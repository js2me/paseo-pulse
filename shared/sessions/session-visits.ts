import { defineRpc } from "@getpaseo/plugin";
import { z } from "zod";

export const VISIT_WINDOW_MS = 24 * 60 * 60 * 1000;
export const REVISIT_WINDOW_MS = 7 * VISIT_WINDOW_MS;
export const REVISIT_COUNT = 4;
export const MIN_VISIT_INTERVAL_MS = 60_000;
export const FREQUENT_VISIT_COUNT = 3;
const agentId = z.string().min(1).max(256).refine((value) => !/[\x00-\x1f\x7f]/.test(value));
export const listSessionVisitsRpc = defineRpc({ name: "session-visits.list", input: z.object({}),
  output: z.object({ sessions: z.array(z.object({ agentId, frequentlyViewedUntil: z.number().int().positive().optional(), revisitedUntil: z.number().int().positive().optional() })).max(2000) }) });
export const recordSessionVisitRpc = defineRpc({ name: "session-visits.record", input: z.object({ agentId }), output: z.object({}) });
