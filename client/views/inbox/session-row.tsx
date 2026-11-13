import { Icon } from "@getpaseo/plugin/client/ui";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { observer } from "../../lib/mvvm";
import type { InboxRow } from "../../view-models/inbox-view-model";
import { relativeTime, useMessages } from "../../i18n/messages";
import { sessionTextColors } from "../shared/session-text-colors";
import { statusColor } from "../shared/status-color";
import { SessionReplyPreview } from "./session-reply-preview";
import type { InboxViewContext } from "./types";

export const SessionRow = observer(function SessionRow({
  context,
  row,
}: {
  context: InboxViewContext;
  row: InboxRow;
}) {
  const { props, binding } = context;
  const { theme, layout } = props;
  const { model, acknowledge, ackPending, ackReady, now, verifying, previewError } = binding;
  const { sessionEntry, agent, reason, recent, lastActivity, withinDay, highlighted, read } = row;
  const { t } = useMessages(),
    c = theme.colors;
  const color = (reason: Parameters<typeof statusColor>[1]) => statusColor(theme, reason);
  const rowColor = reason ? color(reason) : c.foregroundMuted;
  const textColors = sessionTextColors(theme, row.emphasis);
  const rowLabel = t(`status.${row.status}`);
  return (
    <View key={agent.id} style={{ flexDirection: "row", alignItems: "center" }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t(read ? "readRowLabel" : "rowLabel", {
          title: agent.title || t("untitled"),
          status: rowLabel,
        })}
        accessibilityState={{ disabled: !props.navigation }}
        disabled={!props.navigation}
        onPress={() => model.openSession(agent.id)}
        style={({ pressed }) => ({
          flex: 1,
          minWidth: 0,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          paddingHorizontal: 9,
          paddingVertical: layout.compact ? 10 : 7,
          borderRadius: 4,
          borderLeftWidth: 2,
          borderLeftColor: highlighted ? rowColor : "transparent",
          backgroundColor: pressed ? c.surface2 : c.surface0,
        })}
      >
        <View style={{ width: 12, height: 12, flexShrink: 0, alignItems: "center", justifyContent: "center" }}>
          {reason === "running" ? (
            <ActivityIndicator
              animating
              size="small"
              color={color(reason)}
              style={{ transform: [{ scale: 0.6 }] }}
            />
          ) : (
          <View
            style={{
              width: 5,
              height: 5,
              borderRadius: 3,
              backgroundColor: read ? c.foregroundMuted : recent && !reason ? c.statusSuccess : rowColor,
              opacity: read ? 0.45 : highlighted || recent ? 1 : withinDay ? 0.75 : 0.4,
            }}
          />
          )}
        </View>
        <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
          <Text
            numberOfLines={1}
            style={{
              color: textColors.title,
              fontSize: 14,
              lineHeight: 19,
              fontWeight: row.emphasis.weight,
            }}
          >
            {agent.title || t("untitled")}
          </Text>
          <SessionReplyPreview
            theme={theme}
            text={row.reply?.text}
            limited={row.reply?.limited}
            loading={verifying}
            error={previewError}
            color={textColors.preview}
          />
        </View>
        <Text
          accessibilityLabel={t("lastMessage", { time: relativeTime(lastActivity, t, now) })}
          style={{
            color: textColors.time,
            fontSize: 11,
            fontWeight: reason ? "600" : row.emphasis.time >= 0.5 ? "500" : "400",
            minWidth: 32,
            textAlign: "right",
          }}
        >
          {relativeTime(lastActivity, t, now)}
        </Text>
      </Pressable>
      {row.acknowledgeable && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("ackSession", { session: agent.title || t("reply") })}
          disabled={!ackReady || ackPending}
          onPress={() => void acknowledge([sessionEntry])}
          style={{ padding: 7, opacity: !ackReady || ackPending ? 0.4 : 1 }}
        >
          <Icon name="Check" size={15} color={c.foregroundMuted} />
        </Pressable>
      )}
    </View>
  );
});
