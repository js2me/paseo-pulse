import { test } from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { extname } from 'node:path';
import { fileURLToPath } from 'node:url';
const projectRootUrl = new URL('../', import.meta.url).href;

const resolver = registerHooks({ resolve(specifier, context, next) {
  if (specifier.startsWith('.') && !extname(specifier) && context.parentURL?.startsWith(projectRootUrl)) {
    const path = new URL(`${specifier}.ts`, context.parentURL);
    if (existsSync(fileURLToPath(path))) return next(path.href, context);
  }
  return next(specifier, context);
} });
const { default: contribute } = await import('../index.server.ts');
resolver.deregister();

test('list-only backend registers preview/icon reads and acknowledgements without chat RPCs or sending hooks', async () => {
  const settings = [], handlers = [];
  const cleanup = contribute({
    registerSettings(definition) { settings.push(definition.id); },
    handle(contract) { handlers.push(contract.name); },
    on() { throw new Error('The session list must not run message queue or other agent lifecycle hooks'); },
    before() { throw new Error('The session list must not transform agent execution'); },
  });
  assert.deepEqual(settings, ['acknowledgements']);
  assert.deepEqual(handlers.sort(), ['project-icon.read', 'session-index.read', 'session-visits.list', 'session-visits.record']);
  await cleanup();
});
