import { test } from 'node:test';
import assert from 'node:assert/strict';
import { importClientModule, PluginTranslationRuntime } from './plugin-translations.mjs';
const { messages, relativeTime, directoryError } = await importClientModule('../client/i18n/messages.ts');

function runtime(initial = 'en') {
  let locale = initial;
  const listeners = new Set();
  const i18n = new PluginTranslationRuntime({ getLocale: () => locale,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); } });
  return { i18n, t: (key, ...args) => i18n.t(messages, key, ...args),
    setLocale(value) { locale = value; for (const listener of listeners) listener(); } };
}

test('app locales select English, Russian, French and Traditional Chinese; unsupported locales fall back to English', () => {
  const r = runtime();
  for (const [locale, title] of [['en', 'Pulse'], ['en-US', 'Pulse'], ['ru', 'Пульс'], ['ru-RU', 'Пульс'],
    ['fr', 'Pulse'], ['fr-CA', 'Pulse'], ['zh-TW', 'Pulse'], ['zh-Hant', 'Pulse'],
    ['zh-HK', 'Pulse'], ['zh-CN', 'Pulse'], ['de-DE', 'Pulse']]) {
    r.setLocale(locale);
    assert.equal(r.t('title'), title, locale);
  }
  r.i18n.dispose();
});

test('persistent screen/pill labels resolve again on app language changes without re-registration', () => {
  const r = runtime('en'), pill = messages.message('openInInbox');
  let updates = 0;
  const stop = r.i18n.subscribe(() => updates++);
  assert.equal(r.i18n.resolve(pill), 'Open in Pulse');
  r.setLocale('fr'); assert.equal(r.i18n.resolve(pill), 'Ouvrir dans Pulse');
  r.setLocale('zh-TW'); assert.equal(r.i18n.resolve(pill), '在 Pulse 中開啟');
  r.setLocale('ru'); assert.equal(r.i18n.resolve(pill), 'Пульс');
  assert.equal(updates, 3);
  stop(); r.i18n.dispose();
});

test('plural forms, relative time, read labels and plugin errors follow the current locale', () => {
  const r = runtime('ru'), now = Date.parse('2026-11-11T12:00:00Z');
  for (const [count, text] of [[1, '1 ответ'], [2, '2 ответа'], [5, '5 ответов'], [21, '21 ответ']])
    assert.equal(r.t('counts.finished', { count }), text);
  assert.equal(relativeTime(now - 2 * 3600_000, r.t, now), '2ч');
  assert.match(directoryError('SESSION_DIRECTORY_TIMEOUT', r.t), /Сервер не ответил/);
  assert.equal(directoryError('Error: SESSION_DIRECTORY_TIMEOUT', r.t), r.t('directory.timeout'));
  r.setLocale('fr');
  assert.equal(r.t('counts.finished', { count: 2 }), '2 réponses');
  assert.equal(relativeTime(now - 2 * 3600_000, r.t, now), '2 h');
  r.setLocale('zh-TW');
  assert.equal(r.t('counts.finished', { count: 2 }), '2 則回覆');
  assert.equal(relativeTime(now - 2 * 3600_000, r.t, now), '2 小時');
  r.setLocale('en');
  assert.equal(r.t('counts.finished', { count: 1 }), '1 reply');
  assert.equal(r.t('counts.finished', { count: 2 }), '2 replies');
  assert.equal(relativeTime(now - 120_000, r.t, now), '2m');
  assert.equal(relativeTime(now + 1, r.t, now), '—');
  assert.equal(r.t('readRowLabel', { title: 'Проект <X>', status: r.t('status.recent') }), 'Проект <X>, Read, Recent');
  assert.equal(directoryError('Provider: 原始錯誤', r.t), 'Provider: 原始錯誤', 'external error details stay unchanged');
  r.i18n.dispose();
});

test('each UI key is translated in all four resources, including accessible labels and dialogs', () => {
  const flatten = (resource, prefix = '') => Object.entries(resource).flatMap(([key, value]) =>
    typeof value === 'string' ? [`${prefix}${key}`] : flatten(value, `${prefix}${key}.`));
  const keys = flatten(messages.resources.en).map(key => key.replace(/_(one|other)$/, ''));
  for (const locale of ['ru', 'fr', 'zh-TW']) {
    const available = new Set(flatten(messages.resources[locale]).map(key => key.replace(/_(one|few|many|other)$/, '')));
    for (const key of keys) assert.ok(available.has(key), `${locale}: ${key}`);
  }
});
