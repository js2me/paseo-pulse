/// <reference types="node" />
import type { PluginServerContext } from "@getpaseo/plugin/server";
import { randomUUID } from "node:crypto";
import { mkdir, open, readFile, rename, rm } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import process from "node:process";
import { z } from "zod";
import { FREQUENT_VISIT_COUNT, MIN_VISIT_INTERVAL_MS, VISIT_WINDOW_MS,
  REVISIT_WINDOW_MS, REVISIT_COUNT, listSessionVisitsRpc, recordSessionVisitRpc } from "../../shared/sessions/session-visits";

const schema = z.object({ sessions: z.array(z.object({ agentId: recordSessionVisitRpc.input.shape.agentId,
  lastOpenedAt: z.number().int().positive().optional(),
  visits: z.array(z.number().int().positive()).max(20) })).max(2000) });
export function createSessionVisits(options: { path?: string; now?: () => number } = {}) {
  const path = options.path ?? join(process.env.PASEO_HOME || join(homedir(), ".paseo"), "plugin-data", "paseo-session-inbox", "session-visits.json");
  const now = options.now ?? Date.now;
  type History = { visits: number[]; lastOpenedAt: number };
  const sessions = new Map<string, History>();
  let loaded: Promise<void> | undefined;
  let serial: Promise<unknown> = Promise.resolve();
  let closed = false;
  const initialize = () => loaded ??= (async () => {
    try {
      const stored = schema.parse(JSON.parse(await readFile(path, "utf8")));
      for (const session of stored.sessions) {
        const visits = [...new Set(session.visits)].sort((a, b) => a - b);
        if (visits.length) sessions.set(session.agentId, { visits, lastOpenedAt: session.lastOpenedAt ?? visits.at(-1)! });
      }
    } catch (error) {
      if ((error as { code?: string }).code !== "ENOENT") throw error;
    }
  })();
  function current() {
    const time = now();
    const result = new Map<string, History>();
    for (const [agentId, history] of sessions) {
      const recent = history.visits.filter((timestamp) => timestamp <= time && time - timestamp <= REVISIT_WINDOW_MS);
      if (recent.length) result.set(agentId, { ...history, visits: recent });
    }
    return result;
  }
  async function persist(next: Map<string, History>) {
    await mkdir(dirname(path), { recursive: true, mode: 0o700 });
    const partial = join(dirname(path), `.visits-${randomUUID()}.partial`);
    try {
      const file = await open(partial, "wx", 0o600);
      try { await file.writeFile(JSON.stringify({ sessions: [...next].map(([agentId, history]) => ({ agentId, ...history })) })); await file.sync(); }
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
      const next = current(), history = next.get(agentId), time = now();
      const visits = history?.visits ?? [];
      if (history?.lastOpenedAt === time && [...next.keys()].at(-1) === agentId) return {};
      const countVisit = !visits.length || time - visits[visits.length - 1] >= MIN_VISIT_INTERVAL_MS;
      next.delete(agentId);
      next.set(agentId, { visits: countVisit ? [...visits, time].slice(-20) : visits, lastOpenedAt: time });
      if (next.size > 2000) {
        const oldest = [...next].sort((a, b) => a[1].lastOpenedAt - b[1].lastOpenedAt)[0][0];
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
    const time = now();
    const histories = [...current()];
    const recentAgentIds = histories.slice().reverse().sort((a, b) => b[1].lastOpenedAt - a[1].lastOpenedAt).map(([id]) => id);
    return { recentAgentIds, sessions: histories.flatMap(([agentId, { visits }]) => {
      const daily = visits.filter(timestamp => time - timestamp <= VISIT_WINDOW_MS);
      const frequentlyViewedUntil = daily.length >= FREQUENT_VISIT_COUNT
        ? daily[daily.length - FREQUENT_VISIT_COUNT] + VISIT_WINDOW_MS : undefined;
      const revisitedUntil = visits.length >= REVISIT_COUNT
        ? visits[visits.length - REVISIT_COUNT] + REVISIT_WINDOW_MS : undefined;
      return frequentlyViewedUntil || revisitedUntil ? [{ agentId,
        ...(frequentlyViewedUntil ? { frequentlyViewedUntil } : {}),
        ...(revisitedUntil ? { revisitedUntil } : {}),
      }] : [];
    }) };
  }
  return { record, list, async cleanup() { closed = true; await serial.catch(() => {}); } };
}

export function registerSessionVisits(server: PluginServerContext) {
  const visits = createSessionVisits();
  server.handle(listSessionVisitsRpc, () => visits.list());
  server.handle(recordSessionVisitRpc, (input) => visits.record(input));
  return () => visits.cleanup();
}
