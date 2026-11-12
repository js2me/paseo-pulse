import type { PaseoApi, PaseoWorkspaceListResult, PaseoWorkspaceUpdate } from "@getpaseo/client";

/** Sidebar renames belong to workspaces, not agents. Keep their explicit titles live. */
export function observeWorkspaceTitles(paseo: Pick<PaseoApi, "workspaces">,
  onChange: (titles: ReadonlyMap<string, string>) => void): () => void {
  const lifetime = new AbortController();
  const titles = new Map<string, string>();
  const mutations = new Map<string, number>();
  let revision = 0, generation = 0;
  let detach: (() => void) | undefined;
  let release: (() => Promise<void>) | undefined;
  const publish = () => { if (!lifetime.signal.aborted) onChange(new Map(titles)); };
  const set = (id: string, title?: string | null) => {
    const value = title?.trim();
    if (value) titles.set(id, value); else titles.delete(id);
  };
  const update = (message: PaseoWorkspaceUpdate) => {
    if (lifetime.signal.aborted) return;
    const id = message.kind === "remove" ? message.id : message.workspace.id;
    mutations.set(id, ++revision);
    const previous = titles.get(id);
    set(id, message.kind === "remove" ? null : message.workspace.title);
    if (previous !== titles.get(id)) publish();
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
          if ((mutations.get(workspace.id) ?? 0) <= started) set(workspace.id, workspace.title);
        }
        if (!page.pageInfo.hasMore) break;
        const next = page.pageInfo.nextCursor;
        if (!next || cursors.has(next)) throw new Error("WORKSPACE_TITLES_CURSOR");
        cursors.add(next);
        cursor = next;
      } while (cursor);
      for (const id of titles.keys())
        if (!seen.has(id) && (mutations.get(id) ?? 0) <= started) titles.delete(id);
      publish();
    } catch (error) {
      if (!lifetime.signal.aborted) console.warn("Workspace titles could not be read", String(error));
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
        if (!lifetime.signal.aborted) console.warn("Workspace title subscription failed", String(error));
      },
    });
    if (!snapshots) void refresh();
  }).catch((error: unknown) => {
    if (!lifetime.signal.aborted) console.warn("Workspace title subscription failed", String(error));
  });
  return () => { lifetime.abort(); detach?.(); void release?.().catch(() => {}); };
}
