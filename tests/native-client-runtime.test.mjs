import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { build } from 'esbuild';

const require = createRequire(import.meta.url);

test('prebundled runtimes preserve native host constructors through Paseo Hermes interop', async () => {
  const result = await build({
    stdin: { contents: `
      import { Component } from 'react';
      import { ViewModelBase } from './client/generated/mvvm.js';
      import { AnimatableText } from './client/generated/text-animation.js';
      export default function runtime() { return { Component, ViewModelBase, AnimatableText }; }
    `, resolveDir: fileURLToPath(new URL('../', import.meta.url)) },
    bundle: true,
    format: 'cjs',
    platform: 'neutral',
    mainFields: ['module', 'main'],
    target: 'es2020',
    supported: { 'async-await': false },
    external: ['react', 'react/jsx-runtime', 'react-native'],
    write: false,
  });
  // Match the installed Paseo compiler's literal Hermes workaround. Dependency
  // bindings must not rename its loop key and leave host imports as lazy getters.
  const prepared = result.outputFiles[0].text.replaceAll('get: () => from[key]', 'value: from[key]');
  // Model Hermes eval's final loop binding, which differs from browser execution.
  const native = prepared.replace(/for \(let (\w+) of/g, 'for (var $1 of');
  const module = { exports: {} };
  runInNewContext(native, {
    module, exports: module.exports,
    require: name => require(name === 'react-native' ? 'react-native-web' : name),
    console, setTimeout, clearTimeout, AbortController, structuredClone,
  });
  const React = require('react');
  const runtime = module.exports.default();
  assert.equal(runtime.Component, React.Component);
  assert.equal(Object.getPrototypeOf(runtime.AnimatableText.prototype), React.Component.prototype);
  const model = new runtime.ViewModelBase({ id: 'native-smoke', payload: {} });
  assert.equal(model.unmountSignal.aborted, false);
  model.mount();
  model.unmount();
  assert.equal(model.unmountSignal.aborted, true);
});
