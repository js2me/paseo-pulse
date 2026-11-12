import { action, computed, makeObservable, observable, type ViewModelParams } from "../lib/mvvm";
import { PulseViewModel } from "../lib/pulse-view-model";
type Payload = { icon?: { svg: string | null; uri: string | null } | null };
export class ProjectLogoViewModel extends PulseViewModel<Payload> {
  failedUri: string | null = null;
  constructor(params: ViewModelParams<Payload>) {
    super(params);
    makeObservable(this, { failedUri: observable, uri: computed, svg: computed, fail: action.bound });
  }
  get uri() {
    const uri = this.payload.icon?.uri;
    return uri && uri !== this.failedUri ? uri : null;
  }
  get svg() {
    return this.payload.icon?.svg;
  }
  fail(uri: string) {
    this.failedUri = uri;
  }
}
