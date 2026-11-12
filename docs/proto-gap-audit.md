# Prototype gap audit: what to add to compass-ui and compass-proto

Scope: webapp desktop. Order: channels, system console, agents, playbooks, boards v2. Playbooks was audited from a fork snapshot.
Sizes are rough prototype-quality estimates (S/M/L). "ui" = compass-ui primitive, "proto" = compass-proto composite.
Evidence is grep/skim based; items marked (verify) were not confirmed from source.
Playground workaround scan is included as P-1.

Audited 2026-11-12 against the Mattermost webapp, the Agents, Playbooks, and Boards v2 plugins, `compass-ui`, `compass-proto`, and the prototypes in `mattermost-proto-playground`. Playbooks was audited from a fork snapshot of the plugin (last commit 2026-10-29).

## P-1: Foundations in existing compass-proto (from playground workaround scan)

Calls-related items are excluded here and moved to "Later: Calls" at the end. The remaining evidence comes from the playground prototypes; with only 3 prototypes this is a small sample.

1. Rest/`data-*` pass-through and click handlers on composites (`Message` has neither; `MessageInput` has no `onSend` and no suggestion slot). Playground hacks around it with DOM queries (`externalWalkthroughFocus.ts`, `PositionedProfilePopover.tsx`, `ProfileClickable` sniffing tagName). proto, S. Do first; it unblocks guided walkthroughs.
2. Anchored popup / menu-button primitive. Hand-positioned popups and flip logic (profile popover and others). ui or proto, M. Also feeds the autocomplete list (P0 item 2).
3. Fixtures: export users, channels, teams, posts/threads, presence, avatar registry, and let the sidebar builder take custom channel names (replaces `channelNameOverrides`). Playground has 41 avatar import lines. proto, M.
4. Naming: `MobileMessageInput` uses `variant='Root'|'Reply'`, which breaks the kebab-case rule. S. Not desktop scope, but a quick fix.
   Note: many existing components (WithTooltip, Tabs, SegmentedControl, PopoverMenu, Modal, Toast, EmptyState, RightSidebar\*) are unused in the playground, so some hand-built UI is an adoption problem, not a gap.

## P0: Channels (cross-cutting, needed by almost every prototype)

1. Message body rendering: markdown (headings, lists, blockquote, tables, inline code, mention/channel chips), CodeBlock with copy, system messages. proto, M-L. Also reused by agents.
2. Autocomplete suggestion list (@mention, ~channel, :emoji:, /slash) anchored to composer. ui, M.
3. Composer variants: edit mode, thread-reply, DM/GM, char counter, schedule-send picker, OOO/DND notice, read-only/archived notice. proto, M.
4. Settings modal shell (vertical Tabs + content pane) plus SettingItem min/max row and SaveChanges bar. ui S-M + proto M. Serves user, channel, team settings.
5. ConfirmDialog preset (about 15 near-identical modals). proto, S.
6. Searchable user/channel list + multiselect modal (invite, add members, DM, groups). proto, M-L.
7. Quick switch modal. proto, M.
8. RHS search results (search, mentions, saved, pinned, files; Message variant with highlight and jump link). proto, M-L.
9. Typing indicator, message states (edited, deleted, ephemeral, failed, show more). proto, S each.
10. Drafts and scheduled posts (row, page, tabs). proto, M.
11. Channel bookmarks bar. proto, M+M.
12. Core channel flows: New channel modal, Browse channels (L), Forward post, Move thread, More DMs. proto, M each.

## P1: Channels (important, less frequent)

- Search popover (hints, suggestions, recent). proto, M.
- Product rail and App bar container. proto, M / S.
- File preview modal (gallery). proto, L.
- Message attachments (interactive, action buttons), apps_form. proto, M-L / L.
- Burn-on-read states, post reminder submenu and modal, priority picker. proto, M.
- Channel info RHS variants (DM, GM, archived), members RHS (role menu, join requests). proto, S-M.
- Channel header text line, archived/shared states, plugin icon slot; ChannelShell slots (announcement, rail, app bar). proto, S-M.
- Recaps (page, card, create modal). proto, L.
- Global threads recipe. proto, S.
- Form widgets: DatePicker (M), TimePicker, ColorInput, CopyButton, avatar/image upload, URL-prefix input, chip input. ui, S-M each.
- Auth layout (login, signup, MFA, reset, ToS, select team) and onboarding (task list, spotlight, preparing workspace). proto, L total.
- Menu submenu flyouts, anchored Popover, Skeleton loader, labeled Divider (verify these four are truly missing).

## P2: System console

1. SettingRow (label left, control right, help text, disabled, env lock; about 380 uses; True/False radios 146). ui, S. Currently only scss in a specimen.
2. DataTable + Pagination + table toolbar (filter popover, column toggler). About 30 tables. ui, L + M.
3. Small fields: FileUpload, ColorInput, GeneratedField, async RequestButton. ui, S-M.
4. AdminConsoleSidebar upgrades: Find settings search, badges, permission hiding. proto, M.
5. User/team cells and user multiselect option and pill. proto, M.
6. StatTile and ChartCard (no chart components exist). ui/proto, M-L.
7. PermissionsTree (tri-state checkbox tree, scheme cards). proto, L.
8. ABAC editors (rule table, CEL code editor). proto, L.
9. Attribute tables (inline edit, chips, rank, reorder; about 14 pages). proto, L.
10. LogViewer, License/Billing/Plan cards, Health dashboard, Workspace optimization, Jobs table, Plugin cards. proto, M-L each.
11. Composed pages (Users, Teams, Channels, Groups, Roles, Data retention, IP filter). proto, M-L each, after 1-5.

## P3: Agents

Generic primitives first (also benefit channels and playbooks):

1. Collapsible/Disclosure and bordered status Card. ui, S-M.
2. Typing/WaveDots indicator, StreamingText, CodeBlock (shared with channels item 1), KeyValueList, inline citation chip. ui, S-M.
3. AI icon set, ring gauge, floating jump-to-latest, drop-zone overlay, copyable field. ui, S.
   Agents recipes:
4. AgentMessage bubble (rounds, reasoning, tool activity, controls bar). proto, L.
5. Tool cards and approval set (states: pending, running, accepted, rejected, redacted, awaiting share). proto, M.
6. AgentsRightSidebar (history, new chat, back). proto, L.
7. Prompt cards (question, connection request). proto, M each.
8. Composer additions (skills menu, bot chip, stop button) on MessageInput. proto, M.
9. HtmlArtifactCard (mock), Ask AI menu items, recap post. proto, M.
10. Agents product screens (list, 4-tab editor, version history) and admin (LLM service, MCP wizard, tool policies). proto, L.

## P4: Playbooks

Source: user's fork snapshot (matthewbirtch/mattermost-plugin-playbooks, branch audit-snapshot, last commit 2026-10-29), because mattermost/mattermost-plugin-playbooks could not be attached. Confirm the snapshot matches upstream main.
Context: the plugin imports only compass-icons (zero compass-ui/proto). Stack is styled-components, react-bootstrap, react-select, @hello-pangea/dnd, tanstack table. Everything is hand-rolled; compass matches are visual equivalents. Classification is from listings and prop greps.
Migration note (from user): a playbooks work order is in flight to migrate the plugin to compass-ui components, using existing compass-ui components only for now. It is therefore not blocked by the gaps below, and this section does not change the overall ranking. Items 1-10 are the likely next phase if the migration later needs components that don't exist yet. Product code uses compass-ui only; proto recipes (11-16) are for prototyping. The work order itself was not available to check scope.
Shared generic items (overlap earlier sections; build once):

1. DataTable (sortable headers, pagination, row actions). Same as P2/P5.
2. Sortable list + drag handle. Same as P5.
3. Collapsible/Accordion. Same as P3.
4. DatePicker/DateTimePicker with relative/natural-language entry (task due dates). ui, M.
5. UserPicker (Combobox + avatar rows, multi-select, "me"/"none", recents). ui, M. Also serves boards person property, system console, channels invite.
6. Chip tones (overdue, soon, assigned) + avatar-in-chip. ui, S.
7. Filter bar / filter builder (runs list). Same as P5.
8. Timeline (vertical event list). ui, M.
9. Markdown textarea with edit/preview + inline-edit text. ui, M.
10. Wizard modal; tour spotlight backdrop; labelled ProgressBar ("x/y"); file drop zone; scroll-nav. S-M each.
    Playbooks recipes (proto):
11. TaskItem (checkbox, title, assignee, due, command, hover menu). L. Most central.
12. ChecklistSection (header, progress, collapse, drag, add task). L.
13. RunDetailsRHS (about, participants, checklists, status). L.
14. RunPage header/summary, status-update card, timeline. L.
15. PlaybookEditor outline sections with setting rows (toggle + nested control). M. Shares the SettingRow from P2.
16. RetrospectiveEditor, StatusUpdate/UpdateRequest post cards, participants row + add modal, template-card grid + getting-started empty state, channel-header run pill. S-M each.
    Low priority: metrics charts, task conditions/requirements, upgrade modals.

## P5: Boards v2 (mattermost-plugin-boards-v2)

Context: a board is a channel and a card is a post, so sidebar, sharing, and comments are core channels UI (already covered). The plugin webapp imports only about 13 compass-ui primitives; the rest is hand-rolled `boards-*` SCSS. No board/table/kanban/dnd code exists in either compass package. Audit was grep/read based.
Generic items (also help channels, console, playbooks), do first:

1. DataTable: sticky header, resizable/reorderable columns, grouped sections, footer calculation row, inline-edit cell slot. ui, L. Same component as the console's DataTable (P2 item 2); build once.
2. Sortable list + drag handle primitive with keyboard announcements (boards uses @dnd-kit). ui, M. Reused by option lists, property reorder, tabs, checklists.
3. Option-color tokens (9 named, auto text contrast), Chip `color` prop, ColorSwatchPicker. ui, S. Chip today has one fixed color.
4. Property row list + cell editors (select, multi, person, date, number, URL). Needs Combobox inline create + option colors, date-cell trigger, number stepper. proto, M.
5. View toolbar: filter builder popover (L alone), sort/group menus, active-count Button state, sortable Tabs with per-tab menu. proto, M-L.
6. Calendar month grid and Timeline (Gantt). proto, L each.
7. Wizard modal (stepper), click-to-edit rich text, option-list editor, activity row. S-M.
   Boards-specific:
8. KanbanBoard, KanbanColumn, CardTile (column/drop-zone part is reusable). proto, L.
9. Gallery tile, card detail modal + RHS composition, card post preview. proto, M.

## Cross-product shared set (appears in 3+ products; build before product recipes)

DataTable + Pagination + filter toolbar; sortable list + drag handle; Collapsible/Card; option-color Chip + swatch picker; UserPicker (avatar-row Combobox); DatePicker/DateTimePicker; markdown textarea/inline edit; wizard modal; SettingRow; anchored popup/menu button; Timeline and Calendar grid.

## Note on ranking

Boards is last in your priority order, but DataTable, the sortable list, option colors, and the filter builder overlap the system console and playbooks. Build the shared pieces under the console item; boards then only needs the recipes (items 8-9).

## Suggested build order (shared dependencies first)

A. ui: SettingRow, Collapsible/Card, CodeBlock, Typing indicator, Autocomplete list, vertical Tabs, DatePicker/TimePicker.
B. proto: message body rendering + system messages, composer variants, ConfirmDialog, SettingsModal + SettingItem.
C. proto: Quick switch, searchable list modal, RHS search results, drafts/scheduled, bookmarks.
D. ui: DataTable + Pagination + toolbar, then console pages.
E. proto: AgentMessage, tool cards, agents RHS.

## Build order note

Do P-1 items 1-3 before everything in A-E; they change how every later component is written and consumed.

## Caveats

- Subagent audits were skim/grep based. Verify before building: vertical Tabs, Button loading, MenuItem submenus, TextArea counter, labeled Divider, sidebar category collapse.

## Later: Calls (deferred by request; group with any other calls work)

From the playground scan:

- Softphone pieces: dial pad, call-history row (copied 3 times), PiP call window, call RHS. proto, M-L. `OutboundCalls.module.scss` is 1486 lines.
- Call participants fixtures; `types/callParticipant.ts` is duplicated byte-for-byte between playground and compass-proto.
- ChannelShell flexibility for calls prototypes (outbound-calls rebuilds the shell; external-call uses `!important` overrides on ChannelShell and CallPopout). The general ChannelShell slot work stays in P1.
- Hand-positioned call menus (`OutboundCallStartCallMenu.tsx`, `CallPip.tsx` device picker, `TelAutocompleteMessageInput.tsx` tel: popup); these will use the anchored popup from P-1 item 2.
- Hand-built `role="tab"` strips in CallPip where Tabs/SegmentedControl exist (adoption, not a gap).
- WithTooltip missing on IconButtons in CallPip, RhsDialer, DialerScene.
