# Bringing `compass-icons` into `compass-design`

Reference doc for the planned consolidation of `mattermost/compass-icons` into this monorepo.

## Goal

Move icon source, build pipeline, and publish CI into `compass-design` so that all Compass work lives in one repo. External consumers (`@mattermost/compass-icons` importers in the webapp, mobile app, etc.) require zero code changes — the npm package name and all import paths stay identical.

## Current state

| What | Where |
|------|-------|
| Icon source (`config.json` — IcoMoon project) | `mattermost/compass-icons` repo |
| Published package | `@mattermost/compass-icons` on npm |
| Package structure | CJS-only, no `exports` map, `main` → CSS (incorrect), React not in `peerDependencies` |
| Used in compass-design as | `dependencies` (root/docs), `peerDependencies` + `devDependencies` (compass-ui, compass-proto) |
| `.js`-extension workaround | Two identical copies of `vite-plugin-compass-icons-ext.ts` in compass-ui and compass-proto |

## What moves

- `config.json` (IcoMoon project — authoritative source of all 326 icon SVG paths + Unicode code points)
- Any build scripts from the compass-icons repo (to be audited in Phase 0)
- Publish CI (new workflow in this repo)

Font files and generated component files are build artifacts — they are produced from `config.json` and committed as dist output in the workspace package.

## Planned package improvements (during migration)

| Issue | Fix |
|-------|-----|
| CJS-only | Add ESM output (`components/<name>.mjs`, barrel `index.mjs`) |
| No `exports` map | Add full exports map (`.`, `./components/*`, `./IconGlyphs`, `./css/*`) |
| `main` → CSS | Fix `main` → `./components/index.js` |
| React not in `peerDependencies` | Declare `react: "^18.0.0 \|\| ^19.0.0"` |

Adding ESM + exports map removes the need for the `.js`-extension / CJS-default-unwrap Vite plugin in compass-ui and compass-proto — the two copies of `vite-plugin-compass-icons-ext.ts` can be removed or reduced.

## Phases

### Phase 0 — Audit compass-icons source repo (prerequisite)

Explore `github.com/mattermost/compass-icons` before writing any code:

- What generates `components/*.js` from `config.json`? (IcoMoon CLI, custom Node script, or something else?)
- How are font files (woff/woff2/eot/ttf) generated?
- Does a publish workflow already exist there, and what triggers it?
- Are there source files beyond `config.json` (raw SVGs, templates)?

The font generation step is the biggest unknown — it may require a specific CLI or service that needs to be replicated or substituted.

### Phase 1 — Create `packages/compass-icons` workspace

Add the workspace package to this monorepo. Key `package.json` shape:

```json
{
  "name": "@mattermost/compass-icons",
  "version": "0.1.64",
  "main": "./components/index.js",
  "module": "./components/index.mjs",
  "types": "./components/index.d.ts",
  "exports": {
    ".": { "types": "...", "import": "...", "require": "..." },
    "./components/*": { "types": "...", "import": "...", "require": "..." },
    "./IconGlyphs": { "types": "...", "import": "...", "require": "..." },
    "./css/*": "./css/*"
  },
  "files": ["components", "css", "font", "IconGlyphs.js", "IconGlyphs.mjs", "IconGlyphs.d.ts"],
  "peerDependencies": { "react": "^18.0.0 || ^19.0.0" }
}
```

`config.json` and build scripts are in the package source but excluded from the published tarball via `files`.

### Phase 2 — Build pipeline

Add a build script that reads `config.json` and generates all component files (CJS + ESM + `.d.ts`), the glyph barrel, font files, and CSS. Wire into the monorepo:

- `build:icons` script in root `package.json`
- Prepend to the `prebuild` chain: `build:icons` → `build:ui` → `build:proto`

### Phase 3 — Update internal wiring

- Change `devDependencies` in compass-ui, compass-proto, and root from `"^0.1.63"` to `"workspace:*"`
- Keep semver range in `peerDependencies` entries (consumers still resolve from npm)
- Evaluate and remove `vite-plugin-compass-icons-ext.ts` from both compass-ui and compass-proto once ESM output is confirmed working against webpack 5

### Phase 4 — Publish CI

Add `.github/workflows/publish-compass-icons.yml` mirroring `publish-compass-ui.yml`:

- Triggers on GitHub Release published
- Asserts release tag matches `packages/compass-icons/package.json` version
- Publishes with `--workspace=@mattermost/compass-icons --provenance`
- Uses npm OIDC trusted publishing (no long-lived token)
- Set up Trusted Publisher for `@mattermost/compass-icons` on npmjs.com pointing to this workflow before the first release

### Phase 5 — Cutover

1. Agree on cutover version with compass-icons repo maintainers (e.g. `0.1.64`)
2. Freeze old repo — no new releases after agreed cutover point
3. Publish first release from compass-design
4. Update old repo README: "Maintained in compass-design"
5. Archive old repo to prevent accidental publishes

Do not run a dual-publish period — it creates version confusion.

## Consumer impact

| Consumer | Change required |
|----------|----------------|
| Mattermost webapp | None |
| Mobile app | None |
| Proto playground | None |
| compass-design (internal) | `workspace:*` dev link; no source changes |

## Key risks

| Risk | Mitigation |
|------|-----------|
| Font generation tooling unknown | Must resolve in Phase 0 before writing build scripts |
| Vite plugin removal breaks webpack 5 | Test against webapp webpack config before removing; keep as no-op if needed |
| Old repo publishes after cutover | Coordinate explicitly; archive immediately after cutover |
| ESM output causes unexpected resolution in strict consumers | New exports are additive; CJS path unchanged; smoke-test against webpack consumer |
