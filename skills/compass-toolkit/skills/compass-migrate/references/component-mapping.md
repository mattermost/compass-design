# Old component to Compass component

Use this in step 1 (inventory). Rows marked **seen** were migrated this way in a reference migration: `gcal` is mattermost-plugin-google-calendar PR 179 (compass-ui alpha.22), `dataminr` is mattermost-plugin-dataminr (alpha.22), `agents` is mattermost-plugin-agents (alpha.23). Rows marked **source** come from the compass-ui source at alpha.28. Anything not in this table: check `../../compass-build/references/components.md`, and if nothing fits, `not-covered.md`.

Import rule: subpath imports only, for example `@mattermost/compass-ui/components/combobox`. Never the root barrel. Icons come from `@mattermost/compass-icons/components`.

| Old | Compass | Notes |
| --- | --- | --- |
| react-bootstrap `Modal` (+ `Modal.Header`, `.Body`, `.Footer`) | `ModalOverlay` + `Modal` | **seen** (gcal). Header, body and footer become the `title` prop, children and the `footer` prop. The overlay owns the scrim, portal and scroll lock; the host owns `open`. |
| Custom confirm or "are you sure" modal | `ModalOverlay` + `Modal` with two `Button`s in `footer` | **seen** (dataminr, older hand-rolled version). Compass has no confirm component. See the confirm pattern. |
| react-bootstrap `Button`, or a custom `FormButton` | `Button` | **seen** (gcal). `emphasis` (`primary`, `secondary`, `tertiary`), `loading`, `disabled`, `destructive`, `type`, and `form` to submit a form from a modal footer. One `primary` per view. |
| A `Setting` wrapper (label, help text, input) | The input's own props | **seen** (gcal). `label` takes a `ReactNode`; Select and Combobox also take `message` and `messageTone`. Delete the wrapper. |
| Text `<input>` | `TextInput` | **seen** (gcal, dataminr). `label`, `required`, `value`, `onChange`. |
| `<textarea>` | `TextArea` | **seen** (gcal). |
| react-select `Select` (sync) | `Select` | **seen** (gcal `TimeSelector`). Takes `options` as `{label, value}`. |
| react-select `Async` | `Combobox` with `filter={false}`, `loading`, `onInputChange`, `selectedOptions` | **seen** (gcal). Recipe in `patterns.md`. |
| react-select `Creatable`, `AsyncCreatable` | `Combobox` with `creatable` and `onCreateOption` | **seen** (gcal attendees). |
| react-select multi | `Combobox` with `multiple` | **seen** (gcal). Shows removable chips. |
| Clearable single select | `Combobox` with `clearable` | **seen** (gcal channel selector). Calls `onChange(null)`. |
| Date `<input type=date>` or a date library input | `DateRangePicker` with `mode='date'` | **seen** (gcal). `mode='range'` for a range. |
| Time picker | `Select` of time options | **seen** (gcal). There is no time picker component; see `not-covered.md`. |
| Custom `Loading` or spinner | `Spinner` | **seen** (gcal, agents). |
| Custom `Icon` component, raw SVG or font icon | `<Icon glyph={<XIcon/>}/>` | **seen** (gcal). Glyph from `@mattermost/compass-icons/components`. Omit `size` unless deliberate. |
| Icon-only button | `IconButton` with `icon={<Icon glyph={...}/>}` and an `aria-label` | **seen** (gcal header, agents). Omit `size`; the button sizes the icon. |
| Inline form or request error | `ErrorMessage` | **seen** (gcal, dataminr). |
| Error, warning or info banner | `SectionNotice` | **seen** (gcal: `type='danger'`, `role='alert'`). |
| Empty list or panel | `EmptyState` | **seen** (gcal, agents). The action `Button` omits `size`. |
| Badge-like labels, filter chips | `Tag`, `Chip` | **seen** (agents, dataminr). |
| Avatars | `UserAvatar`, `UserAvatarGroup`, `TeamAvatar` | **seen** (agents). Pass a real image when you have one. |
| Context menu | `PopoverMenu` with `MenuItem` and `MenuGroupHeading` | **seen** (agents). Keep the consumer's own menu unless the task is to adopt this one. |
| Search box | `SearchInput` | **seen** (agents). |
| Tabs | `Tabs` | **seen** (agents). |
| Radio, checkbox, switch | `Radio`, `Checkbox`, `Switch` | **seen** (agents, dataminr). |
| Progress bar | `ProgressBar` | **seen** (agents). |
| Custom scroll container | `Scrollbar` | **seen** (agents). Needs the `simplebar-react` peer. |
| Admin console sections | `AdminPanel` and its header and footer parts | **seen** (agents, dataminr). |
| Tooltip | `Tooltip` | **source**. Chrome only: Compass `Tooltip` does no hover wiring or positioning. The consumer's host owns that. |
| styled-components `theme` prop, react-select `styles` | Delete. Use tokens (`var(--center-channel-color)`, `var(--spacing-l)`) | **seen** (gcal replaced a 128-line style file with three z-index constants and tokens). |

## What to record in the inventory

For each row you hit, capture: the file, the old component, the Compass replacement (or "gap"), and any behavior that will differ. The behavior column feeds section 2 of the report, so write it now, not at the end.
