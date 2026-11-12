import { test } from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { mkdtemp, mkdir, readFile, rm, writeFile, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const projectRootUrl = new URL('../', import.meta.url).href;
const resolver = registerHooks({ resolve(specifier, context, next) {
  if (specifier.startsWith('.') && !extname(specifier) && context.parentURL?.startsWith(projectRootUrl)) {
    const url = new URL(`${specifier}.ts`, context.parentURL);
    if (existsSync(fileURLToPath(url))) return next(url.href, context);
  }
  return next(specifier, context);
} });
const { createSessionVisits } = await import('../server/sessions/session-visits.ts');
const { VISIT_WINDOW_MS, MIN_VISIT_INTERVAL_MS, recordSessionVisitRpc } = await import('../shared/sessions/session-visits.ts');
resolver.deregister();

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'paseo-visits-'));
  const path = join(root, 'visits.json');
  let time = Date.parse('2026-11-11T12:00:00Z');
  const services = [];
  const open = () => { const store = createSessionVisits({ path, now: () => time }); services.push(store); return store; };
  const store = open();
  t.after(async () => { await Promise.all(services.map(s => s.cleanup())); await rm(root, { recursive: true, force: true }); });
  return { path, store, open, get now() { return time; }, advance(ms) { time += ms; } };
}

test('three distinct opens qualify for one week, rapid taps/retries do not inflate frequency', async t => {
  const f = await fixture(t), first = f.now;
  await Promise.all(Array.from({ length: 5 }, () => f.store.record({ agentId: 'a' })));
  assert.deepEqual(await f.store.list(), { sessions: [] });
  assert.equal(JSON.parse(await readFile(f.path, 'utf8')).sessions[0].visits.length, 1);
  f.advance(MIN_VISIT_INTERVAL_MS);
  await f.store.record({ agentId: 'a' });
  assert.deepEqual(await f.store.list(), { sessions: [] });
  f.advance(MIN_VISIT_INTERVAL_MS);
  await f.store.record({ agentId: 'a' });
  assert.deepEqual(await f.store.list(), { sessions: [{ agentId: 'a', frequentlyViewedUntil: first + VISIT_WINDOW_MS }] });
  assert.equal((await stat(f.path)).mode & 0o777, 0o600);
  f.advance(VISIT_WINDOW_MS - 2 * MIN_VISIT_INTERVAL_MS);
  assert.equal((await f.store.list()).sessions.length, 1, 'the exact week boundary is inclusive');
  f.advance(1);
  assert.deepEqual(await f.store.list(), { sessions: [] });
});

test('views survive reload and remain separate between agents and host stores', async t => {
  const f = await fixture(t);
  for (let i = 0; i < 3; i++) { await f.store.record({ agentId: 'a' }); f.advance(MIN_VISIT_INTERVAL_MS); }
  await f.store.record({ agentId: 'b' });
  await f.store.cleanup();
  const restored = f.open();
  assert.deepEqual((await restored.list()).sessions.map(s => s.agentId), ['a']);
  const other = createSessionVisits({ path: f.path + '.other', now: () => f.now });
  assert.deepEqual(await other.list(), { sessions: [] });
  await other.cleanup();
  await assert.rejects(f.store.record({ agentId: 'a' }), /перезагружается/);
});

test('renewed visits extend qualification and old history is bounded', async t => {
  const f = await fixture(t);
  for (let i = 0; i < 25; i++) { await f.store.record({ agentId: 'a' }); f.advance(MIN_VISIT_INTERVAL_MS); }
  const saved = JSON.parse(await readFile(f.path, 'utf8'));
  assert.equal(saved.sessions[0].visits.length, 20);
  assert.equal((await f.store.list()).sessions[0].frequentlyViewedUntil, saved.sessions[0].visits.at(-3) + VISIT_WINDOW_MS);
  f.advance(VISIT_WINDOW_MS + 1);
  await f.store.record({ agentId: 'b' });
  assert.deepEqual(JSON.parse(await readFile(f.path, 'utf8')).sessions.map(s => s.agentId), ['b']);
});

test('failed persistence never leaves a successful-looking visit in memory and can be retried', async t => {
  const f = await fixture(t);
  await f.store.list();
  await mkdir(f.path);
  await assert.rejects(f.store.record({ agentId: 'a' }));
  assert.deepEqual(await f.store.list(), { sessions: [] });
  await rm(f.path, { recursive: true });
  await f.store.record({ agentId: 'a' });
  assert.equal(JSON.parse(await readFile(f.path, 'utf8')).sessions[0].visits.length, 1);
});

test('corrupted data is preserved and invalid agent IDs are rejected', async t => {
  const f = await fixture(t);
  await writeFile(f.path, '{corrupted');
  await assert.rejects(f.store.record({ agentId: 'a' }));
  await assert.rejects(f.store.list());
  assert.equal(await readFile(f.path, 'utf8'), '{corrupted');
  for (const agentId of ['', 'bad\u0000id', 'x'.repeat(257)]) assert.equal(recordSessionVisitRpc.input.safeParse({ agentId }).success, false);
});
