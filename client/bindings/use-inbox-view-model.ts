import { useCallback } from "react";
import { useCreateViewModel } from "../lib/mvvm";
import { InboxViewModel } from "../view-models/inbox-view-model";
import type { InboxProps } from "../views/inbox/types";
import { useSessions } from "./use-sessions";
import { useSessionActivity } from "./use-session-activity";
import { useSessionVisits } from "./use-session-visits";
import { useAcknowledgements } from "./use-acknowledgements";
import { useSessionClock } from "./use-session-clock";
import { useCreateSession } from "./use-create-session";
import { useIconProjects } from "./use-icon-projects";

/** The SDK/React Query boundary. Views receive presentation state and commands. */
export function useInboxViewModel(props: InboxProps) {
  const iconProjects = useIconProjects(props.host.id);
  const directory = useSessions(props.directory);
  const activity = useSessionActivity(directory.entries, props.host.id);
  const visits = useSessionVisits(activity.entries, props.host.id);
  const ack = useAcknowledgements(visits.entries);
  const now = useSessionClock(ack.entries);
  const onCreated = useCallback(
    (agentId: string) => {
      visits.trackVisit(agentId);
      props.navigation?.openAgent({ agentId, serverId: props.host.id });
    },
    [visits.trackVisit, props.navigation, props.host.id],
  );
  const creation = useCreateSession(directory.entries, onCreated);
  const model = useCreateViewModel(InboxViewModel, {
    entries: ack.entries,
    replies: activity.replies,
    iconProjects,
    now,
    navigation: props.navigation,
    hostId: props.host.id,
    trackVisit: visits.trackVisit,
  });
  return {
    model,
    now,
    creation,
    loading: directory.loading,
    error: directory.error,
    retry: directory.retry,
    verifying: activity.verifying,
    previewError: activity.previewError,
    acknowledge: ack.acknowledge,
    ackPending: ack.pending,
    ackReady: ack.ready,
    ackError: ack.error,
    creationDisabled: directory.loading || creation.pending !== null || !props.navigation,
  };
}
