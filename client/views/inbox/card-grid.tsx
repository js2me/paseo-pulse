import { Pressable, Text, View } from "react-native";
import { useMessages } from "../../i18n/messages";
import type { InboxRow } from "../../view-models/inbox-view-model";
import { SessionCard } from "./session-card";
import type { InboxViewContext } from "./types";

export function cardRows(rows: InboxRow[], columns: number) {
  const result: InboxRow[][] = [];
  for (let i = 0; i < rows.length; i += columns) result.push(rows.slice(i, i + columns));
  return result;
}

export function CardGridRow({ rows, context }: { rows: InboxRow[]; context: InboxViewContext }) {
  const { props, binding, columns } = context;
  const { t } = useMessages();
  return <View style={{ flexDirection: "row", gap: 8, marginVertical: 3 }}>
    {rows.map(row => <View key={row.agent.id} style={{ flex: 1, minWidth: 0 }}>
      <SessionCard hostId={props.host.id} iconProject={row.iconProject} entry={row.sessionEntry} reply={row.reply} theme={props.theme} now={binding.now}
        loading={binding.verifying} error={binding.previewError}
        onOpen={props.navigation && (() => binding.model.openSession(row.agent.id))} />
      {row.acknowledgeable && <Pressable accessibilityRole="button" accessibilityLabel={t("ackSession", { session: row.agent.title || t("reply") })}
        disabled={!binding.ackReady || binding.ackPending} onPress={() => void binding.acknowledge([row.sessionEntry])}
        style={{ position: "absolute", bottom: 1, right: 1, paddingHorizontal: 10, paddingVertical: 6 }}>
        <Text style={{ fontSize: 11, color: props.theme.colors.statusSuccess }}>{t("ok")}</Text>
      </Pressable>}
    </View>)}
    {Array.from({ length: columns - rows.length }, (_, i) => <View key={`space:${i}`} style={{ flex: 1 }} />)}
  </View>;
}
