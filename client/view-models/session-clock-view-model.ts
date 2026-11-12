import type { SessionEntry } from "../../shared/sessions/sessions";
import { activity, RECENT_SESSION_WINDOW_MS } from "../../shared/sessions/sessions";
import { makeObservable, observable, reaction, runInAction, type ViewModelParams } from "../lib/mvvm";
import { PulseViewModel } from "../lib/pulse-view-model";

export class SessionClockViewModel extends PulseViewModel<{ entries: readonly SessionEntry[] }> {
  now = Date.now();
  private timer?: ReturnType<typeof setTimeout>;
  private stop?: () => void;
  constructor(params: ViewModelParams<{ entries: readonly SessionEntry[] }>) {
    super(params);
    makeObservable(this, { now: observable });
  }
  protected didMount() {
    this.stop = reaction(
      () => this.payload.entries,
      () => this.schedule(),
      { fireImmediately: true },
    );
  }
  protected willUnmount() {
    this.stop?.();
    clearTimeout(this.timer);
  }
  private schedule() {
    clearTimeout(this.timer);
    const now = Date.now();
    // A busy directory may reschedule continuously; its message timestamps must
    // still be compared with current time even before the next minute tick.
    runInAction(() => {
      this.now = now;
    });
    let delay = 60_000;
    for (const { agent } of this.payload.entries) {
      if (agent.frequentlyViewedUntil && agent.frequentlyViewedUntil >= now)
        delay = Math.min(delay, agent.frequentlyViewedUntil - now + 1);
      const timestamp = activity(agent);
      for (const window of [RECENT_SESSION_WINDOW_MS, 24 * 60 * 60 * 1000]) {
        const next = timestamp > now ? timestamp - now : timestamp + window - now + 1;
        if (timestamp > 0 && next > 0) delay = Math.min(delay, next);
      }
    }
    this.timer = setTimeout(() => {
      if (this.unmountSignal.aborted) return;
      this.schedule();
    }, delay);
  }
}
