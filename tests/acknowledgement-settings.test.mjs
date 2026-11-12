import { test } from 'node:test';
import assert from 'node:assert/strict';
import { importClientModule } from './plugin-translations.mjs';
import { reaction } from '../client/generated/mvvm.js';
const { AcknowledgementSettingsAdapter } = await importClientModule('../client/data/sessions/acknowledgement-settings.ts');
const { AcknowledgementsViewModel } = await importClientModule('../client/view-models/acknowledgements-view-model.ts');
const ready = (revision = '1', seen = {}, overrides = {}) => ({ status: 'ready', revision, values: { seen },
  saving: false, saveError: null, save: async () => true, reset: async () => true, reload: async () => {}, ...overrides });

test('fresh SDK objects, parsed values and closures do not invalidate the observable payload', () => {
  const adapter = new AcknowledgementSettingsAdapter();
  const entries = [];
  const initial = adapter.read(ready());
  const model = new AcknowledgementsViewModel({ id: 'sdk-object-churn', payload: { settings: initial, entries } });
  model.mount();
  let renders = 0;
  const stop = reaction(() => model.entries, () => renders++);
  try {
    const initialEntries = model.entries;
    for (let i = 0; i < 1000; i++) {
      const settings = adapter.read(ready());
      assert.equal(settings, initial);
      assert.equal(model.setPayload({ settings, entries }), true);
      assert.equal(model.entries, initialEntries);
    }
    assert.equal(renders, 0);
  } finally { stop(); model.unmount(); }
});

test('stable commands always invoke the newest SDK closure, including on unchanged revisions', async () => {
  const adapter = new AcknowledgementSettingsAdapter(), calls = [];
  const initial = adapter.read(ready('1', {}, {
    save: async () => { throw new Error('Stale closure'); },
    reset: async () => { throw new Error('Stale closure'); },
    reload: async () => { throw new Error('Stale closure'); },
  }));
  const next = adapter.read(ready('1', {}, {
    save: async (...args) => { calls.push(['save', ...args]); return true; },
    reset: async () => { calls.push(['reset']); return true; },
    reload: async () => { calls.push(['reload']); },
  }));
  assert.equal(next, initial);
  await initial.save({ seen: { a: 'token' } }, '1');
  await initial.reset(); await initial.reload();
  assert.deepEqual(calls, [['save', { seen: { a: 'token' } }, '1'], ['reset'], ['reload']]);
});

test('document revisions, saving and errors still propagate, and adapters stay installation-local', () => {
  const first = new AcknowledgementSettingsAdapter(), second = new AcknowledgementSettingsAdapter();
  const initial = first.read(ready('1', { a: 'old' }));
  const changed = first.read(ready('2', { a: 'new' }));
  assert.notEqual(changed, initial);
  assert.equal(changed.values.seen.a, 'new');
  assert.equal(second.read(ready('2', { a: 'other-host' })).values.seen.a, 'other-host');
  assert.equal(first.read(ready('2', { a: 'new' })), changed);
  const saving = first.read(ready('2', { a: 'new' }, { saving: true }));
  assert.notEqual(saving, changed); assert.equal(saving.saving, true);
  const failed = first.read(ready('2', { a: 'new' }, { saveError: 'Offline' }));
  assert.equal(failed.saveError, 'Offline');
  const commands = { saving: false, saveError: null, save: async () => false, reset: async () => false, reload: async () => {} };
  const loading = first.read({ ...commands, status: 'loading' });
  assert.equal(first.read({ ...commands, status: 'loading' }), loading);
  const invalid = first.read({ ...commands, status: 'invalid', error: 'Invalid', revision: '3' });
  assert.equal(invalid.error, 'Invalid');
  assert.equal(first.read({ ...commands, status: 'error', error: 'Disconnected' }).error, 'Disconnected');
  assert.equal(first.read(ready('4', { a: 'reconnected' })).values.seen.a, 'reconnected');
});
