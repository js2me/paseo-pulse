import { useSettings } from "@getpaseo/plugin/client";
import { useMemo } from "react";
import type { SessionEntry } from "../../shared/sessions/sessions";
import { acknowledgementSettings } from "../../shared/sessions/acknowledgements";
import { useCreateViewModel } from "../lib/mvvm";
import { AcknowledgementsViewModel } from "../view-models/acknowledgements-view-model";
import { useMessages } from "../i18n/messages";
import { AcknowledgementSettingsAdapter } from "../data/sessions/acknowledgement-settings";

export function useAcknowledgements(entries: readonly SessionEntry[]) {
  const sdkSettings = useSettings(acknowledgementSettings);
  const adapter = useMemo(() => new AcknowledgementSettingsAdapter(), []);
  const settings = adapter.read(sdkSettings);
  const { t } = useMessages();
  const model = useCreateViewModel(AcknowledgementsViewModel, { settings, entries });
  const error = model.errorKey ?? model.readError;
  return {
    entries: model.entries,
    acknowledge: model.acknowledge,
    pending: model.saving,
    ready: model.ready,
    error: error ? t(error) : null,
  };
}
