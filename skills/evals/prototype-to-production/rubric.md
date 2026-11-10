# Rubric

Score each side 0 (no), 1 (partly) or 2 (yes). Fix this before either run; don't edit it after seeing the output.

## Boundaries

1. No `@mattermost/compass-proto` import or dependency.
2. No playground chrome or demo controls (SceneSwitcher, DeviceFrame, walkthrough, viewer/state/theme toggles, demo resets), including prototype-local ones.
3. No playground SCSS copied wholesale; tokens used, host style conventions followed.
4. Scope respected: every in-scope surface and entry point built; surrounding shells wired into, not replaced.

## Components

5. Compass components used wherever the consumer's installed version has them; no hand-rolled equivalents.
6. Overlays, menus and tooltips follow the host pattern; no second menu stack.
7. Variant props are lowercase kebab-case; `IconButton` gets `<Icon glyph>` without size and an `aria-label`.

## Behavior and variants

(Score each entry point separately and note any that is missing.)

8. Every variant from the spec and prototype handled and tied to a real host source (viewer, role, state, flag, user preference), not a fixture or prop.
9. Spec vs prototype: the spec wins on behavior, the prototype on look; every mismatch flagged with the side followed.
10. Real data and saving through the host's pattern, not fixtures or local-only state.
11. Prototype fixtures not shipped.

## Look (needs the running app)

12. Spacing between and within fields matches the prototype's SCSS values and the Compass form gaps (24px fields, 16px paired fields, 32px groups).
13. Every menu, picker and tooltip inside a modal shows above it.
14. Each variant and entry point looks like the prototype (states, alignment, wording, focus order).

## Quality

15. All user-visible strings use the consumer's i18n pattern, and the string files are updated.
16. Accessibility: visible labels, keyboard operation, focus; no reliance on prototype shortcuts.
17. Tests added or updated.
18. Version skew noted and no version bump made.
19. Lint, types and tests of touched files run and reported honestly.

## Added after the Universal Search evaluation (score from the next evaluation on)

These came from the developer's review of that run. Don't use them to rescore earlier runs.

20. Placement, size and motion match the prototype: anchor and offset, width, height rules (fixed, auto, minimum, maximum), transitions between states. With a variable height, the anchored edge doesn't move as the height changes, and the maximum height is set.
21. Compass parts the prototype hides or overrides (a removed close button, changed header or body padding, a custom input style, a transparent overlay instead of a dimmed scrim) are hidden or overridden the same way.
22. Secondary and transient states are built: autocomplete rows (with what they show, such as avatars), tips and footers, derived default lists, and their empty states.
23. Every entry point the change replaces opens only the new surface, never the old one as well.
24. Keyboard: Escape closes each overlay, focus returns to what opened it, Tab order matches the prototype's.

## Process (record, not scored)

- Did the skill trigger unprompted?
- **Report check (do this first):** does the final report open with the 11-row status table (required reads plus steps 1 to 10), each row done, skipped with a reason, or not applicable? A report without the table fails this check, even when the prompt asked for a short report.
- Did it create the eleven task-list items with the titles the skill gives, or write its own list?
- Did it invoke `compass-review` with the Skill tool (not just lint and type-check) and call `AskUserQuestion` before building?
- Which steps did it skip? Compare its report with the step 10 report template: every line present with a status?
- Questions asked before building (step 6 "Stop and ask"); decisions made silently.
- Did it run the app and look at it? Any install run through a shared `node_modules`?
- Fix rounds the developer needed.
- Anything surprising either side did.
