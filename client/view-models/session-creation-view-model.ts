import type { PaseoApi } from "@getpaseo/client";
import type { SessionEntry } from "../../shared/sessions/sessions";
import { action, makeObservable, observable, runInAction, type ViewModelParams } from "../lib/mvvm";
import { PulseViewModel } from "../lib/pulse-view-model";
import { createSessionLauncher, type CreationTarget } from "../services/session-creation";

type Payload = { paseo: PaseoApi; entries: readonly SessionEntry[]; onCreated(id: string): void };
export class SessionCreationViewModel extends PulseViewModel<Payload> {
  pending: string | null = null;
  error: unknown = null;
  private launch: ReturnType<typeof createSessionLauncher>;
  constructor(params: ViewModelParams<Payload>) {
    super(params);
    this.launch = createSessionLauncher(params.payload.paseo);
    makeObservable(this, { pending: observable, error: observable.ref, create: action.bound });
  }
  protected willUnmount() {
    this.pending = null;
  }
  async create(target: CreationTarget = {}) {
    if (this.pending !== null || this.unmountSignal.aborted) return;
    this.pending = target.projectKey ?? "global";
    this.error = null;
    const signal = this.unmountSignal;
    try {
      const id = await this.launch(this.payload.entries, target);
      if (!signal.aborted) this.payload.onCreated(id);
    } catch (error) {
      if (!signal.aborted)
        runInAction(() => {
          this.error = error;
        });
    } finally {
      if (!signal.aborted)
        runInAction(() => {
          this.pending = null;
        });
    }
  }
}
