import type { PaseoApi } from "@getpaseo/client";
import { observeSessionDirectory, type SessionDirectoryState } from "./session-directory";

/** Owned by the plugin installation, rather than any mounted screen. */
export function createSessionDirectoryStore(paseo: Pick<PaseoApi, "agents">) {
  let state: SessionDirectoryState = { entries: [], loading: true, error: null };
  const listeners = new Set<() => void>();
  let stop: (() => void) | undefined;
  let disposed = false;
  const publish = (next: SessionDirectoryState) => {
    // Keep the last complete list visible during a manual retry.
    state = next.loading && state.entries.length ? { ...next, entries: state.entries } : next;
    for (const listener of listeners) listener();
  };
  const start = () => {
    if (disposed || stop) return;
    stop = observeSessionDirectory(paseo, publish);
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
      stop = undefined;
      start();
    },
    dispose() {
      disposed = true;
      stop?.();
      stop = undefined;
      listeners.clear();
      state = { entries: [], loading: true, error: null };
    },
  };
}

export type SessionDirectoryStore = ReturnType<typeof createSessionDirectoryStore>;
