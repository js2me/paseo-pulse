import type { PaseoApi, PaseoAgentConfig, PaseoAgentCreateOptions } from "@getpaseo/client";
import type { Session, SessionEntry } from "../shared/sessions";

export type CreationTarget = { projectKey?: string; cwd?: string };
export class NewSessionError extends Error {
  code: "noProject" | "noAgents" | "noModels" | "sourceMissing";
  constructor(code: NewSessionError["code"]) { super(code); this.code = code; }
}

/** User prompts and new sessions indicate use; background status/metadata updates do not. */
export function latestCreationSource(entries: readonly SessionEntry[], projectKey?: string) {
  const candidates = entries.filter(({ agent }) => !agent.archivedAt && !agent.internal);
  const recent = (items: readonly SessionEntry[]) => [...items].sort((a, b) => {
    const time = (agent: Session) => Math.max(Date.parse(agent.lastUserMessageAt ?? "") || 0,
      Date.parse(agent.createdAt) || 0);
    return time(b.agent) - time(a.agent) || a.agent.id.localeCompare(b.agent.id);
  })[0];
  return (projectKey ? recent(candidates.filter(({ project }) => project.projectKey === projectKey)) : undefined)
    ?? recent(candidates);
}

export async function prepareNewSession(paseo: Pick<PaseoApi, "agents" | "projects" | "config" | "providers">,
  entries: readonly SessionEntry[], target: CreationTarget = {}): Promise<PaseoAgentCreateOptions> {
  const source = latestCreationSource(entries, target.projectKey);
  let cwd = target.cwd ?? source?.agent.cwd;
  if (!cwd) cwd = (await paseo.projects.list()).projects[0]?.projectRootPath;
  if (!cwd) throw new NewSessionError("noProject");
  let config: PaseoAgentConfig;
  if (source) {
    // Refresh the directory snapshot only, without loading history or sending a prompt.
    const refreshed = await paseo.agents.ref(source.agent.id).refresh();
    if (!refreshed) throw new NewSessionError("sourceMissing");
    const agent = refreshed.agent;
    const provider = agent.provider;
    const model = agent.model ?? agent.runtimeInfo?.model ?? await defaultModel(paseo, provider, cwd);
    const modeId = agent.currentModeId ?? agent.runtimeInfo?.modeId;
    const thinkingOptionId = agent.thinkingOptionId ?? agent.runtimeInfo?.thinkingOptionId ?? agent.effectiveThinkingOptionId;
    config = { provider: `${provider}/${model}`,
      ...(modeId != null ? { modeId } : {}),
      ...(thinkingOptionId != null ? { thinkingOptionId } : {}),
      ...(agent.features?.length ? { featureValues: Object.fromEntries(agent.features.map(({ id, value }) => [id, value])) } : {}) };
  } else {
    const [settings, available] = await Promise.all([paseo.config.get(), paseo.providers.listAvailable()]);
    if (available.error) throw new Error(available.error);
    const providers = available.providers.filter(({ available }) => available).map(({ provider }) => provider);
    const profile = settings.config.agentProfiles?.find(({ provider }) => providers.includes(provider));
    const provider = profile?.provider ?? providers[0];
    if (!provider) throw new NewSessionError("noAgents");
    const model = profile?.model ?? await defaultModel(paseo, provider, cwd);
    config = { provider: `${provider}/${model}`,
      ...(profile?.modeId != null ? { modeId: profile.modeId } : {}),
      ...(profile?.thinkingOptionId != null ? { thinkingOptionId: profile.thinkingOptionId } : {}),
      ...(profile?.featureValues ? { featureValues: profile.featureValues } : {}) };
  }
  // No inherited title, prompt, parent, history, environment or workspace identity.
  return { cwd, config };
}

async function defaultModel(paseo: Pick<PaseoApi, "providers">, provider: string, cwd: string) {
  const result = await paseo.providers.listModels(provider, { cwd });
  if (result.error) throw new Error(result.error);
  const models = result.models?.filter(({ isSelectable }) => isSelectable !== false) ?? [];
  const model = models.find(({ isDefault }) => isDefault)?.id ?? models[0]?.id;
  if (!model) throw new NewSessionError("noModels");
  return model;
}

/** One in-flight operation and a stable key when retrying an uncertain create response. */
export function createSessionLauncher(paseo: Parameters<typeof prepareNewSession>[0]) {
  let pending: Promise<string> | undefined;
  let attempt: { fingerprint: string; key: string } | undefined;
  return (entries: readonly SessionEntry[], target: CreationTarget = {}) => {
    if (pending) return pending;
    pending = (async () => {
      const input = await prepareNewSession(paseo, entries, target);
      const fingerprint = JSON.stringify(input);
      if (attempt?.fingerprint !== fingerprint) attempt = { fingerprint,
        key: `pulse-new-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}` };
      const created = await paseo.agents.create({ ...input, idempotencyKey: attempt.key });
      attempt = undefined;
      return created.id;
    })().finally(() => { pending = undefined; });
    return pending;
  };
}
