import { usePaseo } from "@getpaseo/plugin/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const EMPTY_PROJECTS: Awaited<ReturnType<ReturnType<typeof usePaseo>["projects"]["list"]>>["projects"] = [];

export function useIconProjects(hostId: string) {
  const paseo = usePaseo();
  const queryClient = useQueryClient();
  const queryKey = ["session-inbox", hostId, "icon-projects"];
  const query = useQuery({
    queryKey,
    queryFn: async () => (await paseo.projects.list()).projects,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
    networkMode: "always",
  });
  useEffect(
    () =>
      paseo.projects.subscribe(() => {
        void queryClient.invalidateQueries({ queryKey: ["session-inbox", hostId, "icon-projects"] });
      }),
    [paseo, queryClient, hostId],
  );
  return query.data ?? EMPTY_PROJECTS;
}
