# Accessibility

Source: `/foundations/accessibility-guidelines`. Benchmark: WCAG 2.1 AA.

- **Contrast:** 4.5:1 normal text, 3:1 large text (18pt, or 14pt bold) and UI components. Use theme tokens; they are built to meet this.
- **Color alone never carries meaning.** Add an icon or text.
- **Keyboard:** everything focusable and operable with Tab, Shift+Tab, Enter, Space, arrows. Logical tab order follows reading order. Don't use positive `tabindex`.
- **Focus ring:** always visible on `:focus-visible`. Use Compass components (they ship it). Never `outline: none` without an equivalent.
- **Targets:** pointer min 24x24px, touch min 40x40px, at least 8px between adjacent targets (4px only in dense toolbars).
- **Overlays:** move focus in on open, trap it in modals, Escape closes, restore focus to the trigger. `Modal` does this by default; don't switch it off without a reason. Inner widgets call `preventDefault()` on Escape they handled.
- **Forms:** every field has a visible label that stays visible. The floating label (the component's `label` prop) is the default; a separate label is for cases where it is absolutely needed (e.g. admin left column labels). A placeholder alone never qualifies. Required fields get a trailing asterisk in the label plus native `required` or `aria-required`; the asterisk is `aria-hidden` and never relies on color alone. Errors are described in text and associated with the field. Use the correct `type` and `autocomplete`.
- **Icon-only controls:** `aria-label` required. Decorative icons and badges are `aria-hidden`; announce state in visually hidden text.
- **Dynamic content:** status updates and errors announced via `aria-live`/`role="status"|"alert"`.
- **Semantics:** native elements first (`button`, `a`, `input`, headings in order). ARIA only to fill gaps. Navigational CTAs are links; actions are buttons.
- **Motion:** respect `prefers-reduced-motion`. No flashing.
- **Text:** resizable, no fixed heights that clip enlarged text.
- **Test:** keyboard only pass, one screen reader pass (VoiceOver or NVDA), and axe.
