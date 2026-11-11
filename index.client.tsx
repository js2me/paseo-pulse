import type { PluginClientContext, PluginScreenProps } from "@getpaseo/plugin/client";
import { InboxScreen } from "./client/inbox";
import { createInboxPills } from "./client/inbox-pills";
import { createSessionDirectoryStore } from "./client/session-directory-store";
import { createInboxSidebar } from "./client/inbox-sidebar";
import { messages } from "./client/messages";

export default function contribute(client: PluginClientContext) {
  const sidebar = createInboxSidebar();
  const directory = createSessionDirectoryStore(client.paseo);
  const Screen = (props: PluginScreenProps) => <InboxScreen {...props} directory={directory} />;
  client.addScreen({ id: "inbox", title: messages.message("title"), Component: Screen });
  client.addSidebarHeaderItem({ id: "inbox", title: messages.message("title"), Component: sidebar.Component });
  client.addCommandCenterItem({ id: "open-inbox", title: messages.message("openInbox"), icon: "Inbox", context: "global",
    onSelect: ({ openScreen }) => openScreen({ screenId: "inbox" }),
  });
  const pills = createInboxPills(client);
  const stopDirectory = directory.subscribe(() => {
    const { entries } = directory.getSnapshot();
    pills.sync(entries);
    sidebar.update(entries);
  });
  directory.start();
  return () => {
    stopDirectory();
    directory.dispose();
    pills.dispose();
    sidebar.dispose();
  };
}
