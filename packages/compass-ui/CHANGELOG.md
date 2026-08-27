# Changelog

All notable changes to `@mattermost/compass-ui` are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/). Versioning follows [Semantic Versioning](https://semver.org/) while on `0.x` (API may change between minors).

## [Unreleased]

### Changed

- **BREAKING:** Theme presets (`themes.scss`, including `--calls-bg`) move from `@mattermost/compass-ui/styles` to `/styles/standalone`. Webapp-safe `/styles` is tokens + webapp-compat only. Standalone hosts already import `/styles/standalone` and need no import change. Webapp should continue omitting standalone and rely on host theme vars (components keep palette fallbacks such as `var(--calls-bg, var(--color-indigo-600))`).

## [0.1.0-alpha.1] - 2026-08-27

### Changed

- **BREAKING:** Variant prop string values standardized to lowercase kebab-case across components (e.g. `emphasis="primary"`, `size="x-small"`, `appearance="do-not-disturb"`). Aligns with Mattermost webapp shared package conventions.
- Storybook autodocs descriptions synced from the first paragraph of each component guidelines page.
- User-facing display labels use Title Case where appropriate (product names, demo copy, aria-labels); variant prop values remain lowercase.

### Added

- `scripts/sync-storybook-descriptions.mjs` — refresh component JSDoc from guidelines intros.
- Agent docs for variant prop conventions and Storybook description sync workflow.

## [0.1.0-alpha.0] - 2026-08-26

First alpha on npm (`@alpha` dist-tag). Extracted from `mattermost-proto-playground`.

### Added

- **`@mattermost/compass-ui` workspace package** with Vite library build (ESM + CJS).
- **81 UI components** migrated from `src/components/ui/`.
- **Style exports:**
  - `@mattermost/compass-ui/styles` — tokens, themes, webapp-compat (`dist/compass-ui.css`)
  - `@mattermost/compass-ui/styles/standalone` — CSS reset + document `body` / heading chrome for Storybook and other standalone hosts
  - `@mattermost/compass-ui/component-styles` — component CSS modules + SimpleBar base styles (`dist/index.css`)
- **Root barrel** export from `src/index.ts` (components, hooks, utilities, sub-exports for layout shells).
- **Call icons:** `OutboundCallIcon`, `PhoneLockIcon` (in `compass-proto`). Dialpad uses `@mattermost/compass-icons` `dialpad`.
- **ChannelsSidebar helpers:** header/navigator subcomponents (fixture builders moved to proto).
- **Storybook** with theme toolbar (`denim`, `sapphire`, `quartz`, `indigo`, `onyx`).
- **CI workflow** (typecheck, build, `npm pack` artifact).
- `scripts/smoke-test-compass-ui-pack.mjs` — tarball install + Vite consumer build gate.
- `INTEGRATION.md` — consumer setup guide for Vite and Mattermost webapp.

### Changed

- `@mattermost/compass-ui/styles` is tokens/themes/webapp-compat only (no reset or document chrome), so webapp can import it safely. Standalone hosts also import `/styles/standalone`.
- Demo fixtures out of the published core surface: `buildDefaultChannelsSidebarModel` and `defaultAdminConsoleSidebarGroups` move to `@mattermost/compass-proto`; `RightSidebarThread` / `RightSidebarChannelInfo` move to proto. `ChannelsSidebar` / `AdminConsoleSidebar` remain props-driven in core (empty defaults).
- Monolith consumers (`mattermost-proto-playground`) import from `@mattermost/compass-ui` instead of `@/components/ui/*`.
- `ChannelShell`, `ThreadListItem`, `RightSidebarThread` no longer bundle demo avatar assets — consumers pass fixtures via props.

### Removed

- `src/components/ui/` and `src/components/icons/` from the playground monolith (source of truth is the package).

### Notes

- **Peer dependencies:** `react`, `react-dom`, `@mattermost/compass-icons`, `simplebar-react` (optional meta for simplebar).
- **Webapp integration** (webpack) validated separately; switch from `file:` to `@mattermost/compass-ui@alpha` for mergeable PRs.

[Unreleased]: https://github.com/mattermost/compass-design/compare/0.1.0-alpha.1...HEAD
[0.1.0-alpha.1]: https://github.com/mattermost/compass-design/compare/0.1.0-alpha.0...0.1.0-alpha.1
[0.1.0-alpha.0]: https://github.com/mattermost/compass-design/releases/tag/0.1.0-alpha.0
