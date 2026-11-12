import type { Session } from "../../../shared/sessions/sessions";
import type { LatestReplyQueryData } from "./latest-reply";

function validTimestamp(value: string | null | undefined, now: number): string | null {
  const timestamp = value ? Date.parse(value) : NaN;
  return Number.isFinite(timestamp) && timestamp > 0 && timestamp <= now ? value! : null;
}

/** A refresh changes the query token, not the last proven chat activity. */
export function withSessionActivity(session: Session, data: LatestReplyQueryData | undefined, now = Date.now(),
  options: { savedTranscript?: boolean } = {}): Session {
  const verified = data?.activityKnown ? validTimestamp(data.lastActivityAt, now) : null;
  const userMessage = validTimestamp(session.lastUserMessageAt, now);
  // The token starts with the exact user timestamp captured before the history read.
  // A newer prompt can arrive while that read is pending; its older result must not
  // rewind the prompt. Status-only changes cannot revive a rejected old user hint.
  // Saved provider files can lag a prompt already accepted by the daemon. Their
  // timestamp is still sound evidence, but cannot rewind a newer real user message.
  const newUserMessage = data && userMessage && ((options.savedTranscript && verified) ||
    !data.sourceToken.startsWith(`${session.lastUserMessageAt}:`))
    ? userMessage : null;
  const lastChatMessageAt = newUserMessage && (!verified || Date.parse(newUserMessage) > Date.parse(verified))
    ? newUserMessage : verified;
  return { ...session, lastChatMessageAt,
    // A completed but inconclusive read still suppresses its captured SDK hint.
    chatActivityKnown: !!data };
}
