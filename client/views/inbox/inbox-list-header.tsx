import { Icon } from "@getpaseo/plugin/client/ui";
import { Pressable, Text, View } from "react-native";
import { observer } from "../../lib/mvvm";
import { directoryError, useMessages } from "../../i18n/messages";
import type { InboxViewContext } from "./types";

export const InboxListHeader = observer(function InboxListHeader({ context }: { context: InboxViewContext }) {
  const { props, binding } = context;
  const { model, loading, error, retry, creation, verifying, ackReady, ackError } = binding;
  const { groups, search, onlyAttention } = model;
  const { t } = useMessages(),
    c = props.theme.colors;
  return (
    <>
      {!groups.length && (loading || verifying || (!ackReady && !ackError)) && (
        <Text style={{ color: c.foregroundMuted, fontSize: 13 }}>{t("loading")}</Text>
      )}
      {creation.error && (
        <Text accessibilityRole="alert" style={{ color: c.statusDanger, fontSize: 12 }}>
          {creation.error}
        </Text>
      )}
      {ackError && (
        <Text accessibilityRole="alert" style={{ color: c.statusDanger, fontSize: 12 }}>
          {ackError}
        </Text>
      )}
      {error && (
        <View style={{ gap: 6 }}>
          <Text style={{ color: c.statusDanger, fontSize: 12 }}>
            {t("listError", { error: directoryError(error, t) })}
          </Text>
          <Pressable accessibilityRole="button" onPress={retry}>
            <Text style={{ color: c.accent }}>{t("retry")}</Text>
          </Pressable>
        </View>
      )}
      {!loading && !verifying && ackReady && !error && !groups.length && (
        <View style={{ paddingVertical: 24, alignItems: "center", gap: 8 }}>
          <Icon
            name={search ? "Search" : "CircleCheck"}
            size={22}
            color={search ? c.foregroundMuted : c.statusSuccess}
          />
          <Text style={{ color: c.foreground, fontSize: 14 }}>
            {search ? t("nothingFound") : onlyAttention ? t("nothingNeedsAttention") : t("noSessions")}
          </Text>
          {!search && onlyAttention && (
            <Pressable accessibilityRole="button" onPress={() => model.setOnlyAttention(false)}>
              <Text style={{ color: c.foregroundMuted, fontSize: 12 }}>{t("viewAll")}</Text>
            </Pressable>
          )}
        </View>
      )}
    </>
  );
});
