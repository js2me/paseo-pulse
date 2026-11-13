import { useCallback } from "react";
import type { PluginScreenProps } from "@getpaseo/plugin/client";
import { useCreateViewModel } from "../lib/mvvm";
import { SessionCreationViewModel, type NewWorkspaceInput } from "../view-models/session-creation-view-model";
import { useMessages } from "../i18n/messages";

export function useCreateSession(navigation: PluginScreenProps["navigation"], hostId: string) {
  const { t } = useMessages();
  // Older SDK releases do not declare this optional host capability yet.
  const open = navigation && "openNewWorkspace" in navigation && typeof navigation.openNewWorkspace === "function"
    ? navigation.openNewWorkspace : undefined;
  const openWorkspace = useCallback((input: NewWorkspaceInput) => open?.(input), [open]);
  const model = useCreateViewModel(SessionCreationViewModel, {
    hostId, openNewWorkspace: open ? openWorkspace : undefined,
  });
  return {
    create: model.create,
    pending: model.pending,
    error: model.error ? model.error instanceof Error && model.error.message === "NEW_WORKSPACE_NAVIGATION_UNAVAILABLE"
      ? t("new.navigationUnavailable") : t("new.creationError", { error: String(model.error) }) : null,
  };
}
