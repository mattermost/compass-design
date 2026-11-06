# Component picker

Pick the Compass component by need before writing custom markup. Check `packages/compass-ui/src/components/` (or the package exports) if a name here is missing.

## Choosing the control for a field

Decide by what the user is giving you, in this order. Source: the Select, Combobox, Radio, Checkbox, Switch and Date Range Picker guidelines; items marked **[proposed]** are not in the guidelines.

**1. Yes/No**

- Applies instantly, reveals a secondary option, or enables a whole section: `Switch`.
- Part of a form submitted with a button (Create, Save, Validate): `Checkbox`. Never a `Switch` in a submit form.
- The user must actively pick between two named answers (True/False, On/Off, Yes/No, Enable/Disable): two `Radio`s side by side, 24px apart, hugging their content.

**2. One choice from a set**

- 4 options or fewer, mutually exclusive, worth seeing side by side: `Radio` group. Never more than 4 radios.
- 2 or 3 options where each deserves a visual or descriptive treatment (icon, title, short description): `CardButton` as a visual radio choice. Give each card an `icon`, a `title` and an optional `description`, set `selected` on the chosen one, wrap the cards in `CardButtonGroup`, which provides the radio-group role, roving tab stops and arrow-key selection. Give the group an accessible name; each card is `role="radio"` (the component sets `aria-checked` from `selected`).
- More than 4, still single-select: `Select`.
- Needs typeahead, is very long, or must be searched or created: `Combobox`.
- Action menus that don't capture a value are not fields: use `Dropdown` or `PopoverMenu`. `Dropdown` is only the trigger and `PopoverMenu` only the surface: the host owns open and close, focus, keyboard navigation and the menu semantics. A `Dropdown` that opens an action menu must override its default `aria-haspopup="listbox"` (use `"menu"`) and the host must make it operable by keyboard.

**3. Several choices**

- Few, independent: `Checkbox` group (about 6 or fewer **[proposed]**).
- Long or searchable: `Combobox` in multi-select mode (shows removable chips).

**4. Free input**

- Short single line: `TextInput` (it takes any native `type`). **Always set the type that matches the data**, plus `autocomplete` and `inputMode` where they help:

| Data                                                          | `type`                            |
| ------------------------------------------------------------- | --------------------------------- |
| Email address                                                 | `email`                           |
| Phone number                                                  | `tel`                             |
| Link or website                                               | `url`                             |
| A quantity or count you'd do math on (retries, limits, sizes) | `number` (set `min`/`max`/`step`) |
| Anything else short                                           | `text` (the default)              |

Identifiers that only look numeric (postal codes, account or ID numbers) stay `type="text"` with `inputMode="numeric"`, not `number`. **[proposed]** Passwords use `PasswordInput` and search uses `SearchInput`, not `TextInput` with that type.

- Multi-line: `TextArea`.
- Secret: `PasswordInput`. Search: `SearchInput`.

**5. Date**

- One date: `DateRangePicker mode="date"`. A range: `mode="range"`. Relative ranges ("last 7 days"): a `Select` of presets plus the picker.
- Don't use a native `type="date"` input.

**6. Prefer choosing over typing.** If the answer comes from a known set, use a choice control, not free text. Fewer keystrokes, fewer errors. **[proposed]**

## Inputs

| Need                                              | Use                                                                                                                                                                                                 |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Single-line text, email, URL, number              | `TextInput` (optional floating `label`, `message` for errors)                                                                                                                                       |
| Multi-line text                                   | `TextArea` (has `message`)                                                                                                                                                                          |
| Password                                          | `PasswordInput`                                                                                                                                                                                     |
| Search                                            | `SearchInput`                                                                                                                                                                                       |
| One choice, 4 options or fewer                    | `Radio` group                                                                                                                                                                                       |
| One choice between 2 or 3 visual options          | `CardButton` (visual radio)                                                                                                                                                                         |
| One choice, more than 4 options                   | `Select`                                                                                                                                                                                            |
| One choice or many, searchable, long or creatable | `Combobox`                                                                                                                                                                                          |
| Several independent choices, few                  | `Checkbox` group                                                                                                                                                                                    |
| Yes/No in a submit form                           | `Checkbox`                                                                                                                                                                                          |
| Yes/No that applies instantly                     | `Switch`                                                                                                                                                                                            |
| A single date                                     | `DateRangePicker mode="date"`                                                                                                                                                                       |
| A date range                                      | `DateRangePicker mode="range"`                                                                                                                                                                      |
| Field error or hint under an input                | the input's own `message` and `messageTone` props (`TextInput`, `TextArea`, `Select`, `Combobox`); they are linked with `aria-describedby`. Don't draw a separate `FieldMessage` under these inputs |
| Form-level error text                             | `ErrorMessage` or a `SectionNotice`                                                                                                                                                                 |

`DateRangePicker` is the only date component. Despite its name it is also the single-date picker. It takes a floating `label` like the other inputs; use it (it also names the trigger for assistive technology).

## Actions and navigation

| Need                                     | Use                               |
| ---------------------------------------- | --------------------------------- |
| Action                                   | `Button` (one `primary` per view) |
| Icon-only action                         | `IconButton`                      |
| Large tile action                        | `TileButton`, `CardButton`        |
| Overflow or context menu                 | `PopoverMenu` + `MenuItem`        |
| Switch between views of the same content | `Tabs`                            |
| Pagination                               | `PaginationDots`                  |

## Feedback and status

| Need                          | Use                                                                                                                                                                                                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Notice inside a page or panel | `SectionNotice`. Info, success and other non-error, non-warning notices are typically dismissable (`onDismiss`). Error and warning notices are not dismissable; they stay until the problem is resolved                                                      |
| Transient result              | `Toast`                                                                                                                                                                                                                                                      |
| Page-wide banner              | `GlobalBanner`                                                                                                                                                                                                                                               |
| Explanation on hover or focus | `Tooltip`                                                                                                                                                                                                                                                    |
| Label or status tag           | `Tag` (pick the `type` that matches the meaning: `info` or `info-dim` for context, `warning` for a caution or special mode, `success` and `danger` for results; `default` only for plain metadata with no status), `Chip` for removable or selectable values |
| Loading                       | `Spinner`, `ProgressBar`                                                                                                                                                                                                                                     |
| Nothing here yet              | `EmptyState` (see `writing.md` for the subtle variant)                                                                                                                                                                                                       |

## Containers

| Need                 | Use                                                                    |
| -------------------- | ---------------------------------------------------------------------- |
| Dialog               | `Modal` (+ `ModalHeader`, `ModalFooter`, `ModalOverlay` for the scrim) |
| Right sidebar header | `RightSidebarHeader`                                                   |
| Admin settings panel | `AdminPanel` (+ footer and header pieces)                              |
| Scrolling region     | `Scrollbar`                                                            |
| Separator            | `Divider`                                                              |

## When nothing fits

- Compass has no generic collapsible. For admin use `AdminPanel expandable` (a nested one needs a title and a subtitle; top-level admin panels should have a subtitle too). Elsewhere hand-build it per `motion-and-states.md` (grid `0fr` to `1fr`, `aria-expanded`, `aria-controls`, hidden content not tabbable) and keep the hand-built piece small.
- For anything else missing, build the minimum from tokens and existing components, mark it with a short comment ("stand-in for missing component X"), and say so in your report. Don't pull in another UI library.
