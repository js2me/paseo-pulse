import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { mkdtemp, readFile, readdir, rm, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createOpenCodeIndex } from '../server/opencode-index.ts';

const now = Date.parse('2026-11-10T12:00:00Z');
const time = age => now - age * 60_000;
const iso = age => new Date(time(age)).toISOString();
const sessionId = 'ses_fixture123';
const summary = overrides => ({ text: null, lastActivityAt: null, activityKnown: true, latestReplyAt: null,
  limited: false, ...overrides });
async function fixture({ wal = false, fork = false } = {}) {
  const directory = await mkdtemp(join(tmpdir(), 'paseo-opencode-index-'));
  const path = join(directory, fork ? 'opencode-forked-code.db' : 'opencode.db');
  const database = new DatabaseSync(path);
  if (wal) database.exec('PRAGMA journal_mode=WAL; PRAGMA wal_autocheckpoint=0;');
  database.exec(`CREATE TABLE session (id TEXT PRIMARY KEY);
    CREATE TABLE message (id TEXT PRIMARY KEY, session_id TEXT NOT NULL, time_created INTEGER, time_updated INTEGER, data TEXT NOT NULL);
    CREATE INDEX message_session_time_created_id_idx ON message(session_id,time_created,id);
    CREATE TABLE part (id TEXT PRIMARY KEY, message_id TEXT NOT NULL, session_id TEXT NOT NULL, time_created INTEGER, time_updated INTEGER, data TEXT NOT NULL);
    CREATE INDEX part_message_id_id_idx ON part(message_id,id);`);
  database.prepare('INSERT INTO session VALUES (?)').run(sessionId);
  const index = createOpenCodeIndex({ dataHome: directory, now: () => now });
  const message = (id, role, age, parts, extra = {}, session = sessionId) => {
    database.prepare('INSERT INTO message VALUES (?,?,?,?,?)').run(id, session, time(age), time(age),
      JSON.stringify({ role, time: { created: time(age) }, ...extra }));
    for (const [number, part] of parts.entries()) database.prepare('INSERT INTO part VALUES (?,?,?,?,?,?)')
      .run(id + '-' + number, id, session, time(age), time(age), JSON.stringify(part));
  };
  return { directory, path, database, index, message,
    cleanup: async () => { index.cleanup(); database.close(); await rm(directory, { recursive: true, force: true }); } };
}

test('saved OpenCode text uses real message completion and creation times, excluding tools and synthetic parts', async () => {
  const f = await fixture();
  try {
    f.message('a', 'user', 20, [{ type: 'text', text: 'Question' }]);
    f.message('b', 'assistant', 10, [{ type: 'text', text: '**Fixed** `api_client`, not removed.' }],
      { time: { created: time(10), completed: time(8) } });
    f.message('c', 'assistant', 7, [{ type: 'tool', state: { output: 'not a reply' } }, { type: 'reasoning', text: 'private' }]);
    f.message('d', 'user', 6, [{ type: 'file', url: 'file://screenshot.png', mime: 'image/png' }]);
    f.message('e', 'assistant', 4, [{ type: 'text', text: 'synthetic text', synthetic: true }]);
    f.message('f', 'user', 3, [{ type: 'text', text: 'ignored text', ignored: true }]);
    f.message('g', 'assistant', 2, [{ type: 'text', text: 'summary' }], { summary: true });
    assert.deepEqual(await f.index.read(sessionId), summary({ text: 'Fixed api_client, not removed.',
      lastActivityAt: iso(6), latestReplyAt: iso(8) }));
  } finally { await f.cleanup(); }
});

test('a read-only connection leaves database bytes and metadata untouched and never creates missing databases', async () => {
  const f = await fixture();
  try {
    f.message('a', 'assistant', 1, [{ type: 'text', text: 'Saved answer' }]);
    const beforeBytes = await readFile(f.path), before = await stat(f.path, { bigint: true });
    const files = await readdir(f.directory);
    assert.equal((await f.index.read(sessionId)).text, 'Saved answer');
    assert.equal((await f.index.read(sessionId)).text, 'Saved answer');
    const after = await stat(f.path, { bigint: true });
    assert.deepEqual(await readFile(f.path), beforeBytes);
    assert.equal(after.size, before.size);
    assert.equal(after.mtimeNs, before.mtimeNs);
    assert.deepEqual(await readdir(f.directory), files, 'missing fork database was never created');
    assert.equal(await f.index.read("ses_x'; DROP TABLE message;--"), null);
    assert.equal(f.database.prepare('SELECT COUNT(*) AS count FROM message').get().count, 1);
  } finally { await f.cleanup(); }
  const missing = await mkdtemp(join(tmpdir(), 'paseo-opencode-missing-'));
  const index = createOpenCodeIndex({ dataHome: missing });
  try { assert.equal(await index.read(sessionId), null); assert.deepEqual(await readdir(missing), []); }
  finally { index.cleanup(); await rm(missing, { recursive: true, force: true }); }
});

test('concurrent first reads reuse the same initialized database and cached summary', async () => {
  const f = await fixture();
  try {
    f.message('a', 'assistant', 1, [{ type: 'text', text: 'Shared cached answer' }]);
    const results = await Promise.all(Array.from({ length: 9 }, () => f.index.read(sessionId)));
    assert.equal(results[0].text, 'Shared cached answer');
    for (const result of results) assert.equal(result, results[0], 'one initialized connection owns the shared summary cache');
  } finally { await f.cleanup(); }
});

test('committed WAL updates invalidate cache even when the database file itself is unchanged', async () => {
  const f = await fixture({ wal: true });
  try {
    f.message('a', 'assistant', 10, [{ type: 'text', text: 'Before WAL update' }]);
    assert.equal((await f.index.read(sessionId)).text, 'Before WAL update');
    const before = await stat(f.path, { bigint: true });
    f.message('b', 'assistant', 1, [{ type: 'text', text: 'After WAL update' }]);
    const after = await stat(f.path, { bigint: true });
    assert.equal(after.size, before.size);
    assert.equal(after.mtimeNs, before.mtimeNs);
    assert.deepEqual(await f.index.read(sessionId), summary({ text: 'After WAL update', lastActivityAt: iso(1), latestReplyAt: iso(1) }));
  } finally { await f.cleanup(); }
});

test('fork database previews work and summaries remain bounded to 220 Unicode characters', async () => {
  const f = await fixture({ fork: true });
  try {
    f.message('a', 'assistant', 1, [{ type: 'text', text: '🚀'.repeat(10_000) }]);
    const result = await f.index.read(sessionId);
    assert.equal(Array.from(result.text).length, 220);
    assert.ok(result.text.endsWith('…'));
    assert.equal(result.lastActivityAt, iso(1));
  } finally { await f.cleanup(); }
});

test('tool and synthetic parts cannot exhaust the text/file limit before a real attachment', async () => {
  const f = await fixture();
  try {
    f.message('a', 'assistant', 10, [{ type: 'text', text: 'Previous answer' }]);
    f.message('b', 'user', 1, [
      ...Array.from({ length: 80 }, () => ({ type: 'tool', state: { output: 'not a message' } })),
      ...Array.from({ length: 80 }, () => ({ type: 'text', text: 'internal', synthetic: true })),
      { type: 'file', url: 'file://real.png' },
    ]);
    assert.deepEqual(await f.index.read(sessionId), summary({ text: 'Previous answer', lastActivityAt: iso(1), latestReplyAt: iso(10) }));
  } finally { await f.cleanup(); }
});

test('at most 32 recent messages are inspected and a bounded miss remains unknown', async () => {
  const f = await fixture();
  try {
    f.message('old', 'assistant', 100, [{ type: 'text', text: 'Outside bounded history' }]);
    for (let index = 0; index < 32; index++) f.message('tool-' + index, 'assistant', 99 - index,
      [{ type: 'tool', state: { output: 'tool output' } }]);
    assert.deepEqual(await f.index.read(sessionId), summary({ activityKnown: false, limited: true }));
  } finally { await f.cleanup(); }
});

test('invalid newest chat times never borrow older or database mutation timestamps', async () => {
  const f = await fixture();
  try {
    f.message('a', 'assistant', 10, [{ type: 'text', text: 'Old answer' }]);
    f.message('b', 'user', 1, [{ type: 'file', url: 'file://image.png' }], { time: { created: now + 60_000 } });
    assert.deepEqual(await f.index.read(sessionId), summary({ text: 'Old answer', lastActivityAt: null,
      activityKnown: false, latestReplyAt: iso(10) }));
  } finally { await f.cleanup(); }
});

test('confirmed empty sessions are distinct from missing sessions and cleanup prevents further reads', async () => {
  const f = await fixture();
  try {
    assert.deepEqual(await f.index.read(sessionId), summary());
    assert.equal(await f.index.read('ses_missing'), null);
    f.index.cleanup();
    assert.equal(await f.index.read(sessionId), null);
  } finally { await f.cleanup(); }
});
