import type { PluginClientContext } from "@getpaseo/plugin/client";
import { InboxScreen } from "./client/inbox";
import { createInboxPills } from "./client/inbox-pills";
import { observeSessionDirectory } from "./client/session-directory";
import { createInboxSidebar } from "./client/inbox-sidebar";
import { messages } from "./client/messages";

export default function contribute(client: PluginClientContext) {
  const sidebar = createInboxSidebar();
  client.addScreen({ id: "inbox", title: messages.message("title"), Component: InboxScreen });
  client.addSidebarHeaderItem({ id: "inbox", title: messages.message("title"), Component: sidebar.Component });
  client.addCommandCenterItem({ id: "open-inbox", title: messages.message("openInbox"), icon: "Inbox", context: "global",
    onSelect: ({ openScreen }) => openScreen({ screenId: "inbox" }),
  });
  const pills = createInboxPills(client);
  const stopDirectory = observeSessionDirectory(client.paseo, ({ entries }) => {
    pills.sync(entries);
    sidebar.update(entries);
  });
  return () => {
    stopDirectory();
    pills.dispose();
    sidebar.dispose();
  };
}
