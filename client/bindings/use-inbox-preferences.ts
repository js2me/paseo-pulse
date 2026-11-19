import { useSettings } from "@getpaseo/plugin/client";
import { useCallback, useEffect, useRef, useState } from "react";
import { inboxPreferences, type InboxGrouping, type InboxPreferences } from "../../shared/inbox-preferences";

export function useInboxPreferences() {
  const settings = useSettings(inboxPreferences);
  const latest = useRef(settings);
  latest.current = settings;
  const [draft, setDraft] = useState<InboxPreferences | null>(null);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const saving = useRef(false);
  const savedGrouping = settings.status === "ready" ? settings.values.grouping : undefined;
  const savedAttention = settings.status === "ready" ? settings.values.onlyAttention : undefined;
  useEffect(() => {
    if (savedGrouping === draft?.grouping && savedAttention === draft?.onlyAttention) setDraft(null);
  }, [savedGrouping, savedAttention, draft]);
  const update = useCallback(async (changes: Partial<InboxPreferences>) => {
    const current = latest.current;
    if (current.status !== "ready" || current.saving || saving.current) return;
    saving.current = true;
    setPending(true);
    setFailed(false);
    const values = { ...current.values, ...changes };
    setDraft(values);
    try {
      const saved = await current.save(values, current.revision);
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
  const setGrouping = useCallback((grouping: InboxGrouping) => update({ grouping }), [update]);
  const setOnlyAttention = useCallback((onlyAttention: boolean) => update({ onlyAttention }), [update]);
  return {
    grouping: draft?.grouping ?? savedGrouping ?? "workspace",
    onlyAttention: draft?.onlyAttention ?? savedAttention ?? true,
    setGrouping,
    setOnlyAttention,
    ready: settings.status === "ready",
    pending: pending || settings.saving,
    error: failed || settings.saveError || ((settings.status === "error" || settings.status === "invalid") ? settings.error : null),
  };
}
