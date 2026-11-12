import type { PaseoApi } from "@getpaseo/client";
import { observeSessionDirectory, type SessionDirectoryState } from "./session-directory";
import { observeWorkspaceTitles } from "./workspace-titles";

/** Owned by the plugin installation, rather than any mounted screen. */
export function createSessionDirectoryStore(paseo: Pick<PaseoApi, "agents"> & Partial<Pick<PaseoApi, "workspaces">>) {
  let state: SessionDirectoryState = { entries: [], loading: true, error: null };
  let source = state;
  let titles: ReadonlyMap<string, string> = new Map();
  const listeners = new Set<() => void>();
  let stop: (() => void) | undefined;
  let stopTitles: (() => void) | undefined;
  let disposed = false;
  const publish = (next: SessionDirectoryState) => {
    // Keep the last complete list visible during a manual retry.
    source = next.loading && source.entries.length ? { ...next, entries: source.entries } : next;
    state = { ...source, entries: source.entries.map((entry) => {
      const title = entry.agent.workspaceId ? titles.get(entry.agent.workspaceId) : undefined;
      return title ? { ...entry, agent: { ...entry.agent, title },
        project: { ...entry.project, workspaceName: title } } : entry;
    }) };
    for (const listener of listeners) listener();
  };
  const start = () => {
    if (disposed || stop) return;
    stop = observeSessionDirectory(paseo, publish);
    if (paseo.workspaces && !stopTitles) stopTitles = observeWorkspaceTitles({ workspaces: paseo.workspaces }, (next) => {
      titles = next;
      publish(source);
    });
  };
  return {
    getSnapshot: () => state,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    start,
    retry() {
      if (disposed) return;
      stop?.();
      stopTitles?.();
      stop = undefined;
      stopTitles = undefined;
      start();
    },
    dispose() {
      disposed = true;
      stop?.();
      stopTitles?.();
      stop = undefined;
      stopTitles = undefined;
      listeners.clear();
      state = { entries: [], loading: true, error: null };
      source = state;
      titles = new Map();
    },
  };
}

export type SessionDirectoryStore = ReturnType<typeof createSessionDirectoryStore>;
