---
name: compass-design
description: Build Mattermost UI with @mattermost/compass-ui. Use whenever you build, design, restyle or review a screen, form, modal, panel, settings page, plugin UI or prototype that uses Compass, or when the user says a Mattermost UI looks off, crowded, inconsistent or "not Compass". Covers spacing, hierarchy, buttons, color/themes, type, radius, elevation, motion, states, accessibility, writing, tokens and what to avoid.
---

# Compass design

Compass is one product, one brand. Do not invent style. Reuse components and tokens, then apply the rules below.

Rules tagged **[proposed]** are not yet in the Compass guidelines. Follow them, but do not cite them as official.

## House rules (these win over everything else)

1. **Reuse before building.** Look in `@mattermost/compass-ui` first. If a component covers the need, use it. Never restyle it from outside; use its props.
2. **Tokens only.** No raw px, hex, ms or easing keywords where a token exists. See `references/tokens-and-implementation.md`.
3. **One primary action per view.** One `emphasis="primary"` Button per view. Every other action uses a lower emphasis: **`tertiary` is the default** (Cancel, back, alternatives). Use `quaternary`, `dim` or `link` for lighter actions. Avoid `secondary` unless a design calls for it; it may be phased out.
4. **Theme tokens for product UI.** Use role tokens (`--center-channel-bg`, `--button-bg`), never palette hex. It must work on every theme.
5. **Less is the default.** If an element, border, label or sentence can go without losing meaning, remove it.
6. **Keyboard and screen reader first.** Every control is focusable, labelled and shows a focus ring.
7. **Sentence case, short.** Buttons are 4 words or fewer and start with a verb.

## Workflow

1. **Pick the context** (core feature, plugin, or prototype). Read `references/context.md`. It changes imports, what you may reuse and how strict to be.
2. **Plan before markup.** Write, in a few lines: the one job of the screen, its one primary action, its sections, and what is hidden until asked for.
3. **Compose from components.** Layer order: Foundations, Components, Patterns, Layouts. Prefer an existing Pattern before assembling Components.
4. **Apply the rules** from the references that match what you are building (table below).
5. **Run `references/checklist.md`** and fix every failure before reporting done. Also run the project's `lint:styles` and eslint.

## Which reference to read

| Building or deciding                           | Read                                       |
| ---------------------------------------------- | ------------------------------------------ |
| Gaps, grouping, sections, forms, buttons, hierarchy | `references/spacing-and-hierarchy.md` |
| Tokens, imports, component usage, variant props | `references/tokens-and-implementation.md` |
| Which component to use for a need (inputs, date, feedback) | `references/components.md` |
| Fonts, sizes, weights                          | `references/typography.md`                 |
| Colors, themes, opacity, semantic color        | `references/color-and-themes.md`           |
| Radius, shadows, surfaces, z-index             | `references/shape-and-elevation.md`        |
| Animation, hover, focus, pressed, disabled     | `references/motion-and-states.md`          |
| Copy, labels, errors, empty states             | `references/writing.md`                    |
| Contrast, keyboard, focus, ARIA, reduced motion | `references/accessibility.md`             |
| Removing redundancy, progressive disclosure    | `references/simplicity-and-disclosure.md`  |
| Plugin vs core vs prototype                    | `references/context.md`                    |
| Final review                                   | `references/checklist.md`                  |

Reasoning and visuals live in the Compass guidelines (`/foundations/*`). These references are the short, checkable version. If they disagree, the guidelines win and the reference is a bug.

## Never

- Hardcode colors, spacing, font sizes, radii, shadows, durations or easing.
- Use more than one primary Button in a view, or make every action primary "so it stands out".
- Style a Compass component from outside with deep selectors, `!important` or inline `style`.
- Pass a raw compass-icons glyph to `IconButton`, or set `size` on an `Icon` inside a Compass slot.
- Add hover, tooltips or portals to published `IconButton`/`Tooltip` (use `WithTooltip` from `compass-proto` in prototypes only).
- Rely on color alone, placeholder-only labels, or `outline: none` without a replacement focus ring.
- Animate purely for decoration, snap an expand/collapse, or ignore `prefers-reduced-motion`.
- Use "pill" to describe a button. Use `--radius-pill`, never `--radius-full`.
- Add decorative borders, boxed containers or helper text that restate the label.
- Use Title Case, trailing periods on buttons/labels, colons on input labels, or "Please", "Oops", "Successfully".
