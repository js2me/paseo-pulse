import type { PluginTheme } from "@getpaseo/plugin";
import type { Attention } from "../../../shared/sessions/sessions";

export function statusColor(theme: PluginTheme, reason: Attention): string {
  const c = theme.colors;
  if (reason === "running") {
    // Paseo has no info color token. Keep running blue regardless of the accent.
    const hex = c.surface0.replace(/^#/, "");
    const full = hex.length === 3 ? [...hex].map((digit) => digit + digit).join("") : hex;
    const [r, g, b] = [0, 2, 4].map((offset) => parseInt(full.slice(offset, offset + 2), 16));
    return 0.299 * r + 0.587 * g + 0.114 * b < 128 ? "#60a5fa" : "#2563eb";
  }
  return reason === "permission"
    ? c.statusWarning
    : reason === "error"
      ? c.statusDanger
      : reason === "finished"
        ? c.statusSuccess
        : c.foregroundMuted;
}
