import { useSyncExternalStore } from "react";
import type { SessionDirectoryStore } from "./session-directory-store";

export function useSessions(directory: SessionDirectoryStore) {
  const state = useSyncExternalStore(directory.subscribe, directory.getSnapshot, directory.getSnapshot);
  return { ...state, retry: directory.retry };
}
