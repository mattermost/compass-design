---
name: compass-migrate
description: Migrate existing Mattermost plugin or webapp UI to @mattermost/compass-ui, replacing react-bootstrap, react-select, styled-components theming or custom inputs, modals, spinners and icons. Use when asked to adopt, migrate, port or swap UI to Compass in code that already ships, or to remove react-bootstrap or react-select. Covers the inventory-first process, infra changes, old-to-Compass component mapping, modal, form and async-select patterns, version-specific gotchas, Jest and Playwright updates, required checks and the report. For new UI use compass-build; to audit without changing code use compass-review; to turn a prototype into product code use prototype-to-production.
---

# Compass migrate

Move UI that already ships off react-bootstrap, react-select and custom components onto `@mattermost/compass-ui`. The risk in a migration is not the new code. It is the old code left behind, the files nobody listed, and behavior that changed without anyone saying so. The process below exists to prevent those three.

**Check the install first.** If `../compass-build/SKILL.md` or `../compass-build/references/checklist.md` doesn't exist, stop and tell the user to put the toolkit beside this skill with `npx skills add mattermost/compass-design --skill '*'` (add `--global` if this skill is installed globally and `--agent` with the agent you use, so the skills land beside this one); it ships `compass-build`, `compass-review` and this skill together. The plugin does not fix a standalone copy: it installs its own copy, used as `mattermost-compass-toolkit:compass-migrate`, after `/plugin marketplace add mattermost/compass-design` and `/plugin install mattermost-compass-toolkit@compass-design`. The Compass rules live in `compass-build`; this skill adds the migration process and does not repeat them.

**Versions.** The gotchas in this skill were checked against the compass-ui source at `0.1.0-alpha.30`, and the alpha.28 behavior they describe was checked at its release commit. The reference migrations used alpha.22 and alpha.23. Before you start, read the consumer's installed compass-ui version and the compass-ui `CHANGELOG.md`, and treat every entry in `references/gotchas.md` as true only for the versions it names. Some problems the reference migrations hit have since been fixed, and some have not.

## Rules

1. **Inventory before any edit.** Find every usage first and show the map. Without it, files get missed and old code is left behind.
2. **Copy a proven pattern, not a spec.** `references/patterns.md` has one tested example each for a modal, a form field, a select, an async select and a confirm dialog. Start from the one that matches.
3. **Delete the old plumbing.** Theme-prop architecture, react-select style overrides, wrapper components and unused dependencies go in the same change. Leaving them is the most common way a migration is "done" and still wrong.
4. **Don't build what Compass lacks. Ask.** Check `references/not-covered.md`. If a need isn't covered, stop and ask the user whether to keep the old component, build a local one, or wait. Mark anything kept with a `compass-gap:` comment and list it in the report.
5. **Say what changed.** Behavior and UX differences (a menu that no longer opens on focus, a backdrop that no longer dismisses, a different keyboard path) go in the report one by one. Don't leave them for a reviewer to find in the diff.
6. **Leave changes uncommitted** unless the user asks you to commit.

## Process

Work these in order. Ask the user when the consumer kind (core webapp or plugin, see `../compass-build/references/context.md`) or a mapping is unclear.

0. **Scope and branch.** Confirm the consumer, the area being migrated, the reference PR if the user gave one, and the branch to work on. Read the installed compass-ui version.
1. **Inventory, no edits.** List every usage of react-bootstrap, react-select, and every custom input, modal, spinner, avatar, icon, tooltip and theme-prop path. Include tests and styles that reference them. For each, name the Compass replacement from `references/component-mapping.md`, or mark it a gap. Show the table to the user.
2. **Infra.** Dependencies, entry stylesheet, bundler rules and lint config. Follow `references/infra.md`.
3. **Shared primitives first.** The wrappers other files import (a `Setting` or `Input` wrapper, a `Select`, a `Loading`, a confirm modal). Migrating these first shrinks every later step.
4. **Modals.** `ModalOverlay` plus `Modal`, with the footer submit tied to the form by id. See `references/patterns.md`.
5. **Everything else.** Then delete theme-prop plumbing, old style overrides, now-unused wrappers and dependencies.
6. **Tests.** Update unit and E2E tests for the new roles and behavior. See `references/testing.md`.
7. **Verify** with the checks below, then audit with the review skill.
8. **Report.**

## Required checks

You may not call the work done until every check has run and you have the output. If one can't run (no server for E2E, for example), say so in the report as not run.

- Unit tests (Jest or the consumer's runner) on the changed files, then the full suite.
- Lint on the changed files, and the type check.
- A production build of the bundle.
- E2E tests, if the consumer has them.
- Visual baselines, if the consumer keeps them: regenerate them, then open the PNGs and look at each one. A baseline you didn't look at proves nothing.
- Audit the changed code with the `compass-review` skill (listed as `mattermost-compass-toolkit:compass-review` when installed as a plugin) and fix what it reports, or list it under "Left as is".
- Search for leftovers: no import of the removed libraries, no unused wrapper files, no `theme` prop passed only to styling.

## Report

Finish with a short report in your final message, with these sections:

1. **Component mapping.** Old component, new component, files touched.
2. **Intentional UX and behavior changes.** One line each. Include anything a user or a test could notice.
3. **Bugs fixed** along the way.
4. **Left on the old stack or custom, with reasons.** Every `compass-gap:` item, and every file you deliberately did not migrate.
5. **Checks.** Each check above with its result, or "not run" with the reason.
6. **Versions.** The compass-ui version used, and any gotcha you worked around that a newer release may fix.

## Where things live

| Need                                                              | Read                                                  |
| ----------------------------------------------------------------- | ----------------------------------------------------- |
| Which Compass component replaces what, with the props that matter | `references/component-mapping.md`                     |
| Dependencies, stylesheet, bundler, lint, what to delete           | `references/infra.md`                                 |
| Modal, form field, select, async select, confirm dialog           | `references/patterns.md`                              |
| Behavior that trips agents, by compass-ui version                 | `references/gotchas.md`                               |
| Jest and Playwright updates, visual baselines                     | `references/testing.md`                               |
| What Compass doesn't cover yet (ask first)                        | `references/not-covered.md`                           |
| General Compass rules: tokens, spacing, a11y, writing             | `../compass-build/references/` (`checklist.md` first) |
