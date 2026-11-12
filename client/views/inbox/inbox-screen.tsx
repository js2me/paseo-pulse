import { FlatList, View } from "react-native";
import { observer } from "../../lib/mvvm";
import { useInboxViewModel } from "../../bindings/use-inbox-view-model";
import { InboxToolbar } from "./inbox-toolbar";
import { InboxListHeader } from "./inbox-list-header";
import { ProjectGroup } from "./project-group";
import type { InboxProps } from "./types";

export function InboxScreen(props: InboxProps) {
  return <Inbox key={props.host.id} {...props} />;
}
const Inbox = observer(function Inbox(props: InboxProps) {
  const binding = useInboxViewModel(props);
  const context = { props, binding };
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: props.theme.colors.surface0,
      }}
    >
      <View style={{ flex: 1, minWidth: 0, maxWidth: 1000 }}>
        <InboxToolbar context={context} />
        <FlatList
          style={{ flex: 1 }}
          data={binding.model.groups}
          keyExtractor={(group) => group.key}
          initialNumToRender={3}
          maxToRenderPerBatch={3}
          windowSize={5}
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 10, gap: 12 }}
          ListHeaderComponent={<InboxListHeader context={context} />}
          renderItem={({ item }) => <ProjectGroup context={context} group={item} />}
        />
      </View>
    </View>
  );
});
