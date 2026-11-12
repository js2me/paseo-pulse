import { build } from "esbuild";
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
const output = result.metafile.outputs["client/generated/mvvm.js"];
for (const item of output.imports) {
  if (!["react", "react/jsx-runtime"].includes(item.path) || item.kind !== "import-statement")
    throw new Error(`Unexpected runtime import: ${JSON.stringify(item)}`);
}
const packages = new Set(
  Object.entries(output.inputs)
    .filter(([, info]) => info.bytesInOutput > 0)
    .map(([path]) => path.match(/node_modules\/((?:@[^/]+\/)?[^/]+)/)?.[1])
    .filter(Boolean),
);
const licenses = ["Bundled MVVM runtime licenses. React and its renderer are supplied by Paseo."];
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
const types = await readFile(join(root, "scripts/mvvm-runtime.ts"), "utf8");
await writeFile(join(root, "client/generated/mvvm.d.ts"), types);
