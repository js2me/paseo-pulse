import { useSettings } from "@getpaseo/plugin/client";
import { useEffect, useMemo, useRef, useState } from "react";
import { acknowledgementSettings, acknowledgeSessions, applyAcknowledgements } from "../shared/acknowledgements";
import type { SessionEntry } from "../shared/sessions";
import { useMessages } from "./messages";

const emptySeen: Readonly<Record<string, string>> = {};

export function useAcknowledgements(entries: readonly SessionEntry[]) {
  const settings = useSettings(acknowledgementSettings);
  const { t } = useMessages();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<"ack.conflict" | "ack.saveError" | null>(null);
  const inFlight = useRef(false);
  const requested = useRef(new Map<string, string>());
  const [requestRevision, updateRequests] = useState(0);
  const [optimisticSeen, setOptimisticSeen] = useState<Record<string, string>>({});
  const seen = settings.status === "ready" ? settings.values.seen : emptySeen;
  const visibleEntries = useMemo(() => applyAcknowledgements(applyAcknowledgements(entries, seen), optimisticSeen), [entries, seen, optimisticSeen]);

  async function acknowledge(sessions: readonly SessionEntry[]): Promise<void> {
    const marks = acknowledgeSessions({}, sessions);
    if (!Object.keys(marks).length) return;
    setError(null);
    for (const [id, token] of Object.entries(marks)) requested.current.set(id, token);
    // Explicitly marking an answer OK clears its exact token immediately,
    // including while settings load or a different acknowledgement is being saved.
    setOptimisticSeen((previous) => ({ ...previous, ...marks }));
    updateRequests((revision) => revision + 1);
  }

  useEffect(() => {
    if (inFlight.current || settings.status !== "ready" || settings.saving || !requested.current.size) return;
    const marks = Object.fromEntries(requested.current);
    inFlight.current = true;
    setPending(true);
    void (async () => {
      let saved = false;
      try {
        saved = await settings.save({ seen: { ...settings.values.seen, ...marks } }, settings.revision);
        if (!saved) {
          // Preserve the host CAS semantics; a retry must merge the refreshed marks.
          await settings.reload();
          setError("ack.conflict");
        }
      } catch {
        setError("ack.saveError");
      } finally {
        for (const [id, token] of Object.entries(marks)) {
          if (requested.current.get(id) === token) requested.current.delete(id);
        }
        if (!saved) setOptimisticSeen((previous) => Object.fromEntries(Object.entries(previous)
          .filter(([id, token]) => marks[id] !== token)));
        inFlight.current = false;
        setPending(false);
        updateRequests((revision) => revision + 1);
      }
    })();
  }, [requestRevision, settings.status, settings.status === "ready" ? settings.revision : null, settings.saving]);

  useEffect(() => {
    // Keep optimistic marks until the host reflects them, preventing a stale-frame flash.
    setOptimisticSeen((previous) => {
      const remaining = Object.entries(previous).filter(([id, token]) => seen[id] !== token);
      return remaining.length === Object.keys(previous).length ? previous : Object.fromEntries(remaining);
    });
  }, [seen]);

  const readError = settings.status === "error" || settings.status === "invalid"
    ? t("ack.readError")
    : null;
  return { entries: visibleEntries, acknowledge, pending: pending || settings.saving,
    error: error ? t(error) : readError, ready: settings.status === "ready" };
}
