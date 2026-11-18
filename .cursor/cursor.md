# Cursor Cloud Agent Instructions

These instructions apply only to Cursor Cloud Agents. `.cursor/scripts/cloud-agent-start.sh` copies this file to `.cursor/AGENTS.md` (gitignored) at boot. The repo-root `AGENTS.md` and area `AGENTS.md` files still apply.

## Environment

- Image: `.cursor/Dockerfile` (Ubuntu 24.04, Node 24.11.1, npm 11, `gh`). No Docker, databases, or Playwright — none are needed.
- `cloud-agent-install.sh` runs `npm ci` (skipped when `package-lock.json` and Node are unchanged) and builds `packages/compass-ui/dist` and `packages/compass-proto/dist` via `node scripts/ensure-compass-ui.mjs`.
- Skip / force flags (set as Cloud Agent environment variables): `CLOUD_AGENT_SKIP_NPM_CI=1`, `CLOUD_AGENT_FORCE_NPM_CI=1`, `CLOUD_AGENT_SKIP_PACKAGE_BUILD=1`.
- Dev servers are not started at boot. Start the one the task needs.

## Running components

| Surface   | Command             | URL                   | Shows                                                                             |
| --------- | ------------------- | --------------------- | --------------------------------------------------------------------------------- |
| Docs app  | `npm run dev`       | http://localhost:5173 | Guidelines and specimens for compass-ui **and** compass-proto (patterns, layouts) |
| Storybook | `npm run storybook` | http://localhost:6006 | Published compass-ui components only, with Controls and autodocs                  |
| Both      | `npm run dev:all`   | both                  | Docs app links to Storybook via `VITE_STORYBOOK_URL`                              |

- Docs routes: `/<category>/<slug>` (Guidelines tab) and `/<category>/<slug>/specimen`, e.g. `/components/button/specimen`. Slugs live in `src/manifests/topics.ts`.
- The docs app consumes `packages/*/dist`, not `src`. `npm run dev` runs `vite build --watch` for both packages; after a source edit, wait for `built in …` in the output — the page full-reloads itself.
- Storybook reads compass-ui `src` directly (HMR, no dist needed). Use it when changing a `.stories.tsx` file or checking a compass-ui component's props in isolation. It is not required for proto, docs prose, or layout work.
- Run dev servers in the background (e.g. `nohup npm run dev > /tmp/dev.log 2>&1 &`) and poll with `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/` before opening a browser.

## Verifying changes

Same steps as `.github/workflows/compass-packages.yml`:

```bash
npm run check                                            # eslint + stylelint + prettier
npm run typecheck --workspace=@mattermost/compass-ui
npm test --workspace=@mattermost/compass-ui              # vitest + happy-dom, no browser
npm run build --workspace=@mattermost/compass-ui         # also verifies the token snapshot
npm run build --workspace=@mattermost/compass-proto
npm run smoke-test:packages                              # pack + install into a scratch Vite app
npm run build                                            # docs app (tsc -b + vite build)
```

For visual checks, use the `computerUse` subagent's Chrome desktop against the localhost URLs above, and screenshot the specimen or story you changed.

## Troubleshooting

| Symptom                                                                                           | Fix                                                                                                                                                                                                                                                                                          |
| ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `storybook dev` exits with `spawn xdg-open ENOENT`                                                | The image is missing `xdg-utils` (rebuild from `.cursor/Dockerfile`). Workaround: `npm run storybook --workspace=@mattermost/compass-ui -- --no-open`. `npm run storybook -- --no-open` from the root does **not** forward the flag, and `BROWSER=none` makes Storybook try to spawn `none`. |
| `[compass] Timed out waiting for dist/`, or the docs app can't resolve `@mattermost/compass-ui`   | `node scripts/ensure-compass-ui.mjs` (or `npm run build:ui && npm run build:proto`), then restart `npm run dev`.                                                                                                                                                                             |
| `Pre-transform error: Failed to resolve import "./X.module.css"` right after `npm run dev` starts | Transient: the watch build is rewriting `dist/`. It clears once `built in …` prints; reload the page if needed. Persistent errors mean the package build actually failed — scroll up for the Vite error.                                                                                     |
| `Workspace link missing. Run npm install`                                                         | `npm ci` from the repo root (or `CLOUD_AGENT_FORCE_NPM_CI=1` on the next boot).                                                                                                                                                                                                              |
| Build fails on the token snapshot (`verify-compass-ui-dist`)                                      | Tokens are additive-only. Restore the removed/revalued token; only run `npm run tokens:snapshot` when the change is intentional and called out in the PR.                                                                                                                                    |
| Import works on macOS but fails here                                                              | Linux is case-sensitive. Fix the import path casing — CI (ubuntu) fails the same way.                                                                                                                                                                                                        |
| `ENOSPC: System limit for number of file watchers reached`                                        | `sudo sysctl -p /etc/sysctl.d/60-compass-inotify.conf`, then restart the dev server.                                                                                                                                                                                                         |
| Port 5173 or 6006 already in use                                                                  | `lsof -i :5173` / `lsof -i :6006` and kill the old process. Vite silently moves to the next port; Storybook prompts and can hang without a TTY.                                                                                                                                              |
| Storybook warns that `@storybook/addon-*` 8.6.14 is incompatible with 8.6.18                      | Harmless patch-version skew; ignore.                                                                                                                                                                                                                                                         |
