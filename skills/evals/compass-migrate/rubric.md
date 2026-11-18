# Rubric: Jira plugin migration (A = PR 1391 at 2fe1dfa, B = fresh run from master with the updated skills)

Score each row 0 (present as in the review), 1 (partly fixed) or 2 (correct). Score A from the review itself; score B from the running app, then the diff. Rows 1 to 13 are the review points on PR 1391 (review 5864577287).

| #   | Criterion                                                                                                                         | Evidence    |
| --- | --------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| 1   | Subscription modal animates in and out like the confirm modals                                                                    | Running app |
| 2   | Modal `size` chosen on purpose (review suggested `medium`)                                                                        | Diff, app   |
| 3   | Subtitle beside the title (`subtitlePlacement="beside"`) or removed, not stacked                                                  | App         |
| 4   | Initial empty state is understated (no stacked heavy `EmptyState`s); subscriptions and templates are not awkwardly stacked (tabs) | App         |
| 5   | New and edit modals titled `New Jira Subscription` / `Edit Jira Subscription`, no subtitle                                        | App         |
| 6   | Filter row trash `IconButton` has a tooltip                                                                                       | App         |
| 7   | Header Back button has a tooltip                                                                                                  | App         |
| 8   | Back and Cancel confirm a discard only when the form changed                                                                      | App         |
| 9   | Confirm modals have no header or footer divider                                                                                   | App         |
| 10  | A backdrop click closes every modal (the top one only when stacked). Escape is row 14                                             | App         |
| 11  | Error messages spaced the same under every field type                                                                             | App         |
| 12  | The read-only textarea in "Attach message to Jira issue" doesn't look editable                                                    | App         |
| 13  | Dates use the Compass date picker, and its icon is themed                                                                         | App         |

| 14 | Escape closes modals, or the host handler that swallows it is reported (webapp header search, MM-71834) | Running app, report |
| 15 | Tabs in a modal: underlined, in `headerSlot`, header divider off, one bottom border running edge to edge | App |
| 16 | Form fields are evenly spaced in every state, including lazy-loaded fields (24px, gap on the direct container) | App |
| 17 | Dividers are off for short modal bodies, and kept when lazy-loaded content makes the modal grow | App |
| 18 | Icon-only buttons the plugin owns use `WithTooltip` from `@mattermost/shared/components/tooltip` (row 6). The built-in `Modal` header Back and close buttons are excluded: a plugin cannot wrap them (compass-ui gap, scored in row 7) | Diff, app |
| 19 | Filter row keeps its full width in its empty state, not only once a field is chosen | App (open the subscription edit form with no filter chosen) |

Rows 11, 12 and 14 may be compass-ui or webapp defects, not skill misses. If B fails one, check the CHANGELOG and source before blaming the skill, and record it as "upstream".

## Process rows (from the report and the diff)

| #   | Criterion                                                                           | Evidence   |
| --- | ----------------------------------------------------------------------------------- | ---------- |
| P1  | Inventory table shown before any edit                                               | Transcript |
| P2  | Old libraries and theme-prop plumbing removed; no leftovers                         | Diff, grep |
| P3  | UX and behavior changes listed in the report, including every modal behavior choice | Report     |
| P4  | `not-covered.md` items asked about, not silently built                              | Transcript |
| P5  | Ran `compass-review` and fixed or listed what it found                              | Transcript |
| P6  | Checks reported honestly (unit, lint, types, build, E2E), with "not run" where true | Report     |
| P7  | Skill triggered without being named; list which skills loaded                       | Transcript |

## Confounds to record

- A used compass-ui `0.1.0-alpha.27`; B uses `0.1.0-alpha.30`. Z-index, `Modal` and `ModalHeader` behavior changed between them, so some rows may differ for that reason alone.
- A was reviewed once and had one round of fixes before review; B has had none.
- B's base is `origin/master` at 4ff56c9, A's base is older.
- One run per side is anecdotal.
