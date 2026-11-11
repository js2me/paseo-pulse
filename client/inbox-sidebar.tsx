import type { PluginSidebarItemProps } from "@getpaseo/plugin/client";
import { SidebarRow } from "@getpaseo/plugin/client/ui";
import { useMemo, useSyncExternalStore } from "react";
import { Pressable, Text } from "react-native";
import { groupSessions, type SessionEntry } from "../shared/sessions";
import { useSessionActivity } from "./use-session-activity";
import { useAcknowledgements } from "./use-acknowledgements";
import { useSessionClock } from "./use-session-clock";
import { statusColor } from "./status-color";
import { useSessionVisits } from "./use-session-visits";
import { useMessages } from "./messages";

/** Reuse the entrypoint's owned directory; the badge adds no agent subscription. */
export function createInboxSidebar() {
  let entries: SessionEntry[] = [];
  const listeners = new Set<() => void>();
  const snapshot = () => entries;
  const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
  function InboxItem({ currentScreen, openScreen, host, theme }: PluginSidebarItemProps) {
    const { t } = useMessages();
    const raw = useSyncExternalStore(subscribe, snapshot, snapshot);
    const timed = useSessionActivity(raw, host.id);
    const visited = useSessionVisits(timed.entries, host.id);
    const { entries: visible } = useAcknowledgements(visited.entries);
    const now = useSessionClock(visible);
    const groups = useMemo(() => groupSessions(visible, "", true, now), [visible, now]);
    const count = groups.reduce((total, group) => total + group.entries.length, 0);
    const open = () => openScreen({ screenId: "inbox" });
    const color = statusColor(theme, groups[0]?.attention ?? null);
    return <SidebarRow icon="Inbox" label={t("title")} active={currentScreen?.screenId === "inbox"} onPress={open}
      trailing={count > 0 ? <Pressable accessibilityRole="button" accessibilityLabel={t("sidebarCount", { count })}
        onPress={open} style={{ minWidth: 22, height: 18, paddingHorizontal: 5, borderRadius: 5,
          backgroundColor: color, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: theme.colors.surface0, fontSize: 11, lineHeight: 15, fontWeight: "700" }}>{count}</Text>
      </Pressable> : undefined} />;
  }
  return {
    Component: InboxItem,
    update(next: SessionEntry[]) { entries = next; for (const listener of listeners) listener(); },
    dispose() { listeners.clear(); entries = []; },
  };
}
