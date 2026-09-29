# Bringing `compass-icons` into `compass-design`

Reference for consolidating `mattermost/compass-icons` into this monorepo as `packages/compass-icons`.

## Goal

Move icon source, build pipeline, and publish CI into `compass-design` so Compass work lives in one repo. External consumers keep the same npm package name and import paths — no consumer code changes.

## Current state (after import)

| What | Where |
|------|-------|
| Icon source (`svgs/` — 326 SVG files) | `packages/compass-icons/svgs/` |
| Generated `config.json` | Built from `svgs/` by `generate-data.mjs` (gitignored at package root; published from `build/`) |
| Font + CSS | Committed under `packages/compass-icons/{css,font}/`; copied into `build/` on offline builds. Regenerated via Fontello (`build:with-font`) when icons change |
| Published package | `@mattermost/compass-icons` on npm (still published from the old repo until cutover) |
| Package structure | CJS-only + `exports` map. `main` still points at CSS (historical; no consumer uses the bare import). React is a peer dependency |
| Used in compass-design as | Workspace package (`^0.1.63` range links to `packages/compass-icons`) |
| `.js`-extension workaround | Two copies of `vite-plugin-compass-icons-ext.ts` remain (ESM output is a follow-up) |

## What moved

- `svgs/` — authoritative source of every icon
- `generate-data.mjs`, `utils.mjs`, `tsconfig.json`, package `package.json`
- Committed `css/` and `font/` assets (from the last Fontello build)
- Publish CI — `.github/workflows/publish-compass-icons.yml` in this repo

`config.json`, `components/*.tsx`, and `IconGlyphs.ts` are generated. `config.json` **must** stay in the published tarball (mobile reads it). Font files are committed so everyday CI and docs builds stay offline.

## Package improvements (this migration)

| Issue | Decision |
|-------|----------|
| No `exports` map | Added full CJS `exports` covering every consumer path (see below) |
| `main` → CSS | **Left unchanged.** No audited consumer imports the bare package name |
| React not in `peerDependencies` | Declared `react: "^18.0.0 \|\| ^19.0.0"` |
| CJS-only | **Kept CJS-only** for this migration. ESM is a follow-up; the Vite plugin stays until then |

### Exports map (published from `build/`)

```json
{
  ".": "./css/compass-icons.css",
  "./components": { "types": "./components/index.d.ts", "default": "./components/index.js" },
  "./components/*": { "types": "./components/*.d.ts", "default": "./components/*.js" },
  "./IconGlyphs": { "types": "./IconGlyphs.d.ts", "default": "./IconGlyphs.js" },
  "./IconGlyphs.js": { "types": "./IconGlyphs.d.ts", "default": "./IconGlyphs.js" },
  "./css/*": "./css/*",
  "./font/*": "./font/*",
  "./config.json": "./config.json",
  "./package.json": "./package.json"
}
```

The workspace package.json mirrors these paths under `./build/…` so monorepo consumers resolve the same import strings.

## Build pipeline

| Script | What it does |
|--------|----------------|
| `npm run build:icons` | Offline: generate data → prettier → `tsc` → copy committed `css/` + `font/` into `build/` |
| `npm run build:icons:font` | Full rebuild including Fontello (needs network). Syncs generated fonts back to committed `css/` / `font/` |
| Root `prebuild` | `build:icons` → generate manifests → `build:ui` → `build:proto` |

Fontello remains a known network dependency. Everyday CI uses committed fonts only. The old Fontello demo gh-pages deploy was **not** ported — it would conflict with this repo's docs GitHub Pages deploy.

## Internal wiring

- Root, `compass-ui`, and `compass-proto` keep `@mattermost/compass-icons: ^0.1.63` (npm workspaces link the local package; do **not** use `workspace:*`)
- Peer dependency ranges on published packages stay as semver for external consumers
- `vite-plugin-compass-icons-ext.ts` copies stay until an ESM follow-up

## Publish CI

- `.github/workflows/publish-compass-icons.yml` — triggers on GitHub Release tags named `compass-icons-<version>` (e.g. `compass-icons-0.1.64`)
- Publishes from `packages/compass-icons/build/` with OIDC `--provenance`
- `.github/workflows/compass-packages.yml` builds icons offline and runs `smoke-test:icons` on every push / PR to main
- Before the first release from this repo: repoint the npm Trusted Publisher to this workflow, confirm maintainer access, and bump past the last published version on npm

## Consumer contract

No audited repo imports the bare `@mattermost/compass-icons` package name. Paths in use:

| Path | Consumers |
|------|-----------|
| `components` barrel (named icons + default `glyphMap`) | webapp, playbooks, ai, agents, desktop, boards |
| `components/<name>` | weave, proto-playground, blocks-prototype, compass-ui plugin, webapp |
| `IconGlyphs` | webapp (types) |
| `css/compass-icons.css` | desktop, boards, calls |
| `font/compass-icons.ttf`, `config.json` | mobile build scripts |
| `font-family: 'compass-icons'` | webapp, ai, agents, mobile (requires font CSS loaded) |

Consumers pin versions from `0.1.31` to `0.1.63`. Compatibility must be kept for every path above.

## Acceptance check before cutover

Pack from `build/` (`npm run smoke-test:icons` covers the contract paths) and additionally install the tarball into:

- `mattermost/webapp`
- `mattermost-plugin-playbooks`
- `mattermost-plugin-boards`
- `mattermost-desktop`
- `mattermost-mobile` scripts

Diff the tarball file list and glyph list against published `0.1.63`.

## Cutover

### Remaining manual steps (not done by this PR)

1. Agree version (next free after npm's latest — currently `0.1.63`, so `0.1.64` or later) and freeze date with compass-icons maintainers
2. Freeze the old repo — no new releases
3. Confirm npm owner/maintainer access on `@mattermost/compass-icons`
4. Repoint the npm Trusted Publisher to `compass-design` / `publish-compass-icons.yml` (verify whether only one publisher is allowed — if so, this also blocks the old repo)
5. Bump `packages/compass-icons/package.json` version, merge, tag `compass-icons-<version>`, publish
6. Install the published tarball into webapp, playbooks, boards, desktop, and mobile scripts and run their builds (acceptance check)
7. Update the old repo README ("Maintained in compass-design"), then archive it

Do not dual-publish.

### In-repo acceptance already covered

- `npm run smoke-test:icons` — packs from `build/`, asserts tarball contents and every consumer-contract resolution path
- Glyph list and Unicode codepoints diffed against published `0.1.63` (326 icons, 0 mismatches)
- `compass-ui` / `compass-proto` build and typecheck against the workspace package

## Risks

| Risk | Mitigation |
|------|-----------|
| Fontello unavailable | Committed fonts keep offline builds working; only icon changes and releases need Fontello |
| Font drift | Tarball / glyph diff against published `0.1.63` before cutover |
| `exports` map omits a path | Consumer-contract smoke test; acceptance builds against webapp / plugins / desktop / mobile |
| Old repo publishes after cutover | Archive immediately; Trusted Publisher repoint also blocks the old workflow if npm allows only one publisher |
| Icon PR ownership | Point design/dev at `compass-design` after cutover |

## ESM follow-up (not in this migration)

A second `tsc` pass (`module: ESNext`) plus rewriting the barrel's extensionless imports would unlock removing `vite-plugin-compass-icons-ext.ts`. Defer until after cutover is stable.
