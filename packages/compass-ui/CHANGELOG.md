# Changelog

All notable changes to `@mattermost/compass-ui` are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/). Versioning follows [Semantic Versioning](https://semver.org/) while on `0.x` (API may change between minors).

## [Unreleased]

### Changed

- **BREAKING: `ActionButton` renamed to `TileButton`.** The other button components are named for how they look (`IconButton`, `CardButton`, `EmojiButton`, `ReactionButton`); `TileButton` describes the stacked icon-over-label tile, and avoids confusion with the "action buttons" on integration post actions and interactive dialogs. Update imports from `@mattermost/compass-ui/components/action-button` to `@mattermost/compass-ui/components/tile-button`, and the `ActionButton`, `ActionButtonProps` and `ActionButtonAsChildProps` names to `TileButton`, `TileButtonProps` and `TileButtonAsChildProps`. The Storybook title is now `Components/Actions/Tile Button`. No alias for the old name is provided.
- **BREAKING: `TileButton` `active` renamed to `toggled`.** Matches `IconButton` and `EmojiButton`, where `toggled` sets `aria-pressed` and the toggled visual. Behavior is unchanged: omit the prop for a plain action, and it is still not available with `asChild`. Unlike `IconButton` and `EmojiButton`, there is no appearance-only `active` prop.
- **`TileButton` CSS:** class names are now `tile-button*` (was `action-button*`), the toggled modifier is `tile-button--toggled` (was `action-button--active`), and the host override for label side padding is `--tile-button-padding-inline` (was `--action-button-padding-inline`).

## [0.1.0-alpha.20] - 2026-10-21

### Added

- **`Button` `emphasis="dim"`:** muted center-channel label with a transparent surface and a light hover fill — for quiet toolbar / view-header actions (e.g. Properties, Filter, Sort).
- **`Button` `compact`:** optional denser padding (default `false`). On `small`, padding is `6px 10px` (28px tall) with a 6px icon/label gap. On `x-small`, compact only tightens horizontal padding (8px → 6px) and keeps the 24px height / 4px gap. No-op on `emphasis="link"` (padding stays `0`).

### Changed

- **`Button` `x-small`:** horizontal padding reduced from 12px to 8px; icon/label gap set to 4px (stays 24px tall).
- **`Button` `large`:** icon/label gap increased from 8px to 12px (compact: 10px) so it scales with the 20px icon.
- **`Button` leading/trailing slots:** accept any React node (icons, badges, custom markup), not only Icon elements.
- **`ActionButton` width:** the default width is now 108px, up from 88px, to leave room for longer labels. Hosts that set their own width keep it, but it is now bounded: never below 64px (`min-width`) and never wider than the container (`max-width: 100%`).

### Fixed

- **`ActionButton` long labels:** the label no longer forces a single line. It wraps to two lines (centred, balanced), clamps with an ellipsis after that, and breaks a single over-long word, so translated labels stay inside the button. The button also shrinks when its container is narrower than its width, down to a minimum of 64px, and never grows to fill it. Side padding moves from the button to the label and eases from 16px (at 88px wide or more) to 8px (at 64px) so narrow buttons wrap less; hosts can set `--action-button-padding-inline` to override it. Host `padding-left` / `padding-right` overrides on the button now add to the label padding instead of replacing it. The icon stays top-aligned across a row. The full label remains in the DOM, so the accessible name is unchanged.

## [0.1.0-alpha.19] - 2026-10-20

### Added

- **`Modal` `manageFocus`:** set `false` when the host owns focus (e.g. a floating-ui focus manager) to turn off initial focus, the Tab trap and focus restore. The modal still joins the modal stack, so modals below it stay inert, and Escape still follows `closeOnEscape`. Initial focus and restore use the value at mount; the Tab trap follows later updates (so a host `enforceFocus` prop can toggle). Default `true` keeps the current behavior.
- **`modalOverlayStyles`** (`@mattermost/compass-ui/components/modal`): class names for a host-rendered overlay element — `modal-overlay` (scrim via `--modal-overlay-bg`, centers the dialog 24px above true center, fades in on mount) and `modal-overlay--exiting` (fades out). The host still owns the portal, z-index, scroll lock and backdrop clicks.
- **`--modal-overlay-bg`:** additive token for the modal scrim — `rgba(var(--color-neutral-1200-rgb), 0.64)` (near-black at 64%, matching webapp `.modal-backdrop.in`).
- **`Scrollbar` `size`:** optional `'default' | 'wide'`. `default` keeps the 8px track; `wide` uses a 10px track.
- **OAuth illustrations:** `oauth` and `outgoing-oauth-connections` ship from `@mattermost/compass-ui/illustrations/oauth` and `@mattermost/compass-ui/illustrations/outgoing-oauth-connections` (OAuth 2.0 Applications seal and Outgoing OAuth Connections arrow).

### Changed

- **`PopoverNotice`:** container corner radius is `--radius-m` (8px), up from `--radius-s` (4px).

### Fixed

- **`Modal` max size:** the dialog now caps its height at the viewport minus 160px (minus 240px when the viewport is at least 900px tall), as the Modal guideline specifies, and its width at the viewport minus 40px. The body is a single `minmax(0, 1fr)` grid row so it sizes to its content when short and gets a definite height under that cap. Overflow always uses `Scrollbar` (default 8px track), including `scrollable={false}` (that mode only fills the body for host-owned panes; the dialog no longer grows past the viewport).
- **`Modal` stacking across compass-ui copies:** the modal stack lived in each copy's module, so with a plugin's compass-ui copy on the page, both open modals handled Escape and Tab. The stack is now shared on `globalThis` under `Symbol.for('@mattermost/compass-ui/modal-stack/v1')`, so only the topmost modal reacts. The v1 entry format is frozen (opaque tokens, push/splice, last is top); incompatible changes would mint `v2`. Copies on `0.1.0-alpha.15` or earlier still keep their own stack.
- **`Scrollbar` thumb:** uses `--radius-pill` instead of a hardcoded `3px` corner radius.

## [0.1.0-alpha.18] - 2026-10-19

### Fixed

- **`SectionNotice` title:** host System Console rules such as `.admin-console h4 { margin-bottom: 2em; font-weight: 600 }` overrode the single-class title resets — leaving a large gap under the title, and letting host win `font-weight` on specificity even when the value matched. Margin and `font-weight` now use a doubled class selector so unlayered module CSS wins without `!important`.

## [0.1.0-alpha.17] - 2026-10-18

### Added

- **`FieldMessage`:** inline field status line with `tone` (`error` | `warning` | `info` | `success`). Error and warning use `role="alert"`.
- **`TextInput`, `TextArea`, `SearchInput` `message` / `messageTone`:** host-driven status under the field; error tone (or bare `invalid`) drives invalid chrome; message id is merged into `aria-describedby` ahead of the character counter.
- **`TextInput` `clearable`:** opt-in clear button (default off) with `onClear`, `clearLabel` (default `"Clear"`), and `clearButtonProps`. Escape clears when the button would be visible. Clear sits after `trailingIcon` and stays in tab order.
- **`TextInput` `trailingAction`:** control outside the bordered wrapper; message and counter stay as wide as the field column. Slot height matches the field control for `size` (32 / 40 / 48). Prefer a primary `Button` (Button defaults). TextArea does not take `trailingAction`.
- **`PasswordInput`:** dedicated password field (Search Input pattern) with built-in show/hide toggle — `showPasswordLabel` / `hidePasswordLabel` / `revealButtonProps`, optional controlled `revealed`, plus `message` / `messageTone`. Prefer this over composing Text Input when migrating webapp `PasswordInput`.

### Changed

- **`ErrorMessage`:** now renders `FieldMessage` with `tone="error"` (imports stay valid — used by Agents plugin).
- **`SearchInput` clear:** shared clear control; still always-on when filled, default `clearLabel` `"Clear search"`, `tabIndex={-1}`. Clear is also hidden (and Escape does not clear) when `readOnly`, matching Text Input.
- **`FieldMessage` icon:** top padding set to 2px so the 12px glyph optically centers with the 16px text line (was ~1–2px high / unpadded).
- **`TextInput` / `TextArea` character counter:** uses the same type size as Field Message (`font-size-75` / `line-height-75`).
- **`TextInput` / `TextArea` / `SearchInput` field message spacing:** `gap: var(--spacing-xs)` (8px) between the control and Field Message / counter instead of margin-top.
- **`FieldMessage` tones:** error / warning / success prefer host theme roles (`--error-text`, `--away-indicator`, `--online-indicator`) with Compass semantic fallbacks (`--color-danger|warning|success`). Info is text-only at `rgba(--center-channel-color-rgb, 0.75)` with no icon.
- **`TextInput` / `TextArea` footer:** Field Message and character counter sit on one row (message start, counter end) when both are set.
- **`TextInput` leading/trailing icons:** Icon slot context follows field `size` (12 / 16 / 16), matching the clear control. Small leading-icon label offset updated for the 12px glyph.

### Fixed

- **`FieldMessage` icon:** optical vertical alignment with the first line of text (was ~1–2px high).
- **Built-in clear `onChange`:** synthetic clear event includes `preventDefault` / `nativeEvent` so host handlers that touch those fields don’t throw.
- **`TextInput` label markup:** floating label uses `htmlFor` and sits beside the field chrome (same pattern as Search Input / Password Input), so the clear button is no longer a second labelable control inside `<label>`.

## [0.1.0-alpha.16] - 2026-10-16

### Added

- **`AdminPanelFooter`:** action rail for Admin Panel with `leftActions` and `rightActions` slots for `Button`, `IconButton`, or pagination. Compose via the new optional `AdminPanel` `footer` prop (collapses with the body when expandable).
- **`Select` `dividerAfter`:** optional flag on `SelectOption` that renders a menu divider after that option.
- **`Combobox` and `Select` `menuItemProps`:** forward any `MenuItem` prop that the menu doesn't own (`secondaryLabelPosition`, `trailingVisual`, `tag`, `tagLabel`, `mentionCount`, `customStatusEmoji`, `destructive`, `className`, `data-*`, …) to the option rows, either on the component (all rows) or on a single option (`ComboboxOption.menuItemProps` / `SelectOption.menuItemProps`, which wins; `className` is merged). Props the menu sets itself (ARIA, selection state, the click / pointer handlers it uses, `label`, `secondaryLabel`, `leadingVisual`, `disabled`) can't be overridden, and neither can `autoFocus`, which would pull focus off the input / trigger when the menu opens. `Combobox` selects on `onClick`, so it accepts `onPointerUp`; `Select` selects on `onPointerUp`, so it accepts `onClick`. `Combobox` doesn't apply it to the create row. New exported types `MenuItemPassthroughProps` (generic over the props the host owns) and `MenuItemOwnedProps`.

### Changed

- **`AdminPanel`:** `title` is optional when `children` are provided (body-only panels). Footer remains optional. TypeScript requires a header (`title`) or a body (`children`) — footer-only is not allowed. Expand/collapse still requires a header.
- **`AdminPanelFooter` → `AdminConsoleFooter`:** renamed the component, types (`AdminConsoleFooterProps`, `AdminConsoleFooterStatus`), CSS block (`.admin-console-footer`), docs slug (`/components/admin-console-footer`), and subpath export (`@mattermost/compass-ui/components/admin-console-footer`) to match `AdminConsoleHeader`.
- **`SectionNotice` secondary action:** uses `emphasis="tertiary"` instead of `emphasis="secondary"` so the supporting action stays lower-emphasis than the page’s main controls.

### Fixed

- **`SectionNotice` title:** renders as a semantic `<h4>` (was `<p>`) for document-outline parity with the Mattermost webapp notice. Title styles explicitly set margin, padding, font-family, size, weight, line-height, letter-spacing, text-transform, and color so host global `h4` rules do not bleed into Compass typography. Intentional default DOM change.
- **`AdminPanel`:** omits the padded `admin-panel__body` (and the expandable collapse wrapper) when `children` is empty, and omits the header divider when there is no body or footer, so header-only panels (e.g. System Console nav banners) no longer leave a blank strip.
- **`Combobox`, `Select` menu width:** the "match the field width" rule (`width: 100%; max-width: none`) had the same specificity as `PopoverMenu`'s `max-width: 496px`, so in the aggregated stylesheet (where `PopoverMenu` is emitted later) the menu was capped at 496px. The rule now nests under the popup so it wins regardless of order.
- **`MenuItem` vertical centering:** with a leading visual taller than the label row (e.g. a 24px avatar next to a single-line or inline-secondary-label row), the label and trailing visual sat at the top of the row. They now center on the row. A trailing check on a two-line row (secondary label below) now centers too instead of sitting at the top.
- **`Combobox`, `Select` hover scrolling:** hovering a row that was partly clipped at the edge of the menu scrolled it into view, which moved the next clipped row under the pointer and kept the list scrolling on its own. Hover now only moves the highlight; keyboard navigation still scrolls the highlighted row into view.
- **`Switch`, `Checkbox`, `Radio`:** host Bootstrap / System Console rules such as `.form-horizontal label { margin-bottom: 5px }` overrode the single-class `margin: 0` reset and pushed the control off-center in flex rows. The margin reset now uses a doubled block selector so unlayered module CSS wins without `!important`.
- **`Combobox` `multiple`:** with many or long chips the input's `min-height: 100%` resolved against the whole wrapped chip area, so the input grew taller than the field and its caret rendered outside it. The input now stretches only to its own flex line.
- **`Chip`:** a long label kept the chip at its full text width, so it overflowed its container (e.g. inside a `Combobox`). The chip now shrinks to its container (`min-width: 0; max-width: 100%`) and the label ellipsizes.
- **`MenuItem`:** a long label (nowrap, non-shrinking) pushed the trailing check icon out of the row. The label now truncates with an ellipsis so the trailing visual stays visible.

## [0.1.0-alpha.15] - 2026-10-11

### Added

- **`Button`, `IconButton`, and `ActionButton` `asChild`:** merge Compass styling and anatomy onto a single child element (typically `<a>` or a React Router `Link`) instead of rendering a nested `<button>`. New exported types `ButtonAsChildProps`, `IconButtonAsChildProps`, and `ActionButtonAsChildProps`. Disabled / loading links use `aria-disabled` (and `aria-busy` when loading), keep focus, and block click / middle-click navigation. `IconButton` `asChild` requires `aria-label` and omits `toggled`; `ActionButton` `asChild` omits `active`.
- **`RightSidebarHeader` `onPopout` / `popoutLabel`:** optional pop out button (`dock-window` glyph) rendered between expand and close. Default accessible name: "Open in new window".

### Fixed

- **`Button` `emphasis="link"`:** now renders `leadingIcon` and `trailingIcon` (the public type already accepted them). Hover underline stays on the label only.

## [0.1.0-alpha.14] - 2026-10-08

### Added

- **`Modal` focus and keyboard behavior:** focuses the dialog (or `initialFocusRef`) on mount, traps Tab / Shift+Tab inside it (focusable elements computed at keypress), closes on Escape via a document listener (skips events with `defaultPrevented`; opt out with `closeOnEscape={false}`), and restores focus to the previously focused element on unmount. The dialog root gains `tabIndex={-1}`. New props `closeOnEscape` and `initialFocusRef`; `aria-describedby` passes through.
- **`PopoverMenu` `open`:** optional controlled visibility with the popover scale + fade transition; unmounts after the exit; optional `onExited` fires once it has unmounted. Omitting it keeps the previous always-rendered behavior.
- **`Modal` `open` / `onExited`:** optional controlled visibility with a fade + drop-from-top + subtle scale 98%→100% transition (`--duration-quick`); Tab and Escape stop at the start of the exit, and the modal unmounts, restores focus, then calls `onExited`. Omitting `open` keeps the previous mount-controlled behavior.
- **`readDurationMs(token, fallback)`** (`@/utils/duration`, internal): reads a duration token for JS timers.
- **`Tabs` `appearance`:** optional `'default' | 'underlined'` prop. `underlined` draws a bottom rule with an indicator under the active tab. Default markup and look are unchanged.

### Changed (policy)

- **Overlay policy eased:** overlay primitives may own WAI-ARIA-pattern focus and keyboard behavior; portals, positioning, scroll lock, backdrop and open/close remain host-owned. See `AGENTS.md`.

### Fixed

- **`usePopoverTransition`** (`PopoverMenu`, `Select`, `Combobox`, `DateRangePicker`, …): the unmount delay is read from `--duration-quick` instead of a hard-coded 150ms, so it stays in sync with the CSS transition and any host override.
- **`Checkbox`, `Radio`, and `Switch`:** set `font-weight: regular` on the root label so host global `label { font-weight: bold }` rules (e.g. Bootstrap forms) do not bold option text.
- **`Checkbox` and `Radio`:** controls align to the first line of the label when the label wraps, instead of vertically centering across all lines.
- **`IconButton` inverted active:** uses `--sidebar-text` / `--sidebar-text-rgb` tokens so active/toggled inverted buttons match sidebar contrast.
- **`ChannelSidebarItem` overflow menu:** passes `<Icon glyph={<DotsVerticalIcon />} />` into `IconButton` (context-sized) instead of a raw compass-icons glyph.

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
- **Translatable text props:** text props that were typed `string` now accept `ReactNode` (for example `MenuGroupHeading.label`, `TourPoint.title`, `TourPointPrimaryAction.label`, `PopoverNotice.checkboxLabel`, `ActionButton.label`, `FeatureDiscoveryPanel.title`/`description`, `AdminPanel` and `AdminPanelHeader` `betaLabel`/`enterpriseLabel`/`buttonLabel`, `AdminConsoleFooter.saveLabel`/`cancelLabel`). Option labels used for filtering stay `string`.

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

[Unreleased]: https://github.com/mattermost/compass-design/compare/0.1.0-alpha.20...HEAD
[0.1.0-alpha.20]: https://github.com/mattermost/compass-design/compare/0.1.0-alpha.19...0.1.0-alpha.20
[0.1.0-alpha.19]: https://github.com/mattermost/compass-design/compare/0.1.0-alpha.18...0.1.0-alpha.19
[0.1.0-alpha.18]: https://github.com/mattermost/compass-design/compare/0.1.0-alpha.17...0.1.0-alpha.18
[0.1.0-alpha.17]: https://github.com/mattermost/compass-design/compare/0.1.0-alpha.16...0.1.0-alpha.17
[0.1.0-alpha.16]: https://github.com/mattermost/compass-design/compare/0.1.0-alpha.15...0.1.0-alpha.16
[0.1.0-alpha.15]: https://github.com/mattermost/compass-design/compare/0.1.0-alpha.14...0.1.0-alpha.15
[0.1.0-alpha.14]: https://github.com/mattermost/compass-design/compare/0.1.0-alpha.13...0.1.0-alpha.14
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
