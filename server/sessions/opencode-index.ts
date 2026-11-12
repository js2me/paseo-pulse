/// <reference types="node" />
import type { DatabaseSync } from "node:sqlite";
import { stat } from "node:fs/promises";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import process from "node:process";

type Summary = { text: string | null; lastActivityAt: string | null; activityKnown: boolean;
  latestReplyAt: string | null; limited: boolean };
type DatabaseState = { database: DatabaseSync; identity: string; signature: string; summaries: Map<string, Summary | null> };
const SESSION_ID = /^ses_[a-zA-Z0-9]{1,128}$/;
const object = (value: unknown): Record<string, unknown> | null =>
  value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
function messageTime(data: Record<string, unknown>, now: number): string | null {
  const time = object(data.time);
  const value = data.role === "assistant" && time?.completed !== undefined ? time.completed : time?.created;
  return typeof value === "number" && Number.isFinite(value) && value > 0 && value <= now
    ? new Date(value).toISOString() : null;
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

/** Reads saved OpenCode SQLite messages; never opens a provider or a writable database. */
export function createOpenCodeIndex(options: { dataHome?: string; now?: () => number } = {}) {
  const dataHome = resolve(options.dataHome ?? join(process.env.XDG_DATA_HOME ?? join(homedir(), ".local", "share"), "opencode"));
  const paths = [join(dataHome, "opencode.db"), join(dataHome, "opencode-forked-code.db")];
  const now = options.now ?? Date.now;
  const databases = new Map<string, DatabaseState>();
  let closed = false;
  let sqlite: Promise<typeof import("node:sqlite") | null> | undefined;
  async function readDatabase(path: string, sessionId: string): Promise<Summary | null> {
    try {
      const [file, wal] = await Promise.all([
        stat(path, { bigint: true }), stat(`${path}-wal`, { bigint: true }).catch(() => null),
      ]);
      if (closed || !file.isFile()) return null;
      const identity = `${file.dev}:${file.ino}`;
      const signature = `${identity}:${file.size}:${file.mtimeNs}:${file.ctimeNs}:` +
        (wal ? `${wal.ino}:${wal.size}:${wal.mtimeNs}:${wal.ctimeNs}` : "no-wal");
      let state = databases.get(path);
      if (state && state.identity !== identity) { state.database.close(); databases.delete(path); state = undefined; }
      if (!state) {
        const module = await (sqlite ??= import("node:sqlite").catch(() => null));
        if (closed || !module) return null;
        // Another read can initialize this file while the shared import is pending.
        state = databases.get(path);
        if (state && state.identity !== identity) { state.database.close(); databases.delete(path); state = undefined; }
        if (!state) {
          state = { database: new module.DatabaseSync(path, { readOnly: true, allowExtension: false, timeout: 10 }),
            identity, signature, summaries: new Map() };
          databases.set(path, state);
        }
      }
      if (state.signature !== signature) { state.signature = signature; state.summaries.clear(); }
      if (state.summaries.has(sessionId)) return state.summaries.get(sessionId)!;
      const messages = state.database.prepare(
        "SELECT id, data FROM message WHERE session_id = ? ORDER BY time_created DESC, id DESC LIMIT 32",
      ).all(sessionId);
      if (!messages.length) {
        const exists = state.database.prepare("SELECT 1 FROM session WHERE id = ? LIMIT 1").get(sessionId);
        const result = exists ? { text: null, lastActivityAt: null, activityKnown: true, latestReplyAt: null, limited: false } : null;
        state.summaries.set(sessionId, result);
        return result;
      }
      // JSON extraction prevents large tool/reasoning payloads crossing into JS.
      const parts = state.database.prepare(`SELECT
        json_extract(data, '$.type') AS type,
        CASE WHEN json_extract(data, '$.type') = 'text'
          THEN substr(json_extract(data, '$.text'), 1, 4096) END AS text
        FROM part WHERE message_id = ? AND json_valid(data)
          AND json_extract(data, '$.type') IN ('text', 'file')
          AND coalesce(json_extract(data, '$.synthetic'), 0) != 1
          AND coalesce(json_extract(data, '$.ignored'), 0) != 1
        ORDER BY id LIMIT 64`);
      let lastActivityAt: string | null = null;
      let latestReplyAt: string | null = null;
      let text: string | null = null;
      let sawChat = false;
      let malformed = false;
      for (const message of messages) {
        let data: Record<string, unknown> | null;
        try { data = typeof message.data === "string" ? object(JSON.parse(message.data)) : null; }
        catch { malformed = true; continue; }
        if (!data) { malformed = true; continue; }
        if ((data.role !== "user" && data.role !== "assistant") || data.synthetic === true ||
          data.ignored === true || data.summary === true) continue;
        const content = parts.all(message.id);
        const raw = content.filter((part) => part.type === "text" && typeof part.text === "string")
          .map((part) => part.text).join("\n").slice(0, 4096);
        const hasFile = content.some((part) => part.type === "file");
        if (!raw.trim() && !(data.role === "user" && hasFile)) continue;
        if (!sawChat) { sawChat = true; lastActivityAt = messageTime(data, now()); }
        if (data.role === "assistant") {
          text = preview(raw);
          if (text) { latestReplyAt = messageTime(data, now()); break; }
        }
      }
      const result = { text, lastActivityAt, activityKnown: sawChat ? lastActivityAt !== null : messages.length < 32 && !malformed,
        latestReplyAt, limited: malformed || (!text && messages.length >= 32) };
      if (state.summaries.size >= 1000) state.summaries.delete(state.summaries.keys().next().value!);
      state.summaries.set(sessionId, result);
      return result;
    } catch {
      return null;
    }
  }
  return {
    async read(sessionId: string): Promise<Summary | null> {
      if (closed || !SESSION_ID.test(sessionId)) return null;
      let result: Summary | null = null;
      for (const path of paths) {
        const candidate = await readDatabase(path, sessionId);
        if (candidate && (!result || Date.parse(candidate.lastActivityAt ?? "") > Date.parse(result.lastActivityAt ?? "") ||
          (!result.lastActivityAt && candidate.lastActivityAt))) result = candidate;
      }
      return result;
    },
    cleanup() {
      closed = true;
      for (const state of databases.values()) { try { state.database.close(); } catch {} }
      databases.clear();
    },
  };
}
