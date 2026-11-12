import { defineTranslations, useTranslation } from "@getpaseo/plugin/client";
import en from "./locales/en.json" with { type: "json" };
import ru from "./locales/ru.json" with { type: "json" };
import fr from "./locales/fr.json" with { type: "json" };
import zhTW from "./locales/zh-TW.json" with { type: "json" };

// Paseo currently offers zh-CN; Chinese variants use the requested Traditional script.
export const messages = defineTranslations({ resources: { en, ru, fr, zh: zhTW, "zh-TW": zhTW, "zh-Hant": zhTW } });
export const useMessages = () => useTranslation(messages);
export type Translate = ReturnType<typeof useMessages>["t"];

export function relativeTime(timestamp: number, t: Translate, now = Date.now()) {
  if (!timestamp || timestamp > now) return "—";
  const minutes = Math.max(0, Math.floor((now - timestamp) / 60_000));
  if (minutes < 1) return t("time.now");
  if (minutes < 60) return t("time.minutes", { count: minutes });
  if (minutes < 1440) return t("time.hours", { count: Math.floor(minutes / 60) });
  return t("time.days", { count: Math.floor(minutes / 1440) });
}

/** Translate our directory diagnostics; provider/daemon error details stay verbatim. */
export function directoryError(error: string, t: Translate): string {
  return error.replace(/(?:Error: )?SESSION_DIRECTORY_CANCELLED/g, () => t("directory.cancelled"))
    .replace(/(?:Error: )?SESSION_DIRECTORY_TIMEOUT/g, () => t("directory.timeout"))
    .replace(/(?:Error: )?SESSION_DIRECTORY_CURSOR/g, () => t("directory.cursor"))
    .replace(/SESSION_DIRECTORY_LIVE: ([^;]*)/g, (_match, detail: string) => t("directory.live", { error: detail }));
}
