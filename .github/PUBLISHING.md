# Release preparation

The package is `paseo-pulse`; the intended public repository is
https://github.com/js2me/paseo-pulse. The stable Paseo runtime ID remains
`paseo-session-inbox` so existing settings and view history continue to work.

## Validate

Use Node.js 24+:

```sh
npm ci --ignore-scripts
npm run release:check
```

Paseo supplies React, React Native, React Query and the SDK at runtime. MobX 6,
`mobx-view-model`, `mobx-view-model-react` and `mobx-react-lite` are bundled into
`client/generated/mvvm.js`, with a source map and license notices. All package
inputs are development dependencies pinned by the committed lock. There are
no installed production dependencies, lifecycle scripts or manifest preparation
commands, so no npm shrinkwrap is required.

`release:check` first regenerates this shared runtime with `build:runtime`.
Commit the generated files with their sources. CI verifies they are in sync.
The runtime exports the real library hooks and observer; it uses Paseo’s React
instance. Its batching adapter relies on React 19 automatic batching, and its
external-store adapter uses React’s built-in hook. Neither adapter imports React
DOM, a second React copy or a platform renderer. The build checks its external
imports. Ordinary plugin installation uses the committed bundle directly.

To refresh the sample-data screenshots and icon, with Chrome installed:

```sh
PASEO_CHROME_BINARY=/usr/bin/google-chrome npm run test:media
```

Review the generated images before releasing. The generator uses a temporary
browser profile and mock host data; it does not connect to the live daemon.

## Pack and publish

```sh
mkdir -p artifacts
npm pack --ignore-scripts --pack-destination artifacts
```

Inspect the archive and package file list. It should contain both entries,
client/server/shared modules, locale resources, listing images, overviews and
license notices. Tests, developer fixtures, node_modules and private host data
must not be included.

Create/push the public GitHub repository before submitting it for review.
After the version and artifact are final and npm authentication is configured:

```sh
npm publish artifacts/paseo-pulse-0.13.4.tgz --access public
```

Test an exact published version on a separate daemon before submitting it:

```sh
paseo plugin add npm:paseo-pulse@0.13.4 --host <test-daemon>
paseo plugin ls --host <test-daemon>
```

Use [REGISTRY_SUBMISSION.md](REGISTRY_SUBMISSION.md) for the registry form.
Do not advertise a catalog install command until a listing has been approved.
