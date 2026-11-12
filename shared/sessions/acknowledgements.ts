import { defineSettings } from "@getpaseo/plugin";
import { z } from "zod";
import type { Session, SessionEntry } from "./sessions";

export const acknowledgementSettings = defineSettings({
  id: "acknowledgements",
  scope: "host",
  version: 1,
  schema: z.object({ seen: z.record(z.string(), z.string()).default({}) }),
});
export type Acknowledgements = Readonly<Record<string, string>>;

function acknowledgeableReason(session: Session): "finished" | "error" | null {
  if (session.archivedAt || session.internal || session.pendingPermissions.length ||
    session.status === "running" || session.status === "initializing") return null;
  if (session.status === "error" && session.requiresAttention !== false) return "error";
  if (!session.requiresAttention) return null;
  return session.attentionReason === "finished" || session.attentionReason === "error" ? session.attentionReason : null;
}

export function canAcknowledge(session: Session): boolean {
  return acknowledgeableReason(session) !== null;
}

export function acknowledgementToken(session: Session): string | null {
  const reason = acknowledgeableReason(session);
  return reason ? `${reason}:${session.attentionTimestamp || session.updatedAt}` : null;
}

export function acknowledgeSessions(seen: Acknowledgements, sessions: readonly SessionEntry[]): Record<string, string> {
  const next = { ...seen };
  for (const { agent } of sessions) {
    const token = acknowledgementToken(agent);
    if (token) Object.defineProperty(next, agent.id, { value: token, enumerable: true, configurable: true, writable: true });
  }
  return next;
}

export function applyAcknowledgements(entries: readonly SessionEntry[], seen: Acknowledgements): SessionEntry[] {
  return entries.map((entry) => {
    const token = acknowledgementToken(entry.agent);
    if (!token || seen[entry.agent.id] !== token) return entry;
    return { ...entry, agent: { ...entry.agent, requiresAttention: false, attentionReason: null } };
  });
}
