# Compass icons

Workspace package `@mattermost/compass-icons`. Follow this when adding icons or changing the icon build.

## Source of truth

- **`svgs/`** — one SVG per icon (`{name}_{CODEPOINT}.svg`). This is the only hand-edited icon source.
- Generated and gitignored: `components/`, `IconGlyphs.ts`, `config.json`.
- Committed build inputs: `css/`, `font/` (last Fontello output). Everyday builds copy these into `build/` and do not call Fontello.

## Commands

| Command | When to use |
|---------|-------------|
| `npm run build:icons` (repo root) | Offline build — data generation, `tsc`, copy committed fonts |
| `npm run build:icons:font` | After adding/changing SVGs — runs Fontello (network), then syncs `css/` + `font/` for commit |

Do not put Fontello on the default `prebuild` path.

## Publishing

- Output that ships is under `packages/compass-icons/build/` (including generated `package.json` with the `exports` map).
- Release tag format: `compass-icons-<version>` (see `.github/workflows/publish-compass-icons.yml`).
- Keep `config.json` and `font/*` in the published tarball — mobile depends on them.
- Leave `main` as `css/compass-icons.css`. No consumer imports the bare package name.
- CJS only for now. Do not remove `vite-plugin-compass-icons-ext.ts` from compass-ui / compass-proto until an ESM follow-up lands.

## Consumer import paths (do not break)

`./components`, `./components/*`, `./IconGlyphs`, `./css/*`, `./font/*`, `./config.json`.

See [docs/compass-icons-integration.md](../../docs/compass-icons-integration.md).
