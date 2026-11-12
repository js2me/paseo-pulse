import type { PluginSidebarItemProps } from "@getpaseo/plugin/client";
import { SidebarRow } from "@getpaseo/plugin/client/ui";
import { observable, observer, runInAction, useCreateViewModel } from "../../lib/mvvm";
import { SidebarViewModel } from "../../view-models/sidebar-view-model";
import { Pressable, Text } from "react-native";
import { type SessionEntry } from "../../../shared/sessions/sessions";
import { useSessionActivity } from "../../bindings/use-session-activity";
import { useAcknowledgements } from "../../bindings/use-acknowledgements";
import { useSessionClock } from "../../bindings/use-session-clock";
import { statusColor } from "../shared/status-color";
import { useSessionVisits } from "../../bindings/use-session-visits";
import { useMessages } from "../../i18n/messages";

/** Reuse the entrypoint's owned directory; the badge adds no agent subscription. */
export function createInboxSidebar() {
  const entries = observable.box<SessionEntry[]>([], { deep: false });
  const InboxItem = observer(function InboxItem({
    currentScreen,
    openScreen,
    host,
    theme,
  }: PluginSidebarItemProps) {
    const { t } = useMessages();
    const raw = entries.get();
    const timed = useSessionActivity(raw, host.id);
    const visited = useSessionVisits(timed.entries, host.id);
    const { entries: visible } = useAcknowledgements(visited.entries);
    const now = useSessionClock(visible);
    const model = useCreateViewModel(SidebarViewModel, { entries: visible, now });
    const count = model.count;
    const open = () => openScreen({ screenId: "inbox" });
    const color = statusColor(theme, model.attention);
    return (
      <SidebarRow
        icon="Inbox"
        label={t("title")}
        active={currentScreen?.screenId === "inbox"}
        onPress={open}
        trailing={
          count > 0 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t("sidebarCount", { count })}
              onPress={open}
              style={{
                minWidth: 22,
                height: 18,
                paddingHorizontal: 5,
                borderRadius: 5,
                backgroundColor: color,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: theme.colors.surface0, fontSize: 11, lineHeight: 15, fontWeight: "700" }}>
                {count}
              </Text>
            </Pressable>
          ) : undefined
        }
      />
    );
  });
  return {
    Component: InboxItem,
    update(next: SessionEntry[]) {
      runInAction(() => entries.set(next));
    },
    dispose() {
      runInAction(() => entries.set([]));
    },
  };
}
