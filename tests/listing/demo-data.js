// Sample projects only. This module never connects to a real Paseo daemon.
const now = Date.now();
const ago = minutes => new Date(now - minutes * 60_000).toISOString();
export const projects = [
  { projectId: 'atlas', projectDisplayName: 'Atlas Studio', projectRootPath: '/projects/atlas-studio' },
  { projectId: 'horizon', projectDisplayName: 'Horizon API', projectRootPath: '/projects/horizon-api' },
  { projectId: 'relay', projectDisplayName: 'Relay Mobile', projectRootPath: '/projects/relay-mobile' },
];
function session(projectId, id, title, preview, minutes, overrides = {}) {
  const project = projects.find(item => item.projectId === projectId);
  return { agent: { id, title, provider: 'codex', cwd: project.projectRootPath, workspaceId: projectId,
    createdAt: ago(1440), updatedAt: ago(minutes), lastUserMessageAt: ago(minutes), status: 'idle',
    requiresAttention: false, pendingPermissions: [], ...overrides },
  project: { projectKey: projectId, projectName: project.projectDisplayName }, preview };
}
export const entries = [
  session('atlas', 'plan', 'Approve the navigation plan', 'The proposal is ready. Please approve the next step.', 4,
    { pendingPermissions: [{ id: 'sample-permission' }], requiresAttention: true, attentionReason: 'permission' }),
  session('atlas', 'checkout', 'Polish the checkout flow', 'Updating responsive states and keyboard navigation.', 6, { status: 'running' }),
  session('atlas', 'accessibility', 'Review accessibility changes', 'Contrast and focus checks pass. Ready for review.', 12,
    { requiresAttention: true, attentionReason: 'finished', attentionTimestamp: ago(12) }),
  session('atlas', 'labels', 'Align settings labels', 'Labels are consistent on desktop and mobile.', 52),
  session('horizon', 'integration', 'Investigate an integration failure', 'A service configuration is needed to continue.', 18,
    { status: 'error', requiresAttention: true, attentionReason: 'error', attentionTimestamp: ago(18) }),
  session('horizon', 'webhooks', 'Check webhook retry handling', 'Checking retry timing and duplicate delivery guards.', 7, { status: 'running' }),
  session('horizon', 'backoff', 'Verify retry backoff', 'Transient network errors now recover as expected.', 145),
  session('relay', 'navigation', 'Refine compact navigation', 'Sidebar and navigation fit narrow screens.', 47),
  session('relay', 'safe-areas', 'Adjust safe-area spacing', 'Screen edges and bottom spacing are aligned.', 192),
];
const page = { entries: entries.map(({ preview, ...entry }) => entry), pageInfo: { hasMore: false, nextCursor: null, prevCursor: null } };
export const creationDemo = { created: [], opened: [], fail: false };
export const demoApi = {
  agents: { list: async options => options?.subscribe ? { ...page, subscription: {
    subscribe(observer) { observer.snapshot(page); return () => {}; }, release: async () => {},
  } } : page,
    ref: id => ({ refresh: async () => {
      const agent = entries.find(({ agent }) => agent.id === id)?.agent;
      return agent ? { agent: { ...agent, model: `model-${agent.workspaceId}`, currentModeId: 'auto',
        thinkingOptionId: 'high', features: [{ type: 'toggle', id: 'sandbox', value: false }] } } : null;
    } }),
    create: async input => {
      creationDemo.created.push(input);
      await new Promise(resolve => setTimeout(resolve, 150));
      if (creationDemo.fail) throw new Error('Sample creation error');
      return { id: `sample-created-${creationDemo.created.length}` };
    } },
  projects: { list: async () => ({ projects }), subscribe: () => () => {} },
  config: { get: async () => ({ config: { agentProfiles: [{ id: 'demo', name: 'Codex', provider: 'codex', model: 'sample-model' }] } }) },
  providers: { listAvailable: async () => ({ providers: [{ provider: 'codex', available: true }] }), listModels: async () => ({ models: [] }) },
};
export async function demoRpc(name, input) {
  if (name === 'session-index.read') return { entries: input.agentIds.map(agentId => {
    const entry = entries.find(({ agent }) => agent.id === agentId);
    return { agentId, text: entry.preview, limited: false, latestReplyAt: entry.agent.lastUserMessageAt,
      lastActivityAt: entry.agent.lastUserMessageAt, activityKnown: true };
  }) };
  if (name === 'project-icon.read') return { icon: null };
  if (name === 'session-visits.list') return { sessions: [] };
  if (name === 'session-visits.record') return {};
  throw new Error(`Unexpected sample-media RPC: ${name}`);
}
