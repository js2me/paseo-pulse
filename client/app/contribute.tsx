import type { PluginClientContext, PluginScreenProps } from "@getpaseo/plugin/client";
import { InboxScreen } from "../views/inbox/inbox-screen";
import { createInboxPills } from "./inbox-pills";
import { createSessionDirectoryStore } from "../data/sessions/session-directory-store";
import { createInboxSidebar } from "../views/sidebar/inbox-sidebar";
import { messages } from "../i18n/messages";

export default function contribute(client: PluginClientContext) {
  const sidebar = createInboxSidebar();
  const directory = createSessionDirectoryStore(client.paseo);
  const Screen = (props: PluginScreenProps) => <InboxScreen {...props} directory={directory} />;
  client.addScreen({ id: "inbox", title: messages.message("title"), Component: Screen });
  client.addSidebarHeaderItem({
    id: "inbox",
    title: messages.message("title"),
    Component: sidebar.Component,
  });
  client.addCommandCenterItem({
    id: "open-inbox",
    title: messages.message("openInbox"),
    icon: "Inbox",
    context: "global",
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
