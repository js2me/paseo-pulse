import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cleanReplyText, fetchLatestReply, latestReplyQueryOptions, sessionReplyToken } from '../client/latest-reply.ts';
import { isRecentSession } from '../shared/sessions.ts';
import { QueryClient, QueryObserver, onlineManager } from '@tanstack/react-query';

const baseTime = Date.now() - 6 * 60 * 60_000;
const at = (seq) => new Date(baseTime + seq * 1000).toISOString();
const entry = (seqStart, type, text, timestamp = at(seqStart)) => ({ seqStart, timestamp, item: { type, text } });
const reply = (text = null, options = {}) => ({ text, limited: false, latestReplyAt: null, lastActivityAt: null, activityKnown: true, ...options });
const page = (entries, options = {}) => ({ epoch: 'one', entries, hasOlder: false, startCursor: null, error: null, ...options });
const source = (pages) => {
  const calls = [];
  return { calls, timeline: { async refetch(options) {
    calls.push(options);
    assert.ok(pages.length, 'unexpected history read');
    return pages.shift();
  } } };
};
const tick = () => new Promise((resolve) => setImmediate(resolve));

test('selects the latest nonempty assistant by sequence rather than array order', async () => {
  const history = source([page([
    entry(30, 'user_message', 'new user prompt'), entry(20, 'assistant_message', '**Latest** response'),
    entry(25, 'assistant_message', '   '), entry(10, 'assistant_message', 'Old reply'),
    entry(40, 'reasoning', 'Private reasoning'), entry(50, 'tool_call', 'Tool output'),
  ])]);
  assert.deepEqual(await fetchLatestReply(history.timeline), reply('Latest response', { latestReplyAt: at(20), lastActivityAt: at(30) }));
  assert.deepEqual(history.calls, [{ direction: 'before', projection: 'projected', limit: 100 }]);
});

test('cleans Markdown and whitespace without damaging identifiers or negations', () => {
  assert.equal(cleanReplyText('# Result\n\n- **Fixed** `api_client`\n- [x] _not_ [removed](https://example.test)\n```ts\nkeep_value\n```'),
    'Result Fixed api_client not removed keep_value');
  assert.equal(cleanReplyText('Do not delete user_id.\n\tKeep **config.json**.'), 'Do not delete user_id. Keep config.json.');
  const short = cleanReplyText('🚀'.repeat(240));
  assert.equal(Array.from(short).length, 220);
  assert.equal(Array.from(short).at(-1), '…');
});

test('long previews preserve links, inline code and Unicode across the bounded prefix', () => {
  const prose = 'Результат проверен, отрицания не потеряны. '.repeat(3000);
  assert.equal(cleanReplyText(prose), cleanReplyText(prose.slice(0, 1000)));
  const markdown = ('- **Fixed** `api_client`, not removed.\n').repeat(3000);
  assert.equal(cleanReplyText(markdown), cleanReplyText(markdown.slice(0, 999)));
  const longUrl = '[Actual label](https://example.test/' + 'x'.repeat(20_000) + ') followed by real text';
  assert.equal(cleanReplyText(longUrl), 'Actual label followed by real text');
  const multilineCode = '`keep_value\n' + 'x'.repeat(5000) + '`';
  assert.ok(cleanReplyText(multilineCode).startsWith('keep_value '));
  const labelCode = '[Label `start](https://example.test) ' + 'text '.repeat(1400) + '`';
  assert.ok(cleanReplyText(labelCode).startsWith('Label start text'), 'inline code in a link label may close beyond the prefix');
  const shortUnicodePrefix = '🚀'.repeat(110) + '\n' + ' '.repeat(4000) + 'still present';
  assert.equal(cleanReplyText(shortUnicodePrefix), '🚀'.repeat(110) + ' still present');
});

test('selecting the latest reply leaves older bodies untouched and falls back past empty cleaned replies', async () => {
  let oldReads = 0;
  const old = entry(10, 'assistant_message', undefined);
  Object.defineProperty(old.item, 'text', { get() { oldReads++; return 'Old large answer. '.repeat(10_000); } });
  const result = await fetchLatestReply(source([page([
    entry(40, 'user_message', 'new prompt'), old,
    entry(30, 'assistant_message', '```\n```\n\u200b'),
    entry(20, 'assistant_message', '**Latest useful** answer'),
  ])]).timeline);
  assert.equal(result.text, 'Latest useful answer');
  assert.equal(result.latestReplyAt, at(20));
  assert.equal(result.lastActivityAt, at(40));
  assert.equal(oldReads, 0, 'older answer bodies are not read or cleaned once a newer chat/reply is known');
});

test('pages past tools, but never falls back to a user message', async () => {
  const history = source([
    page([entry(100, 'tool_call', 'tool'), entry(101, 'user_message', 'question')],
      { hasOlder: true, startCursor: { epoch: 'one', seq: 100 } }),
    page([entry(90, 'assistant_message', 'Actual reply')]),
  ]);
  assert.deepEqual(await fetchLatestReply(history.timeline), reply('Actual reply', { latestReplyAt: at(90), lastActivityAt: at(101) }));
  assert.deepEqual(history.calls[1], { direction: 'before', projection: 'projected', limit: 100, cursor: { epoch: 'one', seq: 100 } });
  assert.deepEqual(await fetchLatestReply(source([page([entry(1, 'user_message', 'question')])]).timeline), reply(null, { lastActivityAt: at(1) }));
});

test('stops after three pages and distinguishes a bounded miss from an empty history', async () => {
  const history = source([300, 200, 100].map((seq) => page(Array.from({ length: 100 }, (_, index) => entry(seq + index, 'tool_call', 'tool')),
    { hasOlder: true, startCursor: { epoch: 'one', seq } })));
  assert.deepEqual(await fetchLatestReply(history.timeline), reply(null, { limited: true, activityKnown: false }));
  assert.equal(history.calls.length, 3);
  assert.equal(history.calls.every((call) => call.limit === 100), true);
});

test('rejects backend failures, replacement flags on any page, and epoch changes', async () => {
  await assert.rejects(fetchLatestReply(source([page([], { error: 'Read denied' })]).timeline), /Read denied/);
  for (const flag of ['reset', 'staleCursor', 'gap']) {
    await assert.rejects(fetchLatestReply(source([page([entry(1, 'assistant_message', 'stale')], { [flag]: true })]).timeline), /История сессии изменилась/);
  }
  const changed = source([
    page([], { hasOlder: true, startCursor: { epoch: 'one', seq: 10 } }),
    page([entry(1, 'assistant_message', 'replacement')], { epoch: 'two' }),
  ]);
  await assert.rejects(fetchLatestReply(changed.timeline), /История сессии изменилась/);
});

test('rejects missing, cross-epoch, and repeated pagination cursors', async () => {
  for (const startCursor of [null, { epoch: 'other', seq: 10 }]) {
    await assert.rejects(fetchLatestReply(source([page([], { hasOlder: true, startCursor })]).timeline), /курсор истории/);
  }
  const repeated = source([
    page([], { hasOlder: true, startCursor: { epoch: 'one', seq: 10 } }),
    page([], { hasOlder: true, startCursor: { epoch: 'one', seq: 10 } }),
  ]);
  await assert.rejects(fetchLatestReply(repeated.timeline), /курсор истории/);
  assert.equal(repeated.calls.length, 2);
});

test('abort before dispatch and during an RPC never schedules additional pages', async () => {
  const before = new AbortController(); before.abort();
  const unused = source([]);
  await assert.rejects(fetchLatestReply(unused.timeline, { signal: before.signal }), { name: 'AbortError' });
  assert.equal(unused.calls.length, 0);
  const controller = new AbortController();
  let calls = 0, finish;
  const result = fetchLatestReply({ refetch() { calls++; return new Promise((resolve) => { finish = resolve; }); } }, { signal: controller.signal });
  controller.abort();
  await assert.rejects(result, { name: 'AbortError' });
  finish(page([], { hasOlder: true, startCursor: { epoch: 'one', seq: 10 } }));
  await tick();
  assert.equal(calls, 1);
});

test('shares three physical read slots and removes aborted queued reads without dispatching them', async () => {
  let active = 0, maximum = 0, calls = 0;
  const releases = [];
  const timeline = { refetch() {
    calls++; active++; maximum = Math.max(maximum, active);
    return new Promise((resolve) => releases.push(() => { active--; resolve(page([])); }));
  } };
  const controllers = Array.from({ length: 5 }, () => new AbortController());
  const results = controllers.map((controller) => fetchLatestReply(timeline, { signal: controller.signal }));
  const completions = results.map((result) => result.then(() => 'ok', (error) => error.name));
  assert.equal(calls, 3);
  controllers[0].abort();
  controllers[3].abort();
  await tick();
  assert.equal(calls, 3, 'aborting an active RPC must not free its physical read slot');
  releases.shift()(); await tick();
  assert.equal(calls, 4, 'only the remaining uncancelled queued reader starts');
  while (releases.length) { releases.shift()(); await tick(); }
  assert.deepEqual(await Promise.all(completions), ['AbortError', 'ok', 'ok', 'AbortError', 'ok']);
  assert.equal(maximum, 3);
  assert.equal(active, 0);
});

test('a synchronous read failure releases its queue slot', async () => {
  await assert.rejects(fetchLatestReply({ refetch() { throw new Error('sync failure'); } }), /sync failure/);
  assert.deepEqual(await fetchLatestReply(source([page([])]).timeline), reply());
});

test('chat activity follows sequence and real chat timestamps, never tool, reasoning or metadata time', async () => {
  const current = new Date(Date.now() - 60_000).toISOString();
  const result = await fetchLatestReply(source([page([
    entry(10, 'assistant_message', 'Earlier reply', current),
    entry(20, 'user_message', 'Latest actual message', at(20)),
    entry(30, 'tool_call', 'tool', current), entry(40, 'reasoning', 'thought', current),
  ])]).timeline);
  assert.equal(result.lastActivityAt, at(20), 'highest chat sequence wins even when an earlier timestamp is newer');
  assert.equal(result.latestReplyAt, current);
  assert.equal(isRecentSession({ updatedAt: current, createdAt: current, attentionTimestamp: current,
    lastUserMessageAt: current, chatActivityKnown: true, lastChatMessageAt: result.lastActivityAt }), false,
  'hydrating an old chat must not mark it fresh through updatedAt or other metadata');
});

test('blank file-only user messages establish activity even when the reply search reaches its cap', async () => {
  const history = source([300, 200, 100].map((seq, index) => page([
    ...(index === 0 ? [entry(350, 'user_message', '   ')] : []), entry(seq, 'tool_call', 'tool'),
  ], { hasOlder: true, startCursor: { epoch: 'one', seq } })));
  assert.deepEqual(await fetchLatestReply(history.timeline), reply(null, { limited: true, lastActivityAt: at(350) }));
});

test('missing, malformed, and future timestamps stay unknown rather than falling back to an older chat', async () => {
  for (const timestamp of ['', 'not-a-date', new Date(Date.now() + 24 * 60 * 60_000).toISOString()]) {
    const result = await fetchLatestReply(source([page([
      entry(1, 'assistant_message', 'Older valid reply'), entry(2, 'user_message', 'Newer actual message', timestamp),
    ])]).timeline);
    assert.equal(result.activityKnown, false);
    assert.equal(result.lastActivityAt, null);
    assert.equal(result.latestReplyAt, at(1));
  }
});

test('query cache is versioned per host and agent while history hydration never changes its refresh token', async () => {
  const agent = { lastUserMessageAt: at(10), attentionTimestamp: at(20), status: 'idle', updatedAt: at(30) };
  const token = sessionReplyToken(agent);
  assert.equal(sessionReplyToken({ ...agent, updatedAt: new Date().toISOString() }), token);
  for (const status of ['closed', 'initializing', 'idle', 'running', 'error']) {
    assert.equal(sessionReplyToken({ ...agent, status }), token, 'status changes alone never reread history');
  }
  assert.notEqual(sessionReplyToken({ ...agent, lastUserMessageAt: at(40) }), token);
  assert.notEqual(sessionReplyToken({ ...agent, attentionTimestamp: at(40) }), token);
  const options = latestReplyQueryOptions('host-a', 'agent-a', source([page([entry(20, 'assistant_message', 'Old reply')])]).timeline, token);
  assert.deepEqual(options.queryKey, ['session-inbox', 'host-a', 'agent-a', 'last-reply-v2']);
  assert.equal(options.staleTime, Infinity);
  assert.equal(options.refetchOnMount, false);
  assert.equal(options.gcTime, 300_000);
  const result = await options.queryFn({ signal: new AbortController().signal });
  assert.equal(result.sourceToken, token);
  assert.equal(result.lastActivityAt, at(20));
});

test('remounting an old preview uses verified cache until an explicit refresh', async () => {
  const client = new QueryClient();
  const history = source([page([entry(20, 'assistant_message', 'Fresh explicit result')])]);
  const options = latestReplyQueryOptions('remount-host', 'remount-agent', history.timeline, 'stable-token');
  client.setQueryData(options.queryKey, { ...reply('Retained result'), sourceToken: 'stable-token' },
    { updatedAt: Date.now() - 24 * 60 * 60_000 });
  const observer = new QueryObserver(client, options);
  const stop = observer.subscribe(() => {});
  try {
    await tick();
    assert.equal(history.calls.length, 0, 'an old cached preview does not hydrate a provider on mount');
    assert.equal(observer.getCurrentResult().data.text, 'Retained result');
    await observer.refetch();
    assert.equal(history.calls.length, 1, 'explicit changes can still request current history');
    assert.equal(observer.getCurrentResult().data.text, 'Fresh explicit result');
  } finally {
    stop(); observer.destroy(); client.clear();
  }
});

test('SDK reply reads execute while the app HTTP online flag is false', async () => {
  const wasOnline = onlineManager.isOnline();
  const client = new QueryClient();
  const history = source([page([entry(20, 'assistant_message', 'Reply through the connected Paseo host')])]);
  const observer = new QueryObserver(client,
    latestReplyQueryOptions('offline-http-host', 'offline-http-agent', history.timeline, 'offline-http-token'));
  let stop = () => {};
  try {
    onlineManager.setOnline(false);
    stop = observer.subscribe(() => {});
    assert.equal(history.calls.length, 1, 'the SDK request must start without waiting for HTTP connectivity');
    assert.equal(observer.getCurrentResult().fetchStatus, 'fetching');
    assert.equal(observer.getCurrentResult().isPaused, false);
    await tick();
    const result = observer.getCurrentResult();
    assert.equal(result.status, 'success');
    assert.equal(result.fetchStatus, 'idle');
    assert.equal(result.isPaused, false);
    assert.equal(result.data.text, 'Reply through the connected Paseo host');
    assert.equal(result.data.sourceToken, 'offline-http-token');
    assert.equal(onlineManager.isOnline(), false, 'completion must not depend on restoring the HTTP flag');
  } finally {
    stop(); observer.destroy(); client.clear(); onlineManager.setOnline(wasOnline);
  }
});

test('disabled activity observers receive row preview cache results without their own history read', async () => {
  const client = new QueryClient();
  const history = source([page([entry(20, 'assistant_message', 'Real old reply')])]);
  const options = latestReplyQueryOptions('cache-host', 'cache-agent', history.timeline, 'stable-token');
  client.setQueryData(['session-inbox', 'cache-host', 'cache-agent', 'last-reply'], { text: 'Legacy cached preview', limited: false });
  const activity = new QueryObserver(client, { ...options, enabled: false });
  const row = new QueryObserver(client, options);
  const stopActivity = activity.subscribe(() => {});
  assert.equal(history.calls.length, 0);
  assert.equal(activity.getCurrentResult().data, undefined, 'the old preview cache cannot masquerade as verified activity');
  const stopRow = row.subscribe(() => {});
  try {
    await tick();
    assert.equal(history.calls.length, 1);
    assert.equal(activity.getCurrentResult().data.lastActivityAt, at(20));
    assert.equal(activity.getCurrentResult().data.sourceToken, 'stable-token');
    assert.equal(activity.getCurrentResult().data, row.getCurrentResult().data);
  } finally {
    stopRow(); stopActivity(); row.destroy(); activity.destroy(); client.clear();
  }
});
