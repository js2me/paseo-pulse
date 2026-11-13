import { Icon } from "@getpaseo/plugin/client/ui";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { observer } from "../../lib/mvvm";
import { GROUP_PREVIEW_LIMIT, type InboxGroup } from "../../view-models/inbox-view-model";
import { useMessages } from "../../i18n/messages";
import { statusColor } from "../shared/status-color";
import { ProjectLogo } from "../projects/project-logo";
import { SessionRow } from "./session-row";
import type { InboxViewContext } from "./types";

export const ProjectGroup = observer(function ProjectGroup({
  context,
  group,
}: {
  context: InboxViewContext;
  group: InboxGroup;
}) {
  const { props, binding } = context;
  const { theme, layout } = props;
  const { model, creation, creationDisabled, acknowledge, ackReady, ackPending } = binding;
  const { onlyAttention } = model;
  const {
    isExpanded,
    orderedEntries,
    showAll,
    visibleEntries,
    readGroup,
    iconProject,
    acknowledgeableCount,
  } = group;
  const { t } = useMessages(),
    c = theme.colors;
  const color = (reason: Parameters<typeof statusColor>[1]) => statusColor(theme, reason);
  const groupColor = group.attention ? color(group.attention) : null;
  return (
    <View key={group.key} style={{ gap: 2 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: c.surface1,
          borderRadius: 5,
          borderLeftWidth: 2,
          borderLeftColor: groupColor ?? "transparent",
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("projectSessions", { project: group.name, count: group.entries.length })}
          accessibilityState={{ expanded: isExpanded }}
          onPress={() => model.toggleGroup(group.key)}
          style={{
            flex: 1,
            minWidth: 0,
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
            paddingHorizontal: 6,
            paddingVertical: 6,
          }}
        >
          <Icon name={isExpanded ? "ChevronDown" : "ChevronRight"} size={13} color={c.foregroundMuted} />
          <ProjectLogo
            project={iconProject}
            projectKey={group.key}
            name={group.name}
            hostId={props.host.id}
            color={c.foreground}
          />
          <Text
            numberOfLines={1}
            style={{
              color: readGroup ? c.foregroundMuted : c.foreground,
              fontSize: 13,
              fontWeight: readGroup ? "500" : "700",
              flex: 1,
              minWidth: 40,
            }}
          >
            {group.name}
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 6,
              justifyContent: "flex-end",
              maxWidth: "60%",
            }}
          >
            {(["permission", "error", "running", "finished"] as const).map(
              (reason) =>
                group.counts[reason] > 0 && (
                  <Text key={reason} style={{ color: color(reason), fontSize: 11, fontWeight: "600" }}>
                    {t(`counts.${reason}`, { count: group.counts[reason] })}
                  </Text>
                ),
            )}
            {!!group.recentCount && (
              <Text style={{ color: c.foregroundMuted, fontSize: 11 }}>
                {t("counts.recent", { count: group.recentCount })}
              </Text>
            )}
            {!group.count && !group.recentCount && (
              <Text style={{ color: c.foregroundMuted, fontSize: 11 }}>{group.entries.length}</Text>
            )}
          </View>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("createInProject", { project: group.name })}
          disabled={creationDisabled}
          accessibilityState={{ disabled: creationDisabled, busy: creation.pending === group.key }}
          onPress={() => void creation.create({ projectKey: group.key, projectId: iconProject?.projectId,
            sourceDirectory: iconProject?.projectRootPath ?? group.entries[0]?.agent.cwd, displayName: group.name })}
          style={({ pressed }) => ({
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            minWidth: layout.compact ? 36 : 32,
            minHeight: layout.compact ? 36 : 32,
            opacity: creationDisabled ? 0.5 : 1,
            borderRadius: 5,
            backgroundColor: pressed ? c.surface2 : "transparent",
          })}
        >
          {creation.pending === group.key ? (
            <ActivityIndicator size="small" color={c.foregroundMuted} />
          ) : (
            <Icon name="Plus" size={16} color={c.foregroundMuted} />
          )}
        </Pressable>
        {isExpanded && acknowledgeableCount > 1 && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("ackProject", { project: group.name })}
            disabled={!ackReady || ackPending}
            onPress={() => void acknowledge(visibleEntries)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 3,
              padding: 7,
              opacity: !ackReady || ackPending ? 0.4 : 1,
            }}
          >
            <Icon name="CheckCheck" size={14} color={c.statusSuccess} />
            <Text style={{ color: c.statusSuccess, fontSize: 11 }}>{t("ok")}</Text>
          </Pressable>
        )}
      </View>
      {isExpanded && group.rows.map((row) => <SessionRow key={row.agent.id} context={context} row={row} />)}
      {isExpanded && !onlyAttention && orderedEntries.length > GROUP_PREVIEW_LIMIT && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t(showAll ? "collapseProject" : "expandProject", { project: group.name })}
          accessibilityState={{ expanded: showAll }}
          onPress={() => model.toggleRevealed(group.key)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          <Icon name={showAll ? "ChevronUp" : "ChevronDown"} size={12} color={c.foregroundMuted} />
          <Text style={{ color: c.foregroundMuted, fontSize: 12 }}>
            {showAll ? t("collapseToSix") : t("more", { count: orderedEntries.length - GROUP_PREVIEW_LIMIT })}
          </Text>
        </Pressable>
      )}
    </View>
  );
});
