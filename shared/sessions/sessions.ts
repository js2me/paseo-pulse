export type Attention = "permission" | "error" | "running" | "finished" | null;
export interface Session {
  id: string;
  workspaceId?: string | null;
  title: string | null;
  provider: string;
  model?: string | null;
  thinkingOptionId?: string | null;
  effectiveThinkingOptionId?: string | null;
  currentModeId?: string | null;
  availableModes?: readonly { id: string; label: string }[];
  runtimeInfo?: { model?: string | null; thinkingOptionId?: string | null; modeId?: string | null };
  features?: readonly (
    { type: "toggle"; id: string; label: string; value: boolean } |
    { type: "select"; id: string; label: string; value: string | null; options: readonly { id: string; label: string }[] }
  )[];
  cwd: string;
  status: "initializing" | "idle" | "running" | "error" | "closed";
  updatedAt: string;
  createdAt: string;
  lastUserMessageAt?: string | null;
  lastChatMessageAt?: string | null;
  chatActivityKnown?: boolean;
  frequentlyViewedUntil?: number;
  attentionTimestamp?: string | null;
  requiresAttention?: boolean;
  attentionReason?: Exclude<Attention, "running">;
  pendingPermissions: readonly unknown[];
  archivedAt?: string | null;
  internal?: boolean;
}
export interface SessionEntry {
  agent: Session;
  project: { projectKey: string; projectName: string; workspaceName?: string | null };
}
export function attention(session: Session): Attention {
  if (session.pendingPermissions.length > 0) return "permission";
  if (session.status === "error" && session.requiresAttention !== false) return "error";
  if (session.status === "running" || session.status === "initializing") return "running";
  if (!session.requiresAttention) return null;
  return session.attentionReason ?? null;
}
/** Native read state and plugin OK marks never mute work or a pending action. */
export function isReadSession(session: Session): boolean {
  return session.requiresAttention === false && attention(session) === null;
}
export function activity(session: Session): number {
  // Hydrating an old provider history touches updatedAt. Only chat timestamps
  // prove recent activity; a known-but-missing timestamp must stay unknown.
  const value = session.chatActivityKnown ? session.lastChatMessageAt : session.lastUserMessageAt;
  const timestamp = value ? Date.parse(value) : 0;
  return Number.isFinite(timestamp) && timestamp > 0 ? timestamp : 0;
}
export function directoryActivity(session: Session): number {
  return Math.max(...[session.updatedAt, session.attentionTimestamp, session.createdAt, session.lastUserMessageAt]
    .map((value) => value ? Date.parse(value) || 0 : 0));
}
export const RECENT_SESSION_WINDOW_MS = 4 * 60 * 60 * 1000;
/** Directory timestamps select candidates for verification, never prove freshness. */
export function isRecentDirectoryCandidate(session: Session, now = Date.now()): boolean {
  const timestamp = directoryActivity(session);
  return timestamp > 0 && timestamp <= now && now - timestamp <= RECENT_SESSION_WINDOW_MS;
}
export function isRecentSession(session: Session, now = Date.now()): boolean {
  const timestamp = activity(session);
  return timestamp > 0 && timestamp <= now && now - timestamp <= RECENT_SESSION_WINDOW_MS;
}
export function isFrequentlyViewedSession(session: Session, now = Date.now()): boolean {
  return Number.isFinite(session.frequentlyViewedUntil) && (session.frequentlyViewedUntil ?? 0) >= now;
}
const rank = { permission: 4, error: 3, running: 2, finished: 1 };
export interface SessionGroup {
  key: string;
  name: string;
  entries: SessionEntry[];
  attention: Attention;
  count: number;
  recentCount: number;
  counts: Record<Exclude<Attention, null>, number>;
  updatedAt: number;
}
const attentionRank = (reason: Attention) => reason ? rank[reason] : 0;
export function groupSessions(entries: readonly SessionEntry[], search = "", onlyAttention = false, now = Date.now()) {
  const groups = new Map<string, SessionGroup>();
  const query = search.trim().toLocaleLowerCase();
  for (const entry of entries) {
    const { agent, project } = entry;
    if (agent.archivedAt || agent.internal) continue;
    const reason = attention(agent);
    const recent = !reason && isRecentSession(agent, now);
    if (onlyAttention && !reason && !recent && !isFrequentlyViewedSession(agent, now)) continue;
    if (query && ![agent.title, agent.cwd, agent.provider, project.projectName, project.workspaceName]
      .some((value) => value?.toLocaleLowerCase().includes(query))) continue;
    let group = groups.get(project.projectKey);
    if (!group) {
      group = { key: project.projectKey, name: project.projectName, entries: [], attention: null, count: 0, recentCount: 0,
        counts: { permission: 0, error: 0, running: 0, finished: 0 }, updatedAt: 0 };
      groups.set(project.projectKey, group);
    }
    group.entries.push(entry);
    group.updatedAt = Math.max(group.updatedAt, activity(agent));
    if (recent) group.recentCount++;
    if (reason) {
      group.count++;
      group.counts[reason]++;
      if (!group.attention || rank[reason] > rank[group.attention]) group.attention = reason;
    }
  }
  return [...groups.values()].map((group) => ({
    ...group, entries: group.entries.sort((a, b) =>
      attentionRank(attention(b.agent)) - attentionRank(attention(a.agent)) ||
      activity(b.agent) - activity(a.agent) || a.agent.id.localeCompare(b.agent.id)),
  })).sort((a, b) => attentionRank(b.attention) - attentionRank(a.attention) ||
    b.updatedAt - a.updatedAt || a.key.localeCompare(b.key));
}
export function sessionStatus(session: Session) {
  const reason = attention(session);
  return reason === "running" && session.status === "initializing" ? "initializing" : reason ?? session.status;
}
