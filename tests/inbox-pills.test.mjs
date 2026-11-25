import { test } from 'node:test';
import assert from 'node:assert/strict';
import { importClientModule } from './plugin-translations.mjs';
const { createInboxPills } = await importClientModule('../client/app/inbox-pills.ts');

const entry = (id, overrides = {}) => ({ agent: { id, workspaceId: 'workspace', ...overrides } });
function setup() {
  const registrations = [];
  const opened = [];
  const pills = createInboxPills({
    openScreen(screen) { opened.push(screen); },
    addComposerPill(contribution) {
      const record = { contribution, removed: 0 };
      registrations.push(record);
      return { remove() { record.removed++; } };
    },
  }, "Inbox");
  return { opened, pills, registrations };
}

test('each composer opens the shared switcher for its own agent', () => {
  const { opened, pills, registrations } = setup();
  pills.sync([entry('one'), entry('two', { workspaceId: 'other' })]);
  const button = registrations[1].contribution;
  assert.equal(button.workspaceId, 'other');
  assert.equal(button.agentId, 'two');
  assert.equal(button.button.behavior.kind, 'action');
  button.button.behavior.onPress();
  assert.deepEqual(opened, [{ screenId: 'switch-session', params: { agentId: 'two' } }]);
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

test('all catalog pages get buttons and cleanup removes them and ignores late updates', () => {
  const { pills, registrations } = setup();
  pills.sync(Array.from({ length: 501 }, (_, id) => entry(String(id))));
  assert.equal(registrations.length, 501);
  pills.dispose();
  pills.dispose();
  pills.sync([entry('late')]);
  assert.equal(registrations.length, 501);
  assert.ok(registrations.every(r => r.removed === 1));
});
