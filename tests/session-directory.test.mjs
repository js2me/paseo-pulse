import { test } from 'node:test';
import assert from 'node:assert/strict';
import { observeSessionDirectory } from '../client/session-directory.ts';

const entry = (id, overrides = {}) => ({ agent: { id, title: id, provider: 'codex', cwd: '/project',
  createdAt: '2026-01-01T12:00:00Z', updatedAt: '2026-01-01T12:00:00Z', status: 'closed',
  pendingPermissions: [], ...overrides }, project: { projectKey: '/project', projectName: 'project' } });
const page = (entries, nextCursor = null) => ({ entries,
  pageInfo: { nextCursor, prevCursor: null, hasMore: nextCursor !== null } });
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };
const flush = async () => { for (let index = 0; index < 8; index++) await new Promise((resolve) => setImmediate(resolve)); };
function start({ read, snapshot = page([]), replay = true, live, throwLive = false }) {
  const calls = [], states = [];
  let observer, released = 0, detached = 0;
  const subscription = { subscribe(next) { observer = next; if (replay) next.snapshot(snapshot); return () => { detached++; }; },
    async release() { released++; } };
  const api = { agents: { list(options) {
    calls.push(options);
    if (options.subscribe) {
      if (throwLive) throw new Error('Native subscription unavailable');
      return live?.promise ?? Promise.resolve({ ...snapshot, subscription });
    }
    return Promise.resolve().then(() => read(options));
  } } };
  const stop = observeSessionDirectory(api, (state) => states.push(state));
  return { calls, states, stop, subscription, get current() { return states.at(-1); },
    get observer() { return observer; }, get released() { return released; }, get detached() { return detached; } };
}

test('native ready results without snapshot replay still load all 157 ordinary sessions, including old closed sessions', async () => {
  const catalog = Array.from({ length: 157 }, (_, index) => entry(`agent-${index}`, index < 2 ? { status: 'running' } : {}));
  const client = start({ read: () => page(catalog), snapshot: page(catalog.slice(0, 2)), replay: false });
  try {
    await flush();
    assert.equal(client.current.entries.length, 157);
    assert.equal(client.current.loading, false);
    assert.equal(client.current.error, null);
    assert.equal(client.calls.filter((call) => call.subscribe).length, 1, 'only one broad live directory is established');
    for (const call of client.calls) {
      assert.equal(call.filter.requiresAttention, undefined);
      assert.equal(call.filter.statuses, undefined);
      assert.equal(call.scope, undefined);
      assert.deepEqual(call.sort, [{ key: 'created_at', direction: 'desc' }]);
    }
  } finally { client.stop(); }
});

test('an indefinitely pending live subscription never blocks ordinary bootstrap or its loading state', async () => {
  const live = deferred();
  const client = start({ read: () => page(Array.from({ length: 158 }, (_, index) => entry(`agent-${index}`))), live });
  await flush();
  assert.equal(client.current.entries.length, 158);
  assert.equal(client.current.loading, false);
  assert.equal(client.current.error, null);
  client.stop();
  live.resolve({ ...page([]), subscription: client.subscription });
  await flush();
  assert.equal(client.released, 1, 'a late subscription is released after unmount');
});

test('reads all old directory pages beyond 200, deduplicates overlaps, and filters only archived/internal sessions', async () => {
  const all = Array.from({ length: 501 }, (_, index) => entry(`old-${index}`));
  const pages = new Map([
    [undefined, page(all.slice(0, 200), 'second')],
    ['second', page(all.slice(199, 399), 'third')],
    ['third', page([...all.slice(399), entry('archived', { archivedAt: '2026-01-02T00:00:00Z' }), entry('internal', { internal: true })])],
  ]);
  const client = start({ read: ({ page: { cursor } }) => pages.get(cursor) });
  try {
    await flush();
    assert.equal(client.current.entries.length, 501);
    assert.equal(client.current.loading, false);
    assert.deepEqual(client.calls.filter((call) => !call.subscribe).map((call) => call.page.cursor), [undefined, 'second', 'third']);
    client.observer.update({ type: 'agent_update', payload: { kind: 'upsert', ...entry('live-old', { status: 'idle' }) } });
    assert.equal(client.current.entries.length, 502, 'live updates do not reintroduce the old 200-session cap');
  } finally { client.stop(); }
});

test('an older in-flight page cannot overwrite live updates or resurrect removed sessions', async () => {
  const olderPage = deferred();
  const client = start({ read: ({ page: { cursor } }) => cursor ? olderPage.promise : page([entry('a'), entry('b')], 'older') });
  try {
    await flush();
    client.observer.update({ type: 'agent_update', payload: { kind: 'upsert', ...entry('a', { title: 'Live title', status: 'running' }) } });
    client.observer.update({ type: 'agent_update', payload: { kind: 'remove', agentId: 'b' } });
    olderPage.resolve(page([entry('a', { title: 'Old title' }), entry('b'), entry('c')]));
    await flush();
    assert.deepEqual(client.current.entries.map(({ agent }) => agent.id).sort(), ['a', 'c']);
    assert.equal(client.current.entries.find(({ agent }) => agent.id === 'a').agent.title, 'Live title');
    assert.equal(client.current.loading, false);
  } finally { client.stop(); }
});

test('a page-sized reconnect snapshot preserves the catalog until a complete ordinary resync finishes', async () => {
  const all = Array.from({ length: 157 }, (_, index) => entry(`agent-${index}`));
  const resync = deferred();
  let reads = 0;
  const client = start({ read: () => ++reads === 1 ? page(all) : resync.promise });
  try {
    await flush();
    client.observer.snapshot(page(all.slice(0, 2)));
    assert.equal(client.current.entries.length, 157);
    assert.equal(client.current.loading, true);
    resync.resolve(page([...all.slice(0, -1), entry('new-agent')]));
    await flush();
    assert.equal(client.current.entries.length, 157);
    assert.equal(client.current.entries.some(({ agent }) => agent.id === 'agent-156'), false);
    assert.equal(client.current.entries.some(({ agent }) => agent.id === 'new-agent'), true);
    assert.equal(client.current.loading, false);
  } finally { client.stop(); }
});

test('missing or repeated cursors stop loading with a useful error while preserving already loaded rows', async () => {
  for (const invalidNext of ['repeat', null]) {
    let reads = 0;
    const client = start({ read: () => ++reads === 1 ? page([entry('a')], 'repeat') :
      { ...page([entry('b')], invalidNext), pageInfo: { hasMore: true, nextCursor: invalidNext } } });
    try {
      await flush();
      assert.equal(reads, 2);
      assert.equal(client.current.loading, false);
      assert.match(client.current.error, /SESSION_DIRECTORY_CURSOR/);
      assert.equal(client.current.entries.length, 2);
    } finally { client.stop(); }
  }
});

test('a stuck ordinary native RPC stops the loading indicator after the bounded read timeout', async (context) => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const primary = deferred(), live = deferred();
  const client = start({ read: () => primary.promise, live });
  try {
    await flush();
    context.mock.timers.tick(15_000);
    await flush();
    assert.equal(client.current.loading, false);
    assert.match(client.current.error, /SESSION_DIRECTORY_TIMEOUT/);
  } finally {
    client.stop();
    primary.resolve(page([])); live.resolve({ ...page([]), subscription: client.subscription });
    await flush();
    context.mock.timers.reset();
  }
});

test('cleanup ignores late native responses, does not paginate further, and releases the eventual live handle', async () => {
  const primary = deferred(), live = deferred();
  const client = start({ read: () => primary.promise, live });
  await flush();
  client.stop();
  const published = client.states.length;
  primary.resolve(page([entry('late')], 'must-not-read'));
  live.resolve({ ...page([]), subscription: client.subscription });
  await flush();
  assert.equal(client.states.length, published);
  assert.equal(client.calls.filter((call) => !call.subscribe).length, 1);
  assert.equal(client.released, 1);
});

test('unmount before the scheduled live bootstrap does not dispatch a new subscription', async () => {
  const primary = deferred();
  const client = start({ read: () => primary.promise });
  client.stop();
  primary.resolve(page([]));
  await flush();
  assert.equal(client.calls.filter((call) => call.subscribe).length, 0);
});

test('a delayed stale live ready page cannot overwrite a completed ordinary catalog read', async () => {
  const live = deferred();
  const client = start({ read: () => page([entry('a', { title: 'Current catalog', status: 'idle' })]), live });
  try {
    await flush();
    live.resolve({ ...page([entry('a', { title: 'Stale ready page', status: 'running' })]), subscription: client.subscription });
    await flush();
    assert.equal(client.current.entries[0].agent.title, 'Current catalog');
    assert.equal(client.current.entries[0].agent.status, 'idle');
  } finally { client.stop(); }
});

test('a native subscription throwing synchronously cannot prevent the full ordinary catalog from loading', async () => {
  const client = start({ read: () => page([entry('a'), entry('b'), entry('c')]), throwLive: true });
  try {
    await flush();
    assert.equal(client.current.entries.length, 3);
    assert.equal(client.current.loading, false);
    assert.match(client.current.error, /Native subscription unavailable/);
  } finally { client.stop(); }
});

test('cold history initializing-to-idle bursts do not flash a busy status for known idle or closed sessions', async (context) => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  try {
    for (const status of ['idle', 'closed']) {
      const client = start({ read: () => page([entry('a', { status })]) });
      try {
        await flush();
        client.observer.update({ type: 'agent_update', payload: { kind: 'upsert',
          ...entry('a', { status: 'initializing', title: 'Loaded history' }) } });
        assert.equal(client.current.entries[0].agent.status, status);
        assert.equal(client.current.entries[0].agent.title, 'Loaded history', 'only the transient status is held');
        context.mock.timers.tick(100);
        client.observer.update({ type: 'agent_update', payload: { kind: 'upsert', ...entry('a', { status: 'idle' }) } });
        context.mock.timers.tick(300);
        assert.equal(client.current.entries[0].agent.status, 'idle');
        assert.equal(client.states.some(({ entries }) => entries.some(({ agent }) => agent.status === 'initializing')), false);
      } finally { client.stop(); }
    }
  } finally { context.mock.timers.reset(); }
});

test('sustained initialization appears after a bounded grace that repeated updates cannot extend', async (context) => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const client = start({ read: () => page([entry('a')]) });
  try {
    await flush();
    const initializing = { type: 'agent_update', payload: { kind: 'upsert', ...entry('a', { status: 'initializing' }) } };
    client.observer.update(initializing);
    context.mock.timers.tick(200);
    client.observer.update(initializing);
    context.mock.timers.tick(99);
    assert.equal(client.current.entries[0].agent.status, 'closed');
    context.mock.timers.tick(1);
    assert.equal(client.current.entries[0].agent.status, 'initializing');
  } finally { client.stop(); context.mock.timers.reset(); }
});

test('initial catalog entries, newly created agents and a genuinely changed user prompt show initialization immediately', async (context) => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const client = start({ read: () => page([entry('initial', { status: 'initializing' }), entry('existing')]),
    snapshot: page([entry('snapshot', { status: 'initializing' })]) });
  try {
    await flush();
    assert.equal(client.states.some(({ entries }) => entries.some(({ agent }) => agent.id === 'initial' && agent.status === 'initializing')), true);
    assert.equal(client.states.some(({ entries }) => entries.some(({ agent }) => agent.id === 'snapshot' && agent.status === 'initializing')), true);
    client.observer.update({ type: 'agent_update', payload: { kind: 'upsert', ...entry('new', { status: 'initializing' }) } });
    assert.equal(client.current.entries.find(({ agent }) => agent.id === 'new').agent.status, 'initializing');
    client.observer.update({ type: 'agent_update', payload: { kind: 'upsert', ...entry('existing', { status: 'initializing' }) } });
    assert.equal(client.current.entries.find(({ agent }) => agent.id === 'existing').agent.status, 'closed');
    client.observer.update({ type: 'agent_update', payload: { kind: 'upsert', ...entry('existing', {
      status: 'initializing', lastUserMessageAt: '2026-01-02T12:00:00Z' }) } });
    assert.equal(client.current.entries.find(({ agent }) => agent.id === 'existing').agent.status, 'initializing');
  } finally { client.stop(); context.mock.timers.reset(); }
});

test('running, permissions and errors cancel initialization grace and publish immediately', async (context) => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  try {
    for (const immediate of [
      { status: 'running' }, { status: 'error' },
      { status: 'initializing', pendingPermissions: [{ id: 'permission' }] },
      { status: 'initializing', requiresAttention: true, attentionReason: 'permission' },
      { status: 'initializing', requiresAttention: true, attentionReason: 'error' },
    ]) {
      const client = start({ read: () => page([entry('a')]) });
      try {
        await flush();
        client.observer.update({ type: 'agent_update', payload: { kind: 'upsert', ...entry('a', { status: 'initializing' }) } });
        assert.equal(client.current.entries[0].agent.status, 'closed');
        client.observer.update({ type: 'agent_update', payload: { kind: 'upsert', ...entry('a', immediate) } });
        assert.equal(client.current.entries[0].agent.status, immediate.status);
        assert.equal(client.current.entries[0].agent.attentionReason, immediate.attentionReason);
        const published = client.states.length;
        context.mock.timers.tick(300);
        assert.equal(client.states.length, published, 'cancelled grace cannot emit a stale status');
      } finally { client.stop(); }
    }
  } finally { context.mock.timers.reset(); }
});

test('one held initialization never delays other sessions or removals and cleanup cancels its timer', async (context) => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const client = start({ read: () => page([entry('held'), entry('removed'), entry('other')]) });
  let stopped = false;
  try {
    await flush();
    for (const id of ['held', 'removed']) client.observer.update({ type: 'agent_update', payload: { kind: 'upsert',
      ...entry(id, { status: 'initializing' }) } });
    client.observer.update({ type: 'agent_update', payload: { kind: 'upsert', ...entry('other', { status: 'error' }) } });
    assert.equal(client.current.entries.find(({ agent }) => agent.id === 'other').agent.status, 'error');
    assert.equal(client.current.entries.find(({ agent }) => agent.id === 'held').agent.status, 'closed');
    client.observer.update({ type: 'agent_update', payload: { kind: 'remove', agentId: 'removed' } });
    assert.equal(client.current.entries.some(({ agent }) => agent.id === 'removed'), false);
    client.stop();
    stopped = true;
    const published = client.states.length;
    context.mock.timers.tick(1000);
    assert.equal(client.states.length, published);
  } finally { if (!stopped) client.stop(); context.mock.timers.reset(); }
});

test('a full reconnect read cancels a held initialization when it confirms a running session', async (context) => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  let reads = 0;
  const client = start({ read: () => page([entry('a', { status: ++reads === 1 ? 'closed' : 'running' })]) });
  try {
    await flush();
    client.observer.update({ type: 'agent_update', payload: { kind: 'upsert', ...entry('a', { status: 'initializing' }) } });
    assert.equal(client.current.entries[0].agent.status, 'closed');
    client.observer.snapshot(page([]));
    await flush();
    assert.equal(client.current.entries[0].agent.status, 'running');
    const published = client.states.length;
    context.mock.timers.tick(300);
    assert.equal(client.states.length, published);
  } finally { client.stop(); context.mock.timers.reset(); }
});
