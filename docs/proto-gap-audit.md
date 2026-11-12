# Prototype gap audit: what to add to compass-ui and compass-proto

Scope: webapp desktop. Order: channels, system console, agents, calls, playbooks, boards v2. Playbooks was audited from a fork snapshot.
Sizes are rough prototype-quality estimates (S/M/L). "ui" = compass-ui primitive, "proto" = compass-proto composite.
Evidence is grep/skim based; items marked (verify) were not confirmed from source.
Playground workaround scan is included as P-1.
This doc is a snapshot and the rationale. Status of each item is tracked on a Mattermost board, not here. See [ROADMAP.md](./ROADMAP.md) (Prototype coverage).

Audited 2026-11-12 against the Mattermost webapp, the Agents, Playbooks, and Boards v2 plugins, `compass-ui`, `compass-proto`, and the prototypes in `mattermost-proto-playground`. Playbooks was audited from a fork snapshot of the plugin (last commit 2026-10-29).

## P-1: Foundations in existing compass-proto (from playground workaround scan)

Calls-related items are in P4 (Calls), not here. The remaining evidence comes from the playground prototypes; with only 3 prototypes this is a small sample.

1. Rest/`data-*` pass-through and click handlers on composites (`Message` has neither; `MessageInput` has no `onSend` and no suggestion slot). Playground hacks around it with DOM queries (`externalWalkthroughFocus.ts`, `PositionedProfilePopover.tsx`, `ProfileClickable` sniffing tagName). proto, S. Do first; it unblocks guided walkthroughs.
2. Anchored popup / menu-button primitive. Hand-positioned popups and flip logic (profile popover and others). Also feeds the autocomplete list (P0 item 2). Already specified in [#111](https://github.com/mattermost/compass-design/issues/111) (`Popover.Portal` and `Popover.Positioner` on `@floating-ui/react`), so there is no separate issue; a general content surface to place inside it is [#243](https://github.com/mattermost/compass-design/issues/243). The tooltip host in [#82](https://github.com/mattermost/compass-design/issues/82) should decide whether to build on the same layer. What this audit adds is the prototype needs and seeds below.
3. Fixtures: export users, channels, teams, posts/threads, presence, avatar registry, and let the sidebar builder take custom channel names (replaces `channelNameOverrides`). Playground has 41 avatar import lines. proto, M.
4. Naming: `MobileMessageInput` uses `variant='Root'|'Reply'`, which breaks the kebab-case rule. S. Not desktop scope, but a quick fix.
   Note: many existing components (WithTooltip, Tabs, SegmentedControl, PopoverMenu, Modal, Toast, EmptyState, RightSidebar\*) are unused in the playground, so some hand-built UI is an adoption problem, not a gap.

## P0: Channels (cross-cutting, needed by almost every prototype)

1. Message body rendering: markdown (headings, lists, blockquote, tables, inline code, mention/channel chips), CodeBlock with copy, system messages. proto, M-L. Also reused by agents.
2. Autocomplete suggestion list (@mention, ~channel, :emoji:, /slash) anchored to composer. ui, M.
3. Composer variants: edit mode, thread-reply, DM/GM, char counter, schedule-send picker, OOO/DND notice, read-only/archived notice. proto, M.
4. Settings modal shell (vertical Tabs + content pane) plus SettingItem min/max row and SaveChanges bar. ui S-M + proto M. Serves user, channel, team settings. Partly in flight: the unmerged `claude/nice-clarke-mjs9w8` branch in this repo adds `SettingsModal`, `SettingsSidebar`, `SettingsPane`, and `SettingsSection` to compass-proto (no open PR). The remaining gap is the collapsed/expanded setting row and the save bar.
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
- Menu submenu flyouts, anchored Popover, Skeleton loader, labeled Divider (verify these four are truly missing). The anchored popover is #243; submenu flyouts may be part of #111.

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
12. Hierarchical (tree) select for graph-valued attributes. ui, L. `Combobox` supports `multiple` but has no tree or expand/collapse, and it closes on option click, so the webapp restyled its existing picker instead of migrating (mattermost/mattermost#39977). No design yet; design comes first, including whether the picker is a tree or a flat list with breadcrumbs. Tracked in [#270](https://github.com/mattermost/compass-design/issues/270).

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

## P4: Calls

Sources: the Calls plugin webapp (desktop UI), the video-calls prototype (`claude/practical-goodall-ac0d7b`; `claude/video-calls-walkthrough-update` is a near-duplicate with a small SIP ring-sound tweak), and the outbound-calls, external-call-participants, and calls admin console prototypes. compass-proto already has `CallWidget`, `CallPopout`, `CallInfoPanel`, `ParticipantsPanel`, `CallNotice` (promoted from the video-calls prototype), `CallParticipantAvatar`, and `RecordingIndicator`. compass-ui has no call primitives. The Calls plugin hand-builds its widgets and uses almost no compass-ui, so many shared widgets there are an adoption issue, not a gap. Seeds are under `src/pages/prototypes/` in `mattermost-proto-playground` unless noted.

Foundations (small, useful across calls work):

1. DialPad. proto, S. Seed: `outbound-calls/OutboundCallKeypad.tsx` (styles are tangled in a 1,000-line scss file).
2. CallHistoryRow. proto, S. Copied three times in the playground; seed in `outbound-calls/RhsDialer.tsx`.
3. IncomingCallCard, full and condensed, with the calling pulse. proto, M. Seeds: `video-calls/components/IncomingCallCard`, `WidgetIncoming`, `CallingPulse`.
4. PreJoinPanel. proto, S. Seed: `video-calls/components/PreJoinPanel`.
5. Draggable window hook. proto, S. Seed: `video-calls/scenes/useWidgetDrag.ts` (remove a hardcoded class selector).
6. Calls hooks: local camera, screen share, mic level, media devices, voice activity, call timer, call sounds. proto, S. Seeds in `video-calls/hooks/` and `useScreenShare.ts` (decouple from the call context).
7. Call participants fixtures, and drop the duplicated `types/callParticipant.ts`. proto, S.

Core components:

8. VideoTile (video, mirror, loading, speaking ring, mute and hand badges). proto, M. Seed: `video-calls/components/VideoTile`. Unblocks the popout, the widget video mode, and the stage.
9. VideoStage: grid, speaker, and screen-share layouts with a layout function. proto, L. Seed: `video-calls/components/VideoStage` and `layout/computeStageLayout.ts`. Strongest candidate, with real logic.
10. CallControlsBar with a split icon button, reaction tray, and share indicator. proto, M. Seed: `video-calls/components/CallControlsBar`. Depends on the inverted `IconButton` fix below: the control buttons use `style="inverted"`, which reads the sidebar text tokens and is near-invisible on the call surface in the Quartz theme.
11. Device picker menu with mic level meter. proto, M. Seed: `video-calls/components/DeviceMenu`. Needs the shared anchored positioner in #111.
12. Call event post (call started and ended, with participants and duration). proto, M. No seed; plugin source is `custom_post_types/post_type_event.tsx`.
13. Channel header call button, start-call menu, and call toast. proto, S-M. Seeds: `video-calls/components/StartCallButton`, `CallHeaderButton`, and `scenes/StartCallMenu.tsx`; merge with the outbound `OutboundCallStartCallMenu.tsx`.
14. Host controls menu and participant row actions. proto, S. Seed: `video-calls/components/ParticipantMenu`.
15. Call chat and threads panel in the popout. proto, M. Seed: `video-calls/components/CallThreadPane`.
16. Recording consent and info prompt, plus recording and transcription posts. proto, M and S-M. No prototype seed.
17. SelfViewPip with corner snap. proto, M. Seed: `video-calls/components/SelfViewPip`.
18. Channel call card and call banner. proto, S each. Seed: `video-calls/components/CallCard`, `CallBanner`.

Extending existing compass-proto components:

19. CallWidget phases (pre-join, calling, active, incoming) and video mode. proto, L. Seed: `video-calls/components/VideoCallWidget`, `WidgetFrame`, `WidgetMediaControls`.
20. CallPopout as the large call window, and a softphone variant. proto, L. Seeds: `video-calls/components/VideoCallWindow`, `outbound-calls/CallPip/CallPip.tsx` (about 780 lines with hand-built tab strips).
21. Inverted `IconButton` on dark call surfaces. ui, S-M. `style="inverted"` takes its colors from `--sidebar-text`, `--sidebar-text-rgb`, and `--sidebar-header-bg`, but the call surface uses `--calls-bg`. In Quartz the sidebar text is near-black (`neutral-1100`) on a near-black call surface (`neutral-1050`). `CallParticipantAvatar` has the same dependency. Fix upstream in compass-ui: have the inverted style read an on-dark foreground pair (for example `--inverted-color` and `--inverted-color-rgb`) with a fallback to the sidebar tokens, add `--calls-color` and `--calls-color-rgb` next to `--calls-bg` in each theme, and set the pair on the popout root. A fix local to compass-proto would not reach the real Calls plugin, which uses compass-ui only. Fix in [#269](https://github.com/mattermost/compass-design/pull/269). Checked in a browser in all five themes: only Quartz was broken (hover, pressed, toggled). Not yet checked: the destructive inverted state (leave button).
22. CallPopout style and slot props, and a ChannelShell slot, to remove `!important` overrides in `external-call-participants`. proto, S-M.
23. CallNotice banner with actions (host notices, alert banners). proto, S.
24. RecordingIndicator states for transcribing and captions. proto, S.

Softphone (after the foundations):

25. CallDialerPanel, composed from DialPad and CallHistoryRow. proto, M. Seed: `outbound-calls/RhsDialer.tsx`.
26. SoftphonePip. proto, L. Seed: `outbound-calls/CallPip/CallPip.tsx`.
27. PhoneNumberLink and phone glyphs. proto, S. Seed: `outbound-calls/OutboundCallPhoneNumberLink.tsx`.

Smaller items:

28. Leave menu (leave versus end for all). proto, S.
29. Switch-call, error, remove, and stop-recording confirm modals. Use the ConfirmDialog preset (P0). proto, S.
30. Screen source picker modal. proto, M.
31. Live captions overlay and reaction stream. proto, S each.
32. Call settings (audio, video, screen share) in the settings modal. proto, M. Seed: `video-calls/components/UserSettingsModal`. Depends on the settings shell (P0 item 4).
33. Calls admin console settings (about 40) built on SettingRow (P2 item 1), plus the RTCD and recording modals via ConfirmDialog. proto, M-L. Seed: `calls-admin-console/components/SettingRow.tsx` on `claude/determined-wozniak-jxwzjn`.
34. Cloud pricing and upgrade modals. proto, S-M. Overlaps the feature discovery panel.

Scene-only, leave in the playground: the call state context, the widget and window hosts, the chat scenes, `OutboundCalls.tsx` and the other outbound scenes, the walkthrough files, and the admin console scene.

## P5: Playbooks

Source: user's fork snapshot (matthewbirtch/mattermost-plugin-playbooks, branch audit-snapshot, last commit 2026-10-29), because mattermost/mattermost-plugin-playbooks could not be attached. Confirm the snapshot matches upstream main.
Context: the plugin imports only compass-icons (zero compass-ui/proto). Stack is styled-components, react-bootstrap, react-select, @hello-pangea/dnd, tanstack table. Everything is hand-rolled; compass matches are visual equivalents. Classification is from listings and prop greps.
Migration note (from user): a playbooks work order is in flight to migrate the plugin to compass-ui components, using existing compass-ui components only for now. It is therefore not blocked by the gaps below, and this section does not change the overall ranking. Items 1-10 are the likely next phase if the migration later needs components that don't exist yet. Product code uses compass-ui only; proto recipes (11-16) are for prototyping. The work order itself was not available to check scope.
Shared generic items (overlap earlier sections; build once):

1. DataTable (sortable headers, pagination, row actions). Same as P2/P6.
2. Sortable list + drag handle. Same as P6.
3. Collapsible/Accordion. Same as P3.
4. DatePicker/DateTimePicker with relative/natural-language entry (task due dates). ui, M.
5. UserPicker (Combobox + avatar rows, multi-select, "me"/"none", recents). ui, M. Also serves boards person property, system console, channels invite.
6. Chip tones (overdue, soon, assigned) + avatar-in-chip. ui, S.
7. Filter bar / filter builder (runs list). Same as P6.
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

## P6: Boards v2 (mattermost-plugin-boards-v2)

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

## Cross-product shared set (appears in 2 or more products; build before product recipes)

Products that need each item, from this audit:

- DataTable + Pagination + filter toolbar: system console, playbooks, boards v2.
- Sortable list + drag handle: boards v2, playbooks, system console (attribute option lists).
- Collapsible/Card: agents, playbooks.
- Option-color Chip + swatch picker: boards v2, playbooks, system console (attributes).
- UserPicker (avatar-row Combobox): playbooks, boards v2, system console, channels (invite and add members).
- DatePicker/DateTimePicker: playbooks, boards v2, channels (scheduled posts).
- Markdown textarea and inline edit: playbooks, boards v2, channels.
- Wizard modal: agents (MCP wizard), playbooks, boards v2 (import).
- SettingRow: system console, calls admin settings, playbooks editor.
- Anchored popup / menu button: channels (autocomplete, popovers), calls (device picker, menus), agents.
- Timeline: boards v2, playbooks. Lower overlap; build with the first product that needs it.
- Calendar grid: boards v2 only so far. Lower overlap; listed here in case channels scheduling needs it.

## Note on ranking

Boards is last in the priority order, but DataTable, the sortable list, option colors, and the filter builder overlap the system console and playbooks. Build those shared pieces under the console item. Boards still needs more after that: the property cell editors (item 4), the view toolbar (item 5), the calendar grid and timeline (item 6), and the wizard modal and small pieces (item 7), plus the kanban and card recipes (items 8-9). Build the shared pieces first, then these.

## Suggested build order (shared dependencies first)

A. ui: SettingRow, Collapsible/Card, CodeBlock, Typing indicator, Autocomplete list, vertical Tabs, DatePicker/TimePicker.
B. proto: message body rendering + system messages, composer variants, ConfirmDialog, SettingsModal + SettingItem.
C. proto: Quick switch, searchable list modal, RHS search results, drafts/scheduled, bookmarks.
D. ui: DataTable + Pagination + toolbar, then console pages.
E. proto: AgentMessage, tool cards, agents RHS.
F. proto: calls foundations (VideoTile, IncomingCallCard, DialPad, hooks), then VideoStage and the CallWidget and CallPopout extensions.

## Build order note

Do P-1 items 1-3 before everything in A-E; they change how every later component is written and consumed.

## Caveats

- Subagent audits were skim/grep based. Verify before building: vertical Tabs, Button loading, MenuItem submenus, TextArea counter, labeled Divider, sidebar category collapse.

## Starting points in prototype branches

Branches in `mattermost-proto-playground` hold one-off components that could seed some gaps. Treat them as starting points, not drop-in code. Most older branches predate the compass-proto split, import from `@/components/ui` or the root `compass-ui` barrel, and use Title Case variant values, so each needs porting to the current API, subpath imports, kebab-case values, and a token pass. The recent branches (`cursor/agents-vision-prototype-c820`, `prototype/universal-search`, and the Working Hours branches) are the closest to current conventions. Paths are relative to the branch root.

| Gap                                           | Best seed                                                                                                                                                                                     | Notes                                                                                                                                                                                                              |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Anchored popup / menu button (P-1)            | `abhijit-prototypes`: `FixedPopoverMenu` plus `useFixedMenuPosition`, `useAnchoredMenuOpensAbove`, `usePopoverDismiss` under `src/components/ui/`                                             | Portal menu with outside-click dismiss and flip-up. A reference for #111, not a replacement. `prototype/matrix-interop` has `AnchoredPopoverMenu.tsx` (needs token cleanup).                                       |
| Rest props, `onSend` on composites (P-1)      | `cursor/agents-vision-prototype-c820`: `ComposerShell.tsx`                                                                                                                                    | Has `onSend`, which `MessageInput` lacks.                                                                                                                                                                          |
| Autocomplete list (P0)                        | `cursor/agents-vision-prototype-c820`: `MentionMessageInput.tsx`, `ContextChipMenu.tsx`                                                                                                       |                                                                                                                                                                                                                    |
| Composer notices (P0)                         | `claude/wizardly-fermat-37o7lj`: `working-hours/components/LateHoursNotice.tsx`                                                                                                               | Out-of-office and do-not-disturb notice.                                                                                                                                                                           |
| Settings setting row (P0)                     | `claude/wizardly-fermat-37o7lj`: `working-hours/components/NotificationsSettings.tsx`                                                                                                         | Summary row, edit toggle, Switch. Verify against the compass-proto settings shell on `claude/nice-clarke-mjs9w8` first.                                                                                            |
| ConfirmDialog preset (P0)                     | `prototype/matrix-interop`: `UnmapConfirmModal.tsx`, `DeleteConnectionConfirmModal.tsx`                                                                                                       | Near-identical modals, which is the evidence for the preset.                                                                                                                                                       |
| Searchable list rows, RHS search results (P0) | `prototype/universal-search`: `SearchListRows.tsx`                                                                                                                                            | Row components take types from the prototype's data file.                                                                                                                                                          |
| Searchable channel list (P0)                  | `prototype/matrix-interop`: `ChannelAutocompleteField.tsx`                                                                                                                                    | Combobox with public/private icons.                                                                                                                                                                                |
| Quick switch modal (P0)                       | `feature/quick-switcher`: `QuickSwitcher.tsx`; `prototype/universal-search`: `UniversalSearchModal.tsx`                                                                                       | The quick switcher is cleanest. Its destinations are tied to the docs site, so it needs `items` and `onSelect` props. Universal search needs a compass-ui build with `SegmentedControl` and Modal `headerLeading`. |
| Typing indicator (P0, P3)                     | `channel-automations-v2`: `ChatTypingIndicator.tsx`; `cursor/agents-vision-prototype-c820`: `AgentTypingDots.tsx`                                                                             | 11 lines and props-driven.                                                                                                                                                                                         |
| SettingRow (P2, P5)                           | `abhijit-prototypes` / `global-attributes-asaad`: `ConsoleSetting.tsx`; `claude/determined-wozniak-jxwzjn`: `calls-admin-console/components/SettingRow.tsx`                                   | Both props-driven. The second adds `useId` wiring and a True/False radio helper. Check disabled and env-lock states.                                                                                               |
| DataTable (P2, P6)                            | `abhijit-prototypes`: `ConsolePropertyTable`, `ConsolePropertyRow`; `cursor/automations-product-prototype-373c`: `RunsPage.tsx`, `HomePage.tsx`                                               | Partial. No sorting, pagination, or sticky header.                                                                                                                                                                 |
| Hierarchical (tree) select (P2)               | `mattermost/mattermost`: `webapp/channels/src/components/property_fields/hierarchical_value_menu/`; `abhijit-prototypes`: `HierarchicalAttributeValuePicker/_components/ValuePickerField.tsx` | The webapp component is the production seed (chips, flattened search, multi-parent rows, variants). The prototype argues for a flat list because values can have several parents. Design is open.                  |
| Option-color Chip, chip input (P5, P6)        | `global-attributes-asaad`: `RankedValueChip`, `ColoredRankedInputChip`                                                                                                                        | Open PR #195 adds a pressable Chip mode.                                                                                                                                                                           |
| Collapsible card (P3, P5)                     | `channel-automations-v2`: `settings/SettingsDisclosureCard.tsx`                                                                                                                               | 82 lines, props-driven.                                                                                                                                                                                            |
| Agent tool and prompt cards (P3)              | `cursor/agents-vision-prototype-c820`: `AgentApprovalCard`, `AgentToolAuthCard`, `AgentToolConnectCard`, `AgentArtifactCard`                                                                  | Agent-specific props to strip.                                                                                                                                                                                     |
| Agent message bubble, sidebar (P3)            | `cursor/agents-vision-prototype-c820`: `agents-app/AgentChat.tsx`                                                                                                                             | About 1,900 lines tied to its own context. Heavy extraction.                                                                                                                                                       |
| MCP and tool policies (P3)                    | `channel-automations-v2`: `McpServersToolsList.tsx`                                                                                                                                           | Embedded fixtures.                                                                                                                                                                                                 |
| Tour spotlight, onboarding (P1, P5)           | `tour-point-pattern`, `proto-onboarding`; `abhijit-prototypes`: `src/components/walkthrough/`                                                                                                 | `TourPoint` already ships in compass-ui. The spotlight scrim is what is missing.                                                                                                                                   |
| Playbooks run sidebar sketch (P5)             | `cursor/agents-vision-prototype-c820`: `PlaybookRunRhs.tsx`                                                                                                                                   |                                                                                                                                                                                                                    |

Useful components that are not in the gap list above:

- Radio card group: `classification-markings-config`, `SourceChoiceCards.tsx`.
- Inline-edit title and list row with a status toggle: `channel-automations-v2`, `EditableTitle.tsx` and `AutomationListItem.tsx`.
- Workflow editor canvas: `cursor/automations-product-prototype-373c`, `components/editor/` (adds an `@xyflow/react` dependency).
- Link-unfurl cards (GitHub, Jira) and a webhook post: `cursor/agents-vision-prototype-c820`.
- Sync-status ribbon: `abhijit-prototypes`, `SchemaProvenanceRibbon.tsx`.

Notes:

- `channel-automations-v2` and `feat/channel-automations` are the same work. Use v2.
- `resource-level` is an older subset of `global-attributes-asaad`.
- `abhijit-prototypes` fixtures may contain customer-adjacent copy. Do not copy them.
- `RightSidebarHeader` and `Scrollbar` already ship in compass-ui.
