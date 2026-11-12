/// <reference types="node" />
import type { PluginServerContext } from "@getpaseo/plugin/server";
import type { PaseoApi } from "@getpaseo/client";
import { createHash } from "node:crypto";
import { open } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import process from "node:process";
import { projectIconRpc, type IconProject } from "../../shared/projects/project-icons";
import { extractIcoPngFrame, getImageDimensions, getProjectIcon, sniffMimeType, type ProjectIcon } from "./project-icon-discovery";

type DisplayIcon = { uri: string | null; svg: string | null } | null;
const TTL = 60_000;
export function createProjectIconReader(paseo: Pick<PaseoApi, "projects">,
  home = process.env.PASEO_HOME || join(homedir(), ".paseo")) {
  let catalog: { expires: number; value: Promise<IconProject[]> } | undefined;
  const cache = new Map<string, { signature: string; expires: number; value: Promise<DisplayIcon> }>();
  const projects = () => {
    if (!catalog || catalog.expires < Date.now()) {
      const value = paseo.projects.list().then(({ projects }) => projects);
      catalog = { expires: Date.now() + 1000, value };
      void value.catch(() => { if (catalog?.value === value) catalog = undefined; });
    }
    return catalog.value;
  };
  return async (projectId: string, revision?: string): Promise<DisplayIcon> => {
    let project = (await projects()).find((item) => item.projectId === projectId);
    if (revision && project && revision !== (project.projectIconRevision ?? project.projectCustomIconRevision ?? "")) {
      catalog = undefined;
      project = (await projects()).find((item) => item.projectId === projectId);
    }
    if (!project) return null;
    const signature = JSON.stringify([project.projectRootPath, project.projectIconRevision, project.projectCustomIconRevision]);
    const old = cache.get(projectId);
    if (old?.signature === signature && old.expires > Date.now()) return old.value;
    const current = project;
    const value = (async () => {
      let icon: ProjectIcon | null;
      if (current.projectCustomIconRevision) {
        // This is Paseo's custom-icon location. Only registered project IDs reach it.
        const key = createHash("sha256").update(projectId).digest("hex");
        icon = await readCustomIcon(join(home, "projects", "icons", `${key}.bin`));
      } else icon = await getProjectIcon(current.projectRootPath);
      if (!icon) return null;
      if (icon.mimeType === "image/svg+xml") {
        const svg = Buffer.from(icon.data, "base64").toString("utf8");
        // The public SDK's SVG renderer disallows active content, styles and external links.
        if (/<(?:script|style|foreignObject)\b|\bon\w+\s*=|javascript:|(?:xlink:)?href\s*=\s*["'](?!#)/i.test(svg)) return null;
        return { uri: null, svg };
      }
      if (icon.mimeType === "image/x-icon") return null;
      return { uri: `data:${icon.mimeType};base64,${icon.data}`, svg: null };
    })();
    if (cache.size >= 256 && !cache.has(projectId)) cache.delete(cache.keys().next().value!);
    cache.set(projectId, { signature, expires: Date.now() + TTL, value });
    void value.catch(() => { if (cache.get(projectId)?.value === value) cache.delete(projectId); });
    return value;
  };
}

async function readCustomIcon(path: string): Promise<ProjectIcon | null> {
  try {
    const file = await open(path, "r");
    try {
      const { size } = await file.stat();
      if (size <= 0 || size > 512 * 1024) return null;
      const bytes = Buffer.alloc(size);
      const { bytesRead } = await file.read(bytes, 0, size, 0);
      if (bytesRead !== size) return null;
      let mimeType = sniffMimeType(bytes);
      if (!mimeType) return null;
      let data: Buffer = bytes;
      if (mimeType === "image/x-icon") {
        const frame = extractIcoPngFrame(bytes);
        if (!frame) return null;
        data = frame;
        mimeType = "image/png";
      }
      const dimensions = getImageDimensions(data, mimeType);
      if (!dimensions || dimensions.width <= 0 || dimensions.width !== dimensions.height || dimensions.width > 1024) return null;
      return { data: data.toString("base64"), mimeType };
    } finally { await file.close(); }
  } catch { return null; }
}

export function registerProjectIcons(server: PluginServerContext) {
  let read: ReturnType<typeof createProjectIconReader> | undefined;
  server.handle(projectIconRpc, async ({ projectId, revision }, { paseo }) => {
    read ??= createProjectIconReader(paseo);
    return { icon: await read(projectId, revision) };
  });
  return () => { read = undefined; };
}
