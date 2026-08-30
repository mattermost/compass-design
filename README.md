# mattermost/compass-design

Mattermost Compass design system monorepo: published `@mattermost/compass-ui`, unpublished `@mattermost/compass-proto`, guidelines site, and Storybook.

Prototype flows live in [`mattermost-proto-playground`](https://github.com/mattermost/mattermost-proto-playground).

## Packages

| Package | Published | Role |
| ------- | --------- | ---- |
| `@mattermost/compass-ui` | Yes (`alpha`) | Foundations, primitives, props-driven web chrome |
| `@mattermost/compass-proto` | No | Mobile*, `ChannelShell`, Call* composites, demo fixtures |

See [docs/COMPASS-REPO-SPLIT.md](./docs/COMPASS-REPO-SPLIT.md) for the full split plan and phase status.

## Setup

Requires Node.js 24.x and npm 11.x (see `.nvmrc`).

```bash
npm install
npm run dev
```

Open the URL shown in the terminal for the guidelines site.

## Common commands

```bash
npm run dev              # docs app + package watch
npm run build            # production docs build
npm run storybook        # component catalog (compass-ui)
npm run build:ui         # build @mattermost/compass-ui dist
npm run build:proto      # build @mattermost/compass-proto dist
npm run smoke-test:packages
```

## Consumers

- **Vite / docs:** workspace packages (this repo)
- **Proto playground:** [`mattermost-proto-playground`](https://github.com/mattermost/mattermost-proto-playground) — npm `@mattermost/compass-ui@alpha` (subpath imports; `0.1.0-alpha.3+`) + `file:` for `@mattermost/compass-proto`
- **Mattermost webapp:** `file:` or `@mattermost/compass-ui@alpha` — see [`packages/compass-ui/INTEGRATION.md`](./packages/compass-ui/INTEGRATION.md)
- **Proto package:** workspace or `npm pack` only; not for webapp product code

## Docs hosting

GitHub Pages deploys from `main` via `.github/workflows/deploy.yml` (canonical Compass docs site).
