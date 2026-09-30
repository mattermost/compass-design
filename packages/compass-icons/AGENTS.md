# Compass icons

Workspace package `@mattermost/compass-icons`. Follow this when adding icons or changing the icon build.

## Source of truth

- **`svgs/`** — one SVG per icon (`{name}_{CODEPOINT}.svg`). This is the only hand-edited icon source. Keep each file on the README SVG template (UTF-8 XML decl, 24×24 `svg`, single compound `path`).
- Generated and gitignored: `components/`, `IconGlyphs.ts`, `config.json`, `build/`.
- Fonts/CSS are **not** committed. Fontello writes them into `build/` on release (and when you run `build:icons:font`).

## Commands

| Command | When to use |
|---------|-------------|
| `npm run build:icons` (repo root) | Offline — data generation + `tsc` (React components / glyphs only). Used by docs/CI `prebuild`. |
| `npm run build:icons:font` | After adding/changing SVGs, and for publish — runs Fontello (network) into `build/css` + `build/font` |

Do not put Fontello on the default `prebuild` path.

## Publishing

- Output that ships is under `packages/compass-icons/build/` (including generated `package.json` with the `exports` map).
- Release tag format: `compass-icons@<version>` (UI: `compass-ui@<version>`). See `.github/workflows/publish-compass-icons.yml`.
- Keep `config.json` and `font/*` in the published tarball — mobile depends on them.
- Leave `main` as `css/compass-icons.css`. No consumer uses the bare package name.
- CJS only for now. Do not remove `vite-plugin-compass-icons-ext.ts` from compass-ui / compass-proto until an ESM follow-up lands.

## Consumer import paths (do not break)

`./components`, `./components/*`, `./components/*.js` (compass-ui dist), `./IconGlyphs`, `./IconGlyphs.js`, `./css/*`, `./font/*`, `./config.json`.

Keep both `./components/*.js` and `./components/*` in the exports map — the `.js` form is required by published compass-ui (webpack fullySpecified rewrite).

See [docs/compass-icons-integration.md](../../docs/compass-icons-integration.md).
