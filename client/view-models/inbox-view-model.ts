import type { PluginScreenProps } from "@getpaseo/plugin/client";
import type { InboxGrouping } from "../../shared/inbox-preferences";
import type { IconProject } from "../../shared/projects/project-icons";
import { groupIconProject } from "../../shared/projects/project-icons";
import { canAcknowledge } from "../../shared/sessions/acknowledgements";
import {
  activity,
  attention,
  groupSessions,
  INACTIVE_GROUP_WINDOW_MS,
  isFrequentlyViewedSession,
  isSecondaryAttentionSession,
  isRevisitedSession,
  isReadSession,
  isRecentSession,
  sessionStatus,
  type SessionEntry,
} from "../../shared/sessions/sessions";
import type { LatestReplyQueryData } from "../data/sessions/latest-reply";
import { action, computed, makeObservable, observable, type ViewModelParams } from "../lib/mvvm";
import { PulseViewModel } from "../lib/pulse-view-model";

import { sessionEmphasis } from "./session-emphasis";

export const GROUP_PREVIEW_LIMIT = 6;
export const STATUS_GROUPS = ["action", "running", "finished", "other"] as const;
export type InboxStatusGroup = typeof STATUS_GROUPS[number];
type Payload = {
  entries: readonly SessionEntry[];
  replies: ReadonlyMap<string, LatestReplyQueryData>;
  iconProjects: readonly IconProject[];
  now: number;
  navigation: PluginScreenProps["navigation"];
  hostId: string;
  trackVisit(id: string): void;
  grouping?: InboxGrouping;
  setGrouping?(value: InboxGrouping): void;
};
export class InboxViewModel extends PulseViewModel<Payload> {
  search = "";
  searchOpen = false;
  onlyAttention = true;
  private localGrouping: InboxGrouping = "workspace";
  private expanded = new Map<string, boolean>();
  private revealed = new Set<string>();
  constructor(params: ViewModelParams<Payload>) {
    super(params);
    makeObservable<this, "expanded" | "revealed" | "localGrouping">(this, {
      search: observable,
      searchOpen: observable,
      onlyAttention: observable,
      localGrouping: observable,
      grouping: computed,
      groupByProject: computed,
      statusGroups: computed,
      statusItems: computed,
      expanded: observable.shallow,
      revealed: observable.shallow,
      groups: computed,
      flatRows: computed,
      attentionGroups: computed,
      totalAttention: computed,
      totalCount: computed,
      setSearch: action.bound,
      toggleSearch: action.bound,
      setOnlyAttention: action.bound,
      setGrouping: action.bound,
      toggleGroup: action.bound,
      toggleRevealed: action.bound,
      openSession: action.bound,
    });
  }
  get attentionGroups() {
    return groupSessions(this.payload.entries, "", true, this.payload.now);
  }
  get totalAttention() {
    return this.attentionGroups.reduce((sum, group) => sum + group.entries.length, 0);
  }
  get totalCount() {
    return this.payload.entries.length;
  }
  get groups() {
    const { entries, now, replies, iconProjects } = this.payload;
    return groupSessions(entries, this.search, this.onlyAttention, now, this.groupByProject).map((group) => {
      const expansionKey = `${this.onlyAttention ? "attention" : "all"}:${group.key}`;
      const inactive = this.onlyAttention && group.entries.every(({ agent }) => {
        const timestamp = activity(agent);
        const reason = attention(agent);
        return timestamp > 0 && now - timestamp > INACTIVE_GROUP_WINDOW_MS &&
          reason !== "running" && reason !== "permission";
      });
      const isExpanded = !!this.search.trim() || (this.expanded.get(expansionKey) ?? !inactive);
      const primaryEntries = group.entries.filter(({ agent }) => !isSecondaryAttentionSession(agent, now));
      const secondaryEntries = group.entries.filter(({ agent }) => isSecondaryAttentionSession(agent, now));
      const orderedEntries = this.onlyAttention
        ? [...primaryEntries, ...secondaryEntries]
        : [...group.entries].sort(
            (a, b) => Number(!!b.agent.pinnedAt) - Number(!!a.agent.pinnedAt) ||
              activity(b.agent) - activity(a.agent) || a.agent.id.localeCompare(b.agent.id),
          );
      const revealKey = `${this.onlyAttention ? "attention" : "all"}:${group.key}`;
      const showAll = !this.groupByProject || !!this.search.trim() || this.revealed.has(revealKey);
      const previewCount = this.onlyAttention ? primaryEntries.length : GROUP_PREVIEW_LIMIT;
      const hiddenCount = Math.max(0, orderedEntries.length - previewCount);
      const visibleEntries = showAll ? orderedEntries : orderedEntries.slice(0, previewCount);
      return {
        ...group,
        isExpanded,
        orderedEntries,
        showAll,
        hiddenCount,
        visibleEntries,
        readGroup: group.entries.every(({ agent }) => isReadSession(agent)),
        iconProject: groupIconProject(group, iconProjects),
        acknowledgeableCount: visibleEntries.filter(({ agent }) => canAcknowledge(agent)).length,
        rows: visibleEntries.map((sessionEntry) => {
          const { agent } = sessionEntry;
          const reason = attention(agent),
            recent = isRecentSession(agent, now),
            lastActivity = activity(agent);
          const withinDay =
            lastActivity > 0 && lastActivity <= now && now - lastActivity < 24 * 60 * 60 * 1000;
          return {
            emphasis: sessionEmphasis(agent, now),
            sessionEntry,
            agent,
            reason,
            recent,
            lastActivity,
            withinDay,
            highlighted: !!reason,
            read: isReadSession(agent),
            reply: replies.get(agent.id),
            acknowledgeable: canAcknowledge(agent),
            status: (reason
              ? sessionStatus(agent)
              : recent
                ? "recent"
                : (isFrequentlyViewedSession(agent, now) || isRevisitedSession(agent, now))
                  ? "frequent"
                  : sessionStatus(agent)) as ReturnType<typeof sessionStatus> | "recent" | "frequent",
          };
        }),
      };
    });
  }
  get flatRows() {
    return this.groups.flatMap((group) => group.rows);
  }
  get grouping() {
    return this.payload.grouping ?? this.localGrouping;
  }
  get groupByProject() {
    return this.grouping === "workspace";
  }
  get statusGroups() {
    const groups = new Map<InboxStatusGroup, InboxRow[]>(STATUS_GROUPS.map((key) => [key, []]));
    for (const row of this.flatRows) {
      const key = row.reason === "permission" || row.reason === "error" ? "action"
        : row.reason === "running" ? "running"
        : row.reason === "finished" ? "finished" : "other";
      groups.get(key)!.push(row);
    }
    return STATUS_GROUPS.flatMap((key) => {
      const rows = groups.get(key)!;
      return rows.length ? [{ key, rows }] : [];
    });
  }
  get statusItems(): StatusListItem[] {
    return this.statusGroups.flatMap(({ key, rows }) => [
      { kind: "header", key: `status:${key}`, status: key, count: rows.length } as const,
      ...rows.map((row) => ({ kind: "session", key: `session:${row.agent.id}`, row } as const)),
    ]);
  }
  setGrouping(value: InboxGrouping) {
    this.localGrouping = value;
    this.payload.setGrouping?.(value);
  }
  setSearch(value: string) {
    this.search = value;
  }
  toggleSearch() {
    this.searchOpen = !this.searchOpen;
    this.search = "";
  }
  setOnlyAttention(value: boolean) {
    this.onlyAttention = value;
  }
  toggleGroup(key: string) {
    const group = this.groups.find((group) => group.key === key);
    if (group) this.expanded.set(`${this.onlyAttention ? "attention" : "all"}:${key}`, !group.isExpanded);
  }
  toggleRevealed(key: string) {
    const revealKey = `${this.onlyAttention ? "attention" : "all"}:${key}`;
    if (this.revealed.has(revealKey)) this.revealed.delete(revealKey);
    else this.revealed.add(revealKey);
  }
  openSession(id: string) {
    if (!this.payload.navigation) return;
    this.payload.trackVisit(id);
    this.payload.navigation.openAgent({ agentId: id, serverId: this.payload.hostId });
  }
}
export type InboxGroup = InboxViewModel["groups"][number];
export type InboxRow = InboxGroup["rows"][number];

export type StatusListItem =
  | { kind: "header"; key: string; status: InboxStatusGroup; count: number }
  | { kind: "session"; key: string; row: InboxRow };
