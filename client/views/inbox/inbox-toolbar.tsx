import { Icon } from "@getpaseo/plugin/client/ui";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { observer } from "../../lib/mvvm";
import { useMessages } from "../../i18n/messages";
import { statusColor } from "../shared/status-color";
import type { InboxViewContext } from "./types";

export const InboxToolbar = observer(function InboxToolbar({ context }: { context: InboxViewContext }) {
  const { props, binding } = context;
  const { model, creation, creationDisabled } = binding;
  const { search, searchOpen, onlyAttention, groupByProject, totalAttention, attentionGroups } = model;
  const { t } = useMessages(),
    c = props.theme.colors;
  const countColor =
    totalAttention && attentionGroups[0]?.attention
      ? statusColor(props.theme, attentionGroups[0].attention)
      : c.foregroundMuted;
  return (
    <View
      style={{
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 8,
        borderBottomWidth: 1,
        borderColor: c.border,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <View
          style={{ flexDirection: "row", gap: 2, borderRadius: 6, backgroundColor: c.surface1, padding: 2 }}
        >
          {[
            { value: true, label: t("attention"), count: totalAttention },
            { value: false, label: t("all"), count: model.totalCount },
          ].map((tab) => (
            <Pressable
              key={tab.label}
              accessibilityRole="tab"
              accessibilityState={{ selected: onlyAttention === tab.value }}
              onPress={() => model.setOnlyAttention(tab.value)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                paddingHorizontal: 9,
                paddingVertical: 6,
                borderRadius: 4,
                backgroundColor: onlyAttention === tab.value ? c.surface2 : c.surface1,
              }}
            >
              <Text
                style={{
                  color: onlyAttention === tab.value ? c.foreground : c.foregroundMuted,
                  fontSize: 13,
                  fontWeight: onlyAttention === tab.value ? "600" : "400",
                }}
              >
                {tab.label}
              </Text>
              <Text
                style={{ color: tab.value ? countColor : c.foregroundMuted, fontSize: 12, fontWeight: "600" }}
              >
                {tab.count}
              </Text>
            </Pressable>
          ))}
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <Text style={{ color: c.foregroundMuted, fontSize: 12 }}>{t("grouping")}:</Text>
          <View
            accessibilityRole="radiogroup"
            accessibilityLabel={t("grouping")}
            style={{ flexDirection: "row", gap: 2, borderRadius: 6, backgroundColor: c.surface1, padding: 2 }}
          >
            {[
              { value: true, label: t("groupByWorkspace") },
              { value: false, label: t("noGrouping") },
            ].map((option) => (
              <Pressable
                key={option.label}
                accessibilityRole="radio"
                aria-checked={groupByProject === option.value}
                accessibilityState={{ checked: groupByProject === option.value }}
                onPress={() => model.setGroupByProject(option.value)}
                style={{
                  paddingHorizontal: 9,
                  paddingVertical: 6,
                  borderRadius: 4,
                  backgroundColor: groupByProject === option.value ? c.surface2 : c.surface1,
                }}
              >
                <Text style={{
                  color: groupByProject === option.value ? c.foreground : c.foregroundMuted,
                  fontSize: 13,
                  fontWeight: groupByProject === option.value ? "600" : "400",
                }}>{option.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        <View style={{ flex: 1 }} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("newSession")}
          hitSlop={6}
          disabled={creationDisabled}
          accessibilityState={{ disabled: creationDisabled, busy: creation.pending === "global" }}
          onPress={() => void creation.create()}
          style={{ padding: 6, opacity: creationDisabled ? 0.5 : 1 }}
        >
          {creation.pending === "global" ? (
            <ActivityIndicator size="small" color={c.foreground} />
          ) : (
            <Icon name="Plus" size={18} color={c.foreground} />
          )}
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={searchOpen ? t("closeSearch") : t("findSession")}
          accessibilityState={{ expanded: searchOpen }}
          hitSlop={6}
          onPress={model.toggleSearch}
          style={{ padding: 6 }}
        >
          <Icon name={searchOpen ? "X" : "Search"} size={16} color={c.foregroundMuted} />
        </Pressable>
      </View>
      {searchOpen && (
        <TextInput
          value={search}
          onChangeText={model.setSearch}
          placeholder={t("searchPlaceholder")}
          autoFocus
          placeholderTextColor={c.foregroundMuted}
          accessibilityLabel={t("searchLabel")}
          autoCapitalize="none"
          style={{
            color: c.foreground,
            backgroundColor: c.surface1,
            borderWidth: 1,
            borderColor: c.border,
            borderRadius: 6,
            paddingHorizontal: 10,
            paddingVertical: 7,
            fontSize: 13,
          }}
        />
      )}
    </View>
  );
});
