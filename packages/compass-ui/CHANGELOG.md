# Changelog

All notable changes to `@mattermost/compass-ui` are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/). Versioning follows [Semantic Versioning](https://semver.org/) while on `0.x` (API may change between minors).

## [Unreleased]

### Changed

- **BREAKING:** `Checkbox` and `Radio` replace the `valid` prop with `invalid?: boolean` (default `false`), aligned with `TextInput`, `TextArea`, `Select`, `Combobox`, and `SearchInput`. Use `invalid` or omit the prop instead of `valid={false}`.
- **BREAKING:** `ThreadFooter` `avatars` prop type changes from `{ src, alt }[]` to `UserAvatarGroupItem[]` (`key`, `name`, optional `src`). The legacy `AvatarData` type remains exported as **deprecated** for migration; map `alt` → `name` and add a stable `key` per avatar.
- **BREAKING:** `IconButton` no longer defaults `toggled` to `false`. Omit `toggled` for plain actions so `aria-pressed` is not set; pass `toggled={true|false}` only for toggle buttons.
- **Focus rings:** add `--focus-ring-color` and `--focus-ring-color-rgb` theme tokens (default `var(--button-bg)`). Standalone themes define them explicitly; `@mattermost/compass-ui/styles` aliases them in `webapp-compat.scss` for hosts that already set `--button-bg`. Compact controls (Button, IconButton, ActionButton, Dropdown, Tabs, Chip, PaginationDots, and similar) use the shared outline ring; form fields use 1px inset + 1px outer ring in `--focus-ring-color`.
- **Quaternary** Button and Dropdown default focus rings use `--focus-ring-color` instead of `--link-color`. Secondary Button still uses `--link-color` for its ring.
- **Form field SCSS** blocks renamed to kebab-case BEM (`.text-input`, `.search-input`, `.text-area`, `.select`, `.combobox`, `.date-range-picker`, including element modifiers such as `__leading-icon`). Dist CSS module class hashes change; override via component props or host wrappers, not hard-coded module class names.
- **Composite rows** (`ChannelSidebarItem`, `ThreadListItem`, `ThreadFooter`): decorative unread/mention badges are `aria-hidden`; screen-reader state uses a visually hidden `__status-hint`. Overflow menus are siblings of the primary control and reveal on `:hover` / `:focus-within` via opacity (not `display: none`).
- **`ThreadListItem`:** row content is text-selectable; primary activation is a focusable div (not a nested `<button>`). Overflow menu renders only when `onMenuClick` is provided. Click is suppressed only when the active text selection intersects the row.
- **`ThreadFooter`:** participant stack uses `UserAvatarGroup`; mention badge + `mentionCount` prop; last-reply time reveals on row hover or keyboard focus when following.
- **`Tabs`:** arrow-key roving tabindex with manual activation (Enter/Space selects). Optional `id` / `panelId` on `TabItem` for `aria-controls` pairing with host tabpanels.
- **`Tag`:** semantic variants bind to `--color-success`, `--color-warning`, and `--color-danger` tokens.
- **`AttachmentCard`:** file-open control renders as a button only when `onOpen` is provided; otherwise the identity block is non-interactive. Secondary actions also reveal on `:focus-within`.
- **`Message`** and **`ImagePreview`:** hover-only secondary actions also reveal on `:focus-within`.
- **`IconButton`:** focus ring uses outline + offset (same pattern as Button) instead of a stacked box-shadow overlay, avoiding extra positioning context.
- **`Radio`:** focus ring width aligned with Checkbox (2px).
- **`MenuItem`:** hover/active fills use theme RGB variables instead of hardcoded black `rgba`.

### Added

- `SearchInput` `invalid` prop for error styling and `aria-invalid`.
- `ThreadFooter` `mentionCount` prop (used when `badge="mention"`).
- `ThreadFooter` Storybook stories.
- Deprecated `AvatarData` export on `@mattermost/compass-ui/components/thread-footer` for legacy `{ src, alt }` consumers.
- `INTEGRATION.md` Button size mapping for webapp adopters (`xs`/`sm` → `x-small`/`small`).

### Fixed

- `TextInput` Storybook `trailingIcon` control (arg destructuring typo prevented trailing icons from rendering).
- `Radio` `aria-invalid` retained for invalid form contract with a scoped `jsx-a11y/role-supports-aria-props` suppression.
- `ThreadFooter` SCSS selectors for nested Button emphasis modifiers (attribute selectors instead of unsupported `:global` wrappers).
- `scripts/smoke-test-compass-ui-pack.mjs` exercises `leadingIcon` (camelCase) on Button.

## [0.1.0-alpha.4] - 2026-08-31

### Added

- `Modal` `bodyPadding="menu"` for `MenuItem` lists — 8px vertical / 16px horizontal so row labels align with the 32px header/footer margins.

### Changed

- `Modal` with header/footer dividers off: header bottom and footer top padding are removed (previously only the borders were cleared).

## [0.1.0-alpha.3] - 2026-08-28

### Changed

- **BREAKING (recommended):** Import components from subpaths — `@mattermost/compass-ui/components/<kebab-name>` — instead of the root barrel. Matches `@mattermost/shared` packaging; Jest and webpack load only the requested module graph. Root barrel (`@mattermost/compass-ui`) is retained for backwards compatibility but discouraged in test environments.
- Multi-entry Vite build with `preserveModules`: `dist/components/<name>/`, `dist/hooks/`, wildcard `package.json` exports, and `typesVersions` for deep subpath TypeScript resolution.
- Playground, docs, and `@mattermost/compass-proto` consumers migrated to subpath imports.

### Fixed

- CJS dist chunks unwrap `@mattermost/compass-icons` default exports (`mod?.default ?? mod`) in every `.cjs` file — fixes Jest `React.jsx: type is invalid -- got: object` warnings on icon props.
- Post-build normalization renames component output folders to kebab-case and bundles aggregated `component-styles` CSS.

### Added

- `scripts/generate-compass-ui-exports.mjs`, `scripts/normalize-compass-ui-dist.mjs`, `scripts/verify-compass-ui-dist.mjs` — exports codegen, dist layout normalization, and subpath isolation checks.
- `scripts/migrate-compass-ui-imports.mjs` — codemod for root → subpath import migration.
- Style sub-exports on component indexes: `btnStyles`, `messageStyles`, `channelsSidebarStyles`.
- INTEGRATION.md Jest `moduleNameMapper` guidance for Mattermost webapp consumers.

## [0.1.0-alpha.2] - 2026-08-27

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

[Unreleased]: https://github.com/mattermost/compass-design/compare/0.1.0-alpha.4...HEAD
[0.1.0-alpha.4]: https://github.com/mattermost/compass-design/compare/0.1.0-alpha.3...0.1.0-alpha.4
[0.1.0-alpha.3]: https://github.com/mattermost/compass-design/compare/0.1.0-alpha.2...0.1.0-alpha.3
[0.1.0-alpha.2]: https://github.com/mattermost/compass-design/compare/0.1.0-alpha.1...0.1.0-alpha.2
[0.1.0-alpha.1]: https://github.com/mattermost/compass-design/compare/0.1.0-alpha.0...0.1.0-alpha.1
[0.1.0-alpha.0]: https://github.com/mattermost/compass-design/releases/tag/0.1.0-alpha.0
