/// <reference types="node" />
import type { PluginServerContext } from "@getpaseo/plugin/server";
import { randomUUID } from "node:crypto";
import { mkdir, open, readFile, rename, rm } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import process from "node:process";
import { z } from "zod";
import { FREQUENT_VISIT_COUNT, MIN_VISIT_INTERVAL_MS, VISIT_WINDOW_MS,
  listSessionVisitsRpc, recordSessionVisitRpc } from "../shared/session-visits";

const schema = z.object({ sessions: z.array(z.object({ agentId: recordSessionVisitRpc.input.shape.agentId,
  visits: z.array(z.number().int().positive()).max(20) })).max(2000) });
export function createSessionVisits(options: { path?: string; now?: () => number } = {}) {
  const path = options.path ?? join(process.env.PASEO_HOME || join(homedir(), ".paseo"), "plugin-data", "paseo-session-inbox", "session-visits.json");
  const now = options.now ?? Date.now;
  const sessions = new Map<string, number[]>();
  let loaded: Promise<void> | undefined;
  let serial: Promise<unknown> = Promise.resolve();
  let closed = false;
  const initialize = () => loaded ??= (async () => {
    try {
      const stored = schema.parse(JSON.parse(await readFile(path, "utf8")));
      for (const session of stored.sessions) sessions.set(session.agentId, [...new Set(session.visits)].sort((a, b) => a - b));
    } catch (error) {
      if ((error as { code?: string }).code !== "ENOENT") throw error;
    }
  })();
  function current() {
    const time = now();
    const result = new Map<string, number[]>();
    for (const [agentId, visits] of sessions) {
      const recent = visits.filter((timestamp) => timestamp <= time && time - timestamp <= VISIT_WINDOW_MS);
      if (recent.length) result.set(agentId, recent);
    }
    return result;
  }
  async function persist(next: Map<string, number[]>) {
    await mkdir(dirname(path), { recursive: true, mode: 0o700 });
    const partial = join(dirname(path), `.visits-${randomUUID()}.partial`);
    try {
      const file = await open(partial, "wx", 0o600);
      try { await file.writeFile(JSON.stringify({ sessions: [...next].map(([agentId, visits]) => ({ agentId, visits })) })); await file.sync(); }
      finally { await file.close(); }
      await rename(partial, path);
    } finally { await rm(partial, { force: true }); }
    sessions.clear();
    for (const [id, visits] of next) sessions.set(id, visits);
  }
  function record(raw: { agentId: string }) {
    if (closed) return Promise.reject(new Error("Плагин перезагружается."));
    const { agentId } = recordSessionVisitRpc.input.parse(raw);
    const job = serial.catch(() => {}).then(async () => {
      await initialize();
      const next = current(), visits = next.get(agentId) ?? [], time = now();
      if (visits.length && time - visits[visits.length - 1] < MIN_VISIT_INTERVAL_MS) return {};
      next.set(agentId, [...visits, time].slice(-20));
      if (next.size > 2000) {
        const oldest = [...next].sort((a, b) => a[1].at(-1)! - b[1].at(-1)!)[0][0];
        next.delete(oldest);
      }
      await persist(next);
      return {};
    });
    serial = job;
    return job;
  }
  async function list() {
    if (closed) throw new Error("Плагин перезагружается.");
    await serial.catch(() => {});
    await initialize();
    return { sessions: [...current()].filter(([, visits]) => visits.length >= FREQUENT_VISIT_COUNT)
      .map(([agentId, visits]) => ({ agentId, frequentlyViewedUntil: visits[visits.length - FREQUENT_VISIT_COUNT] + VISIT_WINDOW_MS })) };
  }
  return { record, list, async cleanup() { closed = true; await serial.catch(() => {}); } };
}

export function registerSessionVisits(server: PluginServerContext) {
  const visits = createSessionVisits();
  server.handle(listSessionVisitsRpc, () => visits.list());
  server.handle(recordSessionVisitRpc, (input) => visits.record(input));
  return () => visits.cleanup();
}
