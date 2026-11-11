import type { PluginButtonRegistration, PluginClientContext } from "@getpaseo/plugin/client";
import type { SessionEntry } from "../shared/sessions";
import { messages } from "./messages";

/** Keep native composer buttons stable while session status and history update. */
export function createInboxPills(client: Pick<PluginClientContext, "addComposerPill" | "openScreen">) {
  const pills = new Map<string, { workspaceId: string; registration: PluginButtonRegistration }>();
  let disposed = false;
  return {
    sync(entries: readonly SessionEntry[]) {
      if (disposed) return;
      const present = new Set<string>();
      for (const { agent } of entries) {
        const { id: agentId, workspaceId } = agent;
        if (!workspaceId || agent.archivedAt || agent.internal) continue;
        present.add(agentId);
        if (pills.get(agentId)?.workspaceId === workspaceId) continue;
        pills.get(agentId)?.registration.remove();
        pills.delete(agentId);
        const registration = client.addComposerPill({
          id: "open-inbox", workspaceId, agentId,
          button: {
            title: messages.message("openInInbox"), icon: "Inbox", label: messages.message("openInInbox"),
            behavior: { kind: "action", onPress() {
              if (disposed) return;
              client.openScreen({ screenId: "inbox" });
            } },
          },
        });
        pills.set(agentId, { workspaceId, registration });
      }
      for (const [id, pill] of pills) if (!present.has(id)) {
        pill.registration.remove();
        pills.delete(id);
      }
    },
    dispose() {
      disposed = true;
      for (const pill of pills.values()) pill.registration.remove();
      pills.clear();
    },
  };
}
