import { activity, attention, isFrequentlyViewedSession, isReadSession, type Session } from "../../shared/sessions/sessions";

/** Message age controls contrast; service updates and visits never make old text fresh. */
export function sessionEmphasis(session: Session, now: number) {
  const timestamp = activity(session);
  const age = timestamp > 0 && timestamp <= now ? (now - timestamp) / 3_600_000 : Infinity;
  const reason = attention(session);
  const read = isReadSession(session);
  const freshness = age < 0.25 ? 1 : age < 1 ? 0.9 : age < 4 ? 0.75
    : age < 12 ? 0.55 : age < 24 ? 0.35 : age < 72 ? 0.12 : 0;
  const title = Math.max(0, freshness - (read ? 0.22 : 0));
  const preview = Math.max(0, freshness - (read ? 0.4 : 0.22));
  const time = Math.max(0, freshness - (read ? 0.25 : 0));
  // A pin or repeated visits keep the name identifiable without disguising its age.
  const familiar = !!session.pinnedAt || isFrequentlyViewedSession(session, now);
  return {
    reason,
    title: familiar ? Math.max(title, 0.4) : title,
    preview,
    time,
    weight: reason ? "600" as const : !read && (age < 4 || familiar) ? "500" as const : "400" as const,
  };
}
