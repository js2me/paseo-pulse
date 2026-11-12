import type { PluginServerContext } from "@getpaseo/plugin/server";
import { acknowledgementSettings } from "./shared/sessions/acknowledgements";
import { registerSessionIndex } from "./server/sessions/session-index";
import { registerProjectIcons } from "./server/projects/project-icons";
import { registerSessionVisits } from "./server/sessions/session-visits";

export default function contribute(server: PluginServerContext) {
  server.registerSettings(acknowledgementSettings);
  const stopIndex = registerSessionIndex(server);
  const stopIcons = registerProjectIcons(server);
  const stopVisits = registerSessionVisits(server);
  return async () => { await Promise.all([stopIndex(), stopIcons(), stopVisits()]); };
}
