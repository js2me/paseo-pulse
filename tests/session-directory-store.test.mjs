import { test } from 'node:test';
import assert from 'node:assert/strict';
import { importClientModule } from './plugin-translations.mjs';
const { createSessionDirectoryStore } = await importClientModule('../client/data/sessions/session-directory-store.ts');
const page = entries => ({ entries, pageInfo: { hasMore: false, nextCursor: null, prevCursor: null } });
const entry = id => ({ agent: { id, cwd: '/project', status: 'closed', pendingPermissions: [] },
  project: { projectKey: '/project', projectName: 'Project' } });
const flush = async () => { for (let i = 0; i < 8; i++) await new Promise(resolve => setImmediate(resolve)); };
function setup(id = 'one') {
  let observer, reads = 0, subscriptions = 0, released = 0, pending;
  const initial = page([entry(id)]);
  const api = { agents: { list(options) {
    if (!options.subscribe) { reads++; return pending ?? Promise.resolve(initial); }
    subscriptions++;
    return Promise.resolve({ ...initial, subscription: {
      subscribe(value) { observer = value; value.snapshot(initial); return () => {}; },
      async release() { released++; },
    } });
  } } };
  const store = createSessionDirectoryStore(api);
  return { store, get reads() { return reads; }, get subscriptions() { return subscriptions; },
    get released() { return released; }, get observer() { return observer; },
    deferRead() { let resolve; pending = new Promise(done => { resolve = done; }); return resolve; } };
}

test('reopening a screen immediately reuses the live list without another read or subscription', async () => {
  const client = setup();
  client.store.start();
  await flush();
  const close = client.store.subscribe(() => {});
  assert.equal(client.store.getSnapshot().loading, false);
  close();
  client.observer.update({ type: 'agent_update', payload: { kind: 'upsert', ...entry('two') } });
  const snapshot = client.store.getSnapshot();
  const closeAgain = client.store.subscribe(() => {});
  assert.equal(client.store.getSnapshot(), snapshot);
  assert.deepEqual(snapshot.entries.map(({ agent }) => agent.id), ['one', 'two']);
  assert.equal(snapshot.loading, false);
  assert.equal(client.reads, 1);
  assert.equal(client.subscriptions, 1);
  closeAgain();
  client.store.dispose();
  await flush();
  assert.equal(client.released, 1);
});

test('retry preserves the visible list until a complete replacement arrives', async () => {
  const client = setup();
  client.store.start();
  await flush();
  const resolve = client.deferRead();
  client.store.retry();
  await flush();
  assert.deepEqual(client.store.getSnapshot().entries.map(({ agent }) => agent.id), ['one']);
  resolve(page([entry('replacement')]));
  await flush();
  assert.equal(client.store.getSnapshot().loading, false);
  assert.deepEqual(client.store.getSnapshot().entries.map(({ agent }) => agent.id), ['replacement']);
  client.store.dispose();
});

test('installation stores never share sessions between hosts and stop after disposal', async () => {
  const first = setup('host-one'), second = setup('host-two');
  first.store.start(); second.store.start();
  await flush();
  assert.equal(first.store.getSnapshot().entries[0].agent.id, 'host-one');
  assert.equal(second.store.getSnapshot().entries[0].agent.id, 'host-two');
  first.store.dispose();
  first.store.start(); first.store.retry();
  first.observer.update({ type: 'agent_update', payload: { kind: 'upsert', ...entry('late') } });
  assert.deepEqual(first.store.getSnapshot().entries, []);
  assert.equal(first.reads, 1);
  second.store.dispose();
});
