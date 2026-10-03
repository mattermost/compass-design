# Changelog

All notable changes to `@mattermost/compass-ui` are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/). Versioning follows [Semantic Versioning](https://semver.org/) while on `0.x` (API may change between minors).

## [Unreleased]

### Added

- **`Modal` focus and keyboard behavior:** focuses the dialog (or `initialFocusRef`) on mount, traps Tab / Shift+Tab inside it (focusable elements computed at keypress), closes on Escape via a document listener (skips events with `defaultPrevented`; opt out with `closeOnEscape={false}`), and restores focus to the previously focused element on unmount. The dialog root gains `tabIndex={-1}`. New props `closeOnEscape` and `initialFocusRef`; `aria-describedby` passes through.
- **`PopoverMenu` `open`:** optional controlled visibility with the popover scale + fade transition; unmounts after the exit; optional `onExited` fires once it has unmounted. Omitting it keeps the previous always-rendered behavior.
- **`Modal` `open` / `onExited`:** optional controlled visibility with a fade + drop-from-top + scale 90%→100% transition (`--duration-quick`); Tab and Escape stop at the start of the exit, and the modal unmounts, restores focus, then calls `onExited`. Omitting `open` keeps the previous mount-controlled behavior.
- **`readDurationMs(token, fallback)`** (`@/utils/duration`, internal): reads a duration token for JS timers.
- **`Tabs` `appearance`:** optional `'default' | 'underlined'` prop. `underlined` draws a bottom rule with an indicator under the active tab. Default markup and look are unchanged.

### Changed (policy)

- **Overlay policy eased:** overlay primitives may own WAI-ARIA-pattern focus and keyboard behavior; portals, positioning, scroll lock, backdrop and open/close remain host-owned. See `AGENTS.md`.

### Fixed

- **`usePopoverTransition`** (`PopoverMenu`, `Select`, `Combobox`, `DateRangePicker`, …): the unmount delay is read from `--duration-quick` instead of a hard-coded 150ms, so it stays in sync with the CSS transition and any host override.
- **`Checkbox`, `Radio`, and `Switch`:** set `font-weight: regular` on the root label so host global `label { font-weight: bold }` rules (e.g. Bootstrap forms) do not bold option text.
- **`Checkbox` and `Radio`:** controls align to the first line of the label when the label wraps, instead of vertically centering across all lines.

## [0.1.0-alpha.13] - 2026-10-02

Safe to run several compass-ui copies, of any versions, on one page alongside a host that defines overlapping CSS variables (Mattermost core + plugins).

### Added

- **`--radius-pill`** (`9999px`): pill and circle radius. Its name doesn't collide with the Mattermost webapp.
- **Token contract in CI:** `scripts/verify-compass-ui-dist.mjs` snapshots every token name and value (`tokens.snapshot.json`) and fails when a token is removed or revalued. Tokens are additive-only. Update the snapshot intentionally with `npm run tokens:snapshot`.
- **Attribute pass-through:** `SectionNotice`, `TourPoint`, `EmptyState`, `Tag`, `Modal`, `ErrorMessage`, `ProgressBar`, `Tabs`, `AdminPanel`, `Toast`, `PopoverNotice` (and `Scrollbar`) put extra HTML attributes (`data-*`, `id`, `aria-*`, …) on their root. Component props win on conflicts; `className` is merged.
- **Built-in button props:** `closeButtonProps` (`TourPoint`, `PopoverNotice`, `ModalHeader`, `Modal`), `backButtonProps` (`ModalHeader`, `Modal`), `dismissButtonProps` (`SectionNotice`, `Toast`, `GlobalBanner`), `clearButtonProps` (`SearchInput`, `Combobox`) and `TabItem.buttonProps`. New exported types `BuiltInButtonProps` and `DataAttributes`.
- **Label props for built-in English:** every hardcoded accessible name or message now has an optional prop that defaults to the current English, e.g. `closeLabel`, `backLabel`, `dismissLabel`, `clearLabel`, `listboxLabel`, `selectionsLabel`, and `format*Label` functions for counts. See the PR for the full list.
- **`SectionNotice` action states:** `primaryActionDisabled`, `primaryActionLoading`, `secondaryActionDisabled`, `secondaryActionLoading`. `TourPointPrimaryAction` and `PopoverNoticeAction` gain `disabled` and `loading`.
- **Clearable `Combobox`:** `clearable` shows a keyboard-reachable clear button in single mode that calls `onChange(null)`. No-op with `multiple`.
- **`ModalHeader` / `Modal` `headerSlot`:** optional full-width content below the title+actions row and above the divider (e.g. a search field in Find Channels).

### Changed (non-breaking)

- **Cascade layers for all token stylesheets:** every declaration in `@mattermost/compass-ui/styles` and `/styles/standalone` now sits in a `compass-ui.*` layer (`base`, `vendor`, `webapp-compat`, `tokens`, `themes`), and each sheet opens with the layer order statement. Unlayered host values with the same name (for example the webapp's `--radius-full`, `--elevation-*`) always win, regardless of load order. Copies of compass-ui can no longer override each other's or the host's tokens. Component CSS stays unlayered. Storybook and standalone hosts render as before.
- **SimpleBar CSS** ships as `components/scrollbar/simplebar-vendor.css` inside `@layer compass-ui.vendor`, so a host's own SimpleBar CSS wins. This replaces the CSS-only `dist/node_modules/simplebar-react` folder, which shadowed the real `simplebar-react` package and broke Node ESM imports of `Scrollbar` (and of `Modal`, `PopoverMenu`, `EmptyState`, `Select`, `Combobox`) even when it was installed.
- **`simplebar-react` is a required peer dependency** (no longer `optional`), so npm 7+ installs it automatically.
- All 17 components that used `--radius-full` now use `--radius-pill`, so pills stay pills when the webapp's `--radius-full: 50%` wins.
- **Translatable text props:** text props that were typed `string` now accept `ReactNode` (for example `MenuGroupHeading.label`, `TourPoint.title`, `TourPointPrimaryAction.label`, `PopoverNotice.checkboxLabel`, `ActionButton.label`, `FeatureDiscoveryPanel.title`/`description`, `AdminPanel` and `AdminPanelHeader` `betaLabel`/`enterpriseLabel`/`buttonLabel`, `AdminPanelFooter.saveLabel`/`cancelLabel`). Option labels used for filtering stay `string`.

### Deprecated

- **`--radius-full`**: use `--radius-pill`. It stays defined at `9999px` for existing consumers.

### Fixed

- **`Combobox` and `Select`** no longer crash when `scrollIntoView` is missing, as in jsdom-based consumer tests.
- **`DateRangePicker`** now shows the `placeholder` it already accepted (it was silently ignored). The default stays "mm/dd/yyyy".
- **`Scrollbar`** no longer inherits `--scrollbar-color` from a host scroller that sets the same name (the webapp's `Scrollbars` does). The `color` prop still overrides.

## [0.1.0-alpha.12] - 2026-10-01

### Changed

- **BREAKING:** Move `TeamSidebar` from `@mattermost/compass-ui` into unpublished `@mattermost/compass-proto`. Import it from `@mattermost/compass-proto`. `TeamAvatar` remains in UI.

## [0.1.0-alpha.11] - 2026-10-01

### Added

- **`Toast` `icon` prop**: optional `ReactNode` to override the default type glyph. Toast provides the correct size via context.
- **`Tabs` disabled tabs:** `TabItem.disabled` renders `aria-disabled="true"` with dimmed styling, ignores clicks and Enter/Space, and is skipped by arrow keys, Home, and End. `TabItem.title` sets the native tooltip (e.g. to explain why a tab is disabled). Disabled tabs use `aria-disabled` rather than the native `disabled` attribute so the tooltip still shows on hover.
- **Refs on interactive primitives:** `Button`, `IconButton`, `ActionButton`, `CardButton`, and `MenuItem` forward `ref` to their `<button>`. `Checkbox`, `Radio`, and `Switch` forward it to their `<input>`. Default exports and rendered markup are unchanged, and each sets `displayName`.
- **`ProgressBar` `indeterminate`:** for work with an unknown total, the bar shows an indicator sweeping across the track, timed from motion tokens. It keeps `role="progressbar"` and its `aria-label` and omits `aria-valuenow`. Under `prefers-reduced-motion` the indicator is static.
- **`Combobox` async and creatable modes:**
  - `loading` and `loadingMessage` show a loading row with a Spinner in place of the empty message, and set `aria-busy` on the input.
  - `selectedOptions` gives the option objects for the current value(s), so chips and the single-select label persist when async results no longer include them. This is a prop rather than an internal cache because a cache can't label values that were never in `options` (such as IDs preselected on load) and goes stale when labels change, while the host already holds those entities. Without `selectedOptions`, chip resolution and order are unchanged.
  - `creatable`, `onCreateOption`, and `formatCreateLabel` add a create row (`role="option"`, reachable with the arrow keys and Enter) when the typed text matches no option. With `onCreateOption` set, the host adds the value. Otherwise the trimmed text is committed through `onChange`. Created values not in `options` display their raw value.
  - `emptyMessage` widens to `ReactNode`.

### Changed (non-breaking)

- **Translated content in text props:** these props widen from `string` to `ReactNode`, so react-intl hosts can pass `<FormattedMessage/>` directly. String callers are unaffected. Affected: `Tag` `label`, `MenuItem` `label`, `Tabs` `TabItem.label`, `SectionNotice` `title` / `primaryButtonLabel` / `secondaryButtonLabel`, `EmptyState` `title`, `ErrorMessage` `message`, `Tooltip` `label` / `hint`, `Toast` `message` / `actionLabel`, `PopoverNotice` `title` and `PopoverNoticeAction.label`. `Select` and `Combobox` option labels stay `string` because they drive filtering and type-ahead.

### Changed

- **BREAKING:** Move unfinished / composed patterns out of `@mattermost/compass-ui` into unpublished `@mattermost/compass-proto`: `ChannelsSidebar`, `AdminConsoleSidebar`, `GlobalHeader`, and hardcoded menu recipes (`PlusMenu`, `HelpMenu`, `ChannelMenu`, `TeamMenu`, `ChannelCategoryMenu`, `ChannelHeaderMenu`, `ThreadActionsMenu`, `MessageMoreOptionsMenu`, `ProductSwitcherMenu`). Import them from `@mattermost/compass-proto`. `ChannelSidebarItem`, `TeamSidebar`, `TourPoint`, `PopoverMenu` / `MenuItem`, and `AdminConsoleHeader` remain in UI.
- **CSS packaging:** component CSS modules (and SimpleBar CSS for `Scrollbar`) ship with each component via `vite-plugin-lib-inject-css`. Consumers only need `@mattermost/compass-ui/styles` (plus `/styles/standalone` for standalone hosts). Drop any `@mattermost/compass-ui/component-styles` import — that entry is no longer exported.
- **Icon slots** — all compass-ui components that accept icon slot props (`leadingIcon`, `trailingIcon`, `icon`, etc.) now size icons automatically via `IconSlotContext`. Pass `<Icon glyph={<YourIcon />} />` with no `size` prop; the hosting component injects the correct size. Explicit `size` props still take precedence (non-breaking). Affected: `Button`, `IconButton`, `MenuItem`, `TextInput`, `SectionNotice`, `ActionButton`, `CardButton`, `GlobalBanner`, `Tooltip`, `Dropdown`, `Combobox`, `Select`, `AdminPanelHeader`, `Tag`, `Toast`, `PopoverNotice`.
- **`ICON_BUTTON_ICON_SIZES`** deprecated — callers no longer need to look up icon sizes for `IconButton` slots manually. The constant remains exported for migration; it will be removed in a future minor.
- **`Button`** leading/trailing icon slots no longer use `React.cloneElement` to inject size — sizing moves to `IconSlotContext`.
- **`PopoverNotice`** adds `popover-notice--no-icon` modifier when no icon is present, increasing left padding so body text is not flush to the edge.

## [0.1.0-alpha.10] - 2026-09-17

### Added

- **`IconSlotContext`** and **`useIconSlotContext`** exported from `@mattermost/compass-ui/components/icon`. Host components publish their required slot size via `<IconSlotContext.Provider value={{ size }}>`; `<Icon>` reads it as a fallback when no explicit `size` prop is passed (resolution: prop → context → `'24'`).

### Fixed

- **Themes** (`Denim`, `Sapphire`, `Quartz`): `--link-color` and `--link-color-rgb` corrected to `--color-blue-500` (was incorrectly `--color-blue-600` after a merge conflict).

## [0.1.0-alpha.9] - 2026-09-17

### Changed

- **`PopoverMenu` min-width** increased to 212px (was 160px); per-component inline width overrides removed — use the cascade default.
- **Dist CSS modules** renamed to kebab-case (`.module.css` suffix). Class hashes change; override via component props or host wrappers, not hard-coded module class names.

## [0.1.0-alpha.8] - 2026-09-16

### Changed

- **`Spinner`** `size` prop standardized to string literals (`'small'`, `'medium'`, `'large'`); consistent with other compass-ui size props.
- **`Chip`** `compact` prop added for reduced-padding chip rows.
- **`IconButton`** loading state added.

## [0.1.0-alpha.7] - 2026-09-16

### Added

- **Card Button** (`@mattermost/compass-ui/components/card-button`): selectable choice card with leading icon, title, description, and selected check. Includes `CardButtonGroup` for side-by-side radiogroups (Figma Card Button Group).
- **ModalHeader** (`@mattermost/compass-ui/components/modal-header`): extracted header with subtitle below/beside, optional back, optional `headerAction`, close-only (`hideTitle`), and divider. Figma [Patterns — Modals / Modal Header](https://www.figma.com/design/qdm5tKododENqnTvjLovDT/Patterns---Modals?node-id=789-15921).
- **ModalFooter** (`@mattermost/compass-ui/components/modal-footer`): footer chrome with types `2-actions`, `2-actions-separated`, `1-action`, `pagination`, `stepped-progress`, `spacer-small`, `spacer-large`, plus optional `leading` slot. Figma [Modal Footer](https://www.figma.com/design/qdm5tKododENqnTvjLovDT/Patterns---Modals?node-id=797-8156).
- **Modal:** composes ModalHeader / ModalFooter; adds `subtitlePlacement`, `hideTitle`, `headerAction`, `footerType`, `footerLeading`, `className` / `style`, `bodyPadding="none"`, and `scrollable`.
- **RightSidebarChannelMembers** (`@mattermost/compass-ui/components/right-sidebar-channel-members`): channel members panel for the right sidebar.
- **ReactionButton** (`@mattermost/compass-ui/components/reaction-button`): emoji + count toggle button for message reactions.
- **ReactionsRow** (`@mattermost/compass-ui/components/reactions-row`): lays out a set of `ReactionButton`s plus an add-reaction affordance.
- **MenuGroupHeading** (`@mattermost/compass-ui/components/menu-group-heading`): labelled group header for use between `Divider`-separated sections in `PopoverMenu`.
- **EmojiPopover** (`@mattermost/compass-ui/components/emoji-popover`): data-driven emoji picker popover; accepts `emojis` array and fires `onSelect`.

### Changed

- **Tour Point:** panel, pointer, and inverted Next label use `--button-bg` instead of the fixed `--color-info` semantic, so the callout follows the product theme.
- **Modal:** header/footer markup and styles move into ModalHeader / ModalFooter; subtitle typography aligns to Figma Body 75.
- **MessageReactions** replaced by `ReactionsRow` + `ReactionButton`. Import from `@mattermost/compass-ui/components/reactions-row` and `…/reaction-button`.

### Fixed

- **`GlobalBanner`**: add `flex-shrink: 0` to prevent height collapse when the banner is a flex child.
- **`ThreadFooter`**: remove vertical padding from root element that caused double-spacing in thread list rows.

## [0.1.0-alpha.6] - 2026-09-03

### Added

- Brand SVG illustrations ship from `@mattermost/compass-ui/illustrations/<name>` (React components; kebab-case filename is the subpath). `ILLUSTRATION_NAMES` is exported from `illustrations/names`.

### Changed

- **BREAKING:** Move unfinished / layout composites out of `@mattermost/compass-ui` into unpublished `@mattermost/compass-proto`: `Message`, `MessageInput`, `ChannelHeader`, `RightSidebar` (shell), `ReactionPill`, and `AppBarItem` (no docs topic). Import them from `@mattermost/compass-proto`. Message leaves (`MessageHeader`, `MessageActions`, `MessageReactions`, `MessageSeparator`, `MessageMoreOptionsMenu`, `PinnedSavedIndicators`), `Modal`, `TeamSidebar`, and `ChannelHeaderMenu` remain in UI.
- **BREAKING:** `RightSidebarHeader` is now a top-level UI export at `@mattermost/compass-ui/components/right-sidebar-header` (no longer co-exported from `…/right-sidebar`).
- **BREAKING:** `messageStyles` moves with `Message` to `@mattermost/compass-proto`.
- **Toast:** dismiss icon rests at 64% white; when `onDismiss` is omitted, content uses matching right padding, so the message is not flush to the edge.

## [0.1.0-alpha.5] - 2026-09-02

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

[Unreleased]: https://github.com/mattermost/compass-design/compare/0.1.0-alpha.13...HEAD
[0.1.0-alpha.13]: https://github.com/mattermost/compass-design/compare/0.1.0-alpha.12...0.1.0-alpha.13
[0.1.0-alpha.12]: https://github.com/mattermost/compass-design/compare/0.1.0-alpha.11...0.1.0-alpha.12
[0.1.0-alpha.11]: https://github.com/mattermost/compass-design/compare/0.1.0-alpha.10...0.1.0-alpha.11
[0.1.0-alpha.10]: https://github.com/mattermost/compass-design/compare/0.1.0-alpha.9...0.1.0-alpha.10
[0.1.0-alpha.9]: https://github.com/mattermost/compass-design/compare/0.1.0-alpha.8...0.1.0-alpha.9
[0.1.0-alpha.8]: https://github.com/mattermost/compass-design/compare/0.1.0-alpha.7...0.1.0-alpha.8
[0.1.0-alpha.7]: https://github.com/mattermost/compass-design/compare/0.1.0-alpha.6...0.1.0-alpha.7
[0.1.0-alpha.6]: https://github.com/mattermost/compass-design/compare/0.1.0-alpha.5...0.1.0-alpha.6
[0.1.0-alpha.5]: https://github.com/mattermost/compass-design/compare/0.1.0-alpha.4...0.1.0-alpha.5
[0.1.0-alpha.4]: https://github.com/mattermost/compass-design/compare/0.1.0-alpha.3...0.1.0-alpha.4
[0.1.0-alpha.3]: https://github.com/mattermost/compass-design/compare/0.1.0-alpha.2...0.1.0-alpha.3
[0.1.0-alpha.2]: https://github.com/mattermost/compass-design/compare/0.1.0-alpha.1...0.1.0-alpha.2
[0.1.0-alpha.1]: https://github.com/mattermost/compass-design/compare/0.1.0-alpha.0...0.1.0-alpha.1
[0.1.0-alpha.0]: https://github.com/mattermost/compass-design/releases/tag/0.1.0-alpha.0
