import { usePaseo, useRpc } from "@getpaseo/plugin/client";
import { Icon } from "@getpaseo/plugin/client/ui";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { projectIconRpc, projectInitialColor, type IconProject } from "../shared/project-icons";

export function useIconProjects(hostId: string) {
  const paseo = usePaseo();
  const queryClient = useQueryClient();
  const queryKey = ["session-inbox", hostId, "icon-projects"];
  const query = useQuery({ queryKey, queryFn: async () => (await paseo.projects.list()).projects,
    staleTime: 60_000, refetchOnWindowFocus: false, retry: 1, networkMode: "always" });
  useEffect(() => paseo.projects.subscribe(() => {
    void queryClient.invalidateQueries({ queryKey: ["session-inbox", hostId, "icon-projects"] });
  }), [paseo, queryClient, hostId]);
  return query.data ?? [];
}

/** One cached request per visible project, independent of session activity/history polling. */
export function ProjectLogo({ project, projectKey, name, hostId, color }: {
  project?: IconProject; projectKey: string; name: string; hostId: string; color: string;
}) {
  const read = useRpc(projectIconRpc);
  const revision = project?.projectIconRevision ?? project?.projectCustomIconRevision ?? "";
  const query = useQuery({
    queryKey: ["session-inbox", hostId, "project-icon", project?.projectId, revision],
    enabled: !!project,
    queryFn: () => read({ projectId: project!.projectId, revision }),
    staleTime: 60_000, refetchOnWindowFocus: false, retry: 1, networkMode: "always",
  });
  const icon = query.data?.icon;
  const [failedUri, setFailedUri] = useState<string | null>(null);
  const box = { width: 18, height: 18, flexShrink: 0 };
  if (icon?.svg) return <View style={box}><Icon icon={{ svg: icon.svg }} size={18} color={color} /></View>;
  if (icon?.uri && icon.uri !== failedUri) return <Image source={{ uri: icon.uri }} style={box}
    resizeMode="contain" onError={() => setFailedUri(icon.uri)} />;
  return <View style={{ ...box, borderRadius: 5, alignItems: "center", justifyContent: "center",
    backgroundColor: projectInitialColor(project ? JSON.stringify([hostId, project.projectId]) : projectKey) }}>
    <Text style={{ color: "#ffffff", fontSize: 11, lineHeight: 14, fontWeight: "600" }}>
      {Array.from(name.trim())[0]?.toLocaleUpperCase() || "?"}
    </Text>
  </View>;
}
