import { useEffect, useState } from "react";
import { activity, RECENT_SESSION_WINDOW_MS, type SessionEntry } from "../shared/sessions";

/** Keep list and sidebar counts current even when the host sends no new events. */
export function useSessionClock(entries: readonly SessionEntry[]) {
  const [, refresh] = useState(0);
  const now = Date.now();
  useEffect(() => {
    let delay = 60_000;
    for (const { agent } of entries) {
      if (agent.frequentlyViewedUntil && agent.frequentlyViewedUntil >= now)
        delay = Math.min(delay, agent.frequentlyViewedUntil - now + 1);
      const timestamp = activity(agent);
      for (const window of [RECENT_SESSION_WINDOW_MS, 24 * 60 * 60 * 1000]) {
        const next = timestamp > now ? timestamp - now : timestamp + window - now + 1;
        if (timestamp > 0 && next > 0) delay = Math.min(delay, next);
      }
    }
    const timer = setTimeout(() => refresh((value) => value + 1), delay);
    return () => clearTimeout(timer);
  }, [entries, now]);
  return now;
}
