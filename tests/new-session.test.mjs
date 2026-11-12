import { test } from 'node:test';
import assert from 'node:assert/strict';
import { importClientModule } from './plugin-translations.mjs';
const { latestCreationSource, prepareNewSession, createSessionLauncher } = await importClientModule('../client/services/session-creation.ts');

const at = day => `2026-11-${String(day).padStart(2, '0')}T12:00:00Z`;
const entry = (id, projectKey, day, overrides = {}) => ({ project: { projectKey, projectName: projectKey },
  agent: { id, cwd: `/projects/${projectKey}`, provider: 'codex', model: 'saved-model', createdAt: at(1),
    lastUserMessageAt: at(day), updatedAt: at(day), title: 'Do not inherit', pendingPermissions: [], ...overrides } });
function mock(entries = []) {
  const calls = { refresh: [], create: [], models: [], config: 0 };
  const agents = new Map(entries.map(({ agent }) => [agent.id, agent]));
  const api = {
    agents: { ref: id => ({ refresh: async () => { calls.refresh.push(id); return agents.has(id) ? { agent: agents.get(id) } : null; } }),
      create: async input => { calls.create.push(input); return { id: `created-${calls.create.length}` }; } },
    projects: { list: async () => ({ projects: [{ projectRootPath: '/default-project' }] }) },
    config: { get: async () => { calls.config++; return { config: { agentProfiles: [] } }; } },
    providers: { listAvailable: async () => ({ providers: [{ provider: 'codex', available: true }] }),
      listModels: async (provider, options) => { calls.models.push({ provider, ...options }); return { models: [
        { id: 'unselectable', isDefault: true, isSelectable: false }, { id: 'default', isDefault: true }, { id: 'other' }] }; } },
  };
  return { api, calls, agents };
}

test('project creation selects the latest user session in the whole project, ignoring status and metadata freshness', async () => {
  const entries = [entry('old-running', 'a', 2, { updatedAt: at(12), status: 'running' }),
    entry('latest-project', 'a', 8), entry('latest-global', 'b', 11),
    entry('internal', 'a', 12, { internal: true }), entry('archived', 'a', 12, { archivedAt: at(12) })];
  const { api, calls, agents } = mock(entries);
  agents.set('latest-project', { ...agents.get('latest-project'), model: 'new-model', currentModeId: 'auto',
    thinkingOptionId: 'high', features: [{ id: 'sandbox', type: 'toggle', value: false },
      { id: 'approval', type: 'select', value: 'never' }] });
  assert.equal(latestCreationSource(entries, 'a').agent.id, 'latest-project');
  const input = await prepareNewSession(api, entries, { projectKey: 'a', cwd: '/projects/a-root' });
  assert.deepEqual(input, { cwd: '/projects/a-root', config: { provider: 'codex/new-model', modeId: 'auto',
    thinkingOptionId: 'high', featureValues: { sandbox: false, approval: 'never' } } });
  assert.deepEqual(calls.refresh, ['latest-project']);
  assert.equal(calls.config, 0);
  assert.equal(calls.models.length, 0);
  assert.equal('title' in input, false);
  assert.equal('prompt' in input, false);
  assert.equal('parent' in input, false);
});

test('global creation uses the last session overall and its folder; new empty sessions also count as use', async () => {
  const entries = [entry('older', 'a', 7), entry('global', 'b', 10),
    entry('new-empty', 'c', 1, { lastUserMessageAt: null, createdAt: at(11) })];
  const { api, calls } = mock(entries);
  const input = await prepareNewSession(api, entries);
  assert.equal(input.cwd, '/projects/c');
  assert.deepEqual(calls.refresh, ['new-empty']);
});

test('a project without history falls back to the global settings while preserving the target folder', async () => {
  const entries = [entry('global', 'a', 10)];
  const { api, calls } = mock(entries);
  const input = await prepareNewSession(api, entries, { projectKey: 'new-project', cwd: '/new-project' });
  assert.equal(input.cwd, '/new-project');
  assert.equal(input.config.provider, 'codex/saved-model');
  assert.deepEqual(calls.refresh, ['global']);
});

test('runtime values and provider defaults fill missing snapshot fields without requiring a title', async () => {
  const entries = [entry('runtime', 'a', 10, { model: null,
    runtimeInfo: { model: 'runtime-model', thinkingOptionId: 'max', modeId: 'plan' } })];
  const { api, agents, calls } = mock(entries);
  assert.deepEqual((await prepareNewSession(api, entries)).config,
    { provider: 'codex/runtime-model', thinkingOptionId: 'max', modeId: 'plan' });
  agents.set('runtime', { ...entries[0].agent, model: null, runtimeInfo: undefined });
  assert.equal((await prepareNewSession(api, entries)).config.provider, 'codex/default');
  assert.deepEqual(calls.models, [{ provider: 'codex', cwd: '/projects/a' }]);
});

test('no history uses an available profile and otherwise provider defaults', async () => {
  const { api } = mock();
  assert.deepEqual(await prepareNewSession(api, []), { cwd: '/default-project', config: { provider: 'codex/default' } });
  api.config.get = async () => ({ config: { agentProfiles: [
    { provider: 'missing', model: 'ignored' },
    { provider: 'codex', model: 'profile-model', modeId: 'auto', thinkingOptionId: 'high', featureValues: { sandbox: true } }] } });
  assert.deepEqual((await prepareNewSession(api, [])).config, { provider: 'codex/profile-model',
    modeId: 'auto', thinkingOptionId: 'high', featureValues: { sandbox: true } });
});

test('missing projects, missing sources and model discovery errors never create an agent', async () => {
  const { api, calls } = mock();
  api.projects.list = async () => ({ projects: [] });
  await assert.rejects(prepareNewSession(api, []), { code: 'noProject' });
  await assert.rejects(prepareNewSession(api, [entry('deleted', 'a', 1)]), { code: 'sourceMissing' });
  api.providers.listModels = async () => ({ error: 'Discovery failed' });
  await assert.rejects(prepareNewSession(api, [], { cwd: '/project' }), /Discovery failed/);
  assert.equal(calls.create.length, 0);
});

test('duplicate taps share creation; uncertain failures retry the same idempotency key and success clears it', async () => {
  const entries = [entry('source', 'a', 10)];
  const { api, calls } = mock(entries);
  let resolve;
  api.agents.create = input => { calls.create.push(input); return new Promise(done => { resolve = done; }); };
  const launch = createSessionLauncher(api);
  const first = launch(entries), duplicate = launch(entries);
  assert.equal(first, duplicate);
  await new Promise(done => setImmediate(done));
  assert.equal(calls.create.length, 1);
  resolve({ id: 'new-agent' });
  assert.equal(await first, 'new-agent');
  const successfulKey = calls.create[0].idempotencyKey;
  api.agents.create = async input => { calls.create.push(input); throw new Error('Response lost'); };
  await assert.rejects(launch(entries), /Response lost/);
  await assert.rejects(launch(entries), /Response lost/);
  assert.notEqual(calls.create[1].idempotencyKey, successfulKey);
  assert.equal(calls.create[1].idempotencyKey, calls.create[2].idempotencyKey);
});
