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

function withWorkspaces({ read, delayedSubscription } = {}) {
  let agentObserver, workspaceObserver, titles = [{ id: 'workspace', title: 'Renamed workspace' }];
  let workspaceReleases = 0, workspaceDetaches = 0;
  const original = { ...entry('agent'), agent: { ...entry('agent').agent,
    workspaceId: 'workspace', title: 'Original agent title', updatedAt: '2026-01-01T00:00:00Z' } };
  const subscription = {
    subscribe(observer) { workspaceObserver = observer; observer.snapshot(page(titles));
      return () => { workspaceDetaches++; }; },
    async release() { workspaceReleases++; },
  };
  const store = createSessionDirectoryStore({
    agents: { list: async options => options.subscribe ? { ...page([original]), subscription: {
      subscribe(observer) { agentObserver = observer; observer.snapshot(page([original])); return () => {}; },
      async release() {},
    } } : page([original]) },
    workspaces: { list: async options => options.subscribe
      ? delayedSubscription ?? { ...page(titles), subscription }
      : read ? read(options) : page(titles) },
  });
  store.start();
  return { store, original, subscription, get workspaceReleases() { return workspaceReleases; },
    get workspaceDetaches() { return workspaceDetaches; },
    rename(title) { titles = [{ id: 'workspace', title }]; workspaceObserver.update({ type: 'workspace_update',
      payload: { kind: 'upsert', workspace: titles[0] } }); },
    remove() { workspaceObserver.update({ type: 'workspace_update', payload: { kind: 'remove', id: 'workspace' } }); },
    agentTitle(title) { agentObserver.update({ type: 'agent_update', payload: { kind: 'upsert',
      ...original, agent: { ...original.agent, title } } }); },
    reconnect() { workspaceObserver.snapshot(page(titles)); },
  };
}

test('workspace sidebar names load and rename live without waiting for an agent update', async () => {
  const client = withWorkspaces();
  try {
    await flush();
    assert.equal(client.store.getSnapshot().entries[0].agent.title, 'Renamed workspace');
    client.rename('Shared API client');
    const current = client.store.getSnapshot();
    assert.equal(current.entries[0].agent.title, 'Shared API client');
    assert.equal(current.entries[0].project.workspaceName, 'Shared API client');
    assert.equal(current.entries[0].agent.updatedAt, client.original.agent.updatedAt);
    client.agentTitle('Agent changed its title');
    assert.equal(client.store.getSnapshot().entries[0].agent.title, 'Shared API client');
    const before = client.store.getSnapshot();
    client.rename('Shared API client');
    assert.equal(client.store.getSnapshot(), before, 'status-only workspace updates do not rerender the list');
    client.rename(null);
    assert.equal(client.store.getSnapshot().entries[0].agent.title, 'Agent changed its title');
    client.rename('Another name'); client.remove();
    assert.equal(client.store.getSnapshot().entries[0].agent.title, 'Agent changed its title');
  } finally { client.store.dispose(); }
  await flush();
  assert.equal(client.workspaceReleases, 1);
  assert.equal(client.workspaceDetaches, 1);
});

test('workspace title paging and reconnect reads cannot overwrite a newer live rename', async () => {
  let resolvePage, pending = false;
  const client = withWorkspaces({ read: options => {
    if (options.page.cursor) return pending ? new Promise(resolve => { resolvePage = resolve; })
      : page([{ id: 'workspace', title: 'Page two title' }]);
    return { ...page([{ id: 'other', title: 'Other' }]), pageInfo: { hasMore: true, nextCursor: 'next' } };
  } });
  try {
    await flush();
    assert.equal(client.store.getSnapshot().entries[0].agent.title, 'Page two title');
    pending = true; client.reconnect(); await flush();
    client.rename('Live rename');
    resolvePage(page([{ id: 'workspace', title: 'Stale page' }])); await flush();
    assert.equal(client.store.getSnapshot().entries[0].agent.title, 'Live rename');
    client.store.dispose();
    client.rename('After disposal');
    assert.deepEqual(client.store.getSnapshot().entries, []);
  } finally { client.store.dispose(); }
});

test('a workspace subscription resolving after disposal is immediately released', async () => {
  let resolve;
  const client = withWorkspaces({ delayedSubscription: new Promise(done => { resolve = done; }) });
  await flush(); client.store.dispose();
  resolve({ ...page([]), subscription: client.subscription }); await flush();
  assert.equal(client.workspaceReleases, 1);
  assert.equal(client.workspaceDetaches, 0);
});
