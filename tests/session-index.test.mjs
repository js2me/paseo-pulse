import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, appendFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { registerHooks } from 'node:module';
import { zstdCompressSync } from 'node:zlib';
import { sessionIndexRpc } from '../shared/session-index.ts';
const resolver = registerHooks({ resolve(specifier, context, nextResolve) {
  return nextResolve(['../shared/session-index', './opencode-index'].includes(specifier) ? `${specifier}.ts` : specifier, context);
} });
const { createSessionIndex, parseSessionTranscript } = await import('../server/session-index.ts');
resolver.deregister();

const now = Date.parse('2026-11-10T12:00:00Z');
const at = minutes => new Date(now - minutes * 60000).toISOString();
const uid = index => `01a18000-0000-7000-8000-${String(index).padStart(12, '0')}`;
const codex = (role, text, time = at(2)) => ({ type: 'response_item', timestamp: time,
  payload: { type: 'message', role, content: text === null ? [{ type: 'input_image', image_url: 'data:image/png;base64,AA==' }]
    : [{ type: role === 'assistant' ? 'output_text' : 'input_text', text }] } });
const claude = (role, content, time = at(2), extra = {}) => ({ type: role, timestamp: time,
  message: { role, content }, ...extra });
const jsonl = (...rows) => rows.map(row => JSON.stringify(row)).join('\n') + '\n';
const summary = (overrides = {}) => ({ text: null, lastActivityAt: null,
  activityKnown: true, latestReplyAt: null, limited: false, ...overrides });

test('Codex index selects actual newest chat and assistant, excluding developer, reasoning and tool metadata', () => {
  const result = parseSessionTranscript('codex', jsonl(
    codex('user', 'prompt', at(20)), codex('assistant', '**Ready** `api_client`', at(10)),
    codex('user', null, at(5)), codex('developer', 'Synthetic context', at(1)),
    { type: 'response_item', timestamp: at(0), payload: { type: 'reasoning', text: 'private thought' } },
    { type: 'event_msg', timestamp: at(0), payload: { type: 'task_complete', last_agent_message: 'not a new chat' } },
  ), { now });
  assert.deepEqual(result, summary({ text: 'Ready api_client', lastActivityAt: at(5), latestReplyAt: at(10) }));
});

test('legacy Codex event messages remain readable without counting lifecycle timestamps', () => {
  const result = parseSessionTranscript('codex', jsonl(
    { type: 'event_msg', timestamp: at(3), payload: { type: 'user_message', message: 'question' } },
    { type: 'event_msg', timestamp: at(2), payload: { type: 'agent_message', message: 'Result' } },
    { type: 'event_msg', timestamp: at(1), payload: { type: 'token_count' } },
  ), { now });
  assert.deepEqual(result, summary({ text: 'Result', lastActivityAt: at(2), latestReplyAt: at(2) }));
});

test('Claude text and image prompts count, tool results and thinking/tool-use-only replies do not', () => {
  const result = parseSessionTranscript('claude', jsonl(
    claude('user', 'Question', at(20)), claude('assistant', [{ type: 'text', text: 'Actual answer' }], at(10)),
    claude('user', [{ type: 'image', source: { type: 'base64', data: 'AA==' } }], at(5)),
    claude('assistant', [{ type: 'thinking', thinking: 'private' }], at(4)),
    claude('assistant', [{ type: 'tool_use', id: 'call', name: 'Read' }], at(3)),
    claude('user', [{ type: 'tool_result', tool_use_id: 'call', content: 'data' }], at(2)),
    claude('user', 'system context', at(1), { isMeta: true }),
    claude('user', 'compacted context', at(0), { isCompactSummary: true }),
  ), { now });
  assert.deepEqual(result, summary({ text: 'Actual answer', lastActivityAt: at(5), latestReplyAt: at(10) }));
});

test('timestamps follow record order and never fall back from invalid, future or metadata times', () => {
  for (const time of ['bad', at(-1), '1970-01-01T00:00:00Z']) {
    const result = parseSessionTranscript('codex', jsonl(codex('assistant', 'Old', at(20)), codex('user', 'Latest', time)), { now });
    assert.equal(result.lastActivityAt, null);
    assert.equal(result.activityKnown, false);
    assert.equal(result.latestReplyAt, at(20));
  }
  const result = parseSessionTranscript('codex', jsonl(codex('assistant', 'Older physical entry', at(1)), codex('assistant', 'Newest record', at(10))), { now });
  assert.equal(result.text, 'Newest record');
  assert.equal(result.lastActivityAt, at(10));
});

test('empty, bounded, partial and malformed tails distinguish unknown activity from complete empty history', () => {
  assert.deepEqual(parseSessionTranscript('codex', '', { now }), summary());
  assert.deepEqual(parseSessionTranscript('codex', 'partial\n', { now, truncatedStart: true }),
    summary({ activityKnown: false, limited: true }));
  const result = parseSessionTranscript('codex', 'leftover first record\n' + jsonl(codex('assistant', 'Tail answer', at(1))) + '{"type":"response',
    { now, truncatedStart: true });
  assert.equal(result.text, 'Tail answer');
  assert.equal(result.lastActivityAt, at(1));
  assert.equal(result.limited, true);
  assert.equal(parseSessionTranscript('claude', '{broken}\n', { now }).activityKnown, false);
});

test('previews are bounded before cleanup and preserve Unicode', () => {
  const result = parseSessionTranscript('codex', jsonl(codex('assistant', '🚀'.repeat(10000))), { now });
  assert.equal(Array.from(result.text).length, 220);
  assert.ok(result.text.endsWith('…'));
});

async function fixture(agents) {
  const directory = await mkdtemp(join(tmpdir(), 'paseo-session-index-'));
  const codexHome = join(directory, 'codex');
  const claudeHome = join(directory, 'claude');
  const calls = [];
  const api = { agents: {
    list: async options => { calls.push(options); return { entries: agents.map(agent => ({ agent })), pageInfo: { hasMore: false } }; },
    ref: () => { throw Error('Index must never hydrate an SDK timeline or start a provider'); },
  } };
  let clock = now;
  const index = createSessionIndex({ paseo: api, codexHome, claudeHome, now: () => clock });
  const file = async (provider, sessionId, rows, folder) => {
    const path = provider === 'codex' ? join(codexHome, folder ?? 'sessions/2026/11/10', `rollout-2026-11-10T10-00-00-${sessionId}.jsonl`)
      : join(claudeHome, 'projects', folder ?? '-project', `${sessionId}.jsonl`);
    await mkdir(join(path, '..'), { recursive: true });
    await writeFile(path, rows);
    return path;
  };
  return { index, calls, file, directory, codexHome, claudeHome, advance: amount => { clock += amount; },
    cleanup: async () => { await index.cleanup(); await rm(directory, { recursive: true, force: true }); } };
}
const agent = (id, provider = 'codex', handle = uid(id)) => ({ id: String(id), provider, cwd: '/project',
  persistence: { provider, sessionId: handle, nativeHandle: handle } });

test('verified catalog IDs map to native UUID transcripts, including archived Codex and nested Claude locations', async () => {
  const f = await fixture([agent(1), agent(2), agent(3, 'claude')]);
  try {
    await f.file('codex', uid(1), jsonl(codex('assistant', 'Live')));
    await f.file('codex', uid(2), jsonl(codex('assistant', 'Archived')), 'archived_sessions');
    await f.file('claude', uid(3), jsonl(claude('assistant', [{ type: 'text', text: 'Nested' }])) , '-old-project/subagents');
    const result = await f.index.read({ agentIds: ['1', '2', '3', 'unknown'] });
    assert.deepEqual(result.entries.map(entry => entry.text), ['Live', 'Archived', 'Nested', null]);
    assert.equal(result.entries[3].activityKnown, false);
    assert.equal(f.calls.length, 1);
    assert.equal(f.calls[0].subscribe, undefined);
    assert.equal(f.index.stats.locationScans, 2);
  } finally { await f.cleanup(); }
});

test('stat caches avoid repeated tail reads, batches deduplicate paths and concurrency stays bounded', async () => {
  const agents = Array.from({ length: 12 }, (_, i) => agent(i + 1));
  const f = await fixture(agents);
  try {
    for (const item of agents) await f.file('codex', item.persistence.sessionId, jsonl(codex('assistant', `Answer ${item.id}`)));
    const input = { agentIds: agents.map(item => item.id) };
    await Promise.all([f.index.read(input), f.index.read(input)]);
    assert.equal(f.index.stats.tailReads, 12);
    assert.equal(f.index.stats.catalogReads, 1);
    assert.equal(f.index.stats.locationScans, 1);
    assert.ok(f.index.stats.maxConcurrent <= 3);
    await f.index.read(input);
    assert.equal(f.index.stats.tailReads, 12);
    const path = await f.file('codex', uid(1), jsonl(codex('assistant', 'Changed answer', at(1))));
    await appendFile(path, jsonl(codex('user', 'New question', at(0))));
    const result = await f.index.read({ agentIds: ['1', '1'] });
    assert.equal(result.entries.length, 1);
    assert.equal(result.entries[0].text, 'Changed answer');
    assert.equal(result.entries[0].lastActivityAt, at(0));
    assert.equal(f.index.stats.tailReads, 13);
  } finally { await f.cleanup(); }
});

test('large transcripts read at most one MiB and never reinterpret old metadata as fresh conversation', async () => {
  const f = await fixture([agent(1), agent(2)]);
  try {
    const huge = JSON.stringify({ type: 'tool', payload: 'x'.repeat(2 * 1024 * 1024) }) + '\n';
    await f.file('codex', uid(1), huge + jsonl(codex('assistant', 'Last actual reply', at(80))));
    await f.file('codex', uid(2), jsonl(codex('assistant', 'Out of tail', at(1))) + huge);
    const { entries } = await f.index.read({ agentIds: ['1', '2'] });
    assert.equal(entries[0].text, 'Last actual reply');
    assert.equal(entries[0].lastActivityAt, at(80));
    assert.equal(entries[1].activityKnown, false);
    assert.equal(entries[1].lastActivityAt, null);
    assert.equal(f.index.stats.bytesRead, 2 * 1024 * 1024);
  } finally { await f.cleanup(); }
});

test('unsupported providers, missing persistence/files, paths and symlinks remain unavailable without SDK history', async () => {
  const f = await fixture([agent(1, 'opencode'), { ...agent(2), persistence: null }, agent(3), agent(4, 'codex', '../../escape'), agent(5)]);
  try {
    const secret = join(f.directory, 'outside.jsonl');
    await writeFile(secret, jsonl(codex('assistant', 'Outside content')));
    const directory = join(f.codexHome, 'sessions');
    await mkdir(directory, { recursive: true });
    await symlink(secret, join(directory, `rollout-${uid(5)}.jsonl`));
    const { entries } = await f.index.read({ agentIds: ['1', '2', '3', '4', '5', '../../escape'] });
    assert.ok(entries.every(entry => entry.activityKnown === false && entry.text === null));
    assert.equal(f.index.stats.tailReads, 0);
    await assert.rejects(async () => f.index.read({ agentIds: Array(251).fill('1') }));
  } finally { await f.cleanup(); }
});

test('catalog and missing-file discovery TTLs are bounded, without polling or restarting any provider', async () => {
  const f = await fixture([agent(1)]);
  try {
    await f.index.read({ agentIds: ['1'] });
    for (let i = 0; i < 5; i++) await f.index.read({ agentIds: ['1'] });
    assert.equal(f.index.stats.catalogReads, 1);
    assert.equal(f.index.stats.locationScans, 1);
    f.advance(5000);
    await f.file('codex', uid(1), jsonl(codex('assistant', 'Discovered')));
    await f.index.read({ agentIds: ['1'] });
    assert.equal(f.index.stats.catalogReads, 2);
    assert.equal(f.index.stats.locationScans, 1);
    f.advance(55000);
    const { entries } = await f.index.read({ agentIds: ['1'] });
    assert.equal(entries[0].text, 'Discovered');
    assert.equal(f.index.stats.locationScans, 2);
    await f.index.cleanup();
    await assert.rejects(f.index.read({ agentIds: ['1'] }), /остановлен/);
  } finally { await f.cleanup(); }
});

test('RPC output satisfies the shared contract and invalid input never reaches file reads', async () => {
  const f = await fixture([agent(1)]);
  try {
    const result = await f.index.read({ agentIds: ['1'] });
    assert.deepEqual(sessionIndexRpc.output.parse(result), result);
    await assert.rejects(async () => f.index.read({ agentIds: ['bad\nidentifier'] }));
    assert.equal(f.index.stats.tailReads, 0);
  } finally { await f.cleanup(); }
});

test('compressed Codex archives stream into a bounded tail and share stat caching without starting providers', async () => {
  const f = await fixture([agent(1), agent(2)]);
  try {
    const ordinary = await f.file('codex', uid(1), '');
    await rm(ordinary);
    const compressed = ordinary + '.zst';
    const source = jsonl({ type: 'tool', payload: 'x'.repeat(2 * 1024 * 1024) }) + jsonl(codex('assistant', 'Compressed reply', at(8)));
    await writeFile(compressed, zstdCompressSync(Buffer.from(source)));
    const bad = await f.file('codex', uid(2), '');
    await rm(bad);
    await writeFile(bad + '.zst', 'not zstd');
    const { entries } = await f.index.read({ agentIds: ['1', '2'] });
    assert.equal(entries[0].text, 'Compressed reply');
    assert.equal(entries[0].lastActivityAt, at(8));
    assert.equal(entries[1].activityKnown, false);
    const reads = f.index.stats.tailReads;
    await f.index.read({ agentIds: ['1'] });
    assert.equal(f.index.stats.tailReads, reads);
  } finally { await f.cleanup(); }
});

test('partial writes and temporary file removal keep a known reply; conclusive empty history clears it', async () => {
  const f = await fixture([agent(1)]);
  try {
    const path = await f.file('codex', uid(1), jsonl(codex('assistant', 'Keep this reply', at(3))));
    const before = (await f.index.read({ agentIds: ['1'] })).entries[0];
    await writeFile(path, '{"type":"response_item');
    assert.deepEqual((await f.index.read({ agentIds: ['1'] })).entries[0], before);
    await rm(path);
    assert.deepEqual((await f.index.read({ agentIds: ['1'] })).entries[0], before);
    await writeFile(path, '');
    f.advance(60_000);
    const empty = (await f.index.read({ agentIds: ['1'] })).entries[0];
    assert.equal(empty.activityKnown, true);
    assert.equal(empty.text, null);
    assert.equal(empty.lastActivityAt, null);
  } finally { await f.cleanup(); }
});

test('an existing catalog agent rebound to a different native handle never inherits the old conversation', async () => {
  const current = agent(1);
  const f = await fixture([current]);
  try {
    await f.file('codex', uid(1), jsonl(codex('assistant', 'Previous conversation')));
    await f.index.read({ agentIds: ['1'] });
    current.persistence = { provider: 'codex', sessionId: uid(99), nativeHandle: uid(99) };
    f.advance(5000);
    const { entries } = await f.index.read({ agentIds: ['1'] });
    assert.equal(entries[0].activityKnown, false);
    assert.equal(entries[0].text, null);
  } finally { await f.cleanup(); }
});

test('an active Codex transcript takes precedence over an old archive with the same native UUID', async () => {
  const f = await fixture([agent(1)]);
  try {
    await f.file('codex', uid(1), jsonl(codex('assistant', 'Current session', at(1))));
    await f.file('codex', uid(1), jsonl(codex('assistant', 'Old archived copy', at(100))), 'archived_sessions');
    const { entries } = await f.index.read({ agentIds: ['1'] });
    assert.equal(entries[0].text, 'Current session');
    assert.equal(entries[0].lastActivityAt, at(1));
  } finally { await f.cleanup(); }
});
