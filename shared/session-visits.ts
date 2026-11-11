import { defineRpc } from "@getpaseo/plugin";
import { z } from "zod";

export const VISIT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
export const MIN_VISIT_INTERVAL_MS = 60_000;
export const FREQUENT_VISIT_COUNT = 3;
const agentId = z.string().min(1).max(256).refine((value) => !/[\x00-\x1f\x7f]/.test(value));
export const listSessionVisitsRpc = defineRpc({ name: "session-visits.list", input: z.object({}),
  output: z.object({ sessions: z.array(z.object({ agentId, frequentlyViewedUntil: z.number().int().positive() })).max(2000) }) });
export const recordSessionVisitRpc = defineRpc({ name: "session-visits.record", input: z.object({ agentId }), output: z.object({}) });
