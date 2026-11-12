/// <reference types="node" />
import type { PluginServerContext } from "@getpaseo/plugin/server";
import type { PaseoApi } from "@getpaseo/client";
import { Buffer } from "node:buffer";
import { constants } from "node:fs";
import { open, readdir } from "node:fs/promises";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import process from "node:process";
import * as zlib from "node:zlib";
import { sessionIndexRpc, type SessionIndexEntry } from "../../shared/sessions/session-index";
import { createOpenCodeIndex } from "./opencode-index";

type Summary = Omit<SessionIndexEntry, "agentId">;
type Provider = "codex" | "claude";
type KnownAgent = { id: string; provider: string; cwd: string; archivedAt?: string | null; internal?: boolean;
  persistence?: { provider: string; sessionId: string; nativeHandle?: string } | null };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const UUID_FILE = /(?:^|-)([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.jsonl(?:\.zst)?$/i;
const MAX_TAIL_BYTES = 1024 * 1024;
const CATALOG_TTL = 5_000;
const LOCATION_TTL = 60_000;
const unknown = (): Summary => ({ text: null, lastActivityAt: null, activityKnown: false, latestReplyAt: null, limited: true });
const object = (value: unknown): Record<string, unknown> | null =>
  value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
function timestamp(value: unknown, now: number): string | null {
  const parsed = typeof value === "string" ? Date.parse(value) : NaN;
  return Number.isFinite(parsed) && parsed > 0 && parsed <= now ? new Date(parsed).toISOString() : null;
}
function contentText(content: unknown): string {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content.flatMap((part) => {
    const value = object(part);
    return value && ["text", "input_text", "output_text"].includes(String(value.type)) && typeof value.text === "string"
      ? [value.text] : [];
  }).join("\n");
}
function preview(text: string): string | null {
  const clean = text.slice(0, 4096)
    .replace(/^\s*(`{3,}|~{3,}).*$/gm, "")
    .replace(/!?\[([^\]]*)\]\([^\n)]*\)/g, "$1")
    .replace(/^\s{0,3}(?:#{1,6}\s+|>\s?|[-+*]\s+(?:\[[ xX]\]\s*)?|\d+[.)]\s+)/gm, "")
    .replace(/(`+)([\s\S]*?)\1/g, "$2")
    .replace(/(\*\*|__|~~)([^\n]+?)\1/g, "$2")
    .replace(/(^|\s)([*_])([^\n]+?)\2(?=\s|[.,!?;:]|$)/g, "$1$3")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2066-\u2069]/g, "")
    .replace(/\s+/g, " ").trim();
  if (!clean) return null;
  const chars = Array.from(clean);
  return chars.length > 220 ? `${chars.slice(0, 219).join("")}…` : clean;
}
function chatRecord(provider: Provider, record: Record<string, unknown>): { role: "user" | "assistant"; text: string; time: unknown } | null {
  if (provider === "codex") {
    const payload = object(record.payload);
    if (!payload) return null;
    if (record.type === "response_item" && payload.type === "message" &&
      (payload.role === "user" || payload.role === "assistant")) {
      const text = contentText(payload.content);
      if (payload.role === "assistant" && !text.trim()) return null;
      return { role: payload.role, text, time: record.timestamp };
    }
    if (record.type === "event_msg" && (payload.type === "user_message" || payload.type === "agent_message")) {
      const text = typeof payload.message === "string" ? payload.message : "";
      if (payload.type === "agent_message" && !text.trim()) return null;
      return { role: payload.type === "user_message" ? "user" : "assistant", text, time: record.timestamp };
    }
    return null;
  }
  if (record.isMeta === true || record.isCompactSummary === true || (record.type !== "user" && record.type !== "assistant")) return null;
  const message = object(record.message);
  if (!message || message.role !== record.type) return null;
  const text = contentText(message.content);
  if (record.type === "assistant" && !text.trim()) return null;
  // Tool results are stored as user records but are not messages from the human.
  if (record.type === "user" && Array.isArray(message.content) && !message.content.some((part) => {
    const value = object(part);
    return value && ["text", "image", "document", "input_image"].includes(String(value.type));
  })) return null;
  return { role: record.type, text, time: record.timestamp };
}

/** Parses only a bounded tail, newest records first; tool activity never proves freshness. */
export function parseSessionTranscript(provider: Provider, source: string,
  options: { truncatedStart?: boolean; now?: number } = {}): Summary {
  const now = options.now ?? Date.now();
  const lines = source.split("\n");
  if (options.truncatedStart) lines.shift();
  let sawChat = false;
  let malformed = false;
  let latestChatTime: string | null = null;
  let text: string | null = null;
  let latestReplyAt: string | null = null;
  for (let index = lines.length - 1; index >= 0; index--) {
    if (!lines[index].trim()) continue;
    let record: Record<string, unknown> | null;
    try { record = object(JSON.parse(lines[index])); }
    catch { malformed = true; continue; }
    if (!record) continue;
    const chat = chatRecord(provider, record);
    if (!chat) continue;
    if (!sawChat) { sawChat = true; latestChatTime = timestamp(chat.time, now); }
    if (chat.role === "assistant") {
      text = preview(chat.text);
      if (text) { latestReplyAt = timestamp(chat.time, now); break; }
    }
  }
  return { text, lastActivityAt: latestChatTime,
    activityKnown: sawChat ? latestChatTime !== null : !options.truncatedStart && !malformed,
    latestReplyAt, limited: malformed || (!!options.truncatedStart && !text) };
}

export interface SessionIndexOptions {
  paseo: Pick<PaseoApi, "agents">;
  codexHome?: string;
  claudeHome?: string;
  openCodeDataHome?: string;
  now?: () => number;
}
export function createSessionIndex(options: SessionIndexOptions) {
  const now = options.now ?? Date.now;
  // PASEO_HOME identifies daemon state, not the provider's transcript directories.
  const codexHome = resolve(options.codexHome ?? process.env.CODEX_HOME ?? join(homedir(), ".codex"));
  const claudeHome = resolve(options.claudeHome ?? process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), ".claude"));
  const openCode = createOpenCodeIndex({ dataHome: options.openCodeDataHome, now });
  const lifetime = new AbortController();
  let closed = false;
  let catalog = new Map<string, KnownAgent>();
  let catalogAt = -Infinity;
  let catalogJob: Promise<void> | undefined;
  const locations = new Map<Provider, { at: number; paths: Map<string, string>; job?: Promise<void> }>();
  const cache = new Map<string, { signature: string; summary: Summary }>();
  const knownSummaries = new Map<string, { identity: string; summary: Summary }>();
  const reads = new Map<string, Promise<Summary>>();
  const jobs = new Set<Promise<unknown>>();
  let activeReads = 0;
  const waiting: (() => void)[] = [];
  const stats = { catalogReads: 0, locationScans: 0, tailReads: 0, bytesRead: 0, maxConcurrent: 0 };

  async function loadCatalog() {
    if (now() - catalogAt < CATALOG_TTL) return;
    if (catalogJob) return catalogJob;
    catalogJob = (async () => {
      const next = new Map<string, KnownAgent>();
      const cursors = new Set<string>();
      let cursor: string | undefined;
      do {
        stats.catalogReads++;
        const page = await options.paseo.agents.list({ filter: { includeArchived: false, includeInternal: false },
          sort: [{ key: "created_at", direction: "desc" }], page: { limit: 200, ...(cursor ? { cursor } : {}) },
          signal: lifetime.signal, timeout: 15_000 });
        for (const { agent } of page.entries) if (!agent.archivedAt && !agent.internal) next.set(agent.id, agent);
        if (!page.pageInfo.hasMore) break;
        const nextCursor = page.pageInfo.nextCursor;
        if (!nextCursor || cursors.has(nextCursor)) throw new Error("Не удалось прочитать каталог сессий.");
        cursors.add(nextCursor);
        cursor = nextCursor;
      } while (cursor);
      catalog = next;
      catalogAt = now();
    })();
    try { await catalogJob; } finally { catalogJob = undefined; }
  }
  async function scan(provider: Provider, missingPath = false) {
    let index = locations.get(provider);
    if (!index) { index = { at: -Infinity, paths: new Map() }; locations.set(provider, index); }
    if (index.job) return index.job;
    if (index.at !== -Infinity && (!missingPath || now() - index.at < LOCATION_TTL)) return;
    const current = index;
    current.job = (async () => {
      stats.locationScans++;
      const paths = new Map<string, string>();
      let directories = 0;
      let files = 0;
      async function walk(directory: string, depth: number): Promise<void> {
        if (closed || depth > 5 || ++directories > 4000 || files >= 50_000) return;
        let children;
        try { children = await readdir(directory, { withFileTypes: true }); }
        catch { return; }
        for (const child of children) {
          if (files >= 50_000 || closed) break;
          if (child.isDirectory()) await walk(join(directory, child.name), depth + 1);
          else if (child.isFile()) {
            files++;
            const match = UUID_FILE.exec(child.name);
            const candidate = join(directory, child.name);
            if (match && (!paths.has(match[1].toLowerCase()) || paths.get(match[1].toLowerCase()) === `${candidate}.zst`)) {
              paths.set(match[1].toLowerCase(), candidate);
            }
          }
        }
      }
      if (provider === "codex") {
        await walk(join(codexHome, "sessions"), 0);
        await walk(join(codexHome, "archived_sessions"), 0);
      } else await walk(join(claudeHome, "projects"), 0);
      current.paths = paths;
      current.at = now();
    })();
    try { await current.job; } finally { current.job = undefined; }
  }
  async function boundedRead(path: string, provider: Provider): Promise<Summary> {
    if (reads.has(path)) return reads.get(path)!;
    const job = (async () => {
      await new Promise<void>((resolve) => {
        const start = () => { activeReads++; stats.maxConcurrent = Math.max(stats.maxConcurrent, activeReads); resolve(); };
        if (activeReads < 3) start(); else waiting.push(start);
      });
      try {
        const handle = await open(path, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
        try {
          const info = await handle.stat();
          if (!info.isFile()) return unknown();
          const signature = `${info.dev}:${info.ino}:${info.size}:${info.mtimeMs}:${info.ctimeMs}`;
          const previous = cache.get(path);
          if (previous?.signature === signature) return previous.summary;
          let content: string;
          let truncatedStart: boolean;
          let received: number;
          if (path.endsWith(".zst")) {
            const createDecoder = zlib.createZstdDecompress;
            if (typeof createDecoder !== "function" || info.size > 32 * 1024 * 1024) return previous?.summary ?? unknown();
            const input = handle.createReadStream({ autoClose: false, highWaterMark: 64 * 1024 });
            const decoder = createDecoder();
            const chunks: Buffer[] = [];
            let length = 0;
            let decompressed = 0;
            input.on("error", (error) => decoder.destroy(error));
            input.pipe(decoder);
            try {
              for await (const value of decoder) {
                const chunk = Buffer.isBuffer(value) ? value : Buffer.from(value);
                decompressed += chunk.length;
                if (decompressed > 256 * 1024 * 1024) throw new Error("Сжатая история превышает лимит чтения.");
                chunks.push(chunk);
                length += chunk.length;
                while (length > MAX_TAIL_BYTES && chunks.length) {
                  const excess = length - MAX_TAIL_BYTES;
                  if (chunks[0].length <= excess) length -= chunks.shift()!.length;
                  else { chunks[0] = chunks[0].subarray(excess); length -= excess; }
                }
              }
            } finally { input.destroy(); decoder.destroy(); }
            content = Buffer.concat(chunks, length).toString("utf8");
            truncatedStart = decompressed > length;
            received = info.size;
          } else {
            const bytes = Buffer.alloc(Math.min(info.size, MAX_TAIL_BYTES));
            const start = Math.max(0, info.size - bytes.length);
            received = 0;
            while (received < bytes.length) {
              const { bytesRead } = await handle.read(bytes, received, bytes.length - received, start + received);
              if (!bytesRead) break;
              received += bytesRead;
            }
            content = bytes.subarray(0, received).toString("utf8");
            truncatedStart = start > 0;
          }
          stats.tailReads++;
          stats.bytesRead += received;
          const parsed = parseSessionTranscript(provider, content, { truncatedStart, now: now() });
          const summary = !parsed.activityKnown && previous?.summary.activityKnown ? previous.summary : parsed;
          if (cache.size >= 1000) cache.delete(cache.keys().next().value!);
          cache.set(path, { signature, summary });
          return summary;
        } finally { await handle.close(); }
      } catch {
        // A provider can move a transcript to its archive. Rediscover only after
        // a missing location, with one shared cooldown for the whole provider.
        for (const index of locations.values()) for (const [id, candidate] of index.paths) {
          if (candidate === path) index.paths.delete(id);
        }
        return cache.get(path)?.summary ?? unknown();
      }
      finally { activeReads--; waiting.shift()?.(); }
    })();
    reads.set(path, job);
    try { return await job; } finally { reads.delete(path); }
  }
  async function readOne(agentId: string): Promise<SessionIndexEntry> {
    const agent = catalog.get(agentId);
    if (!agent) return { agentId, ...unknown() };
    const providerName = (agent.persistence?.provider ?? agent.provider).split("/")[0];
    if (providerName !== "codex" && providerName !== "claude" && providerName !== "opencode") return { agentId, ...unknown() };
    const nativeHandle = [agent.persistence?.nativeHandle, agent.persistence?.sessionId]
      .find((value) => value && (providerName === "opencode" ? /^ses_[a-zA-Z0-9]{1,128}$/.test(value) : UUID.test(value)));
    if (!nativeHandle) return { agentId, ...unknown() };
    const identity = `${providerName}:${providerName === "opencode" ? nativeHandle : nativeHandle.toLowerCase()}`;
    const previous = knownSummaries.get(agentId);
    let result: Summary;
    if (providerName === "opencode") result = await openCode.read(nativeHandle) ?? unknown();
    else {
      const provider: Provider = providerName;
      await scan(provider);
      let path = locations.get(provider)?.paths.get(nativeHandle.toLowerCase());
      if (!path) {
        await scan(provider, true);
        path = locations.get(provider)?.paths.get(nativeHandle.toLowerCase());
      }
      result = path ? await boundedRead(path, provider) : unknown();
    }
    if (previous?.identity === identity && previous.summary.activityKnown) {
      if (!result.activityKnown) result = previous.summary;
      else if (result.limited && !result.text && previous.summary.text) {
        result = { ...result, text: previous.summary.text, latestReplyAt: previous.summary.latestReplyAt };
      }
    }
    if (result.activityKnown) {
      if (knownSummaries.size >= 1000) knownSummaries.delete(knownSummaries.keys().next().value!);
      knownSummaries.set(agentId, { identity, summary: result });
    }
    return { agentId, ...result };
  }
  function read(input: { agentIds: string[] }) {
    if (closed) return Promise.reject(new Error("Индекс сессий остановлен."));
    const { agentIds } = sessionIndexRpc.input.parse(input);
    const job = (async () => {
      if (!agentIds.length) return { entries: [] };
      await loadCatalog();
      return { entries: await Promise.all([...new Set(agentIds)].map(readOne)) };
    })();
    jobs.add(job);
    void job.then(() => jobs.delete(job), () => jobs.delete(job));
    return job;
  }
  async function cleanup() {
    closed = true;
    lifetime.abort();
    await Promise.allSettled([...jobs]);
    cache.clear();
    knownSummaries.clear();
    locations.clear();
    openCode.cleanup();
  }
  return { read, cleanup, stats };
}

export function registerSessionIndex(server: PluginServerContext) {
  let index: ReturnType<typeof createSessionIndex> | undefined;
  server.handle(sessionIndexRpc, (input, { paseo }) => (index ??= createSessionIndex({ paseo })).read(input));
  return async () => { await index?.cleanup(); };
}
