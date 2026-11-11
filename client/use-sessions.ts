import { usePaseo } from "@getpaseo/plugin/client";
import { useEffect, useState } from "react";
import type { SessionEntry } from "../shared/sessions";
import { observeSessionDirectory } from "./session-directory";

export function useSessions() {
  const paseo = usePaseo();
  const [entries, setEntries] = useState<SessionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    setEntries([]);
    setLoading(true);
    setError(null);
    return observeSessionDirectory(paseo, (state) => {
      setEntries(state.entries);
      setLoading(state.loading);
      setError(state.error);
    });
  }, [paseo, attempt]);
  return { entries, loading, error, retry: () => setAttempt((value) => value + 1) };
}
