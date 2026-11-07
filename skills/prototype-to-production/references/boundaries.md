# Package boundaries and version skew

Stable rules for translating a Compass prototype into product code. Not a full component inventory — discover exports via the consumer’s installed package.

## Buckets

| Bucket                      | Examples                                                                                                                                                                                                                                                                                              | Product action                                                                                                                                                                                                                                     |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@mattermost/compass-ui`    | `Button`, `TextInput`, `ChannelSidebarItem`, `MenuItem`, …                                                                                                                                                                                                                                            | Keep when the consumer already adopts that component (or the task is adopting it). Import from **subpaths**. Confirm export exists in **consumer** `node_modules` (package contents drift across alphas). See overlay / menu adoption notes below. |
| `@mattermost/compass-proto` | `ChannelShell`, `ChannelsSidebar`, `TeamSidebar`, `GlobalHeader`, `AdminConsoleSidebar`, hardcoded menu recipes (`PlusMenu`, `HelpMenu`, `ChannelMenu`, …), `Mobile*`, `CallWidget`, `CallPopout`, message/composer/`ChannelHeader` composites, `buildDefaultChannelsSidebarModel`, demo RHS fixtures | **Never** add as a product dependency. Decompose to ui components + host layout/behavior.                                                                                                                                                          |
| Playground chrome           | `PrototypeTopNav`, `SceneSwitcher`, `DeviceFrame`, `MobileModalStage`, walkthrough runtime (`data-wt-*`, `src/walkthrough/`)                                                                                                                                                                          | **Drop.** Wire into the consumer’s nav/shell.                                                                                                                                                                                                      |
| Prototype-local             | `src/pages/prototypes/<slug>/components/*`                                                                                                                                                                                                                                                            | Rebuild with ui primitives/tokens, or reuse a host surface pattern with Compass components.                                                                                                                                                        |
| Tokens / CSS vars           | `--spacing-*`, `--center-channel-color`, `--duration-*`, …                                                                                                                                                                                                                                            | Keep. Load styles per consumer kind (see INTEGRATION.md). Do **not** copy playground CSS modules wholesale — re-express layout intent with host conventions + tokens.                                                                              |

## Hard rules

1. Product may depend on **`@mattermost/compass-ui` only** (plus peers such as `@mattermost/compass-icons`).
2. **Never** ship `@mattermost/compass-proto` into webapp, desktop, or plugins.
3. Compass owns **look** (props/slots). Capture **behavior intent** from the prototype (flows, outcomes, states shown, copy wording); implement with the **consumer’s** patterns (permissions, data, routing, optimistic UI, **i18n**) — do not copy playground state, fixtures, stubs, or hardcoded English strings as production logic.
4. Variant prop strings are **lowercase kebab-case** (`'primary'`, `'x-small'`).
5. Overlays from Compass are visual chrome only — host owns open/close, portal, position, focus (exceptions: form widgets that own their menus). **Adoption note (current):** `Modal` is adopted by the **plugins**, so in a plugin use Compass `Modal`. The **webapp** does not use it yet, but adopting it there is the goal: in the webapp keep the host modal unless the task explicitly adopts Compass `Modal`, and don’t build anything that would make adopting it harder. For `Tooltip`, `PopoverMenu`, `TourPoint` and `ProfilePopover`, adoption has not been confirmed: check what the consumer actually uses, and if it uses the host’s own, map the prototype to the **host’s existing overlay / tour / profile-popover / menu patterns** for that surface rather than introducing a second stack. Re-check consumer code / installed usage before assuming any of this still holds.
6. **Menu recipes → host menus (current).** Proto hardcoded menus (`PlusMenu`, `HelpMenu`, `ChannelMenu`, …) are intent only (“open this menu with these items”). Implement with the menu pattern the **consumer already uses** for that surface (check its code; don’t assume, since adoption differs between the webapp and plugins). If the consumer has **no** menu implementation for it, use Compass `PopoverMenu`. Don’t add a second menu stack beside an existing one. Standalone `MenuItem` is fine where the consumer already uses it that way, or alongside `PopoverMenu`.

## Version skew

Prototypes and consumers often pin different `@mattermost/compass-ui` alphas.

| Situation                                                                 | Action                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Prototype used proto; same (or successor) export exists in consumer ui    | Prefer consumer ui.                                                                                                                                                                                                                                                                                                                                                           |
| Prototype imports from **ui**, but export is **missing** from consumer ui | Likely **moved to proto** (or never shipped). Check proto categories / compass-design. If it’s a shell/composite (`ChannelsSidebar`, `GlobalHeader`, …) → **decompose like proto** (host layout + ui components) — do **not** reimplement the full composite from primitives. If it’s truly a missing component → closest component or compose from primitives; note the gap. |
| Prototype used ui component API / variant missing from consumer           | Closest consumer variant, or compose from available ui primitives. Do not invent Button chrome. Note the gap for the developer.                                                                                                                                                                                                                                               |
| Prototype older than consumer                                             | Prefer consumer APIs when they cover the same role.                                                                                                                                                                                                                                                                                                                           |
| Skill table vs installed `.d.ts`                                          | **Installed `.d.ts` wins.** Tables are hints only.                                                                                                                                                                                                                                                                                                                            |

## Lookup (always — before inventing a control)

```sh
ls node_modules/@mattermost/compass-ui/dist/components/
grep -i "MenuItem" node_modules/@mattermost/compass-ui/dist/index.d.ts
# Props / variants:
# node_modules/@mattermost/compass-ui/dist/components/<kebab>/<Name>.d.ts
```

Docs (prose, not version pin): https://mattermost.github.io/compass-design/

Consumer setup: https://github.com/mattermost/compass-design/blob/main/packages/compass-ui/INTEGRATION.md

- **Webapp:** load `@mattermost/compass-ui/styles` (+ component styles as the host already does). **Do not** load `styles/standalone`.
- **Plugin / desktop / other:** follow that host’s established entry and INTEGRATION.md — never copy playground standalone blindly.
- **Adding the package:** only when the user asked to adopt it. Then follow INTEGRATION.md fully (peers, styles, bundler/test config) — do not treat `npm install @mattermost/compass-ui` as sufficient.

## Prefer Compass components over legacy host widgets

When the consumer already depends on compass-ui and the role is an **adopted component** (button, text/search input, badge, empty state, …), **use Compass** even if an older host widget exists. Falling back to legacy components recreates drift.

This does **not** apply to overlays/menus the consumer hasn’t adopted (for example `Modal` in the webapp; check `Tooltip`, `PopoverMenu`, `TourPoint`, `ProfilePopover` per consumer) — use host patterns there (hard rules 5–6). Host code also wins for shells, routing, and product behavior.

## Proto decompose categories (illustrative)

These names drift as packages evolve — always verify against prototype imports and **consumer** `ls node_modules/@mattermost/compass-ui/dist/components/` (e.g. as of `0.1.0-alpha.12` the items below are proto, not ui):

- **Desktop shells / chrome composites:** `ChannelShell`, `ChannelsSidebar`, `TeamSidebar`, `GlobalHeader`, `AdminConsoleSidebar`, …
- **Hardcoded menu recipes:** `PlusMenu`, `HelpMenu`, `ChannelMenu`, `TeamMenu`, `ChannelCategoryMenu`, `ChannelHeaderMenu`, `ThreadActionsMenu`, `MessageMoreOptionsMenu`, `ProductSwitcherMenu`, … — map to the consumer’s existing menu pattern, or Compass `PopoverMenu` if it has none (see hard rule 6)
- **Mobile suites:** `MobileHome`, `MobileTabBar`, `MobileModal`, …
- **Calls composites:** `CallWidget`, `CallPopout`, participants panels, …
- **Message stack / channel header** (when imported from proto): `Message`, `MessageInput`, `ChannelHeader`, …
- **Fixtures:** `buildDefaultChannelsSidebarModel`, demo trees

Components that often stay in ui while shells moved to proto: `ChannelSidebarItem`, `AdminConsoleHeader`, `RightSidebarHeader`, `MenuItem`, message sub-components (`MessageHeader`, `MessageActions`, `MessageSeparator`, …) — **confirm in the consumer’s installed package**. (`PopoverMenu` may exist in ui but is not consumer-adopted yet — see hard rule 6.)

Optional intent check (never a product dependency): compass-design `packages/compass-proto` source on GitHub.
