# @mattermost/compass-ui

Compass design system UI components for Mattermost products.

## Install

```bash
npm install @mattermost/compass-ui
```

Peer dependencies: `react`, `react-dom`, `@mattermost/compass-icons`, and `simplebar-react` (npm 7+ installs peers automatically).

## Usage

Import global styles once at your app entry:

```tsx
import '@mattermost/compass-ui/styles';
```

Component CSS ships with each component import — no separate `component-styles` entry.

Standalone hosts (Storybook, playground) also need theme presets and document chrome:

```tsx
import '@mattermost/compass-ui/styles/standalone';
```

Do not load `/styles/standalone` into Mattermost webapp (it already owns themes, reset, and document styles).

Set a theme on `<html>` (standalone hosts):

```html
<html data-theme="denim"></html>
```

Import components from **subpaths** (one module graph per import — required for Jest and recommended for webpack):

```tsx
import { Button } from '@mattermost/compass-ui/components/button';
```

The root barrel (`@mattermost/compass-ui`) remains for backwards compatibility but loads the full package.

## Plugins and multiple copies

The Mattermost webapp ships one copy of compass-ui and every plugin bundles its own, often at different versions, all on the same page. The package is built so that works:

- **Bundle your own copy and import `@mattermost/compass-ui/styles`.** Every token is declared in a `compass-ui.*` cascade layer, so the stylesheet is safe to load more than once: unlayered host values with the same name (for example the webapp's `--radius-full: 50%` or `--elevation-*`) always win regardless of load order, and compass-only tokens such as `--spacing-xs` still resolve.
- **Never import `@mattermost/compass-ui/styles/standalone` inside a host** such as the Mattermost webapp. Its theme presets override the user's theme.
- **Keep your version close to the host's.** Versions up to `0.1.0-alpha.12` declare tokens unlayered; while one of those loads after the host's stylesheet, it can still override host values. Upgrading removes that.
- **Tokens are additive-only.** Older copies stay on the page with newer ones, so a released token's name and value never change; new values get new tokens. The build snapshots every token (`tokens.snapshot.json`) and fails on removals or value changes. Use `--radius-pill` for pills; `--radius-full` is deprecated because the webapp defines it as `50%`.
- **Don't wrap compass component CSS in cascade layers.** Hosts ship unlayered element rules (Bootstrap `button`, `input`) that would beat layered component styles. Only the token and vendor (SimpleBar) stylesheets are layered.

Layer order, lowest priority first: `compass-ui.base`, `compass-ui.vendor`, `compass-ui.webapp-compat`, `compass-ui.tokens`, `compass-ui.themes`. The rationale lives in `src/styles/layers.scss`.

## Development

From the monorepo root:

```bash
npm run build:ui      # build the library
npm run storybook     # component catalog on :6006
```

## Package layout

- `dist/components/<name>/index.js` / `.cjs` — per-component subpaths (`@mattermost/compass-ui/components/<name>`)
- `dist/hooks/<name>.js` / `.cjs` — hooks (`@mattermost/compass-ui/hooks/<name>`)
- `dist/illustrations/<name>.js` / `.cjs` — brand SVG artwork (`@mattermost/compass-ui/illustrations/<name>`)
- `dist/index.js` / `dist/index.cjs` — legacy root barrel (ESM + CJS)
- `dist/compass-ui.css` — tokens and webapp-compat defaults, all in cascade layers (`./styles`)
- `dist/compass-ui-standalone.css` — theme presets + CSS reset + `body` / heading chrome for standalone hosts, all in cascade layers (`./styles/standalone`)
- `dist/components/<name>/*.css` — per-component CSS modules (side-effect imported with the component)

## Storybook

Storybook is the source of truth for component variants. Specimens in the docs site are thin wrappers for guideline prose.

```bash
npm run storybook --workspace=@mattermost/compass-ui
```

### Authoring stories

- Mirror the guidelines sidebar hierarchy in story `title`s: `Components/{section}/{name}` and `Foundations/Style/{name}` for foundation specimens. Keep `src/storybook/titles.ts` aligned with `src/manifests/sections.ts`; use matching string literals in `meta.title`.
- Foundation stories in `src/foundations/style/` import named `*Content` exports from guideline specimens, use `tags: ['autodocs']` with inline `meta.title`, and rely on the shared `FoundationLayout` decorator in `.storybook/preview.tsx`. Prose guidelines stay on the docs site.
- Keep story-only labels, headings, and wrapper backgrounds theme-aware. Use `var(--center-channel-color)` for text labels and `var(--center-channel-bg)` for preview surfaces.
- Use `var(--sidebar-header-bg)` for inverted story surfaces, and `var(--sidebar-text)` for labels inside those surfaces.
- Use `rgba(var(--center-channel-color-rgb), <alpha>)` only when a secondary text or border treatment intentionally needs opacity.
- Avoid neutral-only text tokens such as `--color-neutral-*` or `--color-text-secondary` in stories unless the component API specifically demonstrates a neutral palette token.
- Native `h1`-`h6` elements and story body text inherit Compass fonts via `@mattermost/compass-ui/styles/standalone` (loaded in `.storybook/preview.tsx`). Do not hardcode font families in stories.
- Storybook Docs tab chrome and Docs controls are themed in `.storybook/docs-theme.css`; keep Docs-specific overrides there so they follow the selected Compass theme.

## Integration and releases

- [INTEGRATION.md](./INTEGRATION.md) — Vite + webapp consumer setup, **release → CI publish** flow
- [CHANGELOG.md](./CHANGELOG.md) — release history

Validate a publishable tarball from the monorepo root:

```bash
npm run smoke-test:ui
```
