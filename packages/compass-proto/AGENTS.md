# Compass proto (unpublished)

Follow this when working under `packages/compass-proto/` or composing proto UI in docs specimens and layouts.

## Inventory

Unpublished prototyping surface (root barrel only — no component subpaths):

- Mobile\* shells and patterns
- `ChannelShell`
- Call\* composites (`CallWidget`, `CallPopout`, `CallParticipantAvatar`, `RecordingPill`, panels)
- Desktop composites not ready for publish: `Message`, `MessageInput`, `ChannelHeader`, `ChannelsSidebar`, `AdminConsoleSidebar`, `GlobalHeader`, `TeamSidebar`, `RightSidebar` (shell), `ReactionPill`, `AppBarItem`
- Hardcoded menu recipes: `PlusMenu`, `HelpMenu`, `ChannelMenu`, `TeamMenu`, `ChannelCategoryMenu`, `ChannelHeaderMenu`, `ThreadActionsMenu`, `MessageMoreOptionsMenu`, `ProductSwitcherMenu`
- Demo RHS panels (`RightSidebarThread`, `RightSidebarChannelInfo`) and sidebar fixture helpers
- `WithTooltip` (prototype tooltip host)

Published chrome that pairs with these (import from `@mattermost/compass-ui` subpaths): `RightSidebarHeader`, Message leaves, `Modal`, `ChannelSidebarItem`, `TourPoint`, `PopoverMenu` / `MenuItem`, etc.

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
- Optional `hint` and `shortcutKeys` map through to Compass `Tooltip`.
- **Skip on mobile-only surfaces** (`Mobile*` bars, sheets, tab bars) — no hover. Still set `aria-label` on the Icon Button.
- **Skip** when the control already has a visible text label.
- Do not invent a second tooltip wrapper, CSS-only hover clone, or `title=`.
