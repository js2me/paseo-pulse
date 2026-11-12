import type { PaseoApi, PaseoWorkspaceListResult, PaseoWorkspaceUpdate } from "@getpaseo/client";

export interface WorkspaceMetadata { title: string | null; pinnedAt: string | null }

/** Sidebar names and pins belong to workspaces, not agents. */
export function observeWorkspaceMetadata(paseo: Pick<PaseoApi, "workspaces">,
  onChange: (workspaces: ReadonlyMap<string, WorkspaceMetadata>) => void): () => void {
  const lifetime = new AbortController();
  const workspaces = new Map<string, WorkspaceMetadata>();
  const mutations = new Map<string, number>();
  let revision = 0, generation = 0;
  let detach: (() => void) | undefined;
  let release: (() => Promise<void>) | undefined;
  const publish = () => { if (!lifetime.signal.aborted) onChange(new Map(workspaces)); };
  const set = (id: string, title?: string | null, pinnedAt?: string | null) => {
    const next = { title: title?.trim() || null, pinnedAt: pinnedAt || null };
    const old = workspaces.get(id);
    if (!next.title && !next.pinnedAt) workspaces.delete(id);
    else if (old?.title !== next.title || old?.pinnedAt !== next.pinnedAt) workspaces.set(id, next);
  };
  const update = (message: PaseoWorkspaceUpdate) => {
    if (lifetime.signal.aborted) return;
    const id = message.kind === "remove" ? message.id : message.workspace.id;
    mutations.set(id, ++revision);
    const previous = workspaces.get(id);
    set(id, message.kind === "remove" ? null : message.workspace.title,
      message.kind === "remove" ? null : message.workspace.pinnedAt);
    if (previous !== workspaces.get(id)) publish();
  };
  const refresh = async () => {
    const current = ++generation, started = revision;
    const seen = new Set<string>(), cursors = new Set<string>();
    let cursor: string | undefined;
    try {
      do {
        const page: PaseoWorkspaceListResult = await paseo.workspaces.list({
          page: { limit: 200, ...(cursor ? { cursor } : {}) },
        });
        if (lifetime.signal.aborted || current !== generation) return;
        for (const workspace of page.entries) {
          seen.add(workspace.id);
          if ((mutations.get(workspace.id) ?? 0) <= started) set(workspace.id, workspace.title, workspace.pinnedAt);
        }
        if (!page.pageInfo.hasMore) break;
        const next = page.pageInfo.nextCursor;
        if (!next || cursors.has(next)) throw new Error("WORKSPACE_METADATA_CURSOR");
        cursors.add(next);
        cursor = next;
      } while (cursor);
      for (const id of workspaces.keys())
        if (!seen.has(id) && (mutations.get(id) ?? 0) <= started) workspaces.delete(id);
      publish();
    } catch (error) {
      if (!lifetime.signal.aborted) console.warn("Workspace metadata could not be read", String(error));
    }
  };
  void refresh();
  void Promise.resolve().then(() => lifetime.signal.aborted ? null : paseo.workspaces.list({
    page: { limit: 200 }, subscribe: {},
  })).then((result) => {
    if (!result) return;
    const subscription = result.subscription;
    if (lifetime.signal.aborted) { void subscription.release().catch(() => {}); return; }
    release = () => subscription.release();
    let snapshots = 0;
    detach = subscription.subscribe({
      snapshot: () => { snapshots++; if (!lifetime.signal.aborted) void refresh(); },
      update: (message) => { if (message.type === "workspace_update") update(message.payload); },
      error: (error) => {
        if (!lifetime.signal.aborted) console.warn("Workspace metadata subscription failed", String(error));
      },
    });
    if (!snapshots) void refresh();
  }).catch((error: unknown) => {
    if (!lifetime.signal.aborted) console.warn("Workspace metadata subscription failed", String(error));
  });
  return () => { lifetime.abort(); detach?.(); void release?.().catch(() => {}); };
}
