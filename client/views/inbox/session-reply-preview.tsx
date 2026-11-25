import type { PluginTheme } from "@getpaseo/plugin";
import { memo } from "react";
import { AnimatedText } from "../shared/animated-text";
import { useMessages } from "../../i18n/messages";

interface Props {
  theme: PluginTheme;
  text?: string | null;
  limited?: boolean;
  loading?: boolean;
  error?: boolean;
  color?: string;
  lines?: number;
  opacity?: number;
}
/** A row only renders its batch result; mounting or scrolling never reads history. */
export const SessionReplyPreview = memo(function SessionReplyPreview({
  theme,
  text,
  limited,
  loading,
  error,
  color,
  lines = 1,
  opacity = 1,
}: Props) {
  const { t } = useMessages();
  const preview =
    text ||
    (loading
      ? t("preview.loading")
      : error
        ? t("preview.error")
        : limited
          ? t("preview.limited")
          : t("preview.empty"));
  return (
    <AnimatedText
      numberOfLines={lines}
      style={{ color: color ?? theme.colors.foregroundMuted, opacity, fontSize: 11, lineHeight: 16 }}
      text={preview}
    />
  );
});
