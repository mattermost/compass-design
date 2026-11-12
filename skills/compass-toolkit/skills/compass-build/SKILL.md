---
name: compass-build
description: Build or restyle Mattermost UI with @mattermost/compass-ui. Use whenever you build, design or restyle a screen, form, modal, panel, settings page, plugin UI or prototype with Compass, or when the user asks to bring existing UI in line with Compass or says it looks off, crowded, inconsistent or "not Compass". Covers spacing, hierarchy, buttons, color/themes, type, radius, elevation, motion, states, accessibility, writing, tokens and what to avoid. To only audit existing code without changing it, use compass-review. To move a shipped plugin or webapp off react-bootstrap or react-select, use compass-migrate.
---

# Compass build

Compass is one product, one brand. Do not invent style. Reuse components and tokens, then apply the rules below.

Rules tagged **[proposed]** are not yet in the Compass guidelines. Follow them, but do not cite them as official.

**Guidelines.** The authoritative guidance is the Compass guidelines site, published at https://compass.mattermost.com and built from `src/guidelines` in the `mattermost/compass-design` repo. Paths like `/foundations/color` in these files are routes on that site (it is a single-page app, so open the site root and navigate if a deep link doesn't resolve). If a reference and a guideline disagree, the guideline wins.

**Version note.** Some rules assume props added in compass-ui alpha.28 (not in older releases): `DateRangePicker` `label` (and `aria-label`, `aria-labelledby`, `aria-describedby`, `required` reaching its trigger), `Select` and `Combobox` `message` and `messageTone`, and `Select` `required` and `aria-describedby`. Check the installed component's props. If they are missing, upgrade compass-ui when you can. If you can't, these are the limits and the best available workarounds, and you must say so in your report:

- **`DateRangePicker` without `label` support:** its trigger is named only by its displayed date or placeholder text, so nothing identifies the field, and it does not expose a required state; those props are silently dropped. Labelling a wrapping `role="group"` does not name the trigger. Use a compass-ui version that has the support. If you can't, a native `<input type="date">` with a visible `<label>` and `required` is an acceptable fallback for this case (the "no native date input" rule assumes a working picker); report that you used it. Otherwise, don't ship a required date field.
- **`Select` without `message` support:** it cannot associate an error with the control (it does not accept or forward `aria-describedby`). `FieldMessage` with `role="alert"` is announced when it appears but is not associated with the field when it is focused. If the association is required, use `Combobox` (it accepts `aria-describedby` and `required`) or upgrade; otherwise report the gap. An older `Select` also has no `required` prop, so it cannot expose the required state: upgrade, or use `Combobox` (which has `required`).

## House rules (these win over everything else)

1. **Reuse before building.** Look in `@mattermost/compass-ui` first. If a component covers the need, use it. Don't restyle it from outside; use its props. The one exception is a documented override, such as Radio's full width in a boolean pair.
2. **Tokens only.** No raw px, hex, ms or easing keywords where a token exists. See `references/tokens-and-implementation.md`.
3. **At most one primary action per view.** One `emphasis="primary"` Button when the view has a main action (a read-only view may have none). Every other action uses a lower emphasis: **`tertiary` is the default** (Cancel, back, alternatives). Use `quaternary`, `dim` or `link` for lighter actions. Avoid `secondary` unless a design calls for it; it may be phased out.
4. **Theme tokens for product UI.** Use role tokens (`--center-channel-bg`, `--button-bg`), never palette hex. It must work on every theme.
5. **Less is the default.** If an element, border, label or sentence can go without losing meaning, remove it.
6. **Keyboard and screen reader first.** Every control is focusable, labelled and shows a focus ring.
7. **Sentence case, short.** Buttons are 4 words or fewer and start with a verb.

## Workflow

1. **Pick the context** (core feature, plugin, or prototype). Read `references/context.md`. It changes imports, what you may reuse and how strict to be.
2. **Plan before markup.** Write, in a few lines: the one job of the screen, its primary action (if it has one), its sections, and what is hidden until asked for.
3. **Compose from components.** Layer order: Foundations, Components, Patterns, Layouts. Prefer an existing Pattern before assembling Components.
4. **Apply the rules** from the references that match what you are building (table below).
5. **Run `references/checklist.md`** and fix every failure before reporting done. Also run the project's own lint and tests (see "Checks to run" in the checklist); report any that are not available.

## Retrofitting existing UI

Use this when the task is to bring existing UI in line with Compass, not to build something new. For a report only, with no edits, use `compass-review` instead.

1. **Audit first.** List what breaks which rule (file and line) before changing anything. Don't start editing while reading.
2. **Keep behavior.** Change the UI, not the logic. Keep props, state, handlers, test ids and data flow. Make the smallest diff that fixes each finding; don't rewrite unrelated code.
3. **Work in passes**, and finish one before the next:
   1. Tokens: replace raw px, hex, font sizes, radii, shadows, durations and easing with tokens. Keep the allowed raw values listed in `references/tokens-and-implementation.md` (1px hairlines, one-off layout widths with no token, breakpoints) so the layout doesn't change.
   2. Components: replace custom markup with the Compass component that covers the need (`references/components.md`). If none fits, keep the custom piece, mark it with a short comment, and say so.
   3. Layout: spacing, grouping, hierarchy, one primary action, forms.
   4. Copy, states and accessibility: labels, errors, focus, ARIA.
4. **Don't force a swap.** If a Compass component can't do what the screen needs (a missing option, a different structure), leave that part and list the gap in your final report instead of working around it.
5. **Re-check.** Run `references/checklist.md` on the result, plus the project's lint and tests. Report in your final response (the message that ends the task, not a file or a code comment), as a short list per pass of what you changed, then a "Left as is" list with the file and the reason for each item, including any component gaps from step 4.

## Which reference to read

| Building or deciding                                       | Read                                      |
| ---------------------------------------------------------- | ----------------------------------------- |
| Gaps, grouping, sections, forms, buttons, hierarchy        | `references/spacing-and-hierarchy.md`     |
| Tokens, imports, component usage, variant props            | `references/tokens-and-implementation.md` |
| Which component to use for a need (inputs, date, feedback) | `references/components.md`                |
| Fonts, sizes, weights                                      | `references/typography.md`                |
| Colors, themes, opacity, semantic color                    | `references/color-and-themes.md`          |
| Radius, shadows, surfaces, z-index                         | `references/shape-and-elevation.md`       |
| Animation, hover, focus, pressed, disabled                 | `references/motion-and-states.md`         |
| Copy, labels, errors, empty states                         | `references/writing.md`                   |
| Contrast, keyboard, focus, ARIA, reduced motion            | `references/accessibility.md`             |
| Removing redundancy, progressive disclosure                | `references/simplicity-and-disclosure.md` |
| Plugin vs core vs prototype                                | `references/context.md`                   |
| Final review                                               | `references/checklist.md`                 |

Reasoning and visuals live in the Compass guidelines (`/foundations/*`). These references are the short, checkable version. If they disagree, the guidelines win and the reference is a bug.

## Never

- Hardcode colors, spacing, font sizes, radii, shadows, durations or easing.
- Use more than one primary Button in a view (zero is fine for a view with no main action), or make every action primary "so it stands out".
- Style a Compass component from outside with deep selectors, `!important` or inline `style`.
- Pass a raw compass-icons glyph to `IconButton`, or (preferably) set `size` on an `Icon` inside a Compass slot; the host component sizes it, and an explicit size is allowed only for a deliberate override.
- Add hover, tooltips or portals to published `IconButton`/`Tooltip` (use `WithTooltip` from `compass-proto` in prototypes only).
- Rely on color alone, placeholder-only labels, or `outline: none` without a replacement focus ring.
- Animate purely for decoration, snap an expand/collapse, or ignore `prefers-reduced-motion`.
- Use "pill" to describe a button. Use `--radius-pill`, never `--radius-full`.
- Add decorative borders, boxed containers or helper text that restate the label.
- Use Title Case, trailing periods on buttons/labels, or colons on input labels.
