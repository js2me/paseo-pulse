import { useSettings } from "@getpaseo/plugin/client";
import type { SessionEntry } from "../../shared/sessions/sessions";
import { acknowledgementSettings } from "../../shared/sessions/acknowledgements";
import { useCreateViewModel } from "../lib/mvvm";
import { AcknowledgementsViewModel } from "../view-models/acknowledgements-view-model";
import { useMessages } from "../i18n/messages";

export function useAcknowledgements(entries: readonly SessionEntry[]) {
  const settings = useSettings(acknowledgementSettings),
    { t } = useMessages();
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
