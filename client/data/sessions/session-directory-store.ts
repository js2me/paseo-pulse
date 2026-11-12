import type { PaseoApi } from "@getpaseo/client";
import { observeSessionDirectory, type SessionDirectoryState } from "./session-directory";
import { observeWorkspaceMetadata, type WorkspaceMetadata } from "./workspace-metadata";

/** Owned by the plugin installation, rather than any mounted screen. */
export function createSessionDirectoryStore(paseo: Pick<PaseoApi, "agents"> & Partial<Pick<PaseoApi, "workspaces">>) {
  let state: SessionDirectoryState = { entries: [], loading: true, error: null };
  let source = state;
  let workspaces: ReadonlyMap<string, WorkspaceMetadata> = new Map();
  const listeners = new Set<() => void>();
  let stop: (() => void) | undefined;
  let stopMetadata: (() => void) | undefined;
  let disposed = false;
  const publish = (next: SessionDirectoryState) => {
    // Keep the last complete list visible during a manual retry.
    source = next.loading && source.entries.length ? { ...next, entries: source.entries } : next;
    state = { ...source, entries: source.entries.map((entry) => {
      const metadata = entry.agent.workspaceId ? workspaces.get(entry.agent.workspaceId) : undefined;
      return metadata ? { ...entry, agent: { ...entry.agent,
        title: metadata.title ?? entry.agent.title, pinnedAt: metadata.pinnedAt },
        project: metadata.title ? { ...entry.project, workspaceName: metadata.title } : entry.project } : entry;
    }) };
    for (const listener of listeners) listener();
  };
  const start = () => {
    if (disposed || stop) return;
    stop = observeSessionDirectory(paseo, publish);
    if (paseo.workspaces && !stopMetadata) stopMetadata = observeWorkspaceMetadata({ workspaces: paseo.workspaces }, (next) => {
      workspaces = next;
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
      stopMetadata?.();
      stop = undefined;
      stopMetadata = undefined;
      start();
    },
    dispose() {
      disposed = true;
      stop?.();
      stopMetadata?.();
      stop = undefined;
      stopMetadata = undefined;
      listeners.clear();
      state = { entries: [], loading: true, error: null };
      source = state;
      workspaces = new Map();
    },
  };
}

export type SessionDirectoryStore = ReturnType<typeof createSessionDirectoryStore>;
