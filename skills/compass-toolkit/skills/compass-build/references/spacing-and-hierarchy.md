# Spacing, grouping and hierarchy

Source: `/foundations/spacing`, `/foundations/layout`, root `AGENTS.md` (button rules). Everything marked **[proposed]** is a starting point to be replaced by team-approved values. Sections marked **[TODO]** are waiting on design examples.

## Baseline (from the guidelines)

- Base unit **8px**; sub-unit **4px** for type, icons, badges and tight controls; 2px only for hairline cases. Layout dimensions land on multiples of 8 where possible.
- Body line heights are multiples of 4px.
- Default container padding is **16px** (`--spacing-l`) for a card or panel.
- Layout margins are greater than or equal to gutters.
- Persistent panels (channel sidebar, RHS) sit outside the grid; the center region reflows to the remaining width.
- Targets: pointer 24x24px, touch 40x40px, min 8px between adjacent targets.
- Don't set spacing on both sides of adjacent text elements (margins collapse). Choose one direction.

## The proximity principle **[proposed]**

Space communicates relationship. Always: **gap inside a group < gap between groups < gap between sections.** If two things have the same gap but are unrelated, or different gaps but are related, the screen reads as wrong. Use the scale steps, never in-between values.

| Relationship                                        | Gap token **[proposed]**                |
| --------------------------------------------------- | --------------------------------------- |
| Icon to its label, tag to tag                       | `--spacing-xxxs`–`--spacing-xs` (4–8px) |
| Items in one group (list rows, button group, chips) | `--spacing-xs` (8px)                    |
| Options in one radio or checkbox group              | `--spacing-m` (12px)                    |
| Text/select fields in one group                     | `--spacing-xxl` (24px)                  |
| Between sub-groups inside a group                   | `--spacing-xxl` (24px)                  |
| Between field groups (sections)                     | `--spacing-xxxl` (32px)                 |
| Panel/card/modal body padding                       | `--spacing-l`–`--spacing-xxl`           |

Prefer a **gap** on the parent (`flex`/`grid` + `gap`) over margins on children.

## Separation: space first **[proposed]**

Reach for separators in this order: (1) space, (2) subtle fill change, (3) hairline divider (`Divider`, `rgba(var(--center-channel-color-rgb), 0.08)`), (4) card/border/shadow. Established components may combine cues (e.g. admin panels use a border plus elevation); follow the component, and don't add extra cues on top of it. Don't box a group that spacing already separates. In dense lists, a divider between groups of items (e.g. menu groups), not between every row.

## Hierarchy

- One clear focal point per view: one title, one primary action.
- Order of emphasis: title, primary action, section titles, body, secondary text. If everything is bold, nothing is.
- Reading order equals visual order equals tab order.

## Buttons and actions

- **One `emphasis="primary"` Button per view.** Every other action is `tertiary` by default, or `quaternary`, `dim` or `link` when lighter. Avoid `secondary` unless a design calls for it; it is rarely used and may be phased out.
- Use the weakest emphasis that still finds the action: `tertiary` for the main alternative (Cancel, back) and for most other actions, `quaternary` for in-row and toolbar actions, `link` for inline navigation.
- Two actions of equal weight: pick one primary, make the other `tertiary`.
- Destructive primary actions (delete) use the destructive treatment; the safe action stays `tertiary`.
- Action position follows the alignment of the content the actions apply to (Button guideline): modal footers right-aligned; in-page actions left-aligned under left-aligned content; centered under centered content. The primary sits on the outer edge the group is aligned to: **left-aligned groups put the primary left-most; right-aligned groups (modal footers) put it right-most.** Avoid centered action groups; if unavoidable, the primary is right-most. Lower-emphasis actions follow inward. Gap `--spacing-xs`. (Matches the Button guideline's Positioning section.)
- Icon-only actions are `IconButton`. Lists of many actions collapse into one overflow menu.
- Button labels: verb first, 4 words max.

## Forms

Measured from the Figma "Apps Framework Components" form (node 5:7570, 536px wide). These values hold for end-user and modal forms. Fields inside admin panels use the two-column setting-row layout in the next subsection. A compact density is unconfirmed.

**Vertical rhythm** (top to bottom of the form):

| Between                                                                                                                                       | Gap                                                                                                        |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Form title/description, notice, form, action buttons                                                                                          | `--spacing-xxl` (24px) each                                                                                |
| Field group title (Heading 200, 16/24 semibold) and its first field                                                                           | `--spacing-l` (16px)                                                                                       |
| Text/select fields in one group                                                                                                               | `--spacing-xxl` (24px)                                                                                     |
| Fields with **separate labels above** (not floating): bottom of one field to the top of the next label                                        | `--spacing-l` (16px), which is 8px less than the floating-label gap, because the label already adds height |
| Separate label and its field                                                                                                                  | `--spacing-xs` (8px)                                                                                       |
| Text input and its error message                                                                                                              | `--spacing-xs` (8px)                                                                                       |
| Field group and the next field group                                                                                                          | `--spacing-xxxl` (32px)                                                                                    |
| Sub-group title (Heading 100, 14/20 semibold) and its controls (radios, checkboxes, switch, or text fields grouped under it, like an address) | `--spacing-m` (12px)                                                                                       |
| Options in one radio/checkbox group                                                                                                           | `--spacing-m` (12px)                                                                                       |
| Sub-groups inside a field group (radio list, checkbox list, switch)                                                                           | `--spacing-xxl` (24px)                                                                                     |
| Nested group (bordered container) padding and field gap                                                                                       | `--spacing-xxl` (24px)                                                                                     |
| Last group and an "Add another" link                                                                                                          | `--spacing-xxl` (24px)                                                                                     |
| Buttons in an action group                                                                                                                    | `--spacing-xs` (8px)                                                                                       |

Other measurements:

- Single column, fields full width. Text inputs are 40px tall.
- **Labels: use the floating label by default** (the component's `label` prop; it stays visible). Use a separate label only when it is absolutely needed: admin rows with a left label column, or a widget that has no floating label support (none of the standard inputs today: `TextInput`, `TextArea`, `Select`, `Combobox` and `DateRangePicker` all take `label`). With separate labels above, field-to-field gaps drop from 24px to 16px (see the vertical rhythm table). Avoid mixing floating and separate labels in one stack of fields where possible; when it can't be avoided, keep each field's own gaps (use the separate-label gap only around the field that has one). Never add a separate label above a field that already has a floating label, and never stack a group title directly on a separate label. Radio, checkbox and switch groups keep their short semibold title (that is a group title, not a field label). Error text is 12/16 (Body 75) in `--error-text`, with a 12px icon, 8px below its input.
- Radios, checkboxes and switches are 20px rows with a short semibold title above the list.
- A form-level error uses `SectionNotice` at the top, above the first group.
- Group related fields under one field group title. Don't title a group that has one field.
- **Required fields:** mark each required field with a trailing asterisk in its label (`Department *`). Individual fields only, never a group title; inside a required group, mark each required field itself. The asterisk is visual: wrap it in an `aria-hidden` span and also set native `required` or `aria-required` where the component allows it, so assistive tech announces "required" instead of "star". Never rely on the asterisk's color alone. If nearly every field is required, mark the optional ones with "(optional)" instead. Compass has no built-in marker yet, so add it in the label text (a component gap). Because that makes `label` a React node, also pass a plain string `listboxLabel` (or `aria-label`) to `Select` and `Combobox` so the options list keeps the field's name instead of "Options". If both are set, `aria-label` takes precedence over `listboxLabel`. Use `Select`'s `required` prop for the required state.
- Helper text only when it adds something the label cannot. Prefer fewer fields over more help text.
- Validation: errors after blur or submit, not on first keystroke. Message states the fix. Keep it associated with the field.
- Footer actions sit under the form. In modals (`ModalFooter`) they are right-aligned with the primary right-most; in-page forms are left-aligned with the primary left-most.
- **Switch vs checkbox:** a `Switch` applies instantly and needs no Save. In any form that is submitted with a button (Create, Save, Validate), use a `Checkbox` for yes/no fields instead. Never put a `Switch` in a form that has a submit button.
- **Paired fields:** two short, clearly related fields may sit side by side (city and state, postal code and country), `--spacing-l` (16px) apart. Never more than two per row; full width on narrow containers.
- **Boolean radios** (True/False, On/Off, Yes/No, Enable/Disable) sit side by side in one row, `--spacing-xxl` (24px) apart, each hugging its content. Never stretch them to the column width or spread them to the ends.

### Modals **[proposed]**

From the Jira plugin migration review.

- **Field gaps live on the element that directly contains the fields.** `gap` on a form only spaces its direct children. A wrapper `<div>` or a lazy-loaded or conditional section inside the form gets no gap, and its fields sit against each other. Render those fields as direct children (a Fragment), or give the wrapper the same flex column and gap.
- **Rows of controls keep their width in every state.** `align-items: flex-start` on a flex column shrinks each child to its content, and a bare wrapper `<div>` around a `width: 100%` row shrinks with it, so a row of empty or disabled selects collapses to a sliver until its content grows. Keep the default `stretch` (or give the wrapper `width: 100%`) and don't wrap repeating rows in bare `<div>`s. Check repeating rows empty, populated and disabled.
- **Dividers follow the body height.** `Modal` shows header and footer dividers by default. When the body is short (it never scrolls and holds a few lines or fields: a confirm, connect or disconnect, a one or two field form), turn both off with `headerDivider={false}` and `footerDivider={false}`. Keep them when the body can scroll or is a long form, where they mark the edge of scrolling content. **Exception: judge by the tallest state.** If lazy-loaded or conditional content (fields that arrive after a fetch, a section that appears on a choice) makes the modal grow, keep the dividers even if the first render is short, and don't switch them on when the content arrives (the layout would jump).
- **Tabs in a modal go in `headerSlot`, with the underlined appearance, and the header divider off.** **Check the installed `Modal` props first**: if it has a prop for the slot padding or for tabs (tracked in mattermost/compass-design#371), use it and skip the selector below. Until then the selector is a documented workaround, not a violation. This is how mattermost-plugin-agents builds its settings modal: `headerSlot={tabs}`, `headerDivider={false}`, `bodyPadding='none'` (the panels own their padding). The tab bar's own bottom border is then the only line under the header and runs edge to edge; with the header divider left on there are two separations. `headerSlot` has built-in padding (16px top, 32px sides, 24px bottom), which insets the bar and stops its border short of the edges, so zero the bottom and side padding (compass-ui has no prop for it, so it takes a selector on the generated class name; scope it to your tabs with `[class*='modal-header__slot']:has(> .your-tabs) {padding: var(--spacing-xs) 0 0}`, and comment why). Keep a small top padding: zeroing all of it leaves no gap between the title row and the tabs. Keep the bottom at 0 so the rule meets the body. Inset the tab strip by padding the `Tabs` root (the rule is a `box-shadow` on the root, so it still runs edge to edge): `padding: 0 var(--spacing-xxxl) 0 calc(var(--spacing-xxxl) - var(--spacing-xs))`. An underlined tab has its own `--spacing-xs` of side padding, so subtract it on the left or the label sits 8px right of the title. Don't put the bar in the body, and don't add a padded wrapper around it: the Jira B2 run did, and got the bar inset about 56px with the border short of both edges.
  - **Don't put the modal's action in `Tabs` `controls`.** The button sits tight against the bar's rule, and adding room around it makes the bar taller, so the top-aligned tabs stop short of the rule and fixing that needs overrides on Tabs' internal classes (`tabs__controls`, `tabs__tab-list`). Use the modal's `headerAction` prop instead: it puts the button in the title row before the close button, and `Tabs` stays unmodified.
  - **Never override Tabs internals** to fix spacing. Adjust the modal slot and the `Tabs` root only, and report anything else on mattermost/compass-design#371.
- Subtitle, title and size: a short subtitle goes beside the title (`subtitlePlacement='beside'`), a create or edit modal has a plain title and no subtitle, and `size` is chosen on purpose.

### Right sidebar (RHS) forms

- Padding is `--spacing-xxl` (24px) on all sides. The form is a single column at the RHS width (500px is the common width; it can be narrower); the values above apply unchanged.
- If the form has an action footer, it is **pinned** to the bottom of the panel, and the form scrolls above it. Footer padding is `--spacing-xxl`; actions are left-aligned with the primary left-most.
- **Full-width dividers (only for the parts the panel has; a form without tabs or without a footer skips the matching rule):** when there is a tab bar, its bottom border spans the full width of the RHS, edge to edge, ignoring the 24px content padding. When there is a footer, its top border does the same and is always shown (1px `rgba(var(--center-channel-color-rgb), 0.12)` **[proposed value]**), not only when content scrolls under it. The tab bar and footer are not inside the padded form area. **When there are tabs, the first tab's label lines up with the left edge of the content margin (24px)**, not its button box: an underlined tab has 8px of its own horizontal padding, so inset the tab strip by 16px (24px minus 8px).
- Only the header is fixed. Everything else scrolls with the content, including any connect or status strip above the tabs, intro text and notices. **If there is a tab bar, it is sticky, not fixed:** it sits where the design puts it, partway down below any strip, and scrolls with the content until it reaches the top (just under the header), then sticks there (`position: sticky; top: 0`, with the panel background and a z-index above the content). Build it inside the scroll area, as a direct child of the scrolling content wrapper.
- When there is a footer, it holds only the actions, with `--spacing-xxl` padding and nothing else adding height. Form-level errors and success messages go above the first group (`SectionNotice`), not in the footer. A visually hidden live region (`role="status"`/`"alert"`) must add no space when empty: no margin, padding, gap or `min-height`, and place it outside the flex gap. **[proposed]**

### Admin console: two-column setting rows

Inside admin panels, a setting is a row with the label in a left column and its field in a right column. Single-column forms (above) apply everywhere else. Values come from the admin console layout specimen (`admin-console.specimen.module.scss`) and are **pending team confirmation**.

| Part                                                        | Rule                                                                                                                                                                                                                         |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Columns                                                     | The field column starts 304px from the panel's content edge (today's 33.33%, pinned to pixels). That 304px includes the gap, so the label text column is 280px; the field column fills the rest. See "Field alignment" below |
| Gap between columns                                         | `--spacing-xxl` (24px), inside the 304px                                                                                                                                                                                     |
| Rows                                                        | No padding on the row. Rows are separated by a gap (`--spacing-xxl`, 24px, **assumed**, same as the single-column field gap)                                                                                                 |
| Dividers                                                    | No hairline between rows. A hairline (`rgba(var(--center-channel-color-rgb), 0.08)`) only separates sections                                                                                                                 |
| Label                                                       | Semibold 14/20, `--center-channel-color`. Top padding depends on the first control (see below)                                                                                                                               |
| Field column                                                | Vertical stack, `--spacing-xs` (8px) between the field, its help text and extras                                                                                                                                             |
| Help text                                                   | 12/16 below the field, text alpha at least 0.72                                                                                                                                                                              |
| Text and select inputs                                      | Max width 400px; don't stretch to the full column                                                                                                                                                                            |
| Boolean radios (True/False, On/Off, Yes/No, Enable/Disable) | One horizontal row, `--spacing-xxl` (24px) apart, each hugging its content (override Radio's full-width)                                                                                                                     |
| Between panels                                              | `--spacing-xl` (20px)                                                                                                                                                                                                        |
| Narrow (under 720px)                                        | One column: label above field, `--spacing-xs` (8px) gap                                                                                                                                                                      |

**Label alignment.** The label's first line must line up with the first line of its control, and controls differ:

| First control                                               | Label top padding                                    |
| ----------------------------------------------------------- | ---------------------------------------------------- |
| Medium text input or select (40px tall, 10px inner padding) | `--spacing-s` (10px)                                 |
| Small text input (32px tall, 8px inner padding)             | `--spacing-xs` (8px)                                 |
| Radio, checkbox                                             | 0 (the control's first line is the row's first line) |
| Switch                                                      | 0                                                    |

The specimen's 6px top padding does not align with a medium input: its text starts 10px down, so the label sits 4px high. Better still, give the label the control's height and center it vertically (`min-height` equal to the control height, `align-items: center`) so it doesn't depend on the size.

**Field alignment.** Every field in the admin page starts at the same x position, so the eye follows one clean line down the page. Nested containers (an admin panel inside another, a section inside a panel) are inset by their own padding and border. Subtract that inset from the label column width in the nested container, so the field column's left edge stays put at 304px from the outermost content edge. Example: a nested container with 24px padding and a 1px border has a 280px - 25px = 255px label column (the 24px gap unchanged). Don't give nested levels the full 280px, or the fields shift right at each level. Define the base width once (a custom property) and compute each level from it; remember a custom property can't refer to itself on the same element, so use a separate property for the per-level inset.

- Row gaps replace the old padding-plus-hairline rhythm and match the 24px field gap in single-column forms.
- Don't mix the two layouts inside one panel.
- Save lives in the persistent admin footer, not per row.
- **Panel subtitles:** an admin panel header should have a subtitle describing what is inside the section. It is optional but recommended; keep it to one short sentence that adds information the title doesn't.
- **React 18:** `AdminPanel` marks its collapsed region with a boolean `inert`, which React 18.2 does not render. On React 18, check that controls in a collapsed panel can't be tabbed to; if they can, report it as a gap.
- **Nested sections** (like "Advanced" inside a panel) use `AdminPanel expandable`, collapsed by default, for now. A nested panel must have a title and a subtitle; use the subtitle for a one-line summary of the current values (for example "No reply-to address · 3 retries"). The gap before a nested panel is `--spacing-xxxl` (32px). A tighter variant of the panel for nesting is a likely Compass addition (flagged).
- **Page:** description to the first panel is `--spacing-xxl` (24px). 24px padding, panels up to 920px wide, a title (`AdminConsoleHeader`) with a one-line description under it in body 14/20 (text alpha at least 0.72).
- **Single checkbox in a row:** the left label names the setting ("Message preview"); the checkbox text says what turning it on does ("Include message preview"). Don't repeat the same words twice if one phrase can do both.
- Whether this two-column layout stays long-term is an open team decision; follow it for admin panels for now.

## Other layouts **[TODO]**

Settings pages, lists, detail panels, empty states and dashboards will get their own spacing tables once examples are provided. Until then use the proximity principle above.
