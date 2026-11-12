import type { SessionEntry } from "../../shared/sessions/sessions";
import { useCreateViewModel } from "../lib/mvvm";
import { SessionClockViewModel } from "../view-models/session-clock-view-model";

export function useSessionClock(entries: readonly SessionEntry[]) {
  return useCreateViewModel(SessionClockViewModel, { entries }).now;
}
