import type { PluginTheme } from "@getpaseo/plugin";
import type { sessionEmphasis } from "../../view-models/session-emphasis";
import { statusColor } from "./status-color";

/** Blend theme text tokens instead of fading text into the background. */
function blend(from: string, to: string, amount: number): string {
  const rgb = (value: string) => {
    const hex = value.replace(/^#/, "");
    const full = hex.length === 3 ? [...hex].map((digit) => digit + digit).join("") : hex;
    return /^[\da-f]{6}$/i.test(full)
      ? [0, 2, 4].map((offset) => parseInt(full.slice(offset, offset + 2), 16)) : null;
  };
  const a = rgb(from), b = rgb(to);
  if (!a || !b) return amount >= 0.5 ? to : from;
  return `#${a.map((value, index) => Math.round(value + (b[index] - value) * amount)
    .toString(16).padStart(2, "0")).join("")}`;
}

export function sessionTextColors(theme: PluginTheme, emphasis: ReturnType<typeof sessionEmphasis>) {
  const c = theme.colors;
  if (emphasis.reason) {
    const status = statusColor(theme, emphasis.reason);
    return {
      title: blend(c.foreground, status, 0.55),
      preview: blend(c.foreground, status, 0.18),
      time: status,
    };
  }
  return {
    title: blend(c.foregroundMuted, c.foreground, emphasis.title),
    preview: blend(c.foregroundMuted, c.foreground, emphasis.preview),
    time: blend(c.foregroundMuted, c.foreground, emphasis.time),
  };
}
