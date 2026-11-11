import { defineRpc } from "@getpaseo/plugin";
import { z } from "zod";
import type { SessionGroup } from "./sessions";

export const projectIconRpc = defineRpc({
  name: "project-icon.read",
  input: z.object({ projectId: z.string().min(1).max(256), revision: z.string().max(256).optional() }),
  output: z.object({ icon: z.object({ uri: z.string().max(720_000).nullable(), svg: z.string().max(65_536).nullable() }).nullable() }),
});
export interface IconProject {
  projectId: string;
  projectKey?: string;
  projectDisplayName: string;
  projectRootPath: string;
  projectIconRevision?: string;
  projectCustomIconRevision?: string | null;
}

/** Copies/worktrees may share a remote key. Prefer the actual root, then display name. */
export function groupIconProject(group: SessionGroup, projects: readonly IconProject[]) {
  const byId = projects.find(({ projectId }) => projectId === group.key);
  if (byId) return byId;
  const candidates = projects.filter((project) => project.projectKey === group.key);
  const cwd = group.entries[0]?.agent.cwd;
  const byRoot = (items: readonly IconProject[]) => [...items].sort((a, b) => b.projectRootPath.length - a.projectRootPath.length)
    .find(({ projectRootPath: root }) => cwd === root || cwd?.startsWith(`${root}/`) || cwd?.startsWith(`${root}\\`));
  return byRoot(candidates) ?? candidates.find(({ projectDisplayName }) => projectDisplayName === group.name)
    ?? (candidates.length === 1 ? candidates[0] : undefined) ?? byRoot(projects);
}

// Same identity palette/hash as Paseo's generated project icons.
export function projectInitialColor(key: string) {
  const colors = ["#7a6aa8", "#3d7ea6", "#388068", "#a4673a", "#b05c80", "#6a70b8", "#368080", "#b06260", "#8f7838", "#5179b0"];
  let hash = 0;
  for (const character of key) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return colors[hash % colors.length];
}
