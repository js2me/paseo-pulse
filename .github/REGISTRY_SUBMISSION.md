# Paseo plugin registry submission

After publishing the repository or npm release, submit with the
[official form](https://github.com/getpaseo/plugins/issues/new?template=submit-plugin.yml).
The form supplies the label that starts review.

- **Title:** Paseo Pulse
- **Source:** https://github.com/js2me/paseo-pulse
- **npm alternative:** paseo-pulse@0.13.5
- **Revision:** the exact public commit to review (`git rev-parse HEAD`).
- **Categories:** Workspaces, Utils.
- **Suggested listing slug:** pulse.

Suggested description:

> Paseo Pulse adds a project-grouped session attention inbox. It shows running agents,
> permission requests, unread errors and replies, conversations active within four hours,
> and sessions opened frequently from the plugin. Read sessions are muted. A click opens
> the native Paseo session; project + buttons create new sessions. The sidebar badge
> follows the same attention rules. English, Russian, French and Traditional Chinese
> follow the app language. Transcript previews are read locally, and no agents are
> started just to display the list. There are no extra production dependencies,
> preparation scripts or external services.

Listing media:

- https://raw.githubusercontent.com/js2me/paseo-pulse/main/assets/desktop.png
- https://raw.githubusercontent.com/js2me/paseo-pulse/main/assets/mobile.png
- https://raw.githubusercontent.com/js2me/paseo-pulse/main/assets/icon.png

`OVERVIEW.md` owns the English listing. Russian, French and Traditional Chinese
translations ship beside it. Screenshots render the actual plugin components
with sample data in an isolated web harness. The mobile image is a compact web
viewport, not a claim of physical-device testing.

The stable runtime ID is `paseo-session-inbox`, preserving existing settings and
data. The npm package and repository use the public name `paseo-pulse`.

A registry ID is assigned only after approval; it is not available yet.
