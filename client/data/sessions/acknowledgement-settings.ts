import type { SettingsState } from "@getpaseo/plugin/client";
import type { acknowledgementSettings } from "../../../shared/sessions/acknowledgements";

export type AcknowledgementState = SettingsState<typeof acknowledgementSettings.schema>;

/**
 * Paseo recreates the settings object, parsed values and commands on every render.
 * A revision identifies immutable document contents; callback identity does not.
 * Keep observable inputs stable while commands always call the latest SDK closure.
 */
export class AcknowledgementSettingsAdapter {
  private latest!: AcknowledgementState;
  private snapshot?: AcknowledgementState;
  private save: AcknowledgementState["save"] = (...args) => this.latest.save(...args);
  private reset: AcknowledgementState["reset"] = () => this.latest.reset();
  private reload: AcknowledgementState["reload"] = () => this.latest.reload();

  read(settings: AcknowledgementState): AcknowledgementState {
    this.latest = settings;
    const previous = this.snapshot;
    if (
      previous &&
      previous.status === settings.status &&
      previous.saving === settings.saving &&
      previous.saveError === settings.saveError &&
      (!("revision" in settings) || ("revision" in previous && previous.revision === settings.revision)) &&
      (!("error" in settings) || ("error" in previous && previous.error === settings.error))
    ) {
      return previous;
    }
    const commands = {
      saving: settings.saving,
      saveError: settings.saveError,
      save: this.save,
      reset: this.reset,
      reload: this.reload,
    };
    switch (settings.status) {
      case "ready":
        this.snapshot = {
          ...commands,
          status: "ready",
          values: settings.values,
          revision: settings.revision,
        };
        break;
      case "invalid":
        this.snapshot = {
          ...commands,
          status: "invalid",
          error: settings.error,
          revision: settings.revision,
        };
        break;
      case "error":
        this.snapshot = { ...commands, status: "error", error: settings.error };
        break;
      case "loading":
        this.snapshot = { ...commands, status: "loading" };
        break;
    }
    return this.snapshot;
  }
}
