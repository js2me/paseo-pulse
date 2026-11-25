import type { PluginTheme } from "@getpaseo/plugin";
import { Pressable, Text, View } from "react-native";
import { activity, sessionStatus, type SessionEntry } from "../../../shared/sessions/sessions";
import type { LatestReplyQueryData } from "../../data/sessions/latest-reply";
import { relativeTime, useMessages } from "../../i18n/messages";
import { sessionEmphasis } from "../../view-models/session-emphasis";
import { blend, sessionTextColors } from "../shared/session-text-colors";
import { statusColor } from "../shared/status-color";
import { SessionReplyPreview } from "./session-reply-preview";

import { ProjectLogo } from "../projects/project-logo";
import type { IconProject } from "../../../shared/projects/project-icons";

type Props = {
  nativeID?: string;
  selected?: boolean;
  hostId: string;
  iconProject?: IconProject;
  entry: SessionEntry;
  theme: PluginTheme;
  reply?: LatestReplyQueryData;
  now?: number;
  loading: boolean;
  error: boolean;
  onOpen?: () => void;
};

export function SessionCard({ nativeID, selected, hostId, iconProject, entry, theme, reply, now = Date.now(), loading, error, onOpen }: Props) {
  const { t } = useMessages();
  const { agent, project } = entry;
  const c = theme.colors;
  const emphasis = sessionEmphasis(agent, now);
  const text = sessionTextColors(theme, emphasis);
  const accent = emphasis.reason ? statusColor(theme, emphasis.reason) : undefined;
  return (
    <Pressable nativeID={nativeID} accessibilityState={{ selected }} accessibilityRole="button" disabled={!onOpen} onPress={onOpen}
      style={({ pressed }) => ({ flexGrow: 1, gap: 5, borderWidth: 1, outlineWidth: selected ? 2 : 0, outlineStyle: "solid", outlineColor: c.foreground, outlineOffset: -2, borderColor: accent ? blend(c.border, accent, 0.5) : c.border,
        borderLeftColor: accent ?? c.border, borderLeftWidth: accent ? 4 : 1,
        borderRadius: 8, padding: 10, backgroundColor: pressed ? c.surface2 : accent ? blend(c.surface1, accent, 0.12) : c.surface1 })}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <ProjectLogo project={iconProject} projectKey={project.projectKey} name={project.projectName} hostId={hostId} color={c.foreground} />
        <Text numberOfLines={1} style={{ flex: 1, color: c.foregroundMuted, fontSize: 11 }}>{project.projectName}</Text>
        <Text style={{ color: text.time, fontSize: 11 }}>{relativeTime(activity(agent), t, now)}</Text>
      </View>
      <Text numberOfLines={2} style={{ color: text.title, fontWeight: emphasis.weight, fontSize: 14 }}>{agent.title || t("untitled")}</Text>
      <View style={{ minHeight: 48 }}>
        <SessionReplyPreview theme={theme} color={text.preview} text={reply?.text} limited={reply?.limited} lines={3} loading={loading} error={error} />
      </View>
      <Text numberOfLines={1} style={{ color: accent ?? c.foregroundMuted, fontWeight: accent ? "600" : "400", fontSize: 11 }}>
        {t(`status.${sessionStatus(agent)}`)}
      </Text>
    </Pressable>
  );
}
