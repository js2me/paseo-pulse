import type { PluginScreenProps } from "@getpaseo/plugin/client";
import { Icon } from "@getpaseo/plugin/client/ui";
import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from "react-native";
import { attention, activity, groupSessions, isReadSession, isRecentSession, isFrequentlyViewedSession, sessionStatus, type Attention } from "../shared/sessions";
import { useSessions } from "./use-sessions";
import { statusColor } from "./status-color";
import { canAcknowledge } from "../shared/acknowledgements";
import { useAcknowledgements } from "./use-acknowledgements";
import { SessionReplyPreview } from "./session-reply-preview";
import { useSessionActivity } from "./use-session-activity";
import { NewSessionDialog } from "./new-session";
import { ProjectLogo, useIconProjects } from "./project-logo";
import { groupIconProject } from "../shared/project-icons";
import { useSessionClock } from "./use-session-clock";
import { useSessionVisits } from "./use-session-visits";
import { directoryError, relativeTime, useMessages } from "./messages";

const GROUP_PREVIEW_LIMIT = 6;
const SESSION_DAY_MS = 24 * 60 * 60 * 1000;
export function InboxScreen(props: PluginScreenProps) {
  return <Inbox key={props.host.id} {...props} />;
}
function Inbox(props: PluginScreenProps) {
  const { theme, layout } = props;
  const { t } = useMessages();
  const c = theme.colors;
  const iconProjects = useIconProjects(props.host.id);
  const { entries: rawEntries, loading, error, retry } = useSessions();
  const { entries: timedEntries, replies, verifying, previewError } = useSessionActivity(rawEntries, props.host.id);
  const { entries: visitedEntries, trackVisit } = useSessionVisits(timedEntries, props.host.id);
  const { entries, acknowledge, pending: ackPending, error: ackError, ready: ackReady } = useAcknowledgements(visitedEntries);
  const [search, setSearch] = useState("");
  const [searchOpen, showSearch] = useState(false);
  const [creationContext, setCreationContext] = useState<{ cwd?: string; provider?: string } | null>(null);
  const [onlyAttention, setOnlyAttention] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const now = useSessionClock(entries);
  const groups = useMemo(() => groupSessions(entries, search, onlyAttention, now), [entries, search, onlyAttention, now]);
  const attentionGroups = useMemo(() => groupSessions(entries, "", true, now), [entries, now]);
  const totalAttention = attentionGroups.reduce((sum, group) => sum + group.entries.length, 0);
  const color = (reason: Attention) => statusColor(theme, reason);
  const countColor = totalAttention && attentionGroups[0]?.attention ? color(attentionGroups[0].attention) : c.foregroundMuted;
  return <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", backgroundColor: c.surface0 }}>
    <View style={{ flex: 1, minWidth: 0, maxWidth: 1000 }}>
      <View style={{ paddingHorizontal: 12, paddingVertical: 8, gap: 8, borderBottomWidth: 1, borderColor: c.border }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <View style={{ flexDirection: "row", gap: 2, borderRadius: 6, backgroundColor: c.surface1, padding: 2 }}>
            {[{ value: true, label: t("attention"), count: totalAttention }, { value: false, label: t("all"), count: entries.length }].map((tab) =>
              <Pressable key={tab.label} accessibilityRole="tab" accessibilityState={{ selected: onlyAttention === tab.value }}
                onPress={() => setOnlyAttention(tab.value)}
                style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 9, paddingVertical: 6,
                  borderRadius: 4, backgroundColor: onlyAttention === tab.value ? c.surface2 : c.surface1 }}>
                <Text style={{ color: onlyAttention === tab.value ? c.foreground : c.foregroundMuted, fontSize: 13,
                  fontWeight: onlyAttention === tab.value ? "600" : "400" }}>{tab.label}</Text>
                <Text style={{ color: tab.value ? countColor : c.foregroundMuted, fontSize: 12, fontWeight: "600" }}>{tab.count}</Text>
              </Pressable>)}
          </View>
          <View style={{ flex: 1 }} />
          <Pressable accessibilityRole="button" accessibilityLabel={t("newSession")} hitSlop={6}
            onPress={() => {
              const source = groups[0]?.entries[0]
                ?? [...entries].sort((a, b) => activity(b.agent) - activity(a.agent))[0];
              setCreationContext({ cwd: source?.agent.cwd, provider: source?.agent.provider });
            }} style={{ padding: 6 }}>
            <Icon name="Plus" size={18} color={c.foreground} />
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={searchOpen ? t("closeSearch") : t("findSession")}
            accessibilityState={{ expanded: searchOpen }} hitSlop={6}
            onPress={() => { showSearch(!searchOpen); setSearch(""); }} style={{ padding: 6 }}>
            <Icon name={searchOpen ? "X" : "Search"} size={16} color={c.foregroundMuted} />
          </Pressable>
        </View>
        {searchOpen && <TextInput value={search} onChangeText={setSearch} placeholder={t("searchPlaceholder")} autoFocus
          placeholderTextColor={c.foregroundMuted} accessibilityLabel={t("searchLabel")} autoCapitalize="none"
          style={{ color: c.foreground, backgroundColor: c.surface1, borderWidth: 1, borderColor: c.border,
            borderRadius: 6, paddingHorizontal: 10, paddingVertical: 7, fontSize: 13 }} />}
      </View>
      <FlatList style={{ flex: 1 }} data={groups} keyExtractor={(group) => group.key}
        initialNumToRender={3} maxToRenderPerBatch={3} windowSize={5}
        contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 10, gap: 12 }}
        ListHeaderComponent={<>
        {!groups.length && (loading || verifying || (!ackReady && !ackError)) &&
          <Text style={{ color: c.foregroundMuted, fontSize: 13 }}>{t("loading")}</Text>}
        {ackError && <Text accessibilityRole="alert" style={{ color: c.statusDanger, fontSize: 12 }}>{ackError}</Text>}
        {error && <View style={{ gap: 6 }}>
          <Text style={{ color: c.statusDanger, fontSize: 12 }}>{t("listError", { error: directoryError(error, t) })}</Text>
          <Pressable accessibilityRole="button" onPress={retry}><Text style={{ color: c.accent }}>{t("retry")}</Text></Pressable>
        </View>}
        {!loading && !verifying && ackReady && !error && !groups.length && <View style={{ paddingVertical: 24, alignItems: "center", gap: 8 }}>
          <Icon name={search ? "Search" : "CircleCheck"} size={22} color={search ? c.foregroundMuted : c.statusSuccess} />
          <Text style={{ color: c.foreground, fontSize: 14 }}>{search ? t("nothingFound") : onlyAttention ? t("nothingNeedsAttention") : t("noSessions")}</Text>
          {!search && onlyAttention && <Pressable accessibilityRole="button" onPress={() => setOnlyAttention(false)}>
            <Text style={{ color: c.foregroundMuted, fontSize: 12 }}>{t("viewAll")}</Text>
          </Pressable>}
        </View>}
        </>}
        renderItem={({ item: group }) => {
          const expansionKey = `${onlyAttention ? "attention" : "all"}:${group.key}`;
          const isExpanded = search.trim() ? true : expanded[expansionKey] ?? true;
          const orderedEntries = onlyAttention ? group.entries : [...group.entries].sort((a, b) =>
            activity(b.agent) - activity(a.agent) || a.agent.id.localeCompare(b.agent.id));
          const showAll = revealed[group.key] ?? false;
          const visibleEntries = onlyAttention || showAll ? orderedEntries : orderedEntries.slice(0, GROUP_PREVIEW_LIMIT);
          const groupColor = group.attention ? color(group.attention) : null;
          const readGroup = group.entries.every(({ agent }) => isReadSession(agent));
          const iconProject = groupIconProject(group, iconProjects);
          const acknowledgeableCount = visibleEntries.filter(({ agent }) => canAcknowledge(agent)).length;
          return <View key={group.key} style={{ gap: 2 }}>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: c.surface1, borderRadius: 5,
              borderLeftWidth: 2, borderLeftColor: groupColor ?? "transparent" }}>
            <Pressable accessibilityRole="button" accessibilityLabel={t("projectSessions", { project: group.name, count: group.entries.length })}
              accessibilityState={{ expanded: isExpanded }} onPress={() => setExpanded((previous) => ({ ...previous, [expansionKey]: !isExpanded }))}
              style={{ flex: 1, minWidth: 0, flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 6, paddingVertical: 6 }}>
              <Icon name={isExpanded ? "ChevronDown" : "ChevronRight"} size={13} color={c.foregroundMuted} />
              <ProjectLogo project={iconProject} projectKey={group.key}
                name={group.name} hostId={props.host.id} color={c.foreground} />
              <Text numberOfLines={1} style={{ color: readGroup ? c.foregroundMuted : c.foreground,
                fontSize: 13, fontWeight: readGroup ? "500" : "700", flex: 1, minWidth: 40 }}>{group.name}</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, justifyContent: "flex-end", maxWidth: "60%" }}>
              {(["permission", "error", "running", "finished"] as const).map((reason) => group.counts[reason] > 0 &&
                <Text key={reason} style={{ color: color(reason), fontSize: 11, fontWeight: "600" }}>
                  {t(`counts.${reason}`, { count: group.counts[reason] })}
                </Text>)}
              {!!group.recentCount && <Text style={{ color: c.foregroundMuted, fontSize: 11 }}>
                {t("counts.recent", { count: group.recentCount })}
              </Text>}
              {!group.count && !group.recentCount && <Text style={{ color: c.foregroundMuted, fontSize: 11 }}>{group.entries.length}</Text>}
              </View>
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel={t("createInProject", { project: group.name })}
              onPress={() => {
                const source = [...group.entries].sort((a, b) => activity(b.agent) - activity(a.agent))[0];
                setCreationContext({ cwd: iconProject?.projectRootPath ?? source?.agent.cwd,
                  provider: source?.agent.provider });
              }}
              style={({ pressed }) => ({ alignItems: "center", justifyContent: "center", alignSelf: "center",
                minWidth: layout.compact ? 36 : 32, minHeight: layout.compact ? 36 : 32,
                borderRadius: 5, backgroundColor: pressed ? c.surface2 : "transparent" })}>
              <Icon name="Plus" size={16} color={c.foregroundMuted} />
            </Pressable>
            {isExpanded && acknowledgeableCount > 1 && <Pressable accessibilityRole="button"
              accessibilityLabel={t("ackProject", { project: group.name })} disabled={!ackReady || ackPending}
              onPress={() => void acknowledge(visibleEntries)}
              style={{ flexDirection: "row", alignItems: "center", gap: 3, padding: 7, opacity: !ackReady || ackPending ? 0.4 : 1 }}>
              <Icon name="CheckCheck" size={14} color={c.statusSuccess} />
              <Text style={{ color: c.statusSuccess, fontSize: 11 }}>{t("ok")}</Text>
            </Pressable>}
            </View>
            {isExpanded && visibleEntries.map((sessionEntry) => {
              const { agent } = sessionEntry;
              const reason = attention(agent);
              const recent = isRecentSession(agent, now);
              const lastActivity = activity(agent);
              const withinDay = lastActivity > 0 && lastActivity <= now && now - lastActivity < SESSION_DAY_MS;
              const highlighted = !!reason;
              const read = isReadSession(agent);
              const rowColor = reason ? color(reason) : c.foregroundMuted;
              const rowLabel = reason ? t(`status.${sessionStatus(agent)}`) : recent ? t("status.recent")
                : isFrequentlyViewedSession(agent, now) ? t("status.frequent") : t(`status.${sessionStatus(agent)}`);
              return <View key={agent.id} style={{ flexDirection: "row", alignItems: "center" }}>
              <Pressable accessibilityRole="button" accessibilityLabel={t(read ? "readRowLabel" : "rowLabel", { title: agent.title || t("untitled"), status: rowLabel })}
                accessibilityState={{ disabled: !props.navigation }} disabled={!props.navigation}
                onPress={() => {
                  if (!props.navigation) return;
                  trackVisit(agent.id);
                  props.navigation.openAgent({ agentId: agent.id, serverId: props.host.id });
                }}
                style={({ pressed }) => ({ flex: 1, minWidth: 0, flexDirection: "row", alignItems: "center", gap: 8,
                  paddingHorizontal: 9, paddingVertical: layout.compact ? 10 : 7, borderRadius: 4,
                  borderLeftWidth: 2, borderLeftColor: highlighted ? rowColor : "transparent",
                  backgroundColor: pressed ? c.surface2 : c.surface0 })}>
                {reason === "running" ? <View style={{ width: 12, height: 12, alignItems: "center", justifyContent: "center" }}>
                  <ActivityIndicator animating size="small" color={color(reason)} style={{ transform: [{ scale: 0.6 }] }} />
                </View> :
                  <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: read ? c.foregroundMuted : recent && !reason ? c.statusSuccess : rowColor,
                    opacity: read ? 0.45 : highlighted || recent ? 1 : withinDay ? 0.75 : 0.4 }} />}
                <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                  <Text numberOfLines={1} style={{ color: read ? c.foregroundMuted : highlighted || withinDay ? c.foreground : c.foregroundMuted,
                    opacity: read ? 0.85 : highlighted || recent || !withinDay ? 1 : 0.88,
                    fontSize: 13, lineHeight: 18, fontWeight: read ? "400" : highlighted ? "600" : withinDay ? "500" : "400" }}>{agent.title || t("untitled")}</Text>
                  <SessionReplyPreview theme={theme} text={replies.get(agent.id)?.text}
                    limited={replies.get(agent.id)?.limited} loading={verifying} error={previewError}
                    color={read ? c.foregroundMuted : reason === "finished" || withinDay ? c.foreground : c.foregroundMuted}
                    opacity={read ? 0.75 : reason === "finished" || !withinDay ? 1 : recent ? 0.9 : 0.75} />
                </View>
                <Text accessibilityLabel={t("lastMessage", { time: relativeTime(lastActivity, t, now) })}
                  style={{ color: read ? c.foregroundMuted : withinDay ? c.foreground : c.foregroundMuted,
                    fontSize: 11, fontWeight: !read && withinDay ? "500" : "400",
                    opacity: read ? 0.75 : !withinDay || recent ? 1 : 0.85, minWidth: 32, textAlign: "right" }}>{relativeTime(lastActivity, t, now)}</Text>
              </Pressable>
              {canAcknowledge(agent) && <Pressable accessibilityRole="button" accessibilityLabel={t("ackSession", { session: agent.title || t("reply") })}
                disabled={!ackReady || ackPending} onPress={() => void acknowledge([sessionEntry])}
                style={{ padding: 7, opacity: !ackReady || ackPending ? 0.4 : 1 }}>
                <Icon name="Check" size={15} color={c.foregroundMuted} />
              </Pressable>}
              </View>;
            })}
            {isExpanded && !onlyAttention && orderedEntries.length > GROUP_PREVIEW_LIMIT && <Pressable
              accessibilityRole="button" accessibilityLabel={t(showAll ? "collapseProject" : "expandProject", { project: group.name })}
              accessibilityState={{ expanded: showAll }}
              onPress={() => setRevealed((previous) => ({ ...previous, [group.key]: !showAll }))}
              style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8 }}>
              <Icon name={showAll ? "ChevronUp" : "ChevronDown"} size={12} color={c.foregroundMuted} />
              <Text style={{ color: c.foregroundMuted, fontSize: 12 }}>{showAll ? t("collapseToSix") : t("more", { count: orderedEntries.length - GROUP_PREVIEW_LIMIT })}</Text>
            </Pressable>}
          </View>;
        }} />
    </View>
    {creationContext && <NewSessionDialog {...props} initialCwd={creationContext.cwd}
      initialProvider={creationContext.provider} onClose={() => setCreationContext(null)}
      onCreated={(agentId) => {
        setCreationContext(null);
        if (props.navigation) { trackVisit(agentId); props.navigation.openAgent({ agentId, serverId: props.host.id }); }
      }} />}
  </View>;
}
