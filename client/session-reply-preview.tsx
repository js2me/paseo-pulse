import type { PluginTheme } from "@getpaseo/plugin";
import { memo } from "react";
import { Text } from "react-native";
import { useMessages } from "./messages";

interface Props {
  theme: PluginTheme;
  text?: string | null;
  limited?: boolean;
  loading?: boolean;
  error?: boolean;
  color?: string;
  opacity?: number;
}
/** A row only renders its batch result; mounting or scrolling never reads history. */
export const SessionReplyPreview = memo(function SessionReplyPreview({ theme, text, limited, loading, error, color, opacity = 1 }: Props) {
  const { t } = useMessages();
  const preview = text || (loading ? t("preview.loading") : error ? t("preview.error")
    : limited ? t("preview.limited") : t("preview.empty"));
  return <Text numberOfLines={1} style={{ color: color ?? theme.colors.foregroundMuted, opacity, fontSize: 11, lineHeight: 16 }}>{preview}</Text>;
});
