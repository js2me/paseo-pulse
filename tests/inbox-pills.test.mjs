import { test } from 'node:test';
import assert from 'node:assert/strict';
import { importClientModule } from './plugin-translations.mjs';
const { createInboxPills } = await importClientModule('../client/app/inbox-pills.ts');

const entry = (id, overrides = {}) => ({ agent: { id, workspaceId: 'workspace', ...overrides } });
function setup() {
  const registrations = [], navigations = [];
  const pills = createInboxPills({
    addComposerPill(contribution) {
      const record = { contribution, removed: 0 };
      registrations.push(record);
      return { remove() { record.removed++; } };
    },
    openScreen(input) { navigations.push(input); },
  });
  return { pills, registrations, navigations };
}

test('native buttons open the sessions list without restoring the removed conversation pane', () => {
  const { pills, registrations, navigations } = setup();
  pills.sync([entry('one'), entry('two', { workspaceId: 'other' })]);
  const button = registrations[1].contribution;
  assert.equal(button.workspaceId, 'other');
  assert.equal(button.agentId, 'two');
  button.button.behavior.onPress();
  button.button.behavior.onPress();
  assert.deepEqual(navigations, [{ screenId: 'inbox' }, { screenId: 'inbox' }]);
  pills.dispose();
});

test('status churn keeps registrations stable; moved, archived and removed sessions are cleaned up', () => {
  const { pills, registrations } = setup();
  pills.sync([entry('one'), entry('two')]);
  pills.sync([entry('one', { status: 'running' }), entry('two', { title: 'changed' })]);
  assert.equal(registrations.length, 2);
  pills.sync([entry('one', { workspaceId: 'new' }), entry('two', { archivedAt: 'now' }),
    entry('internal', { internal: true }), entry('unplaced', { workspaceId: null })]);
  assert.equal(registrations.length, 3);
  assert.deepEqual(registrations.map(r => r.removed), [1, 1, 0]);
  pills.sync([]);
  assert.deepEqual(registrations.map(r => r.removed), [1, 1, 1]);
  pills.dispose();
});

test('all catalog pages get buttons and cleanup prevents stale clicks or late updates', () => {
  const { pills, registrations, navigations } = setup();
  pills.sync(Array.from({ length: 501 }, (_, id) => entry(String(id))));
  assert.equal(registrations.length, 501);
  pills.dispose();
  pills.dispose();
  pills.sync([entry('late')]);
  registrations[0].contribution.button.behavior.onPress();
  assert.equal(registrations.length, 501);
  assert.ok(registrations.every(r => r.removed === 1));
  assert.equal(navigations.length, 0);
});
