import { Icon } from "@getpaseo/plugin/client/ui";
import { observer } from "../../lib/mvvm";
import { useProjectLogo } from "../../bindings/use-project-logo";
import { Image, Text, View } from "react-native";
import { projectInitialColor, type IconProject } from "../../../shared/projects/project-icons";

/** One cached request per visible project, independent of session activity/history polling. */
export const ProjectLogo = observer(function ProjectLogo({
  project,
  projectKey,
  name,
  hostId,
  color,
}: {
  project?: IconProject;
  projectKey: string;
  name: string;
  hostId: string;
  color: string;
}) {
  const model = useProjectLogo(project, hostId);
  const box = { width: 18, height: 18, flexShrink: 0 };
  if (model.svg)
    return (
      <View style={box}>
        <Icon icon={{ svg: model.svg }} size={18} color={color} />
      </View>
    );
  const uri = model.uri;
  if (uri) return <Image source={{ uri }} style={box} resizeMode="contain" onError={() => model.fail(uri)} />;
  return (
    <View
      style={{
        ...box,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: projectInitialColor(
          project ? JSON.stringify([hostId, project.projectId]) : projectKey,
        ),
      }}
    >
      <Text style={{ color: "#ffffff", fontSize: 11, lineHeight: 14, fontWeight: "600" }}>
        {Array.from(name.trim())[0]?.toLocaleUpperCase() || "?"}
      </Text>
    </View>
  );
});
