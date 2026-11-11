# Motion and interactive states

Source: `/foundations/animation`, `.claude/rules/styling.md`.

## When to animate

Animate only when motion answers "where did this come from / go / what changed?". Show cause and effect, preserve continuity, never delay the next action. If it serves no state change, do not ship it. Product motion is subtle; flair belongs to marketing.

## Tokens (never hard-code)

| Scenario                                    | Easing              | Duration                                                                             |
| ------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------ |
| On-screen, small (hover, color, small move) | `--ease-transition` | `--duration-quick` (150ms)                                                           |
| On-screen, large travel (panel across view) | `--ease-transition` | `--duration-moderate` (300ms)                                                        |
| Entrance                                    | `--ease-entrance`   | `--duration-quick` (popovers/modals) or `--duration-moderate` (full panels, drawers) |
| Exit                                        | `--ease-exit`       | same as entrance                                                                     |

Default when unsure: quick + transition. Arrive gently, leave decisively.

## Patterns

- **Popover/menu:** scale 90% to 100% + fade, `transform-origin` toward the anchor. Reverse on close. `PopoverMenu` only does this when it gets `open` (the same as `Modal`): keep it mounted and pass `open`, don't render it conditionally.
- **Modal:** fade + drop from above with scale 98% to 100%. `ModalOverlay` fades the scrim with the same tokens.
- **Expand/collapse:** always animate. Grid `0fr` to `1fr`, `--duration-moderate`, keep content mounted, toggle `aria-expanded`.
- **Hide collapsed content from keyboard and assistive technology:** a clipped (`overflow: hidden`, 0-height) region keeps its controls tabbable and exposed to screen readers. Mark the collapsed content `inert` (or `visibility: hidden` after the collapse finishes), so nothing inside can take focus.
- **Unmounting surfaces:** use `useExitAnimation` so the exit can finish. Inside compass-ui, JS timers read the duration via `readDurationMs`, never a literal 150/300. Consumers can't import it: they use the components' own transitions (for example `usePopoverTransition`) or wait on `transitionend` and `transitioncancel`, with a fallback so a closed surface never stays mounted: skip the wait when no transition runs (such as under reduced motion), otherwise allow the full transition duration plus any delay before cleaning up. Clean up only while the surface is still closed, and after any replacement exit transition has finished; if it reopens or starts a new exit, cancel the pending cleanup.
- **Reduced motion:** honor `prefers-reduced-motion: reduce`. Drop flourishes; meaningful motion (spinner, progress) stays at minimum legible form.
- No decorative loops, parallax or staggered cascades in product UI. **[proposed]**

## Interactive states

Every interactive element has these, and they must be distinguishable without color alone.

| State            | Rule                                                                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Hover            | Subtle fill or underline (link). Fades in `--duration-quick`. Pointer only.                                                                |
| Focus-visible    | Ring via the `focus-ring` mixin (2px ring, 3px offset). Same hover appearance when it has no resting fill. Never remove without replacing. |
| Pressed/active   | Slightly stronger than hover.                                                                                                              |
| Selected/toggled | Instant. Do not animate the base state.                                                                                                    |
| Disabled         | `disabled` attribute; opacity no lower than 0.4. Explain why elsewhere if non-obvious.                                                     |
| Loading          | `loading` prop on Button; keep width stable.                                                                                               |

- Never transition `outline-*`. Never put a `background-color`/`color` transition on a control's base state; declare hover/press fades under `&:hover, &:active` only. State changes and focus leaving are instant.
- `:hover` and `:focus-within` together for row chrome, so keyboard users get revealed actions.
- Revealed overflow menus fade with `opacity` and `pointer-events`, never `display: none` (keeps them tabbable).
- Form fields, checkboxes, radios and switches keep their own field rings. Don't replace them with the button ring.
- Link-emphasis Button: no padding, no resting underline, hover = underline only.
