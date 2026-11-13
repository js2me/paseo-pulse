import { action, makeObservable, observable, runInAction, type ViewModelParams } from "../lib/mvvm";
import { PulseViewModel } from "../lib/pulse-view-model";

export interface NewWorkspaceTarget {
  projectKey?: string;
  projectId?: string;
  sourceDirectory?: string;
  displayName?: string;
}
export interface NewWorkspaceInput {
  serverId: string;
  projectId?: string;
  sourceDirectory?: string;
  displayName?: string;
}
type Payload = { hostId: string; openNewWorkspace?: (input: NewWorkspaceInput) => void };
export class SessionCreationViewModel extends PulseViewModel<Payload> {
  pending: string | null = null;
  error: unknown = null;
  constructor(params: ViewModelParams<Payload>) {
    super(params);
    makeObservable(this, { pending: observable, error: observable.ref, create: action.bound });
  }
  protected willUnmount() { this.pending = null; }
  async create(target: NewWorkspaceTarget = {}) {
    if (this.pending !== null || this.unmountSignal.aborted) return;
    this.pending = target.projectKey ?? "global";
    this.error = null;
    const signal = this.unmountSignal;
    try {
      // Let duplicate taps settle before leaving the screen. No creation RPC is called.
      await Promise.resolve();
      if (signal.aborted) return;
      if (!this.payload.openNewWorkspace) throw new Error("NEW_WORKSPACE_NAVIGATION_UNAVAILABLE");
      const { projectKey: _key, ...context } = target;
      this.payload.openNewWorkspace({ ...context, serverId: this.payload.hostId });
    } catch (error) {
      if (!signal.aborted) runInAction(() => { this.error = error; });
    } finally {
      if (!signal.aborted) runInAction(() => { this.pending = null; });
    }
  }
}
