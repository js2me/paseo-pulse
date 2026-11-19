import { useSettings } from "@getpaseo/plugin/client";
import { useCallback, useEffect, useRef, useState } from "react";
import { inboxPreferences, type InboxGrouping } from "../../shared/inbox-preferences";

export function useInboxPreferences() {
  const settings = useSettings(inboxPreferences);
  const latest = useRef(settings);
  latest.current = settings;
  const [draft, setDraft] = useState<InboxGrouping | null>(null);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const saving = useRef(false);
  const savedGrouping = settings.status === "ready" ? settings.values.grouping : undefined;
  useEffect(() => {
    if (savedGrouping === draft) setDraft(null);
  }, [savedGrouping, draft]);
  const setGrouping = useCallback(async (grouping: InboxGrouping) => {
    const current = latest.current;
    if (current.status !== "ready" || current.saving || saving.current) return;
    saving.current = true;
    setPending(true);
    setFailed(false);
    setDraft(grouping);
    try {
      const saved = await current.save({ ...current.values, grouping }, current.revision);
      if (!saved) {
        setDraft(null);
        setFailed(true);
        await latest.current.reload();
      }
    } catch {
      setDraft(null);
      setFailed(true);
    } finally {
      saving.current = false;
      setPending(false);
    }
  }, []);
  return {
    grouping: draft ?? savedGrouping ?? "workspace",
    setGrouping,
    ready: settings.status === "ready",
    pending: pending || settings.saving,
    error: failed || settings.saveError || ((settings.status === "error" || settings.status === "invalid") ? settings.error : null),
  };
}
