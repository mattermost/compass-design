# Pre-finish checklist

Walk every item. Fix failures, then report which items you checked. Items tagged `[lint]` can be verified by the project's own checks (see "Checks to run" at the end). Items tagged `[manual]` are not covered by any lint check: inspect the code (and the browser where needed) before marking them done.

## Structure and hierarchy

- [ ] The screen has one job and one clear focal point.
- [ ] At most one primary Button in the view (none is fine for a read-only view); the rest are lower emphasis. `Button` defaults to `emphasis="primary"`, so a Button with no `emphasis` prop, or with `emphasis={undefined}`, counts as primary.
- [ ] Groups use smaller gaps than the gaps between groups; sections use larger still.
- [ ] No box, border, shadow or fill where spacing alone separates content.
- [ ] Every element survived the "can I delete this?" pass (`simplicity-and-disclosure.md`).
- [ ] Advanced or secondary content is behind progressive disclosure; required content is visible. **[proposed]**
- [ ] Form fields follow the field disclosure rules: required always visible, collapsed sections only hold optional or defaulted fields, and have a summary line. **[proposed]**
- [ ] Forms in an RHS have 24px padding and a pinned footer.
- [ ] Form field gaps match the Forms table in every state, including lazy-loaded and conditional fields (a wrapper `<div>` inside a form drops the parent's `gap`).
- [ ] Repeating rows of controls (filters, key-value rows) keep their full width in the empty, populated and disabled states.
- [ ] Modals: dividers off when the body is short in every state (keep them if lazy-loaded content makes it grow); tabs sit in `headerSlot` with `appearance='underlined'`, the header divider off, and one full-width bottom border.

## Components and tokens

- [ ] Used existing Compass components and patterns instead of custom markup. `[manual]`
- [ ] No raw px, hex, font-size, radius, shadow, duration or easing. `[lint]` Border widths are raw by design: don't swap them for spacing tokens.
- [ ] Subpath, named imports only; variant props are kebab-case strings.
- [ ] Picked components with `references/components.md` (e.g. single date = `DateRangePicker mode="date"`).
- [ ] Every `TextInput` has the type that matches its data (`email`, `tel`, `url`, `number`; `text` only when nothing more specific fits).
- [ ] Each field's control was chosen with "Choosing the control for a field" in `references/components.md` (option count, single vs multi, free text vs known set).
- [ ] In a form with a submit button, yes/no fields are `Checkbox`, not `Switch`.
- [ ] Required fields have a trailing asterisk (individual fields only) and `required` or `aria-required`. Fields use floating labels (every standard input takes `label`); a separate label appears only where absolutely needed (admin left column).
- [ ] `IconButton` uses `icon={<Icon glyph=... />}`, normally with no `size` (an explicit size only as a deliberate override), and has `aria-label`.
- [ ] No inline styles for tokenizable values; no `!important`; no deep overrides of Compass components.
- [ ] Context respected (core, plugin or prototype): correct style import, no standalone stylesheet in a host.

## Color, type, shape

- [ ] Theme role tokens only; checked on one light and one dark theme.
- [ ] Text alpha at least 0.72 (placeholder 0.64, disabled 0.4); icon alpha at least 0.56. `[manual]`
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
- [ ] No filler ("please", "oops", "successfully", exclamation marks). **[proposed]**
- [ ] Visible and accessible text is translatable (`ReactNode`, label props), not hardcoded in components. `[lint]`

## Accessibility

- [ ] Keyboard-only pass: reachable, operable, logical order, nothing trapped (except modals).
- [ ] Every field has a visible label; errors are associated with their fields.
- [ ] Targets at least 24x24px pointer / 40x40px touch with 8px between.
- [ ] Each overlay follows its own focus pattern: modal dialogs move focus in, trap it, close on Escape and restore focus; non-modal dialogs and popovers don't trap focus; a menu button moves focus into its menu; a tooltip never takes focus.
- [ ] Modals animate in and out, close on Escape and on the backdrop, use a deliberate `size`, and carry a plain title. A form's Cancel, Back, Escape and backdrop confirm a discard only when something changed.
- [ ] Every icon-only button has a tooltip as well as an `aria-label`.
- [ ] Dynamic updates are announced (`aria-live` / `role`).

## Before reporting

- [ ] Ran the scoped lint/tests for what changed. CSS-only: stylelint plus a browser check.
- [ ] Listed any **[proposed]** rules you relied on, and anything you could not verify.

## Checks to run

- **If you are working in the webapp, a plugin or the playground:** use that project's own lint, type-check and test scripts. A consumer may not have `lint:styles`; report which checks were unavailable rather than skipping silently.
- **If you are working in the compass-design repo itself (compass-ui, docs, proto):** from the repo root run `npm run lint` and `npm run lint:styles`; in `packages/compass-ui` run `npm test`.
