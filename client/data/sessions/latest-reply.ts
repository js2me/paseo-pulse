interface Cursor { epoch: string; seq: number }
interface TimelineEntry {
  seqStart: number;
  timestamp?: string;
  item: { type: string; text?: string };
}
interface TimelinePage {
  epoch: string;
  entries: readonly TimelineEntry[];
  startCursor: Cursor | null;
  hasOlder: boolean;
  error?: string | null;
  reset?: boolean;
  staleCursor?: boolean;
  gap?: boolean;
}
interface Timeline {
  refetch(options: { direction: "before"; projection: "projected"; limit: number; cursor?: Cursor }): Promise<TimelinePage>;
}
export interface LatestReply {
  text: string | null;
  limited: boolean;
  latestReplyAt: string | null;
  lastActivityAt: string | null;
  activityKnown: boolean;
}
export interface LatestReplyQueryData extends LatestReply { sourceToken: string }
export function sessionReplyToken(session: { lastUserMessageAt?: string | null; attentionTimestamp?: string | null; status: string }): string {
  // History hydration changes both updatedAt and closed/initializing/idle status.
  // Only a new prompt or attention event invalidates an already fetched reply.
  return `${session.lastUserMessageAt ?? ""}:${session.attentionTimestamp ?? ""}`;
}
export function latestReplyQueryOptions(hostId: string, agentId: string, timeline: Timeline, sourceToken: string) {
  return {
    queryKey: ["session-inbox", hostId, agentId, "last-reply-v2"] as const,
    queryFn: async ({ signal }: { signal: AbortSignal }): Promise<LatestReplyQueryData> => ({
      ...await fetchLatestReply(timeline, { signal }), sourceToken,
    }),
    staleTime: Infinity,
    gcTime: 5 * 60_000,
    retry: 0,
    // Paseo manages this host connection, independently of the app's HTTP online flag.
    networkMode: "always" as const,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  };
}
const MAX_READS = 3;
let activeReads = 0;
const waiting: (() => void)[] = [];
function drain(): void {
  while (activeReads < MAX_READS && waiting.length) waiting.shift()!();
}
function abortError(signal: AbortSignal): Error {
  const reason = (signal as AbortSignal & { readonly reason?: unknown }).reason;
  if (reason instanceof Error) return reason;
  const error = new Error("Загрузка последнего ответа отменена.");
  error.name = "AbortError";
  return error;
}
function checkAborted(signal?: AbortSignal): void {
  if (signal?.aborted) throw abortError(signal);
}
/** An aborted in-flight SDK request keeps its slot until the actual RPC settles. */
function readPage(timeline: Timeline, cursor: Cursor | undefined, signal?: AbortSignal): Promise<TimelinePage> {
  checkAborted(signal);
  return new Promise((resolve, reject) => {
    let started = false;
    let settled = false;
    const onAbort = () => {
      if (settled) return;
      settled = true;
      reject(abortError(signal!));
      if (!started) {
        const index = waiting.indexOf(start);
        if (index >= 0) waiting.splice(index, 1);
        signal?.removeEventListener("abort", onAbort);
      }
    };
    const start = () => {
      if (settled) return;
      started = true;
      activeReads++;
      const finish = (page: TimelinePage | undefined, error?: unknown) => {
        activeReads--;
        signal?.removeEventListener("abort", onAbort);
        if (!settled) {
          settled = true;
          if (page) resolve(page);
          else reject(error);
        }
        drain();
      };
      try {
        const request = timeline.refetch({ direction: "before", projection: "projected", limit: 100,
          ...(cursor ? { cursor } : {}) });
        request.then((page) => finish(page), (error: unknown) => finish(undefined, error));
      } catch (error) {
        finish(undefined, error);
      }
    };
    waiting.push(start);
    signal?.addEventListener("abort", onAbort, { once: true });
    if (signal?.aborted) onAbort();
    drain();
  });
}

function stripReplyMarkdown(text: string): string {
  return text
    .replace(/^\s*(`{3,}|~{3,}).*$/gm, "")
    .replace(/!?\[([^\]]*)\]\([^\n)]*\)/g, "$1")
    .replace(/<((?:https?:\/\/|mailto:)[^>]+)>/g, "$1")
    .replace(/^\s{0,3}(?:#{1,6}\s+|>\s?|[-+*]\s+(?:\[[ xX]\]\s*)?|\d+[.)]\s+)/gm, "")
    .replace(/(`+)([\s\S]*?)\1/g, "$2")
    .replace(/(\*\*|__|~~)([^\n]+?)\1/g, "$2")
    .replace(/(^|\s)([*_])([^\n]+?)\2(?=\s|[.,!?;:]|$)/g, "$1$3")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2066-\u2069]/g, "")
    .replace(/\s+/g, " ").trim();
}

function shortenReplyText(clean: string): string {
  // A preview needs only the first 221 code points, even for a very long answer.
  const characters: string[] = [];
  for (const character of clean) {
    characters.push(character);
    if (characters.length > 220) return `${characters.slice(0, 219).join("")}…`;
  }
  return clean;
}

export function cleanReplyText(text: string): string {
  const prefixLimit = 4096;
  if (text.length > prefixLimit) {
    // A complete leading line cannot change emphasis when the tail arrives. For a
    // long single line, end at real whitespace and require all paired syntax to
    // be closed. Incomplete links/code must use the full text so that a truncated
    // URL or delimiter never leaks into the visible preview.
    const window = text.slice(0, prefixLimit);
    const lineEnd = window.lastIndexOf("\n");
    const boundary = lineEnd >= 0 ? lineEnd + 1 : window.search(/\s+\S*$/);
    if (boundary > 0) {
      const prefix = window.slice(0, boundary);
      const clean = stripReplyMarkdown(prefix);
      const unpaired = prefix
        .replace(/^\s*(`{3,}|~{3,}).*$/gm, "")
        .replace(/!?\[([^\]]*)\]\([^\n)]*\)/g, "$1")
        .replace(/<((?:https?:\/\/|mailto:)[^>]+)>/g, "$1")
        .replace(/(`+)([\s\S]*?)\1/g, "");
      const independent = !/[`\[<]/.test(unpaired) &&
        (lineEnd >= 0 || !/[*_~]/.test(stripReplyMarkdown(unpaired)));
      const preview = shortenReplyText(clean);
      if (independent && preview !== clean) return preview;
    }
  }
  return shortenReplyText(stripReplyMarkdown(text));
}

/** Reads at most 300 projected rows; never subscribes or substitutes a user prompt. */
export async function fetchLatestReply(timeline: Timeline, options: { signal?: AbortSignal } = {}): Promise<LatestReply> {
  const { signal } = options;
  let epoch: string | undefined;
  let cursor: Cursor | undefined;
  let lastChat: { seq: number; timestamp?: string } | undefined;
  const validTimestamp = (value?: string): string | null => {
    const timestamp = value ? Date.parse(value) : NaN;
    return Number.isFinite(timestamp) && timestamp > 0 && timestamp <= Date.now() ? value! : null;
  };
  const result = (text: string | null, limited: boolean, latestReplyAt: string | null = null): LatestReply => {
    const lastActivityAt = validTimestamp(lastChat?.timestamp);
    return { text, limited, latestReplyAt, lastActivityAt,
      // A complete history with no chat messages is known to have no activity.
      activityKnown: lastChat ? lastActivityAt !== null : !limited };
  };
  const visited = new Set<string>();
  for (let pageNumber = 0; pageNumber < 3; pageNumber++) {
    checkAborted(signal);
    const page = await readPage(timeline, cursor, signal);
    checkAborted(signal);
    if (page.error) throw new Error(page.error);
    if (page.reset || page.staleCursor || page.gap || (epoch !== undefined && page.epoch !== epoch)) {
      throw new Error("История сессии изменилась. Повторите загрузку.");
    }
    epoch = page.epoch;
    const replies: TimelineEntry[] = [];
    for (const entry of page.entries) {
      // Blank user messages can carry files. Tools and reasoning do not prove chat activity.
      if ((!lastChat || entry.seqStart > lastChat.seq) && (entry.item.type === "user_message" ||
        (entry.item.type === "assistant_message" && entry.item.text && /\S/.test(entry.item.text)))) {
        lastChat = { seq: entry.seqStart, timestamp: entry.timestamp };
      }
      if (entry.item.type === "assistant_message") replies.push(entry);
    }
    // Sort metadata before touching answer bodies. Usually only one answer needs
    // Markdown cleaning; older answers can be arbitrarily large.
    replies.sort((left, right) => right.seqStart - left.seqStart);
    for (const entry of replies) {
      if (!entry.item.text || !/\S/.test(entry.item.text)) continue;
      const text = cleanReplyText(entry.item.text);
      if (text) return result(text, false, validTimestamp(entry.timestamp));
    }
    if (!page.hasOlder) return result(null, false);
    const next = page.startCursor;
    if (!next || next.epoch !== epoch || (cursor && next.seq >= cursor.seq)) {
      throw new Error("Не удалось продолжить загрузку последнего ответа: курсор истории не изменился.");
    }
    const key = `${next.epoch}:${next.seq}`;
    if (visited.has(key)) throw new Error("Не удалось продолжить загрузку последнего ответа: курсор истории повторился.");
    visited.add(key);
    cursor = next;
  }
  return result(null, true);
}
