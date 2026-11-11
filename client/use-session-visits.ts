import { useRpc } from "@getpaseo/plugin/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import type { SessionEntry } from "../shared/sessions";
import { listSessionVisitsRpc, recordSessionVisitRpc } from "../shared/session-visits";

export function useSessionVisits(entries: readonly SessionEntry[], hostId: string) {
  const list = useRpc(listSessionVisitsRpc), record = useRpc(recordSessionVisitRpc);
  const client = useQueryClient();
  const key = useMemo(() => ["session-inbox", hostId, "session-visits"], [hostId]);
  const query = useQuery({ queryKey: key, queryFn: () => list({}), enabled: entries.length > 0,
    staleTime: 5000, refetchInterval: 5000, refetchOnWindowFocus: false, retry: 1, networkMode: "always" });
  const enriched = useMemo(() => {
    const frequent = new Map((query.data?.sessions ?? []).map(({ agentId, frequentlyViewedUntil }) => [agentId, frequentlyViewedUntil]));
    return entries.map((entry) => frequent.has(entry.agent.id)
      ? { ...entry, agent: { ...entry.agent, frequentlyViewedUntil: frequent.get(entry.agent.id) } } : entry);
  }, [entries, query.data]);
  const trackVisit = useCallback((agentId: string) => {
    // The plugin-scoped RPC outlives this screen, so native navigation is immediate.
    void record({ agentId }).then(() => client.invalidateQueries({ queryKey: key })).catch((error: unknown) => {
      console.warn("Session visit could not be saved", String(error));
    });
  }, [record, client, key]);
  return { entries: enriched, trackVisit };
}
