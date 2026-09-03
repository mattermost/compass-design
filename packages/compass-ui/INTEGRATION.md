# Integrating `@mattermost/compass-ui`

Guide for consuming the Compass UI library in Vite apps (docs, prototypes catalog) and the Mattermost webapp (`webapp/channels`).

Mobile shells, `ChannelShell`, Call* composites, `ParticipantsPanel`, `RecordingPill`, demo RHS panels (`RightSidebarThread`, `RightSidebarChannelInfo`), and sidebar fixture helpers (`buildDefaultChannelsSidebarModel`, `defaultAdminConsoleSidebarGroups`) live in unpublished **`@mattermost/compass-proto`** (workspace package). Import those from `@mattermost/compass-proto`, not from `@mattermost/compass-ui`. Webapp product code should depend on `compass-ui` only.

## Install

### Published (target — after `@mattermost` npm org access)

```bash
npm install @mattermost/compass-ui @mattermost/compass-icons simplebar-react
```

Use the `alpha` dist-tag until stable:

```bash
npm install @mattermost/compass-ui@alpha
```

### Before npm publish

**Workspace (monorepo):**

```json
{
  "dependencies": {
    "@mattermost/compass-ui": "workspace:*"
  }
}
```

**Packed tarball (smoke test / local validation):**

```bash
npm run build --workspace=@mattermost/compass-ui
npm pack --workspace=@mattermost/compass-ui
npm install /path/to/mattermost-compass-ui-0.1.0-alpha.0.tgz
```

**File path (sibling repo):**

```json
"@mattermost/compass-ui": "file:../mattermost-compass-ui"
```

Run the automated smoke test from the playground repo root:

```bash
npm run smoke-test:ui
```

---

## Required setup (all consumers)

### 1. Import styles once at app entry

```tsx
// main.tsx or app entry
import '@mattermost/compass-ui/styles';
import '@mattermost/compass-ui/component-styles';
```

| Export | Contents |
|--------|----------|
| `@mattermost/compass-ui/styles` | CSS variables (tokens) + webapp-compat defaults |
| `@mattermost/compass-ui/styles/standalone` | Theme presets (`data-theme`), CSS reset, and document `body` / heading chrome for Storybook and other **standalone** hosts only |
| `@mattermost/compass-ui/component-styles` | Component CSS modules, SimpleBar base CSS |

Components assume CSS variables are present — they do not import tokens directly.

**Mattermost webapp:** import `/styles` and `/component-styles` only. Do **not** import `/styles/standalone` — webapp already owns themes, reset, and document styles.

**Standalone hosts** (playground, Storybook, local demos): also import `/styles/standalone` after `/styles`.

### 2. Set a theme

Standalone hosts (with `/styles/standalone`):

```html
<html data-theme="denim">
```

Supported presets: `denim`, `sapphire`, `quartz`, `indigo`, `onyx`. Toggle via `document.documentElement.setAttribute('data-theme', theme)` or your theme context.

**Mattermost webapp** applies its own theme CSS variables — do not rely on Compass theme presets. Published components fall back to palette tokens (e.g. `var(--calls-bg, var(--color-indigo-600))`) when a host role is missing.

### 3. Load fonts (recommended)

Compass typography expects Metropolis (headings) and Open Sans (body):

```bash
npm install @fontsource/metropolis @fontsource/open-sans
```

```tsx
import '@fontsource/metropolis/400.css';
import '@fontsource/metropolis/600.css';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/600.css';
```

Fonts are not bundled in the library — consumers load them (same pattern as the playground).

### 4. Import components (subpaths)

Import from **per-component subpaths** so bundlers and Jest load only the module graph you need (same pattern as `@mattermost/shared`):

```tsx
import { Button } from '@mattermost/compass-ui/components/button';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { Illustration } from '@mattermost/compass-ui/components/illustration';
import SearchIllustration from '@mattermost/compass-ui/illustrations/search';
import { useExitAnimation } from '@mattermost/compass-ui/hooks/use-exit-animation';
```

| Import style | When to use |
|--------------|-------------|
| `@mattermost/compass-ui/components/<kebab-name>` | **Default** — components, types, and style sub-exports from that component |
| `@mattermost/compass-ui/illustrations/<kebab-name>` | Brand SVG artwork as React components (`search`, `groups`, …) |
| `@mattermost/compass-ui/hooks/<kebab-name>` | Shared hooks |
| `@mattermost/compass-ui/utils/string` | `toKebab` and string helpers |
| `@mattermost/compass-ui` (root barrel) | Legacy only — loads the full package; avoid in Jest |

PascalCase component folders map to kebab-case subpaths: `AdminConsoleSidebar` → `components/admin-console-sidebar`.

Style sub-exports live on the owning component subpath:

```tsx
import { btnStyles } from '@mattermost/compass-ui/components/button';
import { messageStyles } from '@mattermost/compass-ui/components/message';
```

For playground, prototypes, and docs that install the unpublished workspace package, also:

```tsx
import { ChannelShell } from '@mattermost/compass-proto';
```

Webapp product code should use `@mattermost/compass-ui` only.

---

## Peer dependencies

| Package | Required | Notes |
|---------|----------|-------|
| `react` | Yes | `^18.2.0` for webapp parity; `^19.0.0` works in Vite consumers |
| `react-dom` | Yes | Same range as React |
| `@mattermost/compass-icons` | Yes | Icon glyphs for `Icon`, `IconButton`, etc. |
| `simplebar-react` | Yes* | Required for `Scrollbars`; listed optional in peer meta but needed if you use scroll regions |

Ensure a single React version in the app — no duplicate React trees when linking locally.

---

## Vite consumer (docs, prototypes catalog)

Minimal `main.tsx`:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from '@mattermost/compass-ui/components/button';
import '@mattermost/compass-ui/styles';
import '@mattermost/compass-ui/styles/standalone';
import '@mattermost/compass-ui/component-styles';
import './app.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Button emphasis="primary">Hello</Button>
  </StrictMode>,
);
```

**Monorepo dev:** run `npm run build:ui` (or `predev`) before `npm run dev` when consuming the built `dist/` from the workspace package.

**Do not** alias `@mattermost/compass-ui` to package source in the consumer Vite config — the monolith `@/` alias conflicts with internal package imports. Consume `dist/` via workspace or tarball.

---

## Mattermost webapp (`webapp/channels`)

### Local fast iteration (before npm publish)

Use a **testing branch** only — `file:` must not land in a mergeable PR. Switch to `@mattermost/compass-ui@alpha` after publish.

**Terminal 1 — package watch** (rebuilds `packages/compass-ui/dist/` on save):

```bash
cd compass-design
npm install
npm run dev --workspace=@mattermost/compass-ui
```

**Terminal 2 — wire into webapp** in `webapp/channels/package.json` (adjust relative path):

```json
"@mattermost/compass-ui": "file:../../../compass-design/packages/compass-ui"
```

From the webapp monorepo root (`mattermost/webapp`):

```bash
npm install
npm run dev-server
```

**App entry** (`channels/src/entry.tsx`) — import styles once next to other global CSS:

```tsx
import '@mattermost/compass-ui/styles';
import '@mattermost/compass-ui/component-styles';
// Do not import /styles/standalone — webapp owns themes, reset, and document styles
```

Use components as usual:

```tsx
import AccountMultipleOutlineIcon from '@mattermost/compass-icons/components/account-multiple-outline';
import { Select } from '@mattermost/compass-ui/components/select';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { Button } from '@mattermost/compass-ui/components/button';

<Select
  label="Team"
  leadingIcon={<Icon glyph={<AccountMultipleOutlineIcon />} size="16" />}
  options={[
    { value: 'a', label: 'Alpha' },
    { value: 'b', label: 'Bravo' },
  ]}
  onChange={(value) => { /* … */ }}
/>
```

Webapp already applies theme CSS variables; Compass components reuse the same role names (`--center-channel-bg`, `--button-bg`, etc.). Do not import `/styles/standalone` to supply Compass theme presets.

#### Duplicate React (required for `file:` links)

`file:` symlinks the package directory. Webpack can resolve `react` from the linked tree and create a second React copy → Invalid Hook Call or hooks that silently no-op.

1. In the playground, confirm React is not nested under the package:

```bash
ls packages/compass-ui/node_modules/react 2>/dev/null
# should be empty (workspace hoisting)
```

2. In `webapp/channels/webpack.config.js`, alias to the webapp’s React (same pattern as `styled-components`):

```js
resolve: {
  alias: {
    react: path.resolve(__dirname, '..', 'node_modules', 'react'),
    'react-dom': path.resolve(__dirname, '..', 'node_modules', 'react-dom'),
  },
}
```

3. Exclude the linked package from babel (the `file:` realpath sits outside `node_modules`):

```js
const STANDARD_EXCLUDE = [
  /node_modules/,
  /compass-design[\\/]packages[\\/]compass-ui/,
];
```

`compass-ui`’s dist ESM appends `.js` on icon imports and unwraps CJS `default` exports (`mod?.default ?? mod`) so webpack 5 does not treat icon components as `{ default: fn }` objects.

#### HMR

Vite rebuilds `dist/` on save; webpack ignores most of `node_modules` for watching, so expect a **manual browser refresh**. If that becomes painful, exclude the linked package from webpack `snapshot.managedPaths`.

#### Smoke panel (optional)

On the local testing branch, a floating smoke panel is **shown by default** (ported to `document.body`).

Hide:

```js
localStorage.setItem('compass_ui_smoke', '0');
location.reload();
```

Show again:

```js
localStorage.removeItem('compass_ui_smoke');
location.reload();
```

Remove the smoke component before any mergeable PR.

### Published install (mergeable PRs)

After `@mattermost` npm org publish, use the `alpha` tag until stable:

```json
"@mattermost/compass-ui": "0.1.0-alpha.3"
```

```bash
npm install @mattermost/compass-ui@alpha
```

### Import pattern

```tsx
import { Button } from '@mattermost/compass-ui/components/button';
import '@mattermost/compass-ui/styles';
import '@mattermost/compass-ui/component-styles';
// Do not import /styles/standalone — webapp owns themes, reset, and document styles
```

Load `/styles` once at the app bootstrap (same entry that loads global webapp SCSS).

### Jest (unit tests)

Use **subpath imports** in product code (e.g. `confirm_modal.tsx`):

```tsx
import { Button } from '@mattermost/compass-ui/components/button';
```

Do **not** import from the root barrel in tests — Jest `require('@mattermost/compass-ui')` loads the full CJS bundle and evaluates every component, which triggers spurious React warnings and slows suites.

Add a `moduleNameMapper` entry in `webapp/channels/jest.config.js` (adjust paths if your layout differs):

```js
moduleNameMapper: {
  // …existing mappers…
  '^@mattermost/compass-ui/hooks/(.*)$':
    '<rootDir>/node_modules/@mattermost/compass-ui/dist/hooks/$1.cjs',
  '^@mattermost/compass-ui/illustrations/(.*)$':
    '<rootDir>/node_modules/@mattermost/compass-ui/dist/illustrations/$1.cjs',
  '^@mattermost/compass-ui/utils/string$':
    '<rootDir>/node_modules/@mattermost/compass-ui/dist/utils/string.cjs',
  '^@mattermost/compass-ui/(.*)$':
    '<rootDir>/node_modules/@mattermost/compass-ui/dist/$1/index.cjs',
},
```

Order matters: list the `hooks/`, `illustrations/`, and `utils/string` patterns **before** the generic `/(.*)$` rule so those resolve to `dist/<folder>/<name>.cjs` (no `/index` suffix).

**Symptoms fixed by subpaths + mapper (alpha.3+):**

| Symptom | Cause |
|---------|--------|
| `React.jsx: type is invalid -- got: object` on icon props | CJS default export interop — fixed in dist chunks |
| Warnings referencing `AdminConsoleSidebar`, `PopoverNotice`, etc. while testing unrelated files | Root barrel loads all components |

**Webapp migration (separate PR in `mattermost/mattermost`):**

1. Bump to `@mattermost/compass-ui@0.1.0-alpha.3` (or `@alpha` after publish).
2. Add Jest `moduleNameMapper` entries above.
3. Migrate imports leaf-first — start with `confirm_modal.tsx` and other early adopters.
4. Avoid mocking the entire package unless you need to stub behavior; subpaths remove the need for global mocks.

### Proto playground (`mattermost-proto-playground`)

The prototypes catalog is a **separate repo** that consumes published `@mattermost/compass-ui` from npm plus `file:../compass-design/packages/compass-proto`.

After `0.1.0-alpha.3` is published:

1. Bump `package.json`: `"@mattermost/compass-ui": "0.1.0-alpha.3"` (or `@alpha`).
2. From a sibling `compass-design` clone, run the import codemod against the playground tree:

```bash
cd compass-design
COMPASS_UI_CONSUMER_ROOT=../mattermost-proto-playground node scripts/migrate-compass-ui-imports.mjs
```

3. Update agent docs (`AGENTS.md`, `src/pages/prototypes/AGENTS.md`) to mandate subpath imports.
4. Extend `scripts/ensure-compass-packages.mjs` to assert `dist/components/button/index.js` exists (subpath layout).
5. `npm install && npm run build` — verify prototype flows compile.

Import convention matches webapp and docs: `@mattermost/compass-ui/components/<kebab-name>` only; do not use the root barrel.

### Webpack checklist

- [ ] ESM + CJS: package ships both (`module` / `main` fields).
- [ ] CSS: `@mattermost/compass-ui/styles` and `/component-styles` resolve without extra loaders beyond existing CSS pipeline.
- [ ] CSS modules: hashed class names from `component-styles` match rendered components.
- [ ] No duplicate React — webpack aliases when using `file:`; one version across workspaces.
- [ ] `@mattermost/compass-icons` already external in webapp; keep as peer, do not bundle twice. Dist ESM imports use `.js` extensions for webpack fullySpecified.
- [ ] `simplebar-react` installed if using `Scrollbars` or layout specimens that include scroll regions.
- [ ] Source maps enabled for debugging (`dist/*.map` shipped).

### Migration strategy

**Leaf-first** — do not big-bang replace `@mattermost/compass-components`.

1. Add `@mattermost/compass-ui` alongside legacy package.
2. New code uses compass-ui **subpath imports** (`components/button`, not the root barrel).
3. Replace compass-components usages file-by-file (Button, Text equivalents, etc.).
4. Storybook is the variant reference — link from internal docs.

### Button and shared package prop mapping

`@mattermost/shared` `Button` and Compass `Button` share emphasis names (`primary`, `secondary`, `tertiary`, `quaternary`) but **size literals differ**. Map at the adapter boundary when migrating call sites — do not pass shared sizes directly to Compass.

| `@mattermost/shared` | Compass UI `Button` / `IconButton` |
|----------------------|-------------------------------------|
| `xs` | `x-small` |
| `sm` | `small` |
| `md` | `medium` |
| `lg` | `large` |

Example adapter:

```tsx
const SHARED_TO_COMPASS_SIZE = {
  xs: 'x-small',
  sm: 'small',
  md: 'medium',
  lg: 'large',
} as const;

<Button
  emphasis={sharedEmphasis}
  size={SHARED_TO_COMPASS_SIZE[sharedSize]}
/>
```

Other intentional differences during migration:

- **Destructive:** shared uses a `destructive` boolean; Compass uses `emphasis="primary"` + `destructive` or danger tokens on other components — match the Compass API per component docs.
- **Toggle controls:** Compass `ActionButton` and `IconButton` expose `aria-pressed` only when the toggle prop is set (`active` / `toggled`). Omit the prop for plain actions.
- **Switch vs Toggle:** Compass `Switch` is `role="switch"`; webapp `toggle.tsx` is an `aria-pressed` button — not interchangeable without host behavior changes.

### Theme alignment

Mattermost webapp already sets theme CSS variables (`--center-channel-bg`, `--button-bg`, `--error-text`, `--online-indicator`, etc.) and fixed semantic RGB (`--semantic-color-info|success|warning|danger`). Compass theme presets (including `--calls-bg` and `--focus-ring-color`) ship only in `/styles/standalone` for Storybook/playground — not in the webapp `/styles` entry.

Compass uses the **same semantic names** as webapp:

- **`webapp-compat.scss` `@layer`**: standalone defaults for `--semantic-color-*` (mapped to Compass palette RGB), `--neutral-*`, and `--focus-ring-color` / `--focus-ring-color-rgb` (aliases of `--button-bg` / `--button-bg-rgb`). Host unlayered values always win when embedded.
- **`tokens.scss`**: `--color-info|success|warning|danger` wrap `rgb(var(--semantic-color-*))` for authoring.
- **Components**: error / destructive UI uses `var(--error-text, var(--color-danger))`. Presence uses `--online-indicator` / `--away-indicator` / `--dnd-indicator`. Calls surfaces use `var(--calls-bg, var(--color-indigo-600))` until the host defines `--calls-bg`. Toasts / global banners use `--color-*` (fixed semantics).

Confirm host vars match Compass theme role names before wide rollout. Spike with `Button` destructive / `SectionNotice` danger / `Toast` first.

### Overlays

`Modal`, `Tooltip`, `PopoverMenu`, `ProfilePopover`, and similar surfaces are **visual chrome only**. The webapp owns open/close, portals, positioning, focus trap, escape/outside-click, and stacking. Compose Compass panels with existing product overlay infrastructure; panel-level ARIA on the surface is fine. Follow each component's lifecycle (`Modal` mount-controlled; `Dropdown` and similar triggers use controlled `isOpen`; pass `onClose` where provided).

Form widgets with menu/popover surfaces (`Combobox`, `Select`, `DateRangePicker`, etc.) are exempt — they manage widget-level dropdown/picker open state, keyboard behavior, and may **portal + position** their own menus (above/below flip, escape overflow clipping). Optional `portalContainer` / `zIndex` props override the default (`document.body` / high stacking). When using a custom `portalContainer`, it must establish a positioning context (`position` other than `static`); menu coords are converted into that container’s space (viewport `fixed` is used only for `document.body`). Do not duplicate that handling in the host, and do not use those widgets' portal behavior as a pattern for chrome overlays. Proto/mobile presentation shells with backdrop or sheet animation live in `@mattermost/compass-proto`, not in published `compass-ui`.

---

## Patterns, layouts, and fixtures

Compass layers are Foundations → Components → Patterns → Layouts. Patterns such as `ThreadListItem` (from **`@mattermost/compass-ui`**) do **not** ship demo avatar images — pass fixtures from your app.

**Playground / prototypes / docs only:** layouts such as `ChannelShell`, demo sidebar trees, and RHS specimen panels live in unpublished **`@mattermost/compass-proto`**. Use that package only where you can install the workspace dependency. Mattermost webapp product code should import from **`@mattermost/compass-ui` only** (compose patterns and sidebars yourself; do not depend on `compass-proto`).

```tsx
// Workspace consumers (playground, prototypes, docs) — not webapp product code
import type { ChannelsSidebarModel } from '@mattermost/compass-ui/components/channels-sidebar';
import {
  ChannelShell,
  buildDefaultChannelsSidebarModel,
  RightSidebarThread,
} from '@mattermost/compass-proto';

const model = buildDefaultChannelsSidebarModel({
  showUnreadsCategory: false,
  avatarAikoTan: aikoSrc,
  avatarArjunPatel: arjunSrc,
  // ...
});

<ChannelShell channelsSidebarModel={model} userAvatarSrc={leonardSrc} />
```

See `src/fixtures/rightSidebarThreadDemo.tsx` in the playground for a docs-side example.

---

## Package contents (what npm ships)

Only `dist/` is published (`files: ["dist"]`):

```
dist/index.js / index.cjs     # legacy root barrel (re-exports all symbols)
dist/index.d.ts
dist/index.css                # component-styles
dist/compass-ui.css           # styles (tokens + webapp-compat)
dist/compass-ui-standalone.css
dist/components/<name>/       # per-component ESM + CJS + .d.ts (subpath imports)
dist/hooks/                   # hook modules
dist/illustrations/            # brand SVG artwork as React components
dist/utils/string.*           # string helpers
```

Storybook, `src/`, and `*.stories.tsx` are **not** in the tarball.

---

## Versioning and releases

| Channel | Version example | npm tag |
|---------|-----------------|---------|
| Alpha | `0.1.0-alpha.0` | `alpha` |
| Beta | `0.1.0-beta.0` | `beta` |
| Stable | `0.1.0` | `latest` |

Git tag format (same as [`compass-icons`](https://github.com/mattermost/compass-icons)): plain semver, e.g. `0.1.0-alpha.2`. GitHub Release title: `v0.1.0-alpha.2`. Mark pre-release versions as **pre-release** on GitHub for alpha/beta.

### Release flow (automated)

1. **Bump** `packages/compass-ui/package.json` + move CHANGELOG `[Unreleased]` notes into the new version section. Update `compass-proto`’s `@mattermost/compass-ui` peer if it pins an exact version.
2. **Merge** that PR to `main`.
3. **Publish a GitHub Release** from `main` at that commit:
   - Tag: `0.1.0-alpha.2` (must match `package.json` exactly; optional `v` prefix is stripped)
   - Title: `v0.1.0-alpha.2`
   - Check **Set as a pre-release** for alpha/beta
   - Publish the release (not a draft) so CHANGELOG compare links resolve
4. **CI** (`.github/workflows/publish-compass-ui.yml`) runs on `release: published`: typecheck, build, then `npm publish --access public --tag <alpha|beta|latest> --workspace=@mattermost/compass-ui`. Dist-tag is derived from the version string. Already-published versions are skipped.

Do **not** publish from your laptop for routine releases. Manual publish is only a fallback if CI/auth is down:

```bash
npm run build --workspace=@mattermost/compass-ui
npm publish --access=public --tag alpha --workspace=@mattermost/compass-ui
```

### npm trusted publishing (one-time setup)

Publishing uses npm [OIDC trusted publishing](https://docs.npmjs.com/trusted-publishers) (no long-lived `NPM_TOKEN` in GitHub secrets), same pattern as compass-icons.

1. On npmjs.com → `@mattermost/compass-ui` → **Trusted Publisher**
2. Link this GitHub repo and workflow file: `publish-compass-ui.yml`
3. Allow publish (and provenance if offered)

Until trusted publishing is configured, the Release → CI job will fail at `npm publish`; configure the publisher before cutting the next release.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `Failed to resolve @mattermost/compass-ui/styles` | Run `npm run build:ui` — `dist/compass-ui.css` must exist |
| Unstyled components (flat gray UI) | Import both `/styles` and `/component-styles` at app entry |
| Scrollbars missing thumb/track | Ensure `simplebar-react` is installed; `component-styles` includes SimpleBar CSS |
| `@/components/Icon` errors in dev | Do not alias package to source; use built `dist/` |
| Wrong colors | Webapp: ensure host theme vars are set. Standalone: import `/styles/standalone` and set `data-theme` on `<html>` |
| Release publish fails at npm | Configure Trusted Publisher for `publish-compass-ui.yml` on the npm package settings page. Do not set `registry-url` / `NODE_AUTH_TOKEN` on the publish job — empty token auth blocks OIDC and surfaces as E404. |
| Release tag ≠ package version | Tag must match `packages/compass-ui/package.json` (e.g. `0.1.0-alpha.3`) |
| Jest `type is invalid -- got: object` on icons | Upgrade to `0.1.0-alpha.3+`; use subpath imports + Jest mapper (see above) |
| Jest warnings from unrelated compass-ui components | Stop importing from root barrel; use `@mattermost/compass-ui/components/<name>` |
| Workspace link missing | Run `npm install` from repo root, not inside `packages/compass-ui` |

---

## Related docs

- [README.md](./README.md) — quick start
- [CHANGELOG.md](./CHANGELOG.md) — release history
- [Storybook](./README.md#storybook) — component variant catalog (`npm run storybook`)
- [Compass repo split](../../docs/COMPASS-REPO-SPLIT.md) — two-repo architecture and phase plan
