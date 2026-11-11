import { useRpc } from "@getpaseo/plugin/client";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useRef } from "react";
import type { SessionEntry } from "../shared/sessions";
import { sessionIndexRpc } from "../shared/session-index";
import { sessionReplyToken, type LatestReplyQueryData } from "./latest-reply";
import { withSessionActivity } from "./session-activity";

/** One small batch reads the provider's saved message index without opening agents. */
export function useSessionActivity(entries: readonly SessionEntry[], hostId: string) {
  const readIndex = useRpc(sessionIndexRpc);
  const signature = JSON.stringify(entries.map(({ agent }) => agent.id).sort());
  const agentIds: string[] = useMemo(() => JSON.parse(signature), [signature]);
  const currentEntries = useRef(entries);
  currentEntries.current = entries;
  const query = useQuery({
    queryKey: ["session-inbox", hostId, "session-index-v1", signature],
    enabled: agentIds.length > 0,
    queryFn: async () => {
      const tokens = new Map(currentEntries.current.map(({ agent }) => [agent.id, sessionReplyToken(agent)]));
      const result: (LatestReplyQueryData & { agentId: string })[] = [];
      for (let start = 0; start < agentIds.length; start += 250) {
        const page = await readIndex({ agentIds: agentIds.slice(start, start + 250) });
        result.push(...page.entries.map((entry) => ({ ...entry, sourceToken: tokens.get(entry.agentId) ?? "" })));
      }
      return result;
    },
    // The daemon index only stats unchanged files. Refetching never wakes a provider.
    staleTime: 5000,
    refetchInterval: 5000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
    networkMode: "always",
    placeholderData: (previous, previousQuery) => previousQuery?.queryKey[1] === hostId ? previous : undefined,
  });
  const replies = useMemo(() => new Map((query.data ?? []).map((entry) => [entry.agentId, entry])), [query.data]);
  const retained = useRef(new Map<string, { source: SessionEntry; reply: LatestReplyQueryData | undefined; entry: SessionEntry }>());
  const enriched = useMemo(() => {
    const next = new Map<string, { source: SessionEntry; reply: LatestReplyQueryData | undefined; entry: SessionEntry }>();
    const result = entries.map((source) => {
      const indexed = replies.get(source.agent.id);
      // Unavailable provider logs cannot disprove the SDK's actual user timestamp.
      const reply = indexed?.activityKnown || !indexed?.limited ? indexed : undefined;
      const old = retained.current.get(source.agent.id);
      const entry = old?.source === source && old.reply === reply ? old.entry
        : { ...source, agent: withSessionActivity(source.agent, reply, Date.now(), { savedTranscript: true }) };
      next.set(source.agent.id, { source, reply, entry });
      return entry;
    });
    retained.current = next;
    return result;
  }, [entries, replies]);
  return { entries: enriched, replies, verifying: agentIds.length > 0 && query.isPending,
    previewError: query.isError && !query.data };
}
