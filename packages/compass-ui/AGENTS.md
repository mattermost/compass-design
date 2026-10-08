# Compass UI (Storybook)

**`@mattermost/compass-ui`** — published core (tokens, primitives, desktop chrome pieces, brand SVG illustrations).

## Variant prop string values

Component variant props (`size`, `emphasis`, `appearance`, `style`, `type`, `padding`, `status`, etc.) must use **lowercase kebab-case** literals in exported types, defaults, comparisons, Record maps, stories, and specimens — e.g. `'medium'`, `'inverted'`, `'do-not-disturb'`. Map to SCSS modifiers with `toKebab()` from `@/utils/string`.

When adding a component:

1. Define exported `type` unions with lowercase values (mirror Figma variant names, not Figma label casing).
2. Use `toKebab(propValue)` for `--modifier` class suffixes; avoid ad-hoc `.toLowerCase()` unless the prop is already a single word.
3. Storybook `argTypes` `options` arrays and guideline specimens must use the same literals as the component types.

See also the repo-wide rule in [AGENTS.md](../../AGENTS.md#variant-prop-string-values).

## Component API contract (consumers: Mattermost webapp and plugins)

The webapp and plugins (react-intl, Playwright by role / name / `data-testid`) upgrade compass-ui in place. Apply these rules when writing or reviewing any new or changed component. Review checklist: [.cursor/skills/review-compass-ui-component/SKILL.md](../../.cursor/skills/review-compass-ui-component/SKILL.md).

1. **Backwards compatible:** public props only widen. Never rename or remove a prop, narrow a type, or change a default or the default DOM; add an optional prop instead. **Bug fixes are allowed:** making a component honor what its public type or docs already promise (e.g. a typed prop it silently ignored) is a fix, not a break. Use the existing prop rather than adding a new one, and list it under `### Fixed` in the CHANGELOG.
2. **Translatable text:** every prop rendered as visible or accessible text is `ReactNode`. Keep `string` only for values used as data (option labels used for filtering, React keys, ids) and say why in the JSDoc. When a component derives an `aria-label`/`title` from text, derive it only from strings and accept an explicit string override for JSX.
3. **No unoverridable English:** every built-in accessible name or message gets an optional prop with the English default in the destructuring (`closeLabel = 'Close'`). Naming: `*Label` (`ReactNode` when rendered, `string` when it's an attribute); `*AriaLabel` when a control has both visible text and a different name; `format*Label(count)` for counts and plurals.
4. **Pass-through attributes:** composites extend the root element's `HTMLAttributes` (omitting names they define, e.g. `title`, `onChange`), spread `...rest` first so their own props win, and merge `className`. Built-in buttons take `closeButtonProps` / `dismissButtonProps` / `backButtonProps` / `clearButtonProps` typed `BuiltInButtonProps` (`@/utils/props`); collection items take `buttonProps`.
5. **Refs:** interactive primitives forward refs to their focusable `<button>` / `<input>`, as `Button`, `IconButton`, `ActionButton`, `CardButton`, `MenuItem`, `Checkbox`, `Radio`, `Switch`, `TextInput`, `Select` and `Combobox` do.
6. **Disabled and pending:** anything users can activate — including collection items (tabs, menu items, options) and built-in action buttons — supports `disabled`. Async actions also support `loading`, forwarded to compass `Button`.
7. **Form widgets:** pickers support caller-driven async search (`filter={false}` + `inputValue` / `onInputChange`), `loading`, `selectedOptions` (selections survive searches that don't return them), and `creatable` / `clearable` where the value model allows. A widget that closes its menu on Escape calls `preventDefault()` so host Escape handlers can tell it was handled.
8. **Host-agnostic:** guard browser APIs jsdom / happy-dom lack (`el.scrollIntoView?.()`, `ResizeObserver`). Every runtime import is a dependency or a required peer, never an optional peer. Never ship CSS that only works when another package's copy is present.
9. **Styling and tokens:** follow the cascade-layer, additive-only token, unlayered component CSS and `--radius-pill` rules in [.claude/rules/styling.md](../../.claude/rules/styling.md#prefer-design-tokens-over-hardcoded-values) / [.cursor/rules/styling.mdc](../../.cursor/rules/styling.mdc).
10. **Overlays: component-owned vs host-owned:** WAI-ARIA-pattern behavior on the surface (initial focus, focus trap, Escape honoring `defaultPrevented`, focus restore, `aria-*`) may live in the component, opt-out via props; portals, positioning, stacking, scroll lock, backdrop and open/close stay with the host. See [Overlay components](#overlay-components) and the root [Overlays](../../AGENTS.md#overlays) policy. The form-widget portal exception covers existing widget menus only.

```tsx
// ❌ BAD — fixed English, attributes dropped, raw icon glyph
export function Banner({
  title,
  onDismiss,
}: {
  title: string;
  onDismiss?: () => void;
}) {
  return (
    <div>
      <p>{title}</p>
      <IconButton
        aria-label="Dismiss"
        onClick={onDismiss}
        icon={<CloseIcon />}
      />
    </div>
  );
}

// ✅ GOOD — label prop, pass-through, Icon glyph slot (no size)
export interface BannerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title'
> {
  title: ReactNode;
  onDismiss?: () => void;
  dismissLabel?: string;
  dismissButtonProps?: BuiltInButtonProps;
}
export function Banner({
  title,
  onDismiss,
  dismissLabel = 'Dismiss',
  dismissButtonProps,
  className,
  ...rest
}: BannerProps) {
  return (
    <div {...rest} className={mergeClassNames(styles.banner, className)}>
      <p className={styles['banner__title']}>{title}</p>
      <IconButton
        {...dismissButtonProps}
        aria-label={dismissLabel}
        onClick={onDismiss}
        icon={<Icon glyph={<CloseIcon />} />}
      />
    </div>
  );
}
```

**Enforced by `npm test`** — a failure means a rule was broken, not a flaky test:

- `src/components/contract.test.tsx` — each published composite passes `data-testid` / `id` / `aria-*` to its root, and each `*ButtonProps` reaches its button. Add new composites and built-in buttons to its tables.
- `src/components/englishLiterals.test.ts` — fails on English literals in `aria-label`, `title`, `placeholder`, `alt` or `label` in component sources (stories, specimens and tests excluded). Move the text into a label prop; only add to its `ALLOWLIST` with a reason. JSX text nodes aren't scanned — review those by hand.
- `src/components/markup.test.tsx` — default markup snapshots; a diff there means the default DOM changed.

## Icon slots

All compass-ui components that accept icon slot props (`leadingIcon`, `trailingIcon`, `icon`, etc.) size icons via `IconSlotContext`. Callers pass `<Icon glyph={<YourIcon />} />` with **no `size` prop** — the hosting component injects the correct size via context. Explicit `size` still takes precedence (non-breaking), but the recommended pattern omits it. **`IconButton.icon` always uses this pattern** — never pass a raw `@mattermost/compass-icons` glyph.

**When building a new component with an icon slot:**

1. Import `IconSlotContext` from `@/components/Icon/Icon`.
2. Wrap the slot render: `<IconSlotContext.Provider value={{ size: '16' }}>{iconProp}</IconSlotContext.Provider>` (use the correct size for the component).
3. JSDoc the prop: `"Pass \`<Icon glyph={<SomeIcon />} />\`; ComponentName provides the correct size via context."`

**Storybook stories** for icon slot props: use `iconSelectArgType` + `resolveStoryIcon(icon, { wrapIcon: true })` so the select control renders `<Icon glyph={...} />` without an explicit size. Use `wrapSize` only when the component does NOT use context. For raw-glyph slots (e.g. `Chip`, which wraps the glyph internally), omit both options.

## Overlay components

Published overlay primitives (`Modal`, `Tooltip`, `PopoverMenu`, `ProfilePopover`, …) split responsibility:

- **Component-owned:** dialog/surface-level accessibility behavior from the WAI-ARIA pattern — initial focus (container or an `initialFocusRef`), focus trap (focusable elements computed at keypress), document-level Escape that skips `defaultPrevented` events, focus restore on unmount, `aria-*` pass-through. Provide opt-outs (e.g. `closeOnEscape`). `Modal` implements this via `useModalFocus`; other primitives adopt it case by case (non-modal surfaces do not trap focus).
- **Host-owned:** portals, positioning, stacking, scroll lock, backdrop/scrim, outside-click and open/close state. Do not add these to published primitives; a backdrop/animation wrapper (e.g. `ModalOverlay`) needs a separate maintainer decision.
- Follow existing lifecycle props: `Modal` is mount-controlled (keep it mounted through any exit animation so focus restores afterwards); `Dropdown` and similar triggers take controlled `isOpen`; expose `onClose` where the surface has dismiss affordances.
- **Form widgets** with menu/popover surfaces (`Combobox`, `Select`, `DateRangePicker`, …) are exempt — they own widget-level open/close, keyboard nav, and may portal + position their own menus (viewport flip). Do not export that portal/placement logic as a general overlay API.
- **Proto/mobile** shells with backdrop or sheet animation belong in `compass-proto` or playground presenters, not `compass-ui`. Prototype tooltip hosting is `WithTooltip` in `compass-proto` — do not add hover, delay, or portals to published `Tooltip` or `IconButton`.
- Storybook stories may fake backdrops, anchors, or open state in canvas decorators for preview; that behavior must not leak into the component.

When adding or editing `packages/compass-ui/**/*.stories.tsx`:

- Story `title`s mirror the guidelines sidebar: `Components/{section}/{name}` and `Foundations/Style/{name}`. Keep `packages/compass-ui/src/storybook/titles.ts` aligned with `src/manifests/sections.ts`; use the same string literal in `meta.title`.
- **Icon controls:** for props that take an `Icon` / compass-icons glyph (`icon`, `leadingIcon`, `trailingIcon`, `glyph`, …), use `iconSelectArgType` + `resolveStoryIcon` from `src/storybook/icons.tsx` (registry generated by `npm run generate:compass-icons`). Prefer a meta-level `render` that maps select values (`None` / `Default` / glyph name) to React nodes so Controls can enable and swap icons. Do not put React elements in `args` for those props when a select control is present.
- **Storybook scope:** document **published `@mattermost/compass-ui` only**. Unpublished proto composites (`ChannelShell`, Call*, Mobile*, etc.) belong in guidelines layout specimens — not Storybook.
- Foundation stories import named `*Content` exports from guideline specimens (visual reference only). Use `tags: ['autodocs']`, inline string-literal titles, meaningful story names. Do not port guideline MDX prose into Storybook.
- Brand SVG illustrations live in `src/illustrations/*.svg` and publish as `@mattermost/compass-ui/illustrations/<kebab-name>`. Bind fills/strokes to theme roles (`--center-channel-color`, `--center-channel-bg`, `--button-bg`, …), not Denim hex; leave `<mask>` luminance maps and partner-logo hex alone. After adding or renaming an SVG, run `npm run generate:illustrations` from the repo root. After a hex export, run `node scripts/theme-illustration-svgs.mjs`.
- After changing a component guideline intro, run `node scripts/sync-storybook-descriptions.mjs` to refresh Storybook autodocs descriptions.
- Labels/demo text: `var(--center-channel-color)` — not `--color-neutral-*` / `--color-text-secondary`.
- Preview surfaces: `var(--center-channel-bg)`. Inverted surfaces: `var(--sidebar-header-bg)` with `var(--sidebar-text)` labels.
- Secondary text/borders/fills: `rgba(var(--center-channel-color-rgb), <alpha>)`. Text alpha ≥ **0.72** (placeholder text may use **0.64**; disabled ≥ **0.4**); icon alpha ≥ **0.56**.
- Base fonts from `@mattermost/compass-ui/styles` + `/styles/standalone` (Storybook preview) — do not hardcode font families in stories.
- Docs tab chrome: `packages/compass-ui/.storybook/docs-theme.css`.

General styling tokens, opacity floors, and motion: see the repo styling rule (`.claude/rules/styling.md` / `.cursor/rules/styling.mdc`).

## Composite rows: unread, mention, and overflow menus

Messaging and sidebar **row composites** (`ChannelSidebarItem`, `ThreadListItem`, `ThreadFooter`, and similar) share these patterns:

- **Decorative badges** (unread dot, mention pill) use `aria-hidden`. Announce state with a **`__status-hint`** element styled via `@include visually-hidden`.
  - `ChannelSidebarItem` / `ThreadListItem` / `ThreadFooter`: hint copy for mentions uses `` `${count} mention(s)` ``; unread: `unread` or `Unread replies` (footer).
  - `ThreadFooter` renders [MentionBadge](/components/mention-badge) (`location="channel"`, `size="medium"`).
- **Overflow menus** are a **sibling** of the primary control (never nested inside the row button). Reveal on `:hover` and `:focus-within` with **opacity** (and `pointer-events`), not `display: none`, so keyboard users can Tab to the menu button.
- **Row hover chrome** uses `:hover` and `:focus-within` together so keyboard focus gets the same background and revealed actions as pointer hover.
- **Focus rings** use `--focus-ring-color` (theme token, aliases `--button-bg`). Set it on a composite root to retarget child controls; use local `--focus-ring-color` overrides only for contrast (destructive, sidebar, on-primary surfaces).
