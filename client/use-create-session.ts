import { usePaseo } from "@getpaseo/plugin/client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SessionEntry } from "../shared/sessions";
import { createSessionLauncher, NewSessionError, type CreationTarget } from "./new-session";
import { useMessages } from "./messages";

export function useCreateSession(entries: readonly SessionEntry[], onCreated: (id: string) => void) {
  const paseo = usePaseo();
  const launch = useMemo(() => createSessionLauncher(paseo), [paseo]);
  const { t } = useMessages();
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<unknown>(null);
  const active = useRef(false), mounted = useRef(false);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const create = async (target: CreationTarget = {}) => {
    if (active.current) return;
    active.current = true;
    setPending(target.projectKey ?? "global");
    setError(null);
    try {
      const id = await launch(entries, target);
      if (mounted.current) onCreated(id);
    } catch (error) { if (mounted.current) setError(error); }
    finally { active.current = false; if (mounted.current) setPending(null); }
  };
  return { create, pending, error: error ? t("new.creationError", {
    error: error instanceof NewSessionError ? t(`new.${error.code}`) : String(error) }) : null };
}
