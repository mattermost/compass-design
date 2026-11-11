# Results: Jira plugin migration, A / B1 / B2

Scored from the code, then updated with what you saw in the running B2. B1 and A were never run. Cells marked `observed` were seen in the app; `c` is code evidence only; `?` is not checked. Scale: 2 = correct, 1 = partly, 0 = not done or as in the review, `—` = not applicable.

- **A:** mattermost-plugin-jira PR 1391 at `2fe1dfa` (migration done before this skill work; scored from your review and the code).
- **B1:** first run from master, skills at `d546299`. Kept as branch `compass-migrate-eval-b-run1` (commit `a6c1cd7`).
- **B2:** second run from master, skills at `7b2de82`. Committed by the B2 session as `b3e5377` on `compass-migrate-eval-b2` (the prompt said not to commit; I don't know why it did). `.claude/` is untracked. The skills later moved on to `e93ac8d` (popover menu pattern, unique ids, other-skill learnings), which B2 did not see.
- No tool call in B1 or B2 touched the PR, the review or another branch.

| #   | Criterion                                                   | A                                                | B1                                                          | B2                                                                                                                         |
| --- | ----------------------------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 1   | Subscription modal animates                                 | 0 (`Modal` had no `open`)                        | 2c (`open` on overlay and modal)                            | 2 (observed: animates)                                                                                                     |
| 2   | Modal size on purpose                                       | 0 (`large`)                                      | 0 (`large`)                                                 | 2 (`medium` for subscriptions, `small` for connect and confirm)                                                            |
| 3   | Subtitle beside or removed                                  | 0 (stacked)                                      | 2 (no subtitle)                                             | 2 (`subtitlePlacement='beside'`)                                                                                           |
| 4   | Understated empty state, tabs not stacked                   | 0                                                | 1 (tabs; 2 `EmptyState`s remain, weight `?`)                | 1 (same; underlined tabs)                                                                                                  |
| 5   | "New / Edit Jira Subscription" titles                       | 0                                                | 1 (subscription titles changed on its own)                  | 0 (master's "Edit Jira Subscription for " / "Add Jira Subscription in " kept)                                              |
| 6   | Filter trash button tooltip                                 | 0                                                | 0                                                           | 2 (observed: tooltip shows)                                                                                                |
| 7   | Back button tooltip                                         | 0                                                | 0 (`backLabel='Back'`)                                      | 0 (observed: none; built-in Back button can't be wrapped, see gotcha 20)                                                   |
| 8   | Discard confirm only when dirty                             | 0                                                | 2c (`isDirty` on create and edit)                           | 2c                                                                                                                         |
| 9   | Confirm modals without dividers                             | 0                                                | 2c                                                          | 2c (and connect and disconnect)                                                                                            |
| 10  | Backdrop closes modals                                      | 0 (overlay had no `onClose`)                     | 2c                                                          | 2c                                                                                                                         |
| 11  | Error spacing across field types                            | 0 (your review: inconsistent below the combobox) | 2 (observed)                                                | 2 (observed)                                                                                                               |
| 12  | Read-only textarea looks read-only                          | 0 (your review: looks editable)                  | 2 (observed)                                                | 2 (observed: the message is a read-only `<p>`, not an input; whether B2 did this before or after your feedback is unknown) |
| 13  | Dates use the Compass date picker                           | 0                                                | 1 (`FormInput` renders `DateRangePicker`; icon theming `?`) | 1 (same)                                                                                                                   |
| 14  | Escape closes modals                                        | 0                                                | 0 (host swallows it: MM-71834, compass-design#247)          | 0 (same; no workaround added, as the skill says)                                                                           |
| 15  | Tabs underlined, full-width bottom border                   | 0                                                | 0 (default appearance)                                      | 2c (`appearance='underlined'`); border width `?`                                                                           |
| 16  | Form gaps even in every state                               | `?`                                              | 0 (gap on `.jira-form`, fields in a bare `<div>`; 16px)     | 2 (observed: spacing and grouping better than B1)                                                                          |
| 17  | Dividers off for short bodies, kept when lazy content grows | 0 (both always on)                               | 1 (confirm only)                                            | 2c (off on confirm, connect, disconnect; kept on create issue)                                                             |
| 18  | No JS error opening Create from `/jira create`              | `?`                                              | `?`                                                         | `?` (error text not captured)                                                                                              |
| 19  | Icon-only buttons use `WithTooltip`                         | 0                                                | 0                                                           | 2c (dependency and webpack externals added too)                                                                            |
| 20  | Filter row keeps its full width in its empty state          | `?`                                              | 0 (observed: three ~115px selects until a field is chosen)  | `?` (code: no wrapper `<div>` around the empty row; not run)                                                               |

## Observed in B2 (running app)

Animation (1), error spacing (11), form field spacing and grouping (16) and the trash tooltip (6) are good. The Back button in the modal header has no tooltip (7): the button is built into `ModalHeader`, so the plugin cannot wrap it, which the skill had not said. Tracked by compass-design#101 (header icon buttons); gotcha 20 and `not-covered.md` now say so.

## Observed in B1 (running app)

Error spacing across field types (11) and the read-only textarea (12) are good in B1, as in B2. Both were problems in A, which used compass-ui `alpha.27`. Since B1 and B2 are on `alpha.30` and both pass, the fix is probably the compass-ui version (or the migration approach) and not the skill changes between the runs. Treat rows 11 and 12 as not evidence for or against the skills.

## What changed between B1 and B2

- Rows that went from 0 to 2: size (2), tabs (15), dividers (17), tooltips (6, 19). Those match the guidance added between the runs.
- Row 16 went from 0 to 1: B2 read `spacing-and-hierarchy.md` (B1 never opened it), used 24px and moved the gap to the direct container.
- Rows that did not move: Escape (14, host defect), `EmptyState` weight (4), date picker (13), titles (5).
- B1 did better than B2 on row 5. B1 renamed the subscription titles without being asked, and B2 kept master's.

## Process rows (partial)

| #          | Criterion                                            | B1                                     | B2                                                   |
| ---------- | ---------------------------------------------------- | -------------------------------------- | ---------------------------------------------------- |
| P2         | Old libraries and theme plumbing removed             | 2 (no imports left)                    | 2 (one comment mentions react-select)                |
| P5         | Ran `compass-review`                                 | 2                                      | 2                                                    |
| P6         | Checks reported honestly                             | 2 (E2E and visual baselines "not run") | 2 (layout, Escape, E2E and baselines "not verified") |
| P7         | Skill triggered without being named                  | 2                                      | 2                                                    |
| P1, P3, P4 | Inventory table, UX changes listed, gaps asked about | not scored                             | not scored                                           |

## Confounds

- A used compass-ui `alpha.27` and an older base. B1 and B2 use `alpha.30` and master at `4ff56c9`.
- A had one round of fixes before it was reviewed. B1 and B2 had none.
- Both B runs are one run each, with no repeats. Differences of one row are noise until repeated.
- B2 ran on `7b2de82`, not the current `e93ac8d`.
- Rows 1, 10 and 14 to 17 are code evidence only. Escape (14) cannot pass in this webapp until the host handler is fixed.

## To finish scoring in the app

Still unchecked in B2: titles (5), empty state weight (4), date icon theme (13), tab border width (15) and the slash-command error (18). Still unchecked in B1: animation (1), titles (5), empty state weight (4), date icon theme (13), spacing in lazy-loaded states (16) and the slash-command error (18). A was not run, so its `c` and `?` cells stay as they are.
