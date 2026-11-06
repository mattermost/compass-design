# Pre-finish checklist

Walk every item. Fix failures, then report which items you checked. Items tagged `[lint]` can be verified by the project's own checks (see "Checks to run" at the end).

## Structure and hierarchy

- [ ] The screen has one job and one clear focal point.
- [ ] At most one `emphasis="primary"` Button in the view (none is fine for a read-only view); the rest are lower emphasis.
- [ ] Groups use smaller gaps than the gaps between groups; sections use larger still.
- [ ] No box, border, shadow or fill where spacing alone separates content.
- [ ] Every element survived the "can I delete this?" pass (`simplicity-and-disclosure.md`).
- [ ] Advanced or secondary content is behind progressive disclosure; required content is visible.
- [ ] Form fields follow the field disclosure rules: required always visible, collapsed sections only hold optional or defaulted fields, and have a summary line.
- [ ] Forms in an RHS have 24px padding and a pinned footer.

## Components and tokens

- [ ] Used existing Compass components and patterns instead of custom markup. `[lint]`
- [ ] No raw px, hex, font-size, radius, shadow, duration or easing. `[lint]`
- [ ] Subpath, named imports only; variant props are kebab-case strings.
- [ ] Picked components with `references/components.md` (e.g. single date = `DateRangePicker mode="date"`).
- [ ] Every `TextInput` has the type that matches its data (`email`, `tel`, `url`, `number`; `text` only when nothing more specific fits).
- [ ] Each field's control was chosen with "Choosing the control for a field" in `references/components.md` (option count, single vs multi, free text vs known set).
- [ ] In a form with a submit button, yes/no fields are `Checkbox`, not `Switch`.
- [ ] Required fields have a trailing asterisk (individual fields only) and `required` or `aria-required`. Fields use floating labels (every standard input takes `label`); a separate label appears only where absolutely needed (admin left column).
- [ ] `IconButton` uses `icon={<Icon glyph=... />}` with no `size` and has `aria-label`.
- [ ] No inline styles for tokenizable values; no `!important`; no deep overrides of Compass components.
- [ ] Context respected (core, plugin or prototype): correct style import, no standalone stylesheet in a host.

## Color, type, shape

- [ ] Theme role tokens only; checked on one light and one dark theme.
- [ ] Text alpha at least 0.72 (placeholder 0.64, disabled 0.4); icon alpha at least 0.56. `[lint]`
- [ ] Semantic colors use `--color-*` / `--error-text`; presence uses indicator tokens.
- [ ] Weights are regular or semibold; headings follow hierarchy, not size preference.
- [ ] Radius is `--radius-s` by default, larger only on larger surfaces; pill only for counts/status.
- [ ] Elevation matches role; most surfaces are flat.

## States and motion

- [ ] Hover, focus-visible, pressed, selected and disabled exist and are visible without color alone.
- [ ] Focus ring is present on every interactive element.
- [ ] Motion uses duration and easing tokens, serves a state change, and honors reduced motion.
- [ ] Expand/collapse animates; no `outline` or base-state transitions.

## Copy

- [ ] Sentence case; buttons verb-first and 4 words or fewer; no trailing periods on buttons/labels; no colons on input labels.
- [ ] Errors say what happened and what to do; no user blame.
- [ ] No filler ("please", "oops", "successfully", exclamation marks).
- [ ] Visible and accessible text is translatable (`ReactNode`, label props), not hardcoded in components. `[lint]`

## Accessibility

- [ ] Keyboard-only pass: reachable, operable, logical order, nothing trapped (except modals).
- [ ] Every field has a visible label; errors are associated with their fields.
- [ ] Targets at least 24x24px pointer / 40x40px touch with 8px between.
- [ ] Overlays move focus in, trap (modal), close on Escape, restore focus.
- [ ] Dynamic updates are announced (`aria-live` / `role`).

## Before reporting

- [ ] Ran the scoped lint/tests for what changed. CSS-only: stylelint plus a browser check.
- [ ] Listed any **[proposed]** rules you relied on, and anything you could not verify.

## Checks to run

- **In the compass-design repo:** from the repo root run `npm run lint` and `npm run lint:styles`; in `packages/compass-ui` run `npm test`.
- **In a consumer (plugin, webapp, playground):** use that project's own lint, type-check and test scripts. A consumer may not have `lint:styles`; report which checks were unavailable rather than skipping silently.
