import { test } from 'node:test';
import assert from 'node:assert/strict';
import { withSessionActivity } from '../client/session-activity.ts';
import { sessionReplyToken } from '../client/latest-reply.ts';
import { activity, groupSessions, isRecentSession } from '../shared/sessions.ts';

const now = Date.parse('2026-11-10T12:00:00Z');
const time = (minutes) => new Date(now - minutes * 60_000).toISOString();
const session = (overrides = {}) => ({ id: 'a', title: 'A', provider: 'codex', cwd: '/p',
  status: 'idle', createdAt: time(300), updatedAt: time(1), lastUserMessageAt: time(60),
  pendingPermissions: [], ...overrides });
const reply = (agent, overrides = {}) => ({ text: 'Ready', limited: false,
  latestReplyAt: time(1), lastActivityAt: time(1), activityKnown: true,
  sourceToken: sessionReplyToken(agent), ...overrides });
const project = { projectKey: '/p', projectName: 'p' };

test('status and attention token changes keep verified freshness and order during revalidation', () => {
  const original = session();
  const data = reply(original);
  for (const status of ['idle', 'closed', 'running', 'idle']) {
    const current = withSessionActivity({ ...original, status, attentionTimestamp: time(0) }, data, now);
    assert.equal(activity(current), Date.parse(time(1)));
    assert.equal(isRecentSession(current, now), true);
    const groups = groupSessions([{ agent: current, project },
      { agent: session({ id: 'b', lastUserMessageAt: time(2) }), project }], '', false, now);
    assert.equal(groups[0].entries[0].agent.id, 'a');
  }
});

test('a background read failure cannot discard retained successful query data', () => {
  const original = session();
  const query = { data: reply(original), isError: true, isFetching: false };
  const current = withSessionActivity({ ...original, status: 'closed' }, query.data, now);
  assert.equal(current.chatActivityKnown, true);
  assert.equal(current.lastChatMessageAt, time(1));
});

test('an in-flight result for the previous token cannot rewind a newer real user prompt', () => {
  const original = session();
  const data = reply(original, { lastActivityAt: time(50) });
  const current = withSessionActivity({ ...original, lastUserMessageAt: time(0), status: 'running' }, data, now);
  assert.equal(current.lastChatMessageAt, time(0));
  assert.equal(isRecentSession(current, now), true);
});

test('new user hints never rewind a later verified assistant message', () => {
  const original = session();
  const current = withSessionActivity({ ...original, lastUserMessageAt: time(2) }, reply(original), now);
  assert.equal(current.lastChatMessageAt, time(1));
});

test('a lagging saved transcript cannot rewind an accepted prompt after a successful batch refresh', () => {
  const current = session({ lastUserMessageAt: time(0), status: 'running' });
  const saved = reply(current, { lastActivityAt: time(2) });
  assert.equal(withSessionActivity(current, saved, now, { savedTranscript: true }).lastChatMessageAt, time(0));
  assert.equal(withSessionActivity(current, reply(current, { activityKnown: true, lastActivityAt: null }), now,
    { savedTranscript: true }).lastChatMessageAt, null, 'a confirmed empty history still rejects its captured hint');
});

test('inconclusive successful history keeps suppressing its captured user hint across status changes', () => {
  const original = session({ lastUserMessageAt: time(2) });
  const data = reply(original, { activityKnown: false, lastActivityAt: null, limited: true });
  for (const status of ['idle', 'closed', 'running']) {
    const current = withSessionActivity({ ...original, status }, data, now);
    assert.equal(current.chatActivityKnown, true);
    assert.equal(activity(current), 0);
    assert.equal(isRecentSession(current, now), false);
  }
  const next = withSessionActivity({ ...original, lastUserMessageAt: time(0) }, data, now);
  assert.equal(next.lastChatMessageAt, time(0), 'a later prompt is new evidence');
});

test('invalid and future timestamps cannot replace confirmed chat activity', () => {
  const original = session();
  for (const lastUserMessageAt of ['invalid', time(-1), '1970-01-01T00:00:00Z']) {
    const current = withSessionActivity({ ...original, lastUserMessageAt }, reply(original), now);
    assert.equal(current.lastChatMessageAt, time(1));
  }
  for (const lastActivityAt of ['invalid', time(-1), '1970-01-01T00:00:00Z']) {
    const current = withSessionActivity(original, reply(original, { lastActivityAt }), now);
    assert.equal(activity(current), 0);
  }
});

test('without successful history, only actual user timestamps can prove recent activity', () => {
  const current = withSessionActivity(session({ lastUserMessageAt: time(300) }), undefined, now);
  assert.equal(isRecentSession(current, now), false, 'updatedAt is recent but the message is old');
  assert.equal(isRecentSession(withSessionActivity(session({ lastUserMessageAt: time(2) }), undefined, now), now), true);
});

test('enrichment has no shared state that could leak activity between sessions or hosts', () => {
  const first = session();
  assert.equal(withSessionActivity(first, reply(first), now).lastChatMessageAt, time(1));
  assert.equal(withSessionActivity(session({ id: 'b' }), undefined, now).lastChatMessageAt, null);
  assert.equal(withSessionActivity(first, undefined, now).lastChatMessageAt, null, 'a different host has its own query data');
});
