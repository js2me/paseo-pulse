import { useState } from "react";
import { CardGridRow, cardRows } from "./card-grid";
import type { InboxRow, StatusListItem } from "../../view-models/inbox-view-model";
import { TextAnimationProvider } from "../shared/animated-text";
import { FlatList, View } from "react-native";
import { observer } from "../../lib/mvvm";
import { useInboxViewModel } from "../../bindings/use-inbox-view-model";
import { InboxToolbar } from "./inbox-toolbar";
import { InboxListHeader } from "./inbox-list-header";
import { StatusListItemView } from "./status-list-item";
import { SessionRow } from "./session-row";
import { ProjectGroup } from "./project-group";
import type { InboxProps } from "./types";

type CardItem = InboxRow[] | Extract<StatusListItem, { kind: "header" }>;

export function InboxScreen(props: InboxProps) {
  return <TextAnimationProvider><Inbox key={props.host.id} {...props} /></TextAnimationProvider>;
}
const Inbox = observer(function Inbox(props: InboxProps) {
  const binding = useInboxViewModel(props);
  const [width, setWidth] = useState(0);
  const columns = props.layout.compact ? 1 : Math.max(1, Math.min(4, Math.floor((width - 16) / 270)));
  const context = { props, binding, columns };
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        backgroundColor: props.theme.colors.surface0,
      }}
    >
      <View style={{ flex: 1, minWidth: 0 }} onLayout={event => setWidth(event.nativeEvent.layout.width)}>
        <InboxToolbar context={context} />
        {binding.model.groupByProject ? <FlatList
          style={{ flex: 1 }}
          data={binding.model.groups}
          keyExtractor={(group) => group.key}
          initialNumToRender={3}
          maxToRenderPerBatch={3}
          windowSize={5}
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 10, gap: 12 }}
          ListHeaderComponent={<InboxListHeader context={context} />}
          renderItem={({ item }) => <ProjectGroup context={context} group={item} />}
        /> : binding.preferences.view === "cards" ? <FlatList
          style={{ flex: 1 }}
          data={binding.model.grouping === "status" ? binding.model.statusGroups.flatMap<CardItem>(({ key, rows }) => [
            { kind: "header", key: `status:${key}`, status: key, count: rows.length } as const,
            ...cardRows(rows, columns),
          ]) : cardRows(binding.model.flatRows, columns)}
          keyExtractor={item => Array.isArray(item) ? item[0].agent.id : item.key}
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 10 }}
          ListHeaderComponent={<InboxListHeader context={context} />}
          renderItem={({ item }) => Array.isArray(item) ? <CardGridRow rows={item} context={context} />
            : <StatusListItemView context={context} item={item} />}
        /> : binding.model.grouping === "status" ? <FlatList
          style={{ flex: 1 }}
          data={binding.model.statusItems}
          keyExtractor={(item) => item.key}
          initialNumToRender={24}
          maxToRenderPerBatch={24}
          windowSize={5}
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 10, gap: 2 }}
          ListHeaderComponent={<InboxListHeader context={context} />}
          renderItem={({ item }) => <StatusListItemView context={context} item={item} />}
        /> : <FlatList
          style={{ flex: 1 }}
          data={binding.model.flatRows}
          keyExtractor={(row) => row.agent.id}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          windowSize={5}
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 10, gap: 2 }}
          ListHeaderComponent={<InboxListHeader context={context} />}
          renderItem={({ item }) => <SessionRow context={context} row={item} />}
        />}
      </View>
    </View>
  );
});
