import type { PaseoAgentConfig, PaseoAgentProvider } from "@getpaseo/client";
import { usePaseo, type PluginHostProps } from "@getpaseo/plugin/client";
import { Icon, Modal, SettingsCard, SettingsSelect, TextInput } from "@getpaseo/plugin/client/ui";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useMessages } from "./messages";

interface AgentChoice {
  id: string;
  label: string;
  provider: PaseoAgentProvider;
  model?: string;
  modeId?: string;
  thinkingOptionId?: string;
  featureValues?: Record<string, unknown>;
}
type Props = PluginHostProps & {
  initialCwd?: string;
  initialProvider?: string;
  onClose(): void;
  onCreated(agentId: string): void;
};

export function NewSessionDialog({ host, theme, initialCwd, initialProvider, onClose, onCreated }: Props) {
  const paseo = usePaseo();
  const { t } = useMessages();
  const c = theme.colors;
  const [projectId, setProjectId] = useState<string | null>(null);
  const [choiceId, setChoiceId] = useState<string | null>(null);
  const [modelId, setModelId] = useState<string | null>(null);
  const [path, setPath] = useState(initialCwd ?? "");
  const [title, setTitle] = useState("");
  const creating = useRef(false);
  const mounted = useRef(false);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const attempt = useRef<{ fingerprint: string; key: string } | null>(null);
  const choices = useQuery({
    queryKey: ["session-inbox", host.id, "new-session-options"],
    queryFn: async () => {
      const [projects, config, providers] = await Promise.all([
        paseo.projects.list(), paseo.config.get(), paseo.providers.listAvailable(),
      ]);
      if (providers.error) throw new Error(providers.error);
      const available = new Map<string, PaseoAgentProvider>(providers.providers
        .filter(({ available }) => available).map(({ provider }) => [provider, provider]));
      const agents: AgentChoice[] = [];
      for (const profile of config.config.agentProfiles ?? []) {
        const provider = available.get(profile.provider);
        if (!provider) continue;
        agents.push({ id: `profile:${profile.id}`, label: profile.model ? `${profile.name} · ${profile.model}` : profile.name,
          provider, model: profile.model, modeId: profile.modeId, thinkingOptionId: profile.thinkingOptionId,
          featureValues: profile.featureValues });
      }
      for (const provider of available.values()) agents.push({ id: `provider:${provider}`, label: provider, provider });
      // Retain only the launch choices, never the daemon's credentials or other config.
      return { projects: projects.projects.map((project) => ({ id: project.projectId,
        name: project.projectDisplayName, cwd: project.projectRootPath })), agents };
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: 1,
    networkMode: "always",
  });
  const projects = choices.data?.projects ?? [];
  const project = projects.find(({ id }) => id === projectId)
    ?? projects.find(({ cwd }) => cwd === initialCwd)
    ?? [...projects].sort((a, b) => b.cwd.length - a.cwd.length).find(({ cwd }) =>
      initialCwd?.startsWith(`${cwd}/`) || initialCwd?.startsWith(`${cwd}\\`)) ?? projects[0];
  const cwd = (project?.cwd ?? path).trim();
  const agents = choices.data?.agents ?? [];
  const agent = agents.find(({ id }) => id === choiceId)
    ?? agents.find(({ provider }) => provider === initialProvider) ?? agents[0];
  const models = useQuery({
    queryKey: ["session-inbox", host.id, "new-session-models", agent?.provider, cwd],
    enabled: !!agent && !agent.model && !!cwd,
    queryFn: async () => {
      if (!agent) return [];
      const result = await paseo.providers.listModels(agent.provider, { cwd });
      if (result.error) throw new Error(result.error);
      return (result.models ?? []).filter(({ isSelectable }) => isSelectable !== false);
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: 1,
    networkMode: "always",
  });
  const model = agent?.model ?? models.data?.find(({ id }) => id === modelId)?.id
    ?? models.data?.find(({ isDefault }) => isDefault)?.id ?? models.data?.[0]?.id;
  const creation = useMutation({
    networkMode: "always",
    retry: false,
    mutationFn: async (input: { cwd: string; config: PaseoAgentConfig; title?: string }) => {
      const fingerprint = JSON.stringify(input);
      if (attempt.current?.fingerprint !== fingerprint) attempt.current = { fingerprint,
        key: `inbox-new-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}` };
      return paseo.agents.create({ ...input, idempotencyKey: attempt.current.key });
    },
  });
  const submit = async () => {
    if (creating.current || !agent || !model || !cwd || choices.isPending || choices.isError) return;
    creating.current = true;
    try {
      const created = await creation.mutateAsync({ cwd, ...(title.trim() ? { title: title.trim() } : {}),
        config: { provider: `${agent.provider}/${model}`, ...(agent.modeId ? { modeId: agent.modeId } : {}),
          ...(agent.thinkingOptionId ? { thinkingOptionId: agent.thinkingOptionId } : {}),
          ...(agent.featureValues ? { featureValues: agent.featureValues } : {}) } });
      if (mounted.current) onCreated(created.id);
    } catch { /* The mutation displays the error and retains all entered values. */ }
    finally { creating.current = false; }
  };
  const fieldStyle = { color: c.foreground, backgroundColor: c.surface1, borderWidth: 1, borderColor: c.border,
    borderRadius: 6, paddingHorizontal: 10, paddingVertical: 9, fontSize: 13 } as const;
  return <Modal title={t("new.title")} icon={<Icon name="Plus" size={18} color={c.foreground} />} open
    onOpenChange={(open) => { if (!open && !creating.current) onClose(); }}>
    <Modal.Content contentContainerStyle={{ padding: 16, gap: 12 }}>
      {choices.isPending && <ActivityIndicator size="small" color={c.foregroundMuted} />}
      {choices.isError && <View style={{ gap: 8 }}>
        <Text accessibilityRole="alert" style={{ color: c.statusDanger, fontSize: 12 }}>{t("new.choicesError", { error: String(choices.error) })}</Text>
        <Pressable accessibilityRole="button" onPress={() => void choices.refetch()}><Text style={{ color: c.accent }}>{t("retry")}</Text></Pressable>
      </View>}
      {!!choices.data && <>
        <SettingsCard>
          {!!projects.length && <SettingsSelect label={t("new.project")} value={project?.id ?? ""}
            options={projects.map(({ id, name }) => ({ value: id, label: name }))} disabled={creation.isPending}
            onValueChange={(value) => { setProjectId(value); setModelId(null); }} />}
          {!!agents.length && <SettingsSelect label={t("new.profile")} value={agent?.id ?? ""}
            options={agents.map(({ id, label }) => ({ value: id, label }))} disabled={creation.isPending}
            onValueChange={(value) => { setChoiceId(value); setModelId(null); }} />}
          {!!agent && !agent.model && !!models.data?.length && <SettingsSelect label={t("new.model")} value={model ?? ""}
            options={models.data.map(({ id, label }) => ({ value: id, label }))} disabled={creation.isPending}
            onValueChange={setModelId} />}
        </SettingsCard>
        {!projects.length ? <TextInput value={path} onChangeText={setPath} editable={!creation.isPending}
          accessibilityLabel={t("new.folder")} placeholder={t("new.folderPlaceholder")} placeholderTextColor={c.foregroundMuted}
          autoCapitalize="none" autoCorrect={false} style={fieldStyle} />
          : <Text numberOfLines={2} selectable style={{ color: c.foregroundMuted, fontSize: 11 }}>{cwd}</Text>}
        {!agents.length && <Pressable accessibilityRole="button" onPress={() => void choices.refetch()}>
          <Text style={{ color: c.foregroundMuted, fontSize: 12 }}>{t("new.noAgents")}</Text>
        </Pressable>}
        {!!agent && !agent.model && models.isPending && <Text style={{ color: c.foregroundMuted, fontSize: 12 }}>{t("new.loadingModels")}</Text>}
        {!!agent && !agent.model && models.isError && <Pressable accessibilityRole="button" onPress={() => void models.refetch()}>
          <Text style={{ color: c.statusDanger, fontSize: 12 }}>{t("new.modelsError")}</Text>
        </Pressable>}
        {!!agent && !agent.model && models.isSuccess && !models.data.length && <Text style={{ color: c.foregroundMuted, fontSize: 12 }}>
          {t("new.noModels")}
        </Text>}
        <TextInput value={title} onChangeText={setTitle} editable={!creation.isPending}
          accessibilityLabel={t("new.nameLabel")} placeholder={t("new.namePlaceholder")} placeholderTextColor={c.foregroundMuted}
          style={fieldStyle} />
      </>}
      {creation.isError && <Text accessibilityRole="alert" style={{ color: c.statusDanger, fontSize: 12 }}>
        {t("new.creationError", { error: String(creation.error) })}
      </Text>}
      <Pressable accessibilityRole="button" accessibilityLabel={t("new.createLabel")}
        disabled={!agent || !model || !cwd || choices.isPending || choices.isError || creation.isPending}
        accessibilityState={{ disabled: !agent || !model || !cwd || choices.isPending || choices.isError || creation.isPending,
          busy: creation.isPending }} onPress={() => void submit()}
        style={{ alignItems: "center", paddingVertical: 10, paddingHorizontal: 14, borderRadius: 6,
          backgroundColor: c.accent, opacity: !agent || !model || !cwd || choices.isPending || choices.isError || creation.isPending ? 0.4 : 1 }}>
        {creation.isPending ? <ActivityIndicator size="small" color={c.accentForeground} />
          : <Text style={{ color: c.accentForeground, fontSize: 13, fontWeight: "600" }}>{t("new.submit")}</Text>}
      </Pressable>
    </Modal.Content>
  </Modal>;
}
