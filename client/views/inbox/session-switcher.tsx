/// <reference lib="dom" />
import type { PluginScreenProps } from "@getpaseo/plugin/client";
import { useEffect, useId, useRef, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useSessions } from "../../bindings/use-sessions";
import { useSessionVisits } from "../../bindings/use-session-visits";
import { useSessionActivity } from "../../bindings/use-session-activity";
import { useAcknowledgements } from "../../bindings/use-acknowledgements";
import type { SessionDirectoryStore } from "../../data/sessions/session-directory-store";
import { useMessages } from "../../i18n/messages";
import { groupSessions, matchesSession } from "../../../shared/sessions/sessions";
import { useIconProjects } from "../../bindings/use-icon-projects";
import { groupIconProject } from "../../../shared/projects/project-icons";
import { SessionCard } from "./session-card";

type Props = PluginScreenProps & {
  directory: SessionDirectoryStore;
  openInbox(): void;
};

export function SessionSwitcher(props: Props) {
  const { t } = useMessages();
  const c = props.theme.colors;
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(12);
  const directory = useSessions(props.directory);
  const activity = useSessionActivity(directory.entries, props.host.id);
  const visits = useSessionVisits(activity.entries, props.host.id);
  const ack = useAcknowledgements(visits.entries);
  const { entries } = ack;
  const byId = new Map(entries.map(entry => [entry.agent.id, entry]));
  const currentId = props.params.agentId;
  const projects = useIconProjects(props.host.id);
  const screen = useRef<View>(null);
  const { navigation, host, layout } = props;
  const projectKey = currentId && byId.get(currentId)?.project.projectKey;
  const search = query.trim().toLocaleLowerCase();
  // Rank across projects once the inbox data is ready. Keep positions stable during live updates.
  const [openingOrder, setOpeningOrder] = useState<string[] | null>(null);
  const ranked = openingOrder ?? (groupSessions(entries, "", false, Date.now(), false)[0]?.entries ?? [])
    .map(entry => entry.agent.id);
  useEffect(() => {
    if (!openingOrder && !directory.loading && !activity.verifying && !visits.loading && (ack.ready || ack.error)) {
      setOpeningOrder(ranked);
    }
  }, [openingOrder, directory.loading, activity.verifying, visits.loading, ack.ready, ack.error, ranked]);
  const orderedIds = new Set([...ranked, ...byId.keys()]);
  const candidates = [...orderedIds].filter(id => id !== currentId && byId.has(id));
  const previous = visits.recentAgentIds.find(id => id !== currentId && byId.has(id));
  const recent = search ? [] : [...new Set(previous ? [previous, ...candidates] : candidates)].slice(0, 4);
  const others = candidates.map(id => byId.get(id)!).filter(entry => search ? matchesSession(entry, search)
    : entry.project.projectKey === projectKey && !recent.includes(entry.agent.id));
  const input = useRef<TextInput>(null);
  const prefix = useId();
  const [selected, setSelected] = useState<string | null>(null);
  const results = [...recent, ...others.map(entry => entry.agent.id)];
  const active = selected && results.includes(selected) ? selected : results[0];
  const open = (id: string) => {
    if (!navigation) return;
    visits.trackVisit(id);
    navigation.openAgent({ agentId: id, serverId: host.id });
  };
  useEffect(() => {
    if (layout.platform !== "web" || !navigation) return;
    const root = screen.current as unknown as HTMLElement | null;
    const doc = root?.ownerDocument;
    if (!root || !doc) return;
    function onKey(event: KeyboardEvent) {
      if (event.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey ||
        !root?.getClientRects().length) return;
      if (event.key === "Escape" && currentId) {
        if (!event.repeat) navigation?.openAgent({ agentId: currentId, serverId: host.id });
      } else if (doc?.activeElement !== (input.current as unknown as HTMLElement) || !active) return;
      else if (event.key === "Enter") {
        if (!event.repeat) open(active);
      } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        const index = results.indexOf(active) + (event.key === "ArrowDown" ? 1 : -1);
        const next = results[Math.max(0, Math.min(results.length - 1, index))];
        if (index >= recent.length + limit) setLimit(limit + 12);
        setSelected(next);
      } else return;
      event.preventDefault();
      event.stopPropagation();
    }
    doc.addEventListener("keydown", onKey, true);
    return () => doc.removeEventListener("keydown", onKey, true);
  });
  useEffect(() => {
    if (layout.platform !== "web" || !selected || !active) return;
    const root = screen.current as unknown as HTMLElement | null;
    root?.ownerDocument.getElementById(prefix + active)?.scrollIntoView({ block: "nearest" });
  }, [layout.platform, selected, active, prefix]);
  const card = (id: string) => {
    const entry = byId.get(id)!;
    const iconProject = groupIconProject({ key: entry.project.projectKey, name: entry.project.projectName, entries: [entry] }, projects);
    return <SessionCard key={id} nativeID={prefix + id} selected={layout.platform === "web" && active === id} hostId={props.host.id} iconProject={iconProject} entry={entry} reply={activity.replies.get(id)}
    theme={props.theme} loading={activity.verifying} error={activity.previewError}
    onOpen={navigation && (() => open(id))} />;
  };
  const heading = (label: string) => <Text accessibilityRole="header" style={{ color: c.foregroundMuted, fontSize: 12 }}>{label}</Text>;
  return <View ref={screen} style={{ flex: 1, backgroundColor: c.surface0 }}>
    <View style={{ alignSelf: "center", width: "100%", maxWidth: 620, flex: 1, padding: 12, gap: 8 }}>
      <TextInput autoFocus={layout.platform === "web" && !layout.compact} ref={input} aria-activedescendant={active && prefix + active} value={query} onChangeText={text => { setQuery(text); setLimit(12); setSelected(null); }}
        placeholder={t("searchPlaceholder")} placeholderTextColor={c.foregroundMuted} accessibilityLabel={t("searchLabel")}
        autoCapitalize="none" style={{ color: c.foreground, borderColor: c.border, borderWidth: 1, borderRadius: 6, padding: 8 }} />
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled" contentContainerStyle={{ gap: 8 }}>
        {recent.length > 0 && heading(t("recentSessions"))}
        {recent.map(card)}
        {!search && others.length > 0 && heading(t("thisProject"))}
        {others.slice(0, limit).map(entry => card(entry.agent.id))}
        {others.length > limit && <Pressable accessibilityRole="button" onPress={() => setLimit(limit + 12)}>
          <Text style={{ color: c.foreground, padding: 6 }}>{t("more", { count: others.length - limit })}</Text>
        </Pressable>}
        {!recent.length && !others.length && heading(t(directory.loading ? "loading" : "nothingFound"))}
      </ScrollView>
      <Pressable accessibilityRole="button" onPress={props.openInbox}>
        <Text style={{ color: c.accent, paddingVertical: 8 }}>{t("allSessions")}</Text>
      </Pressable>
    </View>
  </View>;
}
