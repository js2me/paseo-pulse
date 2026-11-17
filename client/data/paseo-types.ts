import type { PluginClientContext } from "@getpaseo/plugin/client";

// Host-provided SDK types keep runtime validation independent of local devDependencies.
export type PaseoApi = PluginClientContext["paseo"];
export type PaseoAgentListResult = Awaited<ReturnType<PaseoApi["agents"]["list"]>>;
export type PaseoAgentUpdate = Parameters<Parameters<PaseoApi["agents"]["subscribe"]>[0]>[0];
export type PaseoWorkspaceListResult = Awaited<ReturnType<PaseoApi["workspaces"]["list"]>>;
export type PaseoWorkspaceUpdate = Parameters<Parameters<PaseoApi["workspaces"]["subscribe"]>[0]>[0];
