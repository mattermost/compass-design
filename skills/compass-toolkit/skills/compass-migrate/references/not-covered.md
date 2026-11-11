# What Compass doesn't cover yet

**Draft.** Derived from the components that exist in compass-ui `0.1.0-alpha.28` (`packages/compass-ui/src/components/`), not from a migration that hit each gap. Treat it as a starting point: an item listed here is missing from that version's component list, and an item missing from this list may still not fit your case. The owner of compass-ui should correct this list.

**The rule:** when you hit one of these, don't build a replacement on your own and don't hide it in the diff. Stop and ask the user which they want:

1. keep the old component for now,
2. build a small local component with tokens (mark it `compass-gap:` in a comment), or
3. wait for Compass to add it.

Whatever they choose goes in the report under "Left on the old stack or custom".

The **Issue** column links the compass-design issue that tracks the gap. Read it before you ask, because it may already say what is planned. "None filed" means no issue exists yet: tell the user, and don't file one unless they ask. Check `CHANGELOG.md` first: a release after the one installed may have added it.

| Need | Today | Notes | Issue |
| --- | --- | --- | --- |
| Confirm or alert dialog | Compose `ModalOverlay` + `Modal` + two `Button`s, with `headerDivider={false}` and `footerDivider={false}` (`patterns.md`) | No confirm component, and `Modal` sets `aria-modal` but not `role="alertdialog"`. Ask before adding the role. | [#234](https://github.com/mattermost/compass-design/issues/234) |
| Time picker | A `Select` of time options (`patterns.md`) | No time component. | [#235](https://github.com/mattermost/compass-design/issues/235) |
| Data table, grid or sortable list | None | No table component. | None filed |
| Pagination for paged data (page numbers, next and previous) | None | `PaginationDots` is not a substitute: it marks the current step in a form or slideshow, not a page of data. Don't use it to replace a pager. | [#91](https://github.com/mattermost/compass-design/issues/91) (Prev/Next control) |
| Accordion, collapsible section | None | | None filed |
| Slider, range input | None | | [#123](https://github.com/mattermost/compass-design/issues/123) |
| Breadcrumbs | None | | None filed |
| Step indicator with labels | `PaginationDots` marks the current step in a form or slideshow, with no labels | | None filed |
| Number input increment and decrement controls | Native browser spinners on `TextInput type="number"` | | [#105](https://github.com/mattermost/compass-design/issues/105) | None filed |
| Skeleton or loading placeholder | `Spinner`, `ProgressBar` | No skeleton component. | None filed |
| File upload or drop zone | None | | None filed |
| Color picker | None | | None filed |
| Generic popover with arbitrary content | None | The popover-style components are specific: `PopoverMenu` is a menu surface for `MenuItem` rows, `PopoverNotice` is a short dismissable message card, `ProfilePopover` shows a user profile. `Dropdown` is a heading-style trigger button that opens a `PopoverMenu`, not a popover. Host owns positioning for overlays other than the form widgets. | [#111](https://github.com/mattermost/compass-design/issues/111) covers menu overlay parts, not content popovers |
| Form field wrapper (label, hint, error) | The input's own `label`, `message`, `messageTone` props | Intentional: `Setting`-style wrappers are deleted, not replaced. | n/a |
| Hover tooltip wiring (show on hover or focus, positioning) | `Tooltip` is chrome only | Better support in compass-ui is planned. Until it ships, the host owns hover, focus and positioning: prototypes use `WithTooltip` from `compass-proto`, and plugins and the webapp use their own. Check `CHANGELOG.md` for a newer release before wiring a tooltip yourself, and don't build a shared hover helper as part of a migration. | [#82](https://github.com/mattermost/compass-design/issues/82), [#101](https://github.com/mattermost/compass-design/issues/101) |

## Not a gap

- A **date field** is `DateRangePicker` with `mode='date'`.
- A **multi-select with chips** is `Combobox` with `multiple`.
- A **creatable** or **async** select is `Combobox` (`patterns.md`).
- **Inline errors** are `ErrorMessage` or the input's `message`.
