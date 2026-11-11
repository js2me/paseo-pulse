import { registerHooks } from "node:module";
import { existsSync } from "node:fs";
import { extname } from "node:path";
import { fileURLToPath } from "node:url";
const projectRootUrl = new URL('../', import.meta.url).href;

// Use the real SDK translation runtime without loading app/native UI in Node.
const translations = new URL("../node_modules/@getpaseo/plugin/dist/client/translations.js", import.meta.url);
export const { PluginTranslationRuntime } = await import(translations.href);
export async function importClientModule(path) {
  const resolver = registerHooks({ resolve(specifier, context, next) {
    if (specifier === "@getpaseo/plugin/client") return next(translations.href, context);
    if (specifier.startsWith(".") && !extname(specifier) && context.parentURL?.startsWith(projectRootUrl)) {
      const url = new URL(`${specifier}.ts`, context.parentURL);
      if (existsSync(fileURLToPath(url))) return next(url.href, context);
    }
    return next(specifier, context);
  } });
  try { return await import(new URL(path, import.meta.url).href); }
  finally { resolver.deregister(); }
}
