import type { PluginServerContext } from "@getpaseo/plugin/server";
import { acknowledgementSettings } from "./shared/acknowledgements";
import { registerSessionIndex } from "./server/session-index";
import { registerProjectIcons } from "./server/project-icons";
import { registerSessionVisits } from "./server/session-visits";

export default function contribute(server: PluginServerContext) {
  server.registerSettings(acknowledgementSettings);
  const stopIndex = registerSessionIndex(server);
  const stopIcons = registerProjectIcons(server);
  const stopVisits = registerSessionVisits(server);
  return async () => { await Promise.all([stopIndex(), stopIcons(), stopVisits()]); };
}
