# Agent guidance (shared)

Shared instructions for Cursor, Claude Code, and other agents. `CLAUDE.md` imports this file via `@AGENTS.md`.

## Design system layers

Vocabulary used everywhere: **Foundations** (tokens, type, color, motion) → **Components** (reusable UI) → **Patterns** (composed blocks like Channel Sidebar) → **Layouts** (full screens). Docs URLs and topic categories follow this model.

Package split (in-repo):

- **`@mattermost/compass-ui`** — [packages/compass-ui/AGENTS.md](packages/compass-ui/AGENTS.md)
- **`@mattermost/compass-proto`** — [packages/compass-proto/AGENTS.md](packages/compass-proto/AGENTS.md)

## Required docs for every new foundation, component, or pattern

This is a **must**, not a nice-to-have. Adding (or promoting) a foundation, component, or pattern is not done until all of these exist:

1. **Guidelines page** — `src/guidelines/<category>/<slug>/<slug>.guideline.mdx`.
2. **Specimen page** — `src/guidelines/<category>/<slug>/<slug>.specimen.tsx`, showing the real states and variants.
3. **Topic registration** — a `Topic` in `src/manifests/topics.ts` (with `guidelinePage` **and** `specimenPage`) and, where a sidebar group fits, a slug in `src/manifests/sections.ts`.
4. **Storybook story — if it is part of `@mattermost/compass-ui`** (published components, and foundations with published tokens/styles): `*.stories.tsx` next to the source, title per `titles.ts` / `sections.ts`. Proto-only (`@mattermost/compass-proto`) additions do not get Storybook (see [packages/compass-ui/AGENTS.md](packages/compass-ui/AGENTS.md)), but they still need 1–3.

Procedure: [skills/internal/add-docs-topic/SKILL.md](skills/internal/add-docs-topic/SKILL.md). Do not open a PR that adds one of these without the pages (and story, where required); if the PR is a partial slice, say what is missing and why in the PR body.

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

Tooltips, modals, and popovers (`Modal`, `Tooltip`, `PopoverMenu`, `ProfilePopover`, etc.) are mostly **visual chrome** — surface markup and styles. Two layers:

- **Component-owned (allowed):** behavior that is part of the WAI-ARIA pattern for the surface and only touches its own subtree and the previously focused element — initial focus, focus trap, Escape, focus restore, `aria-*`. It must be on by default or opt-out via a prop, honor `defaultPrevented` (skip Escape an inner widget already handled), and add no DOM beyond the pattern. `Modal` is the first adopter; non-modal surfaces (`Tooltip`, `PopoverMenu`, `ProfilePopover`) adopt case by case.
- **Host-owned (excluded):** open/close state, portals, positioning, stacking, scroll lock, the backdrop element and outside-click. **Exception:** `ModalOverlay` ships the modal scrim (portal, scroll lock, backdrop click, exit motion) so hosts don't each rebuild it; the host still owns open state and the portal container, and the final z-index (the scrim defaults to `--z-modal`; override with `zIndex` or the token). `modalOverlayStyles` stays exported for hosts that already position their own node. Follow each component's existing lifecycle pattern (`Modal` is mount-controlled; `Dropdown` takes controlled `isOpen`) and wire lifecycle props from the host (e.g. `isOpen`, `onClose`) — compose with host hooks (e.g. `useOutsideClose`, `usePopoverTransition`, `useExitAnimation`).

### Popovers always portal

Every popover-style surface — `EmojiPopover`, `TourPoint`, `PopoverMenu`, `ProfilePopover`, `PopoverNotice`, tooltips, and any menu or picker a trigger opens — must be **portaled out of its trigger's container** and positioned against the trigger (viewport-fixed, flipping when there's no room). It must never sit in the normal flow of, or inside the DOM of, the trigger's container. In-flow popovers change the height of their parent (a modal grows when a picker opens), get clipped by `overflow`, and break stacking.

- **Where this applies:** every place a popover is _used_ — hosts, `compass-proto` composites, docs specimens, layouts, and Storybook stories. The host owns the portal (this follows "Host-owned" below); do not add portals or positioning to the chrome primitives themselves.
- **How:** portal to `document.body` (or the host's designated container), `position: fixed` from the trigger's `getBoundingClientRect()`, `z-index: var(--z-popover)` (or `--z-menu` for menus), update on resize and capture-phase scroll, and close on outside press (`useOutsideClose` with the portaled surface as the second root) and Escape. `WithTooltip` is the model for tooltips; `AnchoredMenu` in the bookmarks bar (compass-proto) shows the menu pattern. The `use-anchored-popup-portal` hook is internal to compass-ui form widgets, not a general overlay API.
- **Escape inside a modal:** an Escape that dismisses a portaled popover must `preventDefault()` so the surrounding `Modal` stays open.
- **Not acceptable:** rendering the popover as a sibling in the trigger's flex/grid container, `position: absolute` inside the trigger's wrapper, or expanding a container to hold it.

**Exceptions:** form widgets with menu/popover surfaces (`Combobox`, `Select`, `DateRangePicker`, etc.) own widget-level open/close, keyboard behavior, and may **portal + position** their own menus (viewport flip, escape overflow clipping). That portal logic is scoped to those widgets — do not reuse it as a general overlay positioning API for chrome primitives. Proto/mobile presentation components (`MobileBottomSheet`, `MobileModalStage`, etc.) may bundle backdrop and animation for prototyping — keep those in `compass-proto` or playground presenters, not published overlay primitives. Prototype tooltip hosting (`WithTooltip`) also lives in `compass-proto`, not in `Tooltip` or `IconButton`.

### Submenu recipe

Every submenu (a `PopoverMenu` opened from a menu row with a chevron) follows the Popover Menu guideline:

- **Overlap the parent by 8px** — the child's edge sits 8px inside the parent menu's edge, on the side it opens toward (flip to the left when there's no room).
- **Align the first item with the parent row** — the child's surface reaches above the row by its own padding so its first item sits level with the row that opened it.
- **The parent row is active** (`MenuItem active`) while the submenu is open.
- Static docs previews of a submenu render the same geometry (see `BookmarksHeaderMenuExample`); the live one is portaled like any popover.

## Component usage (short)

- **Primary button:** `emphasis="primary"` at most once per view. Prefer `secondary` / `tertiary` / `quaternary` otherwise.
- **EmptyState actions:** omit `size` on the action `Button` unless Figma requires otherwise (default Medium).
- **Admin True/False radios:** lay out horizontally in a flex row (e.g. `admin-console-layout__radio-row`); override Radio `width: 100%` so both stay on one row; match label `padding-top: var(--spacing-xxs)`.
- **Avatars:** pass a real image from `src/assets/avatars/` when the component supports `src` / equivalent. Initials-only only when documenting fallback or unnamed users.
- **IconButton:** always pass `icon={<Icon glyph={<SomeIcon />} />}` (no raw compass-icons glyph; omit `size` — the button sizes via context). In proto/docs, wrap desktop Icon Buttons with `WithTooltip` from `@mattermost/compass-proto` for now. Do not add hover or portals to `IconButton` or Compass `Tooltip`. Skip `WithTooltip` on mobile-only (touch) surfaces; still set `aria-label`.
- **Links:** for navigational CTAs, use `Button` / `IconButton` / `TileButton` with `asChild` wrapping `<a>` or a router `Link` — not `history.push` on a plain Button, and not invalid nesting (`<Link><Button/></Link>`).

## Styling

Prefer design tokens from `src/styles/tokens.scss` over hardcoded px/hex/ms. Full BEM, tokens, motion, opacity, and Scrollbars rules load when editing styles — see the styling rule pair below.

## Area-specific guidance

- [src/guidelines/AGENTS.md](src/guidelines/AGENTS.md) — Docs guidelines, specimens, MDX
- [packages/compass-ui/AGENTS.md](packages/compass-ui/AGENTS.md) — Compass UI Storybook
- [Component API contract](packages/compass-ui/AGENTS.md#component-api-contract-consumers-mattermost-webapp-and-plugins) — Rules for new or changed compass-ui components (backwards compatibility, translatable text, label props, pass-through, refs); enforced by `npm test`
- [packages/compass-proto/AGENTS.md](packages/compass-proto/AGENTS.md) — Proto composites, `WithTooltip`
- [.claude/rules/styling.md](.claude/rules/styling.md) / [.cursor/rules/styling.mdc](.cursor/rules/styling.mdc) — Styling (keep both files in sync)
- [.claude/rules/version-bumps.md](.claude/rules/version-bumps.md) — Version bump procedure: consumer reminders + compass-ui/compass-proto coupling
- [skills/internal/add-docs-topic/SKILL.md](skills/internal/add-docs-topic/SKILL.md) — Adding a docs topic (procedure)
- [skills/internal/review-compass-ui-component/SKILL.md](skills/internal/review-compass-ui-component/SKILL.md) — New/changed compass-ui component checklist
- [.cursor/rules/creating-agent-rules.mdc](.cursor/rules/creating-agent-rules.mdc) — Adding or changing agent guidance
- [.cursor/cursor.md](.cursor/cursor.md) — Cursor Cloud Agents: running the docs app / Storybook, verification, troubleshooting (environment in [.cursor/README.md](.cursor/README.md))
