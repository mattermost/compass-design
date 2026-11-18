# Compass proto (unpublished)

Follow this when working under `packages/compass-proto/` or composing proto UI in docs specimens and layouts.

## Inventory

Unpublished prototyping surface (root barrel only — no component subpaths):

- Mobile\* shells and patterns
- `ChannelShell`
- Call\* composites (`CallWidget`, `CallPopout`, `CallParticipantAvatar`, `CallNotice`, `RecordingIndicator`, panels)
- Desktop composites not ready for publish: `Message`, `MessageInput`, `ChannelHeader`, `ChannelsSidebar`, `AdminConsoleSidebar`, `GlobalHeader`, `TeamSidebar`, `RightSidebar` (shell), `AppBarItem`, `ProductRail`, `ProductShell`
- Hardcoded menu recipes: `PlusMenu`, `HelpMenu`, `ChannelMenu`, `TeamMenu`, `ChannelCategoryMenu`, `ChannelHeaderMenu`, `ThreadActionsMenu`, `MessageMoreOptionsMenu`, `ProductSwitcherMenu`, `UserAccountMenu`
- Demo RHS panels (`RightSidebarThread`, `RightSidebarChannelInfo`) and sidebar fixture helpers
- `WithTooltip` (prototype tooltip host)

Published chrome that pairs with these (import from `@mattermost/compass-ui` subpaths): `RightSidebarHeader`, Message leaves, `Modal`, `ChannelSidebarItem`, `TourPoint`, `PopoverMenu` / `MenuItem`, etc.

## Popovers portal

Any popover, menu, or picker a proto composite opens (`EmojiPopover`, `PopoverMenu`, `ProfilePopover`, `TourPoint`, `PopoverNotice`, …) portals out of the trigger's container and is positioned against the trigger — never in flow or inside the trigger's wrapper. See [Popovers always portal](../../AGENTS.md#popovers-always-portal).

## Docs

Proto composites that are patterns or layouts still need a docs **guidelines page and specimen page** registered in `src/manifests/topics.ts` (see the root [AGENTS.md](../../AGENTS.md#required-docs-for-every-new-foundation-component-or-pattern)). Proto does not get Storybook — Storybook documents published `@mattermost/compass-ui` only.

## Sample workspace fixtures

`src/fixtures/sample-workspace/generated.ts` is generated from `mattermost/mattermost-preview`; never edit it by hand. To refresh it, and what the generator fails on, see [src/fixtures/sample-workspace/README.md](src/fixtures/sample-workspace/README.md). Tests and specimens must not depend on exact counts or particular post ids, so a refresh doesn't break them.

## Changelog

Record proto changes (renamed props, new variants, etc.) in [CHANGELOG.md](./CHANGELOG.md), under `[Unreleased]` with the date they land (`YYYY-MM-DD`, newest first). `compass-proto` is unpublished, so it has no release sections. Do not put proto changes in `packages/compass-ui/CHANGELOG.md`, which covers the published `@mattermost/compass-ui` package only. The `Changelog` workflow only checks published compass-ui source, not this file.

## Tests

`npm test` in `packages/compass-proto` runs vitest (happy-dom). Proto imports `@mattermost/compass-ui` through its built `dist`, so build compass-ui first (`npm run build` in `packages/compass-ui`) on a fresh checkout.

## Icon Buttons: Icon glyph + WithTooltip

Every `IconButton` must take `icon={<Icon glyph={<SomeIcon />} />}` — never a raw `@mattermost/compass-icons` glyph. Omit `size` on `Icon`; `IconButton` injects it via `IconSlotContext`.

Every desktop `IconButton` in a prototype or layout specimen must also be wrapped in `WithTooltip` from this package (for now). Compass `Tooltip` is chrome only; this wrapper is the prototype host (400ms hover delay, portal, placement). Do not add hover, portals, or positioning to published `IconButton` or `Tooltip`.

```tsx
import { WithTooltip } from '@mattermost/compass-proto';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { IconButton } from '@mattermost/compass-ui/components/icon-button';
import BellOutlineIcon from '@mattermost/compass-icons/components/bell-outline';

<WithTooltip label="Mute channel">
  <IconButton icon={<Icon glyph={<BellOutlineIcon />} />} />
</WithTooltip>;
```

`WithTooltip` copies `label` onto the child as `aria-label` when the child has none. Pass `aria-label` yourself only when it should differ from the tooltip.

- Default `placement="top"`. Use `right` / `bottom` / `left` when the trigger sits on an edge.
- Optional `hint`, `shortcutKeys`, and `emoji` / `emojiSize` (`inline` | `large`) map through to Compass `Tooltip`.
- **Skip on mobile-only surfaces** (`Mobile*` bars, sheets, tab bars) — no hover. Still set `aria-label` on the Icon Button.
- **Skip** when the control already has a visible text label.
- Do not invent a second tooltip wrapper, CSS-only hover clone, or `title=`.
