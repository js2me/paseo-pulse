import type { PluginScreenProps } from "@getpaseo/plugin/client";
import type { IconProject } from "../../shared/projects/project-icons";
import { groupIconProject } from "../../shared/projects/project-icons";
import { canAcknowledge } from "../../shared/sessions/acknowledgements";
import {
  activity,
  attention,
  groupSessions,
  isFrequentlyViewedSession,
  isReadSession,
  isRecentSession,
  sessionStatus,
  type SessionEntry,
} from "../../shared/sessions/sessions";
import type { LatestReplyQueryData } from "../data/sessions/latest-reply";
import { action, computed, makeObservable, observable, type ViewModelParams } from "../lib/mvvm";
import { PulseViewModel } from "../lib/pulse-view-model";

export const GROUP_PREVIEW_LIMIT = 6;
type Payload = {
  entries: readonly SessionEntry[];
  replies: ReadonlyMap<string, LatestReplyQueryData>;
  iconProjects: readonly IconProject[];
  now: number;
  navigation: PluginScreenProps["navigation"];
  hostId: string;
  trackVisit(id: string): void;
};
export class InboxViewModel extends PulseViewModel<Payload> {
  search = "";
  searchOpen = false;
  onlyAttention = true;
  private expanded = new Map<string, boolean>();
  private revealed = new Set<string>();
  constructor(params: ViewModelParams<Payload>) {
    super(params);
    makeObservable<this, "expanded" | "revealed">(this, {
      search: observable,
      searchOpen: observable,
      onlyAttention: observable,
      expanded: observable.shallow,
      revealed: observable.shallow,
      groups: computed,
      attentionGroups: computed,
      totalAttention: computed,
      totalCount: computed,
      setSearch: action.bound,
      toggleSearch: action.bound,
      setOnlyAttention: action.bound,
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
    return groupSessions(entries, this.search, this.onlyAttention, now).map((group) => {
      const expansionKey = `${this.onlyAttention ? "attention" : "all"}:${group.key}`;
      const isExpanded = !!this.search.trim() || (this.expanded.get(expansionKey) ?? true);
      const orderedEntries = this.onlyAttention
        ? group.entries
        : [...group.entries].sort(
            (a, b) => activity(b.agent) - activity(a.agent) || a.agent.id.localeCompare(b.agent.id),
          );
      const showAll = this.revealed.has(group.key);
      const visibleEntries =
        this.onlyAttention || showAll ? orderedEntries : orderedEntries.slice(0, GROUP_PREVIEW_LIMIT);
      return {
        ...group,
        isExpanded,
        orderedEntries,
        showAll,
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
                : isFrequentlyViewedSession(agent, now)
                  ? "frequent"
                  : sessionStatus(agent)) as ReturnType<typeof sessionStatus> | "recent" | "frequent",
          };
        }),
      };
    });
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
    if (this.revealed.has(key)) this.revealed.delete(key);
    else this.revealed.add(key);
  }
  openSession(id: string) {
    if (!this.payload.navigation) return;
    this.payload.trackVisit(id);
    this.payload.navigation.openAgent({ agentId: id, serverId: this.payload.hostId });
  }
}
export type InboxGroup = InboxViewModel["groups"][number];
export type InboxRow = InboxGroup["rows"][number];
