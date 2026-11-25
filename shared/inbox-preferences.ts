import { defineSettings } from "@getpaseo/plugin";
import { z } from "zod";

export const inboxPreferences = defineSettings({
  id: "display",
  scope: "host",
  version: 1,
  schema: z.object({
    view: z.enum(["list", "cards"]).default("list"),
    grouping: z.enum(["workspace", "status", "none"]).default("workspace"),
    onlyAttention: z.boolean().default(true),
  }),
});
export type InboxPreferences = z.infer<typeof inboxPreferences.schema>;
export type InboxGrouping = InboxPreferences["grouping"];
