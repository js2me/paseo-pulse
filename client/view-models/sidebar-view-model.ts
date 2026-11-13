import type { SessionEntry } from "../../shared/sessions/sessions";
import { groupSessions } from "../../shared/sessions/sessions";
import { computed, makeObservable, type ViewModelParams } from "../lib/mvvm";
import { PulseViewModel } from "../lib/pulse-view-model";

type Payload = { entries: readonly SessionEntry[]; now: number };
export class SidebarViewModel extends PulseViewModel<Payload> {
  constructor(params: ViewModelParams<Payload>) {
    super(params);
    makeObservable(this, { groups: computed, count: computed, attention: computed, progressCount: computed, finishedCount: computed });
  }
  get groups() {
    return groupSessions(this.payload.entries, "", true, this.payload.now);
  }
  get count() {
    return this.groups.reduce((total, group) => total + group.entries.length, 0);
  }
  get progressCount() {
    return this.groups.reduce((total, group) => total + group.counts.running, 0);
  }
  get finishedCount() {
    return this.groups.reduce((total, group) => total + group.counts.finished, 0);
  }
  get attention() {
    return this.groups[0]?.attention ?? null;
  }
}
