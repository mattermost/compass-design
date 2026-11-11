---
name: compass-review
description: Audit existing Mattermost UI code against the Compass design rules without changing it. Use when asked to review, audit, check or lint a screen, component, plugin UI, prototype, file, folder, diff or pull request for Compass compliance, design consistency, token use, accessibility or UX writing. Read-only by default; it reports findings with file and line and the rule each one breaks. To build or fix UI, use compass-build.
---

# Compass review

Audit code against the Compass rules and report what breaks them. **Do not edit files** unless the user asks you to fix findings after reading the report.

**Check the install first.** If `../compass-build/SKILL.md` (it holds the version note) or `../compass-build/references/checklist.md` doesn't exist, stop and tell the user to put `compass-build` beside this skill with `npx skills add mattermost/compass-design --skill '*'` (add `--global` if this skill is installed globally, and `--agent` for the agent in use). The plugin brings its own separate copy instead; see [the toolkit README](https://github.com/mattermost/compass-design/blob/main/skills/compass-toolkit/README.md). Don't audit without the rules.

The rules live in `compass-build`. Read `../compass-build/references/` as needed (`checklist.md` first). This skill and `compass-build` are installed together. Before reporting, read `compass-build`'s version note and check the installed component API (for example whether `DateRangePicker` has `label` and `Select` has `message`). Don't report a missing prop-based pattern as a violation if the installed version can't do it; apply the documented fallbacks and report the gap instead.

Rules tagged **[proposed]** in those files are suggestions, not violations: report them as "Suggestion", never as a blocker.

## Input

A file, folder, component, diff or PR. If the target is unclear, ask which one. For a PR or diff, review only what changed.

## Workflow

1. **Pick the context:** core feature, plugin or prototype (`references/context.md`). It changes what counts as a violation (for example, `compass-proto` imports are fine only in a prototype).
2. **Scan for mechanical issues** (search, then read each hit in context):
   - Raw values: hex colors, `px` for spacing, font sizes, radii, shadows, `ms`, `ease` keywords.
   - Inline `style={{ ... }}` with tokenizable values, `!important`, deep selectors into Compass components.
   - Root-barrel imports from `@mattermost/compass-ui`, or the standalone stylesheet loaded in a host.
   - More than one primary Button in a view (count a `Button` with no `emphasis` prop, or `emphasis={undefined}`, as primary, since that is its default); `secondary` where `tertiary` is the norm.
   - `IconButton` without `aria-label`, or with a raw glyph (a Blocker or Should fix). An explicit icon `size` is allowed as a deliberate override: report it as a Suggestion, not a violation.
   - A `Switch` inside a form with a submit button; Radio groups of more than four options.
   - Modals: a `ModalOverlay` with no `onClose`, a `Modal` with no `open`, or an overlay rendered only while visible (no motion, no Escape or backdrop close); `size` left at the default without a reason; a subtitle that could be `subtitlePlacement="beside"` or removed; a create or edit title that isn't the plain `New <thing>` / `Edit <thing>`; confirm dialogs with dividers on.
   - Forms: `gap` set on a `<form>` while fields sit inside a wrapper `<div>` or lazy-loaded section; `--spacing-l` between floating-label fields (the rule is `--spacing-xxl`).
   - A `PopoverMenu` rendered conditionally or without `open` (no enter or exit motion).
   - Duplicate field `id`s rendered on one screen (a selector with a fixed default `id` used several times).
   - Modals: `Tabs` without `appearance='underlined'`; both dividers on for a short body.
   - Icon-only `IconButton` (trash, back, close in a row or header) with no tooltip.
   - A discard confirm that opens without comparing the form to its initial values.
   - A native `type=date`, or a `readOnly` field styled like an input; two `EmptyState`s stacked in one view; sections stacked that `Tabs` would separate.
   - `TextInput` without a fitting `type` (email, tel, url, number).
   - Text alpha below 0.72, icon alpha below 0.56.
   - Hardcoded English in `aria-label`, `title` or `placeholder` inside components.
3. **Read the code for judgment issues** against the references: spacing and grouping, heading font and gaps, hierarchy, control choice, labels and required marking, disclosure, states and focus, motion, writing, accessibility.
4. **Run the project's checks, safely.** Read the lint, type-check and test scripts and any lifecycle hooks (`pre*`/`post*`, test setup) first. Skip anything that can write files (for example a script with `--fix`, a formatter in write mode, or a test hook that updates snapshots) or whose behavior is unclear, and say you skipped it. If working in the webapp, a plugin or the playground, use that project's own scripts. If working in the compass-design repo itself: `npm run lint` and `npm run lint:styles` from the repo root, `npm test` in `packages/compass-ui`. Include failures; do not fix them, and report which checks were unavailable.
5. **Write the report.**

## Report format

Group findings by severity, most serious first.

- **Blocker:** breaks accessibility, hardcodes colors or spacing that break themes, or breaks a "Never" rule.
- **Should fix:** a clear rule violation that does not break use.
- **Suggestion:** a **[proposed]** rule, or a judgment call.

Each finding, in one block:

```
[Severity] path/to/file.tsx:42 — short title
Rule: references/<file>.md, "<rule name>"
Found: what the code does
Fix: what it should do (token, component or value)
```

End with:

- **Summary:** counts by severity and the two or three issues that matter most.
- **Could not verify:** anything that needs a browser (theme, keyboard, screen reader, contrast, visual spacing) or a tool that did not run.

Keep findings short and concrete. Quote the rule; do not restate the guideline. Don't pad the report with praise or with rules that passed.

## After the report

Fixing is a separate step. If the user wants it, switch to `compass-build` and follow its "Retrofitting existing UI" section, working from this report.
