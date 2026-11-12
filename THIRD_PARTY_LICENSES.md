# Third-party notices

Original Paseo Pulse code is MIT-licensed. The following incorporated code retains its original license.

## Paseo project icon discovery

`server/projects/project-icon-discovery.ts` is adapted from Paseo's
`packages/server/src/utils/project-icon.ts`:
https://github.com/getpaseo/paseo

Copyright (c) 2025-present Mohamed Boudra.

Licensed under the Apache License, Version 2.0. The full upstream notice and
license are included in [server/PASEO-LICENSE](server/PASEO-LICENSE).
Changes include bounded image reads, safe SVG handling and ICO frame selection
for the cross-platform session list.

## Lucide screenshot icons

The isolated listing-media harness renders Lucide icons. The icon artwork in
`assets/desktop.png` and `assets/mobile.png` uses Lucide 0.468.0. Production
plugin icons are supplied by Paseo's public UI kit; the Lucide package itself
is a development dependency and is not shipped in the npm archive.

ISC License

Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

## Bundled MVVM libraries

The runtime in `client/generated/mvvm.js` contains MobX 6.16.1,
MobX React Lite 4.1.1, mobx-view-model 11.0.1, mobx-view-model-react 11.0.1,
and the used parts of yummies 7.20.1. Their complete MIT notices are included
in [client/generated/LICENSES.txt](client/generated/LICENSES.txt).
The adjacent source map embeds the sources used to create the bundle.
`scripts/build-runtime.mjs` reproduces it from the committed development lock.
React and its renderer are supplied by Paseo and are not bundled.
