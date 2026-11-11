import type { PaseoApi, PaseoAgentListResult, PaseoAgentUpdate } from "@getpaseo/client";
import type { SessionEntry } from "../shared/sessions";

export interface SessionDirectoryState {
  entries: SessionEntry[];
  loading: boolean;
  error: string | null;
}
const PAGE_SIZE = 200;
const READ_TIMEOUT_MS = 15_000;
const INITIALIZING_GRACE_MS = 300;
const filter = { includeArchived: false, includeInternal: false };
// Immutable creation times prevent live updates moving sessions across a paging cursor.
const sort = [{ key: "created_at" as const, direction: "desc" as const }];
const active = (entry: SessionEntry) => !entry.agent.archivedAt && !entry.agent.internal;

/** A complete catalog read is independent of live subscription readiness and snapshot replay. */
export function observeSessionDirectory(paseo: Pick<PaseoApi, "agents">,
  onChange: (state: SessionDirectoryState) => void): () => void {
  const lifetime = new AbortController();
  const entries = new Map<string, SessionEntry>();
  const mutations = new Map<string, number>();
  const initializing = new Map<string, { status: "idle" | "closed"; lastUserMessageAt: string | null;
    timer: ReturnType<typeof setTimeout> }>();
  let revision = 0;
  let generation = 0;
  let loading = true;
  let readError: string | null = null;
  let liveError: string | null = null;
  let release: (() => Promise<void>) | undefined;
  let detach: (() => void) | undefined;
  const publish = () => {
    if (!lifetime.signal.aborted) onChange({ entries: [...entries.values()].map((entry) => {
      const held = initializing.get(entry.agent.id);
      return held ? { ...entry, agent: { ...entry.agent, status: held.status } } : entry;
    }), loading,
      error: [readError, liveError].filter(Boolean).join("; ") || null });
  };
  const clearInitializing = (id: string) => {
    const held = initializing.get(id);
    if (held) clearTimeout(held.timer);
    initializing.delete(id);
  };
  const storeEntry = (entry: SessionEntry, live = false) => {
    const { agent } = entry;
    const old = entries.get(agent.id)?.agent;
    const held = initializing.get(agent.id);
    const lastUserMessageAt = agent.lastUserMessageAt ?? null;
    // Opening cold history briefly publishes initializing before returning to idle.
    // Hold only that status; permissions, errors, prompts and other rows stay live.
    const canHold = agent.status === "initializing" && !agent.pendingPermissions.length &&
      agent.attentionReason !== "permission" && agent.attentionReason !== "error";
    if (held && (!canHold || held.lastUserMessageAt !== lastUserMessageAt)) clearInitializing(agent.id);
    else if (!held && live && canHold && (old?.status === "idle" || old?.status === "closed") &&
      (old.lastUserMessageAt ?? null) === lastUserMessageAt) {
      const timer = setTimeout(() => {
        if (initializing.get(agent.id)?.timer !== timer) return;
        initializing.delete(agent.id);
        publish();
      }, INITIALIZING_GRACE_MS);
      initializing.set(agent.id, { status: old.status, lastUserMessageAt, timer });
    }
    entries.set(agent.id, entry);
  };
  const removeEntry = (id: string) => {
    clearInitializing(id);
    entries.delete(id);
  };
  const readPage = (cursor?: string): Promise<PaseoAgentListResult> => new Promise((resolve, reject) => {
    const finish = (page?: PaseoAgentListResult, error?: unknown) => {
      clearTimeout(timer);
      lifetime.signal.removeEventListener("abort", aborted);
      if (page) resolve(page); else reject(error);
    };
    const aborted = () => finish(undefined, new Error("SESSION_DIRECTORY_CANCELLED"));
    const timer = setTimeout(() => finish(undefined, new Error("SESSION_DIRECTORY_TIMEOUT")), READ_TIMEOUT_MS);
    lifetime.signal.addEventListener("abort", aborted, { once: true });
    if (lifetime.signal.aborted) { aborted(); return; }
    try {
      void paseo.agents.list({ filter, sort, page: { limit: PAGE_SIZE, ...(cursor ? { cursor } : {}) },
        signal: lifetime.signal, timeout: READ_TIMEOUT_MS }).then((page) => finish(page), (error: unknown) => finish(undefined, error));
    } catch (error) { finish(undefined, error); }
  });
  const refresh = async () => {
    const currentGeneration = ++generation;
    const readRevision = revision;
    const seen = new Set<string>();
    const cursors = new Set<string>();
    let cursor: string | undefined;
    loading = true;
    readError = null;
    publish();
    try {
      do {
        if (lifetime.signal.aborted || currentGeneration !== generation) return;
        const page = await readPage(cursor);
        if (lifetime.signal.aborted || currentGeneration !== generation) return;
        for (const entry of page.entries) {
          if (!active(entry)) continue;
          seen.add(entry.agent.id);
          if ((mutations.get(entry.agent.id) ?? 0) <= readRevision) storeEntry(entry);
        }
        publish();
        if (!page.pageInfo.hasMore) break;
        const next = page.pageInfo.nextCursor;
        if (!next || cursors.has(next)) throw new Error("SESSION_DIRECTORY_CURSOR");
        cursors.add(next);
        cursor = next;
      } while (cursor);
      if (lifetime.signal.aborted || currentGeneration !== generation) return;
      for (const id of entries.keys()) if (!seen.has(id) && (mutations.get(id) ?? 0) <= readRevision) removeEntry(id);
      loading = false;
      publish();
    } catch (error) {
      if (lifetime.signal.aborted || currentGeneration !== generation) return;
      loading = false;
      readError = String(error);
      publish();
    }
  };
  const update = (message: PaseoAgentUpdate) => {
    if (lifetime.signal.aborted) return;
    const id = message.kind === "remove" ? message.agentId : message.agent.id;
    mutations.set(id, ++revision);
    if (message.kind === "remove") removeEntry(id);
    else {
      const old = entries.get(id);
      const entry = { agent: message.agent, project: message.project ?? old?.project ?? {
        projectKey: message.agent.cwd,
        projectName: message.agent.cwd.split(/[\\/]/).filter(Boolean).pop() ?? message.agent.cwd,
      } };
      if (active(entry)) storeEntry(entry, true); else removeEntry(id);
    }
    publish();
  };
  // One broad live directory avoids connection-wide filter collisions on legacy native clients.
  // Its promise or snapshot replay never gates the complete ordinary catalog read.
  void refresh();
  void Promise.resolve().then(() => lifetime.signal.aborted ? null : paseo.agents.list({ filter, sort,
    page: { limit: PAGE_SIZE }, subscribe: {}, signal: lifetime.signal, timeout: READ_TIMEOUT_MS })).then((result) => {
    if (!result) return;
    const subscription = result.subscription;
    if (lifetime.signal.aborted) { void subscription?.release().catch(() => {}); return; }
    let snapshots = 0;
    const snapshot = (page: PaseoAgentListResult) => {
      if (lifetime.signal.aborted) return;
      // A page-sized live snapshot must not truncate an already loaded full catalog.
      for (const entry of page.entries) if (active(entry) && !entries.has(entry.agent.id) && !mutations.has(entry.agent.id)) {
        storeEntry(entry);
      }
      liveError = null;
      publish();
      if (++snapshots > 1 || readError) void refresh();
    };
    if (subscription) {
      release = () => subscription.release();
      detach = subscription.subscribe({ snapshot,
        update: (message) => { if (message.type === "agent_update") update(message.payload); },
        error: (error) => {
          if (lifetime.signal.aborted) return;
          liveError = `SESSION_DIRECTORY_LIVE: ${String(error)}`;
          publish();
        },
      });
    }
    // Use the returned ready page even when a client bridge omits snapshot replay.
    if (!snapshots) snapshot(result);
  }).catch((error: unknown) => {
    if (lifetime.signal.aborted) return;
    liveError = `SESSION_DIRECTORY_LIVE: ${String(error)}`;
    publish();
  });
  return () => {
    lifetime.abort();
    for (const id of initializing.keys()) clearInitializing(id);
    detach?.();
    void release?.().catch(() => {});
  };
}
