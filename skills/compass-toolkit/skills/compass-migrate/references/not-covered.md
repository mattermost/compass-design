# What Compass doesn't cover yet

**Draft.** Derived from the components that exist in compass-ui `0.1.0-alpha.28` (`packages/compass-ui/src/components/`), not from a migration that hit each gap. Treat it as a starting point: an item listed here is missing from that version's component list, and an item missing from this list may still not fit your case. The owner of compass-ui should correct this list.

**The rule:** when you hit one of these, don't build a replacement on your own and don't hide it in the diff. Stop and ask the user which they want:

1. keep the old component for now,
2. build a small local component with tokens (mark it `compass-gap:` in a comment), or
3. wait for Compass to add it.

Whatever they choose goes in the report under "Left on the old stack or custom". Check `CHANGELOG.md` first: a release after the one installed may have added it.

| Need | Today | Notes |
| --- | --- | --- |
| Confirm or alert dialog | Compose `ModalOverlay` + `Modal` + two `Button`s (`patterns.md`) | No confirm component, and `Modal` sets `aria-modal` but not `role="alertdialog"`. Ask before adding the role. |
| Time picker | A `Select` of time options (`patterns.md`) | No time component. |
| Data table, grid or sortable list | None | No table component. |
| Pagination | `PaginationDots` only | A dot indicator, not a page-number pager. |
| Accordion, collapsible section | None | |
| Slider, range input | None | |
| Breadcrumbs, stepper | None | |
| Skeleton or loading placeholder | `Spinner`, `ProgressBar` | No skeleton component. |
| File upload or drop zone | None | |
| Color picker | None | |
| Generic popover with arbitrary content | `PopoverMenu` (a menu), `ProfilePopover`, `PopoverNotice`, `Dropdown` | No content popover. Host owns positioning for overlays other than the form widgets. |
| Form field wrapper (label, hint, error) | The input's own `label`, `message`, `messageTone` props | Intentional: `Setting`-style wrappers are deleted, not replaced. |
| Hover tooltip wiring | `Tooltip` is chrome only | The host owns hover, focus and positioning. In prototypes `WithTooltip` from `compass-proto` does it; plugins and the webapp use their own. |

## Not a gap

- A **date field** is `DateRangePicker` with `mode='date'`.
- A **multi-select with chips** is `Combobox` with `multiple`.
- A **creatable** or **async** select is `Combobox` (`patterns.md`).
- **Inline errors** are `ErrorMessage` or the input's `message`.
