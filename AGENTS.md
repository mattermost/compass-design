# Agent guidance (shared)

Shared instructions for Cursor, Claude Code, and other agents. `CLAUDE.md` imports this file via `@AGENTS.md`.

## Design system layers

Vocabulary used everywhere: **Foundations** (tokens, type, color, motion) → **Components** (reusable UI) → **Patterns** (composed blocks like Channel Sidebar) → **Layouts** (full screens). Docs URLs and topic categories follow this model.

Package split (in-repo):

- **`@mattermost/compass-ui`** — published core (tokens, primitives, desktop chrome pieces)
- **`@mattermost/compass-proto`** — unpublished Mobile*, `ChannelShell`, Call*, demo RHS panels, sidebar fixture helpers (prototyping / docs only)

## Building new components

Before writing new UI, audit `src/components/` (and Compass UI). Reuse an existing component when it already covers the need — especially when the name matches Figma. Only build a new sub-component when nothing suitable exists.

### Variant prop string values

Figma variant props (`size`, `emphasis`, `appearance`, `type`, `padding`, etc.) use **lowercase kebab-case** string literals in the public TypeScript API — aligned with the Mattermost webapp shared package. Examples: `'primary'`, `'x-small'`, `'default'`, `'do-not-disturb'`, `'center-channel'`.

- Map prop values to BEM modifiers with `toKebab()` from `@/utils/string` (or the package export). Do not use Title Case in prop types or JSX prop values.
- Figma labels may stay Title Case in docs prose and matrix headings; only the **prop values** are lowercase.
- Numeric sizes (`Icon` `size="16"`, avatar px tokens) and free-form strings (`label`, `title`) are unchanged.

## Shared React hooks

Check `src/hooks/` before duplicating logic. Key hooks: `useExitAnimation` (exit animations), `useOutsideClose` (click-outside behavior).

## Overlays

Tooltips, modals, and popovers (`Modal`, `Tooltip`, `PopoverMenu`, `ProfilePopover`, etc.) are **visual chrome only** — surface markup and styles. The product owns open/close state, portals, positioning, focus trap, escape/outside-click, and stacking. Panel-level ARIA on the surface (e.g. `role="dialog"`) is fine; do not add orchestration-layer focus management, portals, or triggers inside overlay primitives. Follow each component's existing lifecycle pattern (`Modal` is mount-controlled; `Dropdown` takes controlled `isOpen`) and wire lifecycle props and callbacks from the host (e.g. `isOpen`, `onClose`) — compose with host hooks (e.g. `useOutsideClose`, `usePopoverTransition`, `useExitAnimation`).

**Exceptions:** form widgets with menu/popover surfaces (`Combobox`, `Select`, `DateRangePicker`, etc.) own widget-level open/close, keyboard behavior, and may **portal + position** their own menus (viewport flip, escape overflow clipping). That portal logic is scoped to those widgets — do not reuse it as a general overlay positioning API for chrome primitives. Proto/mobile presentation components (`MobileBottomSheet`, `MobileModalStage`, etc.) may bundle backdrop and animation for prototyping — keep those in `compass-proto` or playground presenters, not published overlay primitives. Prototype tooltip hosting (`WithTooltip`) also lives in `compass-proto`, not in `Tooltip` or `IconButton`.

## Component usage (short)

- **Primary button:** `emphasis="primary"` at most once per view. Prefer `secondary` / `tertiary` / `quaternary` otherwise.
- **EmptyState actions:** omit `size` on the action `Button` unless Figma requires otherwise (default Medium).
- **Admin True/False radios:** lay out horizontally in a flex row (e.g. `admin-console-layout__radio-row`); override Radio `width: 100%` so both stay on one row; match label `padding-top: var(--spacing-xxs)`.
- **Avatars:** pass a real image from `src/assets/avatars/` when the component supports `src` / equivalent. Initials-only only when documenting fallback or unnamed users.
- **IconButton (proto/docs):** wrap desktop Icon Buttons with `WithTooltip` from `@mattermost/compass-proto`. Do not add hover or portals to `IconButton` or Compass `Tooltip`. Skip on mobile-only (touch) surfaces; still set `aria-label`.

## Styling

Prefer design tokens from `src/styles/tokens.scss` over hardcoded px/hex/ms. Full BEM, tokens, motion, opacity, and Scrollbars rules load when editing styles — see the styling rule pair below.

## Area-specific guidance

- [src/guidelines/AGENTS.md](src/guidelines/AGENTS.md) — Docs guidelines, specimens, MDX
- [packages/compass-ui/AGENTS.md](packages/compass-ui/AGENTS.md) — Compass UI Storybook
- [packages/compass-proto/AGENTS.md](packages/compass-proto/AGENTS.md) — Proto composites, `WithTooltip`
- [.claude/rules/styling.md](.claude/rules/styling.md) / [.cursor/rules/styling.mdc](.cursor/rules/styling.mdc) — Styling (keep both files in sync)
- [.cursor/skills/add-docs-topic/SKILL.md](.cursor/skills/add-docs-topic/SKILL.md) — Adding a docs topic (procedure)
- [.cursor/rules/creating-agent-rules.mdc](.cursor/rules/creating-agent-rules.mdc) — Adding or changing agent guidance
