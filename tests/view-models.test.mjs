import { test } from 'node:test';
import assert from 'node:assert/strict';
import { importClientModule } from './plugin-translations.mjs';
import { reaction } from '../client/generated/mvvm.js';
const { InboxViewModel } = await importClientModule('../client/view-models/inbox-view-model.ts');
const { AcknowledgementsViewModel } = await importClientModule('../client/view-models/acknowledgements-view-model.ts');
const { SessionCreationViewModel } = await importClientModule('../client/view-models/session-creation-view-model.ts');
const { SessionClockViewModel } = await importClientModule('../client/view-models/session-clock-view-model.ts');
const { SidebarViewModel } = await importClientModule('../client/view-models/sidebar-view-model.ts');
const now = Date.parse('2026-11-12T12:00:00Z');
const at = minutes => new Date(now - minutes * 60_000).toISOString();
const entry = (id, overrides = {}) => ({ agent: { id, title: id, provider: 'codex', model: 'model', cwd: '/project',
  createdAt: at(1440), updatedAt: at(1), lastUserMessageAt: at(1), status: 'idle',
  requiresAttention: false, pendingPermissions: [], ...overrides }, project: { projectKey: 'project', projectName: 'Project' } });
const flush = async () => { for (let i = 0; i < 8; i++) await new Promise(resolve => setImmediate(resolve)); };
const ready = (seen = {}, revision = '1', save = async () => true, reload = async () => {}) =>
  ({ status: 'ready', values: { seen }, revision, saving: false, saveError: null, save, reload });

test('inbox commands reactively filter, expand six-row groups, clear search and navigate on the correct host', () => {
  const entries = Array.from({ length: 9 }, (_, i) => entry(`session-${i}`));
  const calls = [], visits = [];
  const model = new InboxViewModel({ id: 'inbox-test', payload: { entries, replies: new Map(), iconProjects: [], now,
    hostId: 'host-one', navigation: { openAgent: value => calls.push(value) }, trackVisit: id => visits.push(id) } });
  model.mount();
  const counts = [];
  const stop = reaction(() => model.groups.length, count => counts.push(count));
  try {
    assert.equal(model.totalAttention, 9);
    model.setOnlyAttention(false);
    assert.equal(model.groups[0].rows.length, 6);
    assert.equal(model.groups[0].rows[0].read, true);
    model.toggleRevealed('project');
    assert.equal(model.groups[0].rows.length, 9);
    model.toggleGroup('project');
    assert.equal(model.groups[0].isExpanded, false);
    model.setSearch('missing');
    assert.deepEqual(model.groups, []);
    model.toggleSearch();
    assert.equal(model.search, '');
    assert.equal(model.searchOpen, true);
    assert.deepEqual(counts, [0, 1]);
    model.openSession('session-0');
    assert.deepEqual(visits, ['session-0']);
    assert.deepEqual(calls, [{ agentId: 'session-0', serverId: 'host-one' }]);
  } finally { stop(); model.unmount(); }
  assert.equal(model.unmountSignal.aborted, true);
});

test('sidebar and inbox use identical attention rules after payload updates and freshness expiry', () => {
  const entries = [entry('recent'), entry('old', { lastUserMessageAt: at(500) }), entry('running', { status: 'running' })];
  const payload = { entries, now };
  const model = new SidebarViewModel({ id: 'sidebar-test', payload });
  assert.equal(model.count, 2);
  assert.equal(model.attention, 'running');
  model.setPayload({ ...payload, now: now + 5 * 60 * 60_000 });
  assert.equal(model.count, 1);
  assert.equal(model.attention, 'running');
});

test('OK is optimistic, preserves exact-token semantics and waits for a new revision before writing queued marks', async () => {
  const answer = entry('answer', { requiresAttention: true, attentionReason: 'finished', attentionTimestamp: at(2) });
  let resolve;
  const calls = [];
  const save = (values, revision) => { calls.push({ values, revision }); return new Promise(done => { resolve = done; }); };
  const payload = { entries: [answer], settings: ready({}, '1', save) };
  const model = new AcknowledgementsViewModel({ id: 'ack-test', payload });
  model.mount();
  try {
    model.acknowledge([answer]);
    assert.equal(model.entries[0].agent.requiresAttention, false);
    assert.equal(model.pending, true);
    const newer = entry('answer', { requiresAttention: true, attentionReason: 'finished', attentionTimestamp: at(1) });
    model.setPayload({ ...payload, entries: [newer] });
    assert.equal(model.entries[0].agent.requiresAttention, true);
    model.acknowledge([newer]);
    resolve(true); await flush();
    assert.equal(calls.length, 1, 'do not send the next mark against an old CAS revision');
    model.setPayload({ entries: [newer], settings: ready(calls[0].values.seen, '2', save) });
    await flush();
    assert.equal(calls.length, 2);
    assert.equal(calls[1].revision, '2');
    resolve(true); await flush();
    assert.equal(model.entries[0].agent.requiresAttention, false);
  } finally { model.unmount(); }
});

test('failed or conflicted OK persistence restores attention and exposes an actionable error', async () => {
  for (const conflict of [true, false]) {
    const answer = entry('answer', { requiresAttention: true, attentionReason: 'error', attentionTimestamp: at(1) });
    let reloaded = 0;
    const settings = ready({}, '1', async () => { if (!conflict) throw new Error('Offline'); return false; }, async () => { reloaded++; });
    const model = new AcknowledgementsViewModel({ id: 'ack-failure', payload: { entries: [answer], settings } });
    model.mount();
    try {
      model.acknowledge([answer]); await flush();
      assert.equal(model.entries[0].agent.requiresAttention, true);
      assert.equal(model.errorKey, conflict ? 'ack.conflict' : 'ack.saveError');
      assert.equal(reloaded, conflict ? 1 : 0);
    } finally { model.unmount(); }
  }
});

test('creation VM blocks duplicate commands and cancels navigation when the view unmounts', async () => {
  const source = entry('source');
  let resolve, created = 0;
  const opened = [];
  const paseo = { agents: { ref: () => ({ refresh: async () => ({ agent: source.agent }) }), create: async () => {
    created++; return new Promise(done => { resolve = done; });
  } } };
  const model = new SessionCreationViewModel({ id: 'create-test', payload: { entries: [source], paseo,
    onCreated: id => opened.push(id) } });
  model.mount();
  const first = model.create(); void model.create();
  await flush();
  assert.equal(created, 1);
  assert.equal(model.pending, 'global');
  model.unmount();
  resolve({ id: 'created-agent' }); await first;
  assert.deepEqual(opened, []);
  assert.equal(model.pending, null);
});

test('clock VM releases timers and can mount again under React lifecycle replay', t => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now });
  const model = new SessionClockViewModel({ id: 'clock-test', payload: { entries: [entry('one')] } });
  model.mount();
  t.mock.timers.tick(60_000);
  assert.equal(model.now, now + 60_000);
  model.unmount();
  t.mock.timers.tick(60_000);
  assert.equal(model.now, now + 60_000);
  model.mount();
  assert.equal(model.unmountSignal.aborted, false);
  t.mock.timers.tick(60_000);
  assert.equal(model.now, now + 180_000);
  model.unmount();
});

test('continuous directory updates advance the clock even when they postpone its minute timer', t => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now });
  const model = new SessionClockViewModel({ id: 'busy-clock', payload: { entries: [entry('one')] } });
  model.mount();
  try {
    for (let i = 1; i <= 5; i++) {
      t.mock.timers.tick(10_000);
      model.setPayload({ entries: [entry(`update-${i}`)] });
      assert.equal(model.now, now + i * 10_000);
    }
  } finally { model.unmount(); }
});
