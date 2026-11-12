import { test } from 'node:test';
import assert from 'node:assert/strict';
import { activity, attention, directoryActivity, groupSessions, isReadSession, isRecentDirectoryCandidate, isFrequentlyViewedSession,
  isRecentSession, RECENT_SESSION_WINDOW_MS } from '../shared/sessions/sessions.ts';
import { acknowledgeSessions, applyAcknowledgements } from '../shared/sessions/acknowledgements.ts';

const session = (id, overrides = {}) => ({
  id, title: id, provider: 'codex', cwd: '/repo', status: 'idle',
  createdAt: '2026-11-01T00:00:00Z', updatedAt: '2026-11-02T00:00:00Z',
  lastUserMessageAt: '2026-11-02T00:00:00Z',
  pendingPermissions: [], ...overrides,
});
const entry = (agent, projectKey = 'repo', workspaceName = 'main') => ({
  agent, project: { projectKey, projectName: projectKey, workspaceName },
});

test('read styling follows native read state or exact OK marks, never muting a new answer, running work or permission', () => {
  assert.equal(isReadSession(session('native-read', { requiresAttention: false })), true);
  assert.equal(isReadSession(session('unknown')), false);
  const answer = entry(session('answer', { requiresAttention: true, attentionReason: 'finished' }));
  const marks = acknowledgeSessions({}, [answer]);
  const acknowledged = applyAcknowledgements([answer], marks)[0].agent;
  assert.equal(isReadSession(acknowledged), true);
  assert.equal(isReadSession(applyAcknowledgements([{ ...answer, agent: { ...answer.agent,
    attentionTimestamp: '2026-11-11T12:00:00Z' } }], marks)[0].agent), false);
  for (const overrides of [{ status: 'running' }, { status: 'initializing' }, { pendingPermissions: [{}] }])
    assert.equal(isReadSession(session('active', { requiresAttention: false, ...overrides })), false);
});

test('idle alone is not completion; attention follows explicit daemon state', () => {
  assert.equal(attention(session('idle')), null);
  assert.equal(attention(session('done', { requiresAttention: true, attentionReason: 'finished' })), 'finished');
  assert.equal(attention(session('read', { requiresAttention: false, attentionReason: 'finished' })), null);
  assert.equal(attention(session('permission', { status: 'running', pendingPermissions: [{}] })), 'permission');
  assert.equal(attention(session('read-error', { status: 'error', requiresAttention: false, attentionReason: 'error' })), null);
  assert.equal(attention(session('pending', { status: 'error', requiresAttention: false, pendingPermissions: [{}] })), 'permission');
});
test('workspaces of one project group together; permission outranks finished', () => {
  const groups = groupSessions([
    entry(session('done', { requiresAttention: true, attentionReason: 'finished' })),
    entry(session('permission', { pendingPermissions: [{}] }), 'repo', 'worktree'),
    entry(session('other'), 'another'),
  ]);
  const repo = groups.find((group) => group.key === 'repo');
  assert.equal(groups.length, 2);
  assert.equal(repo.entries.length, 2);
  assert.equal(repo.count, 2);
  assert.deepEqual(repo.counts, { permission: 1, error: 0, running: 0, finished: 1 });
  assert.equal(repo.attention, 'permission');
});
test('blocked projects and sessions precede ready answers and newer ordinary activity', () => {
  const groups = groupSessions([
    entry(session('latest-idle', { lastUserMessageAt: '2026-11-10T00:00:00Z' }), 'ordinary'),
    entry(session('ready', { requiresAttention: true, attentionReason: 'finished' }), 'ready'),
    entry(session('failed', { status: 'error' }), 'failed'),
    entry(session('permission', { pendingPermissions: [{}] })),
    entry(session('idle', { lastUserMessageAt: '2026-11-10T00:00:00Z' })),
    entry(session('answer', { requiresAttention: true, attentionReason: 'finished' })),
    entry(session('error', { status: 'error' })),
  ]);
  assert.deepEqual(groups.map(({ key }) => key), ['repo', 'failed', 'ready', 'ordinary']);
  assert.deepEqual(groups[0].entries.map(({ agent }) => agent.id), ['permission', 'error', 'answer', 'idle']);
  assert.deepEqual(groups[0].counts, { permission: 1, error: 1, running: 0, finished: 1 });
});
test('projects and sessions sort by latest activity, including completed answers', () => {
  const groups = groupSessions([
    entry(session('old')),
    entry(session('new', { chatActivityKnown: true, lastChatMessageAt: '2026-11-04T00:00:00Z' })),
    entry(session('middle', { lastUserMessageAt: '2026-11-03T00:00:00Z' }), 'other'),
  ]);
  assert.equal(groups[0].key, 'repo');
  assert.deepEqual(groups[0].entries.map(({ agent }) => agent.id), ['new', 'old']);
});
test('filters hide archived/internal sessions and search across workspaces', () => {
  const entries = [entry(session('archived', { archivedAt: '2026-11-05T00:00:00Z', pendingPermissions: [{}] })),
    entry(session('internal', { internal: true, status: 'error' })), entry(session('visible'), 'repo', 'feature-branch'),
    entry(session('done', { requiresAttention: true, attentionReason: 'finished' }))];
  assert.equal(groupSessions(entries)[0].entries.length, 2);
  assert.deepEqual(groupSessions(entries)[0].counts, { permission: 0, error: 0, running: 0, finished: 1 });
  assert.equal(groupSessions(entries, 'FEATURE-branch')[0].entries[0].agent.id, 'visible');
  assert.equal(groupSessions(entries, '', true)[0].entries[0].agent.id, 'done');
  assert.deepEqual(groupSessions(entries, 'missing'), []);
});

test('running and initializing sessions appear in attention without an unread flag', () => {
  const groups = groupSessions([
    entry(session('working', { status: 'running', requiresAttention: false }), 'spectra-1'),
    entry(session('starting', { status: 'initializing', requiresAttention: false }), 'spectra-1'),
    entry(session('old-answer', { requiresAttention: true, attentionReason: 'finished' }), 'old-project'),
    entry(session('idle'), 'quiet'),
  ], '', true);
  assert.deepEqual(groups.map(({ key }) => key), ['spectra-1', 'old-project']);
  assert.equal(groups[0].count, 2);
  assert.equal(groups[0].counts.running, 2);
  assert.equal(attention(session('stale-reply', { status: 'running', requiresAttention: true, attentionReason: 'finished' })), 'running');
  assert.equal(attention(session('blocked', { status: 'running', pendingPermissions: [{}] })), 'permission');
});
test('running transitions to unread reply or leaves attention when idle and read', () => {
  const working = session('run', { status: 'running', requiresAttention: false });
  assert.equal(groupSessions([entry(working)], '', true)[0].counts.running, 1);
  const completed = { ...working, status: 'idle', requiresAttention: true, attentionReason: 'finished' };
  const group = groupSessions([entry(completed)], '', true)[0];
  assert.equal(group.counts.running, 0);
  assert.equal(group.counts.finished, 1);
  assert.deepEqual(groupSessions([entry({ ...completed, requiresAttention: false })], '', true), []);
});

const now = Date.parse('2026-11-10T12:00:00Z');
const atAge = (age) => new Date(now - age).toISOString();

test('recent sessions include exactly four hours and exclude one millisecond older', () => {
  assert.equal(RECENT_SESSION_WINDOW_MS, 4 * 60 * 60 * 1000);
  for (const [age, expected] of [[0, true], [2 * 60 * 60 * 1000, true], [RECENT_SESSION_WINDOW_MS, true], [RECENT_SESSION_WINDOW_MS + 1, false]]) {
    for (const overrides of [{ lastUserMessageAt: atAge(age) }, { chatActivityKnown: true, lastChatMessageAt: atAge(age) }]) {
      const agent = session(`age-${age}`, overrides);
      assert.equal(isRecentSession(agent, now), expected);
      assert.equal(groupSessions([entry(agent)], '', true, now).length, expected ? 1 : 0);
    }
  }
});

test('frequently viewed old sessions remain in attention without changing chat freshness or explicit priorities', () => {
  const frequent = session('frequent', { frequentlyViewedUntil: now + 1000 });
  assert.equal(isRecentSession(frequent, now), false);
  assert.equal(isFrequentlyViewedSession(frequent, now), true);
  assert.equal(activity(frequent), Date.parse(frequent.lastUserMessageAt));
  const groups = groupSessions([entry(frequent), entry(session('running', { status: 'running' }))], '', true, now);
  assert.deepEqual(groups[0].entries.map(({ agent }) => agent.id), ['running', 'frequent']);
  assert.equal(groups[0].recentCount, 0);
  assert.equal(groups[0].count, 1);
  assert.equal(groupSessions([entry(frequent)], '', true, now + 1000).length, 1);
  assert.equal(groupSessions([entry(frequent)], '', true, now + 1001).length, 0);
  assert.deepEqual(groupSessions([entry(frequent)], 'missing', true, now), []);
  for (const overrides of [{ internal: true }, { archivedAt: atAge(0) }])
    assert.deepEqual(groupSessions([entry({ ...frequent, ...overrides })], '', true, now), []);
});

test('directory metadata selects history candidates without proving recent conversation activity', () => {
  for (const field of ['updatedAt', 'attentionTimestamp', 'createdAt', 'lastUserMessageAt']) {
    const agent = session(field, { [field]: atAge(10 * 60 * 1000) });
    assert.equal(directoryActivity(agent), now - 10 * 60 * 1000, field);
    assert.equal(isRecentDirectoryCandidate(agent, now), true, field);
    assert.equal(isRecentSession(agent, now), field === 'lastUserMessageAt', field);
  }
  const latest = session('latest-wins', {
    updatedAt: atAge(RECENT_SESSION_WINDOW_MS + 1),
    attentionTimestamp: atAge(5 * 60 * 1000),
  });
  assert.equal(directoryActivity(latest), now - 5 * 60 * 1000);
  assert.equal(isRecentDirectoryCandidate(latest, now), true);
  assert.equal(isRecentSession(latest, now), false);
});

test('recent metadata hydration does not make a seven-hour-old conversation fresh', () => {
  const hydrated = session('hydrated', {
    updatedAt: atAge(36 * 60 * 1000),
    lastUserMessageAt: atAge(8 * 60 * 60 * 1000),
    chatActivityKnown: true,
    lastChatMessageAt: atAge(7 * 60 * 60 * 1000),
  });
  assert.equal(isRecentDirectoryCandidate(hydrated, now), true);
  assert.equal(activity(hydrated), now - 7 * 60 * 60 * 1000);
  assert.equal(isRecentSession(hydrated, now), false);
  assert.deepEqual(groupSessions([entry(hydrated)], '', true, now), []);
  assert.equal(groupSessions([entry(hydrated)], '', false, now)[0].recentCount, 0);
});

test('a verified recent assistant message makes a conversation fresh despite an old user message', () => {
  const answered = session('answered', {
    lastUserMessageAt: atAge(7 * 60 * 60 * 1000),
    chatActivityKnown: true,
    lastChatMessageAt: atAge(5 * 60 * 1000),
  });
  assert.equal(activity(answered), now - 5 * 60 * 1000);
  assert.equal(isRecentSession(answered, now), true);
  const [group] = groupSessions([entry(answered)], '', true, now);
  assert.equal(group.attention, null);
  assert.equal(group.count, 0);
  assert.equal(group.recentCount, 1);
});

test('known missing conversation activity never falls back to metadata or a user hint', () => {
  for (const lastChatMessageAt of [undefined, null, '', 'invalid']) {
    const known = session('known-empty', {
      updatedAt: atAge(0), createdAt: atAge(0), attentionTimestamp: atAge(0),
      lastUserMessageAt: atAge(0), chatActivityKnown: true, lastChatMessageAt,
    });
    assert.equal(activity(known), 0);
    assert.equal(isRecentSession(known, now), false);
    assert.deepEqual(groupSessions([entry(known)], '', true, now), []);
  }
  const unverified = session('no-user', {
    updatedAt: atAge(0), createdAt: atAge(0), attentionTimestamp: atAge(0),
    lastUserMessageAt: null, lastChatMessageAt: atAge(0),
  });
  assert.equal(activity(unverified), 0);
  assert.equal(isRecentSession(unverified, now), false);
});

test('a real recent user timestamp is a positive hint until conversation history is known', () => {
  for (const chatActivityKnown of [undefined, false]) {
    const hinted = session('hinted', {
      lastUserMessageAt: atAge(2 * 60 * 1000), chatActivityKnown,
      lastChatMessageAt: atAge(7 * 60 * 60 * 1000),
    });
    assert.equal(activity(hinted), now - 2 * 60 * 1000);
    assert.equal(isRecentSession(hinted, now), true);
    assert.equal(groupSessions([entry(hinted)], '', true, now)[0].recentCount, 1);
  }
});

test('future, invalid, and nonpositive activity timestamps are not recent', () => {
  const timestamps = [new Date(now + 1).toISOString(), 'invalid', '', null,
    '1970-01-01T00:00:00Z', '1969-12-31T23:59:59Z'];
  const agents = timestamps.flatMap((timestamp, index) => [
    session(`user-${index}`, { lastUserMessageAt: timestamp, updatedAt: atAge(0) }),
    session(`known-${index}`, { chatActivityKnown: true, lastChatMessageAt: timestamp,
      lastUserMessageAt: atAge(0), updatedAt: atAge(0) }),
  ]);
  for (const agent of agents) assert.equal(isRecentSession(agent, now), false, agent.id);
  assert.deepEqual(groupSessions(agents.map((agent) => entry(agent)), '', true, now), []);
});

test('old explicit attention survives the recent window and fresh attention is counted once', () => {
  const groups = groupSessions([
    entry(session('permission', { pendingPermissions: [{}] })),
    entry(session('error', { status: 'error' })),
    entry(session('running', { status: 'running' })),
    entry(session('finished', { requiresAttention: true, attentionReason: 'finished' })),
    entry(session('fresh-finished', { lastUserMessageAt: atAge(1), requiresAttention: true, attentionReason: 'finished' })),
  ], '', true, now);
  assert.deepEqual(groups[0].entries.map(({ agent }) => agent.id), ['permission', 'error', 'running', 'fresh-finished', 'finished']);
  assert.equal(groups[0].count, 5);
  assert.equal(groups[0].recentCount, 0);
  assert.deepEqual(groups[0].counts, { permission: 1, error: 1, running: 1, finished: 2 });
});

test('fresh read and acknowledged sessions remain neutral below explicit attention', () => {
  const acknowledged = entry(session('acknowledged', {
    chatActivityKnown: true, lastChatMessageAt: atAge(2 * 60 * 1000), requiresAttention: true, attentionReason: 'finished',
  }));
  const [cleared] = applyAcknowledgements([acknowledged], acknowledgeSessions({}, [acknowledged]));
  const read = session('read', { lastUserMessageAt: atAge(1), requiresAttention: false, attentionReason: 'finished' });
  assert.equal(attention(cleared.agent), null);
  assert.equal(attention(read), null);
  const groups = groupSessions([
    entry(read), cleared,
    entry(session('old-finished', { requiresAttention: true, attentionReason: 'finished' })),
    entry(session('other-fresh', { lastUserMessageAt: atAge(0) }), 'fresh-project'),
    entry(session('old-error', { status: 'error' }), 'blocked-project'),
    entry(session('expired-read', { lastUserMessageAt: atAge(RECENT_SESSION_WINDOW_MS + 1), requiresAttention: false }), 'expired'),
  ], '', true, now);
  assert.deepEqual(groups.map(({ key }) => key), ['blocked-project', 'repo', 'fresh-project']);
  assert.deepEqual(groups[1].entries.map(({ agent }) => agent.id), ['old-finished', 'read', 'acknowledged']);
  assert.equal(groups[1].attention, 'finished');
  assert.equal(groups[1].count, 1);
  assert.equal(groups[1].recentCount, 2);
  assert.equal(groups[2].attention, null);
  assert.equal(groups[2].count, 0);
  assert.equal(groups[2].recentCount, 1);
  assert.deepEqual(groups[2].counts, { permission: 0, error: 0, running: 0, finished: 0 });
});

test('recent sessions still obey archive, internal, and workspace search filters', () => {
  const entries = [
    entry(session('archived-fresh', { lastUserMessageAt: atAge(0), archivedAt: atAge(0) })),
    entry(session('internal-fresh', { lastUserMessageAt: atAge(0), internal: true })),
    entry(session('visible-fresh', { lastUserMessageAt: atAge(0) }), 'repo', 'feature-branch'),
    entry(session('other-fresh', { lastUserMessageAt: atAge(0) }), 'other'),
  ];
  assert.deepEqual(groupSessions(entries, '', true, now).flatMap(({ entries }) => entries.map(({ agent }) => agent.id)).sort(),
    ['other-fresh', 'visible-fresh']);
  assert.deepEqual(groupSessions(entries, 'FEATURE-BRANCH', true, now)[0].entries.map(({ agent }) => agent.id), ['visible-fresh']);
  assert.deepEqual(groupSessions(entries, 'missing', true, now), []);
});
