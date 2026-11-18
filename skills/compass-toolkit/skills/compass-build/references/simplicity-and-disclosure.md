# Simplicity, redundancy and progressive disclosure

Source: Compass principles (Fast, Obvious, Forgiving) and the Obvious principle's "distractions minimized, superfluous elements omitted". Specific numbers and patterns here are **[proposed]**.

## Strip what is unnecessary

Before finishing, try deleting each of these. Keep it only if something breaks:

- A title that repeats the page, tab or button that opened it.
- A label that repeats its section title; helper text that repeats its label.
- An icon next to a label that already says the same thing (keep icons that aid scanning in dense lists and menus).
- A container, border, shadow or fill around content that spacing already groups.
- A second way to do the same thing in the same place.
- Explanatory paragraphs a good label would make unnecessary.
- Disabled controls that can never be enabled in the current context (hide them).

## Progressive disclosure

Show the common path. Reveal the rest on request.

- **Defaults first.** Pick good defaults so most users skip the setting.
- **Group advanced options** behind an expandable section ("Advanced"), animated per `motion-and-states.md`. Closed by default.
- **Secondary actions** go in an overflow `PopoverMenu`, not in a row of buttons. Keep at most one or two visible.
- **Details on demand:** tooltips for names, popovers for previews, a detail panel for the rest. Don't hide required information.
- **Long flows:** split into steps only when steps depend on each other; otherwise one page with sections.
- **Empty states** explain and offer one action. Don't pre-render empty tables full of headers.
- Never hide the primary action or an error. Anything the user must act on stays visible.
- Never hide something behind hover only. It must also be reachable by keyboard and touch.

## Progressive disclosure for form fields **[proposed]**

Decide per field, not per feel.

**Always visible**

- Required fields.
- Fields most people change every time.
- Fields needed to understand what the form is for.

**Collapse into a section** (only if every field inside is optional or already has a valid default)

- Optional fields most people skip.
- Fields with a sensible preset.
- Advanced or rarely changed fields.

**Reveal conditionally** (show only when a controlling field makes them relevant, animated in)

- A follow-up field that only matters for one answer of another field.
- Never leave a field disabled forever; remove it instead.

**Never hide**

- **A required field is never inside a collapsed section.** Neither is a field with an error, or the primary action. A field with a preset value that people usually accept may collapse only if it is optional.
- If validation fails inside a collapsed section, open it and focus the first error.

**How to build it**

- A section holds at least two fields. A single optional field is just an optional field.
- Label the section with a noun ("Agreement terms"), not a verb. Use a button with `aria-expanded` and `aria-controls`; collapsed content must not be tabbable.
- Show a one-line summary of the current values (or the defaults) under a collapsed section so nothing important hides.
- Order: required fields first, then common optional, then the collapsed section, then the submit area.
- If more than about 7 or 8 fields are visible, group them under titles or collapse some. Don't scroll a flat list.

### Collapsible section style

Compass has no collapsible component yet. Until it does, hand-build it to the Figma spec (MM-68628 Interactive Blocks, "Collapsable"):

- **Container:** always bordered, 1px `rgba(var(--center-channel-color-rgb), 0.08)`, `--radius-s` (4px). Never borderless.
- **Header:** a full-width button, at least 44px tall (it grows when the title or summary wraps, for long translations or enlarged text), 12px padding. A 16px chevron (`<Icon size="16" glyph={...} />`; an `Icon` with no `size` defaults to 24 and looks oversized), right when collapsed, down when expanded, 4px gap, then the title: 14/20 semibold, body font (Open Sans). Optional right-aligned detail text (12/16, e.g. "6 steps") at the far edge; use it for the summary of values or a count.
- **Hover:** a subtle fill on the whole header (about 4% of the center channel color). Focus follows the button focus ring.
- **Expanded body:** 16px padding. Content title and text sit 8px apart.
- **Stacked collapsibles:** 12px between them.
- Behavior as above: `aria-expanded`, `aria-controls`, animated per `motion-and-states.md`, collapsed content `inert` so it is neither tabbable nor exposed to assistive technology.
- Figma's detail text is 56% opacity; the skill keeps the text floor of 72%.

## Forgiving, not noisy

- Confirm destructive or irreversible actions; don't confirm reversible ones, offer undo instead.
- Preserve user input on error or disconnect.
- Prefer inline feedback near the action over a toast; reserve toasts for background results.
