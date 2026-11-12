import { usePaseo } from "@getpaseo/plugin/client";
import type { SessionEntry } from "../../shared/sessions/sessions";
import { useCreateViewModel } from "../lib/mvvm";
import { SessionCreationViewModel } from "../view-models/session-creation-view-model";
import { NewSessionError } from "../services/session-creation";
import { useMessages } from "../i18n/messages";

export function useCreateSession(entries: readonly SessionEntry[], onCreated: (id: string) => void) {
  const paseo = usePaseo(),
    { t } = useMessages();
  const model = useCreateViewModel(SessionCreationViewModel, { paseo, entries, onCreated });
  return {
    create: model.create,
    pending: model.pending,
    error: model.error
      ? t("new.creationError", {
          error: model.error instanceof NewSessionError ? t(`new.${model.error.code}`) : String(model.error),
        })
      : null,
  };
}
