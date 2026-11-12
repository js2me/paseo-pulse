import { test } from 'node:test';
import assert from 'node:assert/strict';
import { importClientModule } from './plugin-translations.mjs';
const { sessionEmphasis } = await importClientModule('../client/view-models/session-emphasis.ts');
const { sessionTextColors } = await importClientModule('../client/views/shared/session-text-colors.ts');
const now = Date.parse('2026-11-12T12:00:00Z');
const session = (hours, extra = {}) => ({ id: 'a', status: 'idle', title: 'Session',
  lastUserMessageAt: new Date(now - hours * 3_600_000).toISOString(), pendingPermissions: [], ...extra });

test('freshness stays visible for read sessions and fades across hours and days', () => {
  for (const read of [false, true]) {
    const levels = [0.1, 0.5, 2, 8, 20, 30, 80].map(age =>
      sessionEmphasis(session(age, read ? { requiresAttention: false } : {}), now));
    for (const key of ['title', 'preview', 'time']) {
      for (let i = 1; i < levels.length; i++) assert.ok(levels[i][key] <= levels[i - 1][key]);
      assert.ok(levels[0][key] > levels[2][key], `${key}: minutes differ from hours even when read`);
    }
    assert.ok(levels[4].title > levels[5].title, '20h is clearer than 1d');
    assert.ok(levels[4].time > levels[5].time);
    assert.ok(levels[0].title > levels[0].preview, 'description is secondary');
  }
  assert.ok(sessionEmphasis(session(2, { requiresAttention: false }), now).title < sessionEmphasis(session(2), now).title);
});

test('metadata, unknown timestamps, future times and pins do not fake recent messages', () => {
  const old = sessionEmphasis(session(80, { updatedAt: new Date(now).toISOString() }), now);
  assert.equal(old.time, 0);
  for (const lastUserMessageAt of [null, 'invalid', new Date(now + 60_000).toISOString()])
    assert.equal(sessionEmphasis(session(0, { lastUserMessageAt }), now).time, 0);
  assert.equal(sessionEmphasis(session(0, { chatActivityKnown: true, lastChatMessageAt: null }), now).time, 0);
  const pinned = sessionEmphasis(session(80, { pinnedAt: new Date(now).toISOString() }), now);
  assert.ok(pinned.title > old.title);
  assert.equal(pinned.preview, old.preview);
  assert.equal(pinned.time, old.time);
});

test('active state colors override age and read state in light and dark themes', () => {
  for (const colors of [
    { surface0: '#181818', foreground: '#eeeeee', foregroundMuted: '#888888' },
    { surface0: '#ffffff', foreground: '#111111', foregroundMuted: '#666666' },
  ]) {
    const theme = { colors: { ...colors, statusSuccess: '#22aa66', statusWarning: '#cc8800', statusDanger: '#dd3333' } };
    const cases = [
      [{ status: 'running', requiresAttention: false }, 'running'],
      [{ pendingPermissions: [{}] }, 'permission'],
      [{ requiresAttention: true, attentionReason: 'finished' }, 'finished'],
      [{ status: 'error' }, 'error'],
    ];
    const timeColors = new Set();
    for (const [extra, reason] of cases) {
      const emphasis = sessionEmphasis(session(80, extra), now);
      assert.equal(emphasis.reason, reason);
      assert.equal(emphasis.weight, '600');
      const color = sessionTextColors(theme, emphasis);
      timeColors.add(color.time);
      assert.notEqual(color.title, colors.foregroundMuted);
      assert.notEqual(color.preview, colors.foregroundMuted);
    }
    assert.equal(timeColors.size, 4);
    assert.equal(sessionTextColors(theme, sessionEmphasis(session(80), now)).time, colors.foregroundMuted);
  }
});
