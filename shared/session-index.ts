import { defineRpc } from "@getpaseo/plugin";
import { z } from "zod";

const agentId = z.string().min(1).max(256).refine((value) => !/[\x00-\x1f\x7f]/.test(value));
export const sessionIndexEntrySchema = z.object({
  agentId,
  text: z.string().max(1000).nullable(),
  lastActivityAt: z.string().datetime().nullable(),
  activityKnown: z.boolean(),
  latestReplyAt: z.string().datetime().nullable(),
  limited: z.boolean(),
});
export type SessionIndexEntry = z.infer<typeof sessionIndexEntrySchema>;
export const sessionIndexRpc = defineRpc({
  name: "session-index.read",
  input: z.object({ agentIds: z.array(agentId).max(250) }),
  output: z.object({ entries: z.array(sessionIndexEntrySchema).max(250) }),
});
