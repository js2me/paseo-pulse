import { test } from 'node:test';
import assert from 'node:assert/strict';
import { acknowledgementSettings, acknowledgementToken, canAcknowledge, acknowledgeSessions, applyAcknowledgements } from '../shared/sessions/acknowledgements.ts';

const entry = (id, overrides = {}) => ({
  agent: { id, title: id, provider: 'codex', cwd: '/repo', status: 'idle',
    createdAt: '2026-11-01T00:00:00Z', updatedAt: '2026-11-02T00:00:00Z',
    pendingPermissions: [], requiresAttention: true, attentionReason: 'finished', ...overrides },
  project: { projectKey: 'repo', projectName: 'repo' },
});

test('acknowledgement settings default to an empty host-scoped document', () => {
  assert.equal(acknowledgementSettings.scope, 'host');
  assert.deepEqual(acknowledgementSettings.schema.parse({}), { seen: {} });
});
test('only completed answers and unreviewed errors can be acknowledged', () => {
  assert(canAcknowledge(entry('done').agent));
  assert(canAcknowledge(entry('error', { status: 'error', attentionReason: 'error' }).agent));
  for (const overrides of [
    { pendingPermissions: [{}] }, { attentionReason: 'permission' }, { status: 'running' }, { status: 'initializing' },
    { requiresAttention: false }, { status: 'error', requiresAttention: false }, { archivedAt: 'now' }, { internal: true },
  ]) {
    const agent = entry('protected', overrides).agent;
    assert.equal(canAcknowledge(agent), false);
    assert.equal(acknowledgementToken(agent), null);
  }
});
test('project acknowledgement retains existing marks and protects running/permissions', () => {
  const entries = [entry('done'), entry('error', { status: 'error', attentionReason: 'error' }),
    entry('running', { status: 'running' }), entry('permission', { pendingPermissions: [{}] })];
  const original = { older: 'finished:old' };
  const seen = acknowledgeSessions(original, entries);
  assert.deepEqual(Object.keys(seen).sort(), ['done', 'error', 'older']);
  assert.deepEqual(original, { older: 'finished:old' });
  const applied = applyAcknowledgements(entries, seen);
  assert.equal(applied[0].agent.requiresAttention, false);
  assert.equal(applied[1].agent.requiresAttention, false);
  assert.equal(applied[2], entries[2]);
  assert.equal(applied[3], entries[3]);
  assert.equal(entries[0].agent.requiresAttention, true);
});
test('only the exact response is cleared; new attention timestamps return to the queue', () => {
  const done = entry('done', { attentionTimestamp: '2026-11-03T00:00:00Z' });
  const seen = acknowledgeSessions({}, [done]);
  assert.equal(applyAcknowledgements([done], seen)[0].agent.requiresAttention, false);
  const renamed = entry('done', { attentionTimestamp: done.agent.attentionTimestamp, updatedAt: '2026-11-04T00:00:00Z' });
  assert.equal(applyAcknowledgements([renamed], seen)[0].agent.requiresAttention, false);
  const next = entry('done', { attentionTimestamp: '2026-11-05T00:00:00Z' });
  assert.equal(applyAcknowledgements([next], seen)[0], next);
  const error = entry('done', { status: 'error', attentionReason: 'error', attentionTimestamp: done.agent.attentionTimestamp });
  assert.equal(applyAcknowledgements([error], seen)[0], error);
});
test('without an attention timestamp a newer update is a new response', () => {
  const done = entry('done');
  const seen = acknowledgeSessions({}, [done]);
  const next = entry('done', { updatedAt: '2026-11-05T00:00:00Z' });
  assert.equal(applyAcknowledgements([next], seen)[0], next);
});
