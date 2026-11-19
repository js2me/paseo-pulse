import { Text, View } from "react-native";
import { useMessages } from "../../i18n/messages";
import type { StatusListItem } from "../../view-models/inbox-view-model";
import { statusColor } from "../shared/status-color";
import { SessionRow } from "./session-row";
import type { InboxViewContext } from "./types";

export function StatusListItemView({ context, item }: { context: InboxViewContext; item: StatusListItem }) {
  const { t } = useMessages();
  if (item.kind === "session") return <SessionRow context={context} row={item.row} />;
  const c = context.props.theme.colors;
  const color = item.status === "action" ? c.statusWarning
    : item.status === "running" ? statusColor(context.props.theme, "running")
    : item.status === "finished" ? c.statusSuccess : c.foregroundMuted;
  return (
    <View style={{
      flexDirection: "row", alignItems: "center", gap: 8,
      backgroundColor: c.surface1, borderRadius: 5,
      borderLeftWidth: 2, borderLeftColor: color,
      marginTop: 8, paddingHorizontal: 8, paddingVertical: 7,
    }}>
      <Text accessibilityRole="header" style={{ color: c.foreground, fontSize: 13, fontWeight: "700" }}>
        {t(`statusGroups.${item.status}`)}
      </Text>
      <Text style={{ color, fontSize: 12, fontWeight: "600" }}>{item.count}</Text>
    </View>
  );
}
