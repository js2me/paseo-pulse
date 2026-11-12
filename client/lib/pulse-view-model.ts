import { ViewModelBase, type ViewModelParams } from "./mvvm";

export class PulseViewModel<Payload extends Record<string, unknown>> extends ViewModelBase<Payload> {
  constructor(params: ViewModelParams<Payload>) {
    super({
      ...params,
      vmConfig: { ...params.vmConfig, comparePayload: "shallow", startViewTransitions: false },
    });
  }
}
