import type { PluginScreenProps } from "@getpaseo/plugin/client";
import type { SessionDirectoryStore } from "../../data/sessions/session-directory-store";
import type { useInboxViewModel } from "../../bindings/use-inbox-view-model";
export type InboxProps = PluginScreenProps & { directory: SessionDirectoryStore };
export type InboxViewContext = { props: InboxProps; binding: ReturnType<typeof useInboxViewModel> };
