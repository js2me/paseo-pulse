import { build } from "esbuild";
import { generateDtsBundle } from "dts-bundle-generator";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
const root = fileURLToPath(new URL("../", import.meta.url));
const result = await build({
  absWorkingDir: root,
  entryPoints: ["scripts/mvvm-runtime.ts"],
  outfile: "client/generated/mvvm.js",
  bundle: true,
  platform: "browser",
  format: "esm",
  target: "es2020",
  sourcemap: "linked",
  external: ["react", "react/jsx-runtime"],
  alias: {
    "react-dom": join(root, "scripts/react-batching.ts"),
    "use-sync-external-store/shim": join(root, "scripts/react-external-store.ts"),
  },
  define: { "process.env.NODE_ENV": '"production"' },
  legalComments: "eof",
  metafile: true,
});
const animations = await build({
  absWorkingDir: root,
  entryPoints: ["scripts/text-animation-runtime.ts"],
  loader: { ".js": "jsx" },
  outfile: "client/generated/text-animation.js",
  bundle: true,
  platform: "browser",
  format: "esm",
  target: "es2020",
  sourcemap: "linked",
  external: ["react", "react/jsx-runtime", "react-native"],
  define: { "process.env.NODE_ENV": '"production"' },
  legalComments: "eof",
  metafile: true,
});
const output = result.metafile.outputs["client/generated/mvvm.js"];
for (const item of [...output.imports, ...animations.metafile.outputs["client/generated/text-animation.js"].imports]) {
  if (!["react", "react/jsx-runtime", "react-native"].includes(item.path) || item.kind !== "import-statement")
    throw new Error(`Unexpected runtime import: ${JSON.stringify(item)}`);
}
const packages = new Set(
  Object.entries({ ...output.inputs, ...animations.metafile.outputs["client/generated/text-animation.js"].inputs })
    .filter(([, info]) => info.bytesInOutput > 0)
    .map(([path]) => path.match(/node_modules\/((?:@[^/]+\/)?[^/]+)/)?.[1])
    .filter(Boolean),
);
const licenses = ["Bundled client runtime licenses. React and its renderer are supplied by Paseo."];
for (const name of [...packages].sort()) {
  const directory = join(root, "node_modules", name);
  const { version } = JSON.parse(await readFile(join(directory, "package.json"), "utf8"));
  let license;
  for (const file of ["LICENSE", "LICENSE.md", "LICENSE.txt", "license", "license.txt"]) {
    try {
      license = await readFile(join(directory, file), "utf8");
      break;
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  if (!license) throw new Error(`Missing license: ${name}`);
  licenses.push(`\n## ${name}@${version}\n\n${license}`);
}
await writeFile(join(root, "client/generated/LICENSES.txt"), licenses.join("\n"));
const [types] = generateDtsBundle([{
  filePath: join(root, "scripts/mvvm-runtime.ts"),
  libraries: {
    inlinedLibraries: ["mobx", "mobx-view-model", "mobx-view-model-react", "mobx-react-lite", "yummies"],
    importedLibraries: ["react"],
    allowedTypesLibraries: [],
  },
  output: { noBanner: true },
}], { preferredConfigPath: join(root, "tsconfig.json") });
// Declarations are inspected by Paseo even though runtime imports were bundled.
for (const match of types.matchAll(/(?:from\s*|import\s*\()(["'])([^"']+)\1/g)) {
  if (match[2] !== "react") throw new Error(`Unexpected declaration import: ${match[2]}`);
}
await writeFile(join(root, "client/generated/mvvm.d.ts"), types.replace(/[\t ]+$/gm, ""));

const [animationTypes] = generateDtsBundle([{
  filePath: join(root, "scripts/text-animation-runtime.ts"),
  libraries: {
    inlinedLibraries: ["react-native-animatable"],
    importedLibraries: ["react", "react-native"],
    allowedTypesLibraries: [],
  },
  output: { noBanner: true },
}], { preferredConfigPath: join(root, "tsconfig.json") });
for (const match of animationTypes.matchAll(/(?:from\s*|import\s*\()(["'])([^"']+)\1/g)) {
  if (!["react", "react-native"].includes(match[2])) throw new Error(`Unexpected animation declaration import: ${match[2]}`);
}
await writeFile(join(root, "client/generated/text-animation.d.ts"), animationTypes.replace(/[\t ]+$/gm, ""));
