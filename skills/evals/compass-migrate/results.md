# Results: Jira plugin migration, A / B1 / B2

Scored from the code, then updated with what you saw in the running B2. B1 was run, but only some rows were checked in the app (they say `observed`); the rest are code evidence. A was not run. Cells marked `observed` were seen in the app; `c` is code evidence only; `?` is not checked. Scale: 2 = correct, 1 = partly, 0 = not done or as in the review, `—` = not applicable.

- **A:** mattermost-plugin-jira PR 1391 at `2fe1dfa` (migration done before this skill work; scored from your review and the code).
- **B1:** first run from master, skills at `d546299`. Kept as branch `compass-migrate-eval-b-run1` (commit `a6c1cd7`).
- **B2:** second run from master, skills at `7b2de82`. Committed by the B2 session as `b3e5377` on `compass-migrate-eval-b2` (the prompt said not to commit; I don't know why it did). `.claude/` is untracked. The skills later moved on to `e93ac8d` (popover menu pattern, unique ids, other-skill learnings), which B2 did not see.
- No tool call in B1 or B2 touched the PR, the review or another branch.

| #   | Criterion                                                   | A                                                | B1                                                                                                    | B2                                                                                                                         |
| --- | ----------------------------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 1   | Subscription modal animates                                 | 0 (`Modal` had no `open`)                        | 2 (observed: animates)                                                                                | 2 (observed: animates)                                                                                                     |
| 2   | Modal size on purpose                                       | 0 (`large`)                                      | 0 (`large`)                                                                                           | 2 (`medium` for subscriptions, `small` for connect and confirm)                                                            |
| 3   | Subtitle beside or removed                                  | 0 (stacked)                                      | 2 (no subtitle)                                                                                       | 2 (`subtitlePlacement='beside'`)                                                                                           |
| 4   | Understated empty state, tabs not stacked                   | 0                                                | 2 (observed: fine)                                                                                    | 2 (observed: fine)                                                                                                         |
| 5   | "New / Edit Jira Subscription" titles                       | 0                                                | 2 (observed: fine)                                                                                    | 2 (observed: fine)                                                                                                         |
| 6   | Filter trash button tooltip                                 | 0                                                | 0                                                                                                     | 2 (observed: tooltip shows)                                                                                                |
| 7   | Back button tooltip                                         | 0                                                | 0 (`backLabel='Back'`)                                                                                | 0 (observed: none; built-in Back button can't be wrapped, see gotcha 20)                                                   |
| 8   | Discard confirm only when dirty                             | 0                                                | 2c (`isDirty` on create and edit)                                                                     | 2c                                                                                                                         |
| 9   | Confirm modals without dividers                             | 0                                                | 2c                                                                                                    | 2c (and connect and disconnect)                                                                                            |
| 10  | Backdrop closes modals                                      | 0 (overlay had no `onClose`)                     | 2c                                                                                                    | 2c                                                                                                                         |
| 11  | Error spacing across field types                            | 0 (your review: inconsistent below the combobox) | 2 (observed)                                                                                          | 2 (observed)                                                                                                               |
| 12  | Read-only textarea looks read-only                          | 0 (your review: looks editable)                  | 2 (observed)                                                                                          | 2 (observed: the message is a read-only `<p>`, not an input; whether B2 did this before or after your feedback is unknown) |
| 13  | Dates use the Compass date picker                           | 0                                                | 2 (observed: fine)                                                                                    | 2 (observed: fine)                                                                                                         |
| 14  | Escape closes modals                                        | 0                                                | 0 (host swallows it: MM-71834, compass-design#247)                                                    | 0 (same; no workaround added, as the skill says)                                                                           |
| 15  | Tabs underlined, full-width bottom border                   | 0                                                | 0 (observed: rounded default tabs, in the body)                                                       | 1 (observed: underlined, but inset about 56px, border short of the edges, two separations in the header)                   |
| 16  | Form gaps even in every state                               | `?`                                              | 0 (observed: not good in the lazy-loaded states; gap on `.jira-form`, fields in a bare `<div>`, 16px) | 2 (observed: spacing and grouping better than B1)                                                                          |
| 17  | Dividers off for short bodies, kept when lazy content grows | 0 (both always on)                               | 1 (confirm only)                                                                                      | 2c (off on confirm, connect, disconnect; kept on create issue)                                                             |
| 18  | Icon-only buttons use `WithTooltip`                         | 0                                                | 0                                                                                                     | 2c (dependency and webpack externals added too)                                                                            |
| 19  | Filter row keeps its full width in its empty state          | 2 (observed: fine)                               | 0 (observed: three ~115px selects until a field is chosen)                                            | 2 (observed: fine)                                                                                                         |
|     | **Total, rows scored for all three (18 rows, max 36)**      | **2**                                            | **21**                                                                                                | **31**                                                                                                                     |
|     | **Total, every row scored for that run**                    | 2 / 36                                           | 21 / 38                                                                                               | 33 / 38                                                                                                                    |

**Reading the totals.** A's zeros come from your review, which listed what was wrong, so they are by construction and not an independent measurement. The one row A scores on that the review did not list (the filter row width) is observed and fine. Rows 11 and 12 pass on both B runs and probably reflect the compass-ui version, not the skills. Many B1 and B2 cells are code evidence only. One run per side.

## Final score

| Basis                                             | A      | B1       | B2       |
| ------------------------------------------------- | ------ | -------- | -------- |
| Rows scored for all three (18 rows, max 36)       | 2 (6%) | 21 (58%) | 31 (86%) |
| Same rows without 11, 12 and 14 (15 rows, max 30) | 2      | 17       | 27       |
| Every row scored for that run                     | 2 / 36 | 21 / 38  | 33 / 38  |

The second line drops the rows that don't measure the skills: 11 and 12 pass on both B runs on compass-ui alpha.30 and were broken on alpha.27, and 14 (Escape) can't pass in this webapp until MM-71834 or compass-design#247 ships.

**Result.** B2 scores highest on every basis, then B1, then A. B1 to B2 gained on modal size (2), the trash tooltip (6), tabs (15, partly), form spacing (16), dividers (17), `WithTooltip` (18) and the filter row (19). Rows 2, 6, 15, 16, 17 and 18 match guidance that B2's skills (`7b2de82`) had and B1's (`d546299`) did not. Row 19 does not: gotcha 30 was written after B2 ran, so that gain was incidental.

**What the remaining B2 misses are.**

- Tabs (15, scored 1): underlined tabs, but inset about 56px with two header separations. Pattern 7 and the Modals rule now describe the agents approach; B2 has not been re-run with them.
- Back button tooltip (7, scored 0): a Compass gap. The built-in header button can't be wrapped (compass-design#101).
- Escape (14, scored 0): a host defect (MM-71834, compass-design#247).

**How far to trust it.** A's score is mostly your review, so its zeros are by construction; its 2 is the filter row, which you observed. One run per side. Most B1 and B2 cells that were not in your review are code evidence; the rest are marked observed. B2 ran on skills `7b2de82`, not the final `9c3770e`, and I don't know whether B2 received follow-up instructions (it committed its own work). Treat this as evidence the updated skills move the result, not as a measured effect size.

## Observed in B2 (running app)

Animation (1), error spacing (11), form field spacing and grouping (16) and the trash tooltip (6) are good. The Back button in the modal header has no tooltip (7): the button is built into `ModalHeader`, so the plugin cannot wrap it, which the skill had not said. Tracked by compass-design#101 (header icon buttons); gotcha 20 and `not-covered.md` now say so.

## Observed in B1 (running app)

Animation (1) is good. Error spacing across field types (11) and the read-only textarea (12) are good in B1, as in B2. Both were problems in A, which used compass-ui `alpha.27`. Since B1 and B2 are on `alpha.30` and both pass, the fix is probably the compass-ui version (or the migration approach) and not the skill changes between the runs. Treat rows 11 and 12 as not evidence for or against the skills.

## Tabs in the modal (row 15)

B1 used Compass `Tabs` with the default rounded appearance, in the modal body. B2 used `appearance='underlined'` in `headerSlot`, but inside a padded wrapper and with the header divider left on, so the tab bar was inset about 56px (32px slot padding plus a 24px wrapper), its bottom border stopped short of both edges, and the header showed two separations. mattermost-plugin-agents does it right: `headerSlot={tabs}`, `headerDivider={false}`, `bodyPadding='none'`, and the slot padding zeroed (pattern 7 in `patterns.md`).

## What changed between B1 and B2

From the grid, rows where the two runs differ:

- 0 to 2: modal size (2), trash tooltip (6), form spacing in every state (16), `WithTooltip` (18), filter row width (19).
- 0 to 1: tabs (15): B2 used the underlined appearance but inset the bar and left two header separations.
- 1 to 2: dividers by body height (17).
- Same score in both: titles (5, both 2), empty state (4), date picker (13), error spacing (11), read-only value (12), animation (1), Escape (14, host defect) and the Back button tooltip (7, both 0).

Rows 2, 6, 15, 16, 17 and 18 match guidance B2's skills had and B1's did not. Row 19 does not: gotcha 30 was written after B2 ran.

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

## Not scored

- A was not run. Its `c` and `?` cells stay as they are (row 16 for A is `?`, which is why row 16 is not in the 18-row total).
- Process rows P1, P3 and P4 (inventory table, UX changes listed, gaps asked about) need the session reports read.
- B2 has not been re-run with the final skills (`9c3770e`), which add pattern 7 (tabs in the modal header), gotcha 30 (collapsed rows) and the Escape workaround note.
