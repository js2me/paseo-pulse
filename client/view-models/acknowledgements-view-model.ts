import { acknowledgeSessions, applyAcknowledgements } from "../../shared/sessions/acknowledgements";
import type { SessionEntry } from "../../shared/sessions/sessions";
import {
  action,
  computed,
  makeObservable,
  observable,
  reaction,
  runInAction,
  type ViewModelParams,
} from "../lib/mvvm";
import { PulseViewModel } from "../lib/pulse-view-model";
import type { AcknowledgementState } from "../data/sessions/acknowledgement-settings";

type Payload = { settings: AcknowledgementState; entries: readonly SessionEntry[] };
const emptySeen: Readonly<Record<string, string>> = {};
export class AcknowledgementsViewModel extends PulseViewModel<Payload> {
  pending = false;
  errorKey: "ack.conflict" | "ack.saveError" | null = null;
  private requested = new Map<string, string>();
  private optimisticSeen: Record<string, string> = {};
  private stop?: () => void;
  private awaitingRevision: string | null = null;
  constructor(params: ViewModelParams<Payload>) {
    super(params);
    makeObservable<this, "requested" | "optimisticSeen">(this, {
      pending: observable,
      errorKey: observable,
      requested: observable.shallow,
      optimisticSeen: observable.ref,
      entries: computed,
      seen: computed,
      ready: computed,
      saving: computed,
      readError: computed,
      acknowledge: action.bound,
    });
  }
  get seen() {
    return this.payload.settings.status === "ready" ? this.payload.settings.values.seen : emptySeen;
  }
  get entries() {
    return applyAcknowledgements(applyAcknowledgements(this.payload.entries, this.seen), this.optimisticSeen);
  }
  get ready() {
    return this.payload.settings.status === "ready";
  }
  get saving() {
    return this.pending || this.payload.settings.saving;
  }
  get readError() {
    return ["error", "invalid"].includes(this.payload.settings.status) ? ("ack.readError" as const) : null;
  }
  acknowledge(sessions: readonly SessionEntry[]) {
    const marks = acknowledgeSessions({}, sessions);
    if (!Object.keys(marks).length) return;
    this.errorKey = null;
    for (const [id, token] of Object.entries(marks)) this.requested.set(id, token);
    this.optimisticSeen = { ...this.optimisticSeen, ...marks };
  }
  protected didMount() {
    this.stop = reaction(
      () => [this.payload.settings, this.requested.size, this.pending] as const,
      () => {
        runInAction(() => {
          const remaining = Object.entries(this.optimisticSeen).filter(
            ([id, token]) => this.seen[id] !== token,
          );
          if (remaining.length !== Object.keys(this.optimisticSeen).length)
            this.optimisticSeen = Object.fromEntries(remaining);
        });
        void this.flush();
      },
      { fireImmediately: true },
    );
  }
  protected willUnmount() {
    this.stop?.();
    this.pending = false;
  }
  private async flush() {
    const settings = this.payload.settings;
    if (
      this.pending ||
      settings.status !== "ready" ||
      settings.saving ||
      !this.requested.size ||
      this.awaitingRevision === settings.revision
    )
      return;
    const marks = Object.fromEntries(this.requested);
    const signal = this.unmountSignal;
    runInAction(() => {
      this.pending = true;
    });
    let saved = false;
    try {
      saved = await settings.save({ seen: { ...settings.values.seen, ...marks } }, settings.revision);
      if (saved) this.awaitingRevision = settings.revision;
      if (!saved && !signal.aborted) {
        await settings.reload();
        if (!signal.aborted)
          runInAction(() => {
            this.errorKey = "ack.conflict";
          });
      }
    } catch {
      if (!signal.aborted)
        runInAction(() => {
          this.errorKey = "ack.saveError";
        });
    } finally {
      if (!signal.aborted)
        runInAction(() => {
          for (const [id, token] of Object.entries(marks))
            if (this.requested.get(id) === token) this.requested.delete(id);
          if (!saved)
            this.optimisticSeen = Object.fromEntries(
              Object.entries(this.optimisticSeen).filter(([id, token]) => marks[id] !== token),
            );
          this.pending = false;
        });
    }
  }
}
