import { useRpc } from "@getpaseo/plugin/client";
import { useQuery } from "@tanstack/react-query";
import { useCreateViewModel } from "../lib/mvvm";
import { ProjectLogoViewModel } from "../view-models/project-logo-view-model";
import { projectIconRpc, type IconProject } from "../../shared/projects/project-icons";

export function useProjectLogo(project: IconProject | undefined, hostId: string) {
  const read = useRpc(projectIconRpc);
  const revision = project?.projectIconRevision ?? project?.projectCustomIconRevision ?? "";
  const query = useQuery({
    queryKey: ["session-inbox", hostId, "project-icon", project?.projectId, revision],
    enabled: !!project,
    queryFn: () => read({ projectId: project!.projectId, revision }),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
    networkMode: "always",
  });
  return useCreateViewModel(ProjectLogoViewModel, { icon: query.data?.icon });
}
