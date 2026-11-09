---
name: prototype-to-production
description: >-
  Translate a mattermost-proto-playground prototype into production UI in the
  Mattermost webapp, desktop app, or a plugin. Use when asked to implement a
  prototype, translate a prototype to production, or build product code from a
  prototype URL, slug, branch or PR. Not for retrofitting UI that is already in
  production (use compass-build or compass-review).
---

# Prototype to production

## Purpose

Turn a **mattermost-proto-playground** prototype into product code in a consumer repo, using that consumer’s installed `@mattermost/compass-ui` and host patterns for routing/behavior. Install it with the other Compass toolkit skills (see [Install](#install)).

## Non-negotiables

These are the rules that were skipped or missed when this skill was tested on a real prototype. They are repeated here so you can't miss them by not opening another file. The details live in the steps and references.

1. **Use your task list.** Before starting, create one item per step below (1 to 10). Don't mark a step done until its output exists: the version comparison, the variants table, the decisions you confirmed, the audit result, the report. A step you didn't do is reported as skipped with the reason; it is never silently dropped.
2. **Read the files in "Required reads"** at the point each one says.
3. **Never depend on `@mattermost/compass-proto`.** Drop playground chrome and any prototype-only control (scene, viewer or state switchers, toggles, demo resets), but implement every variant they reveal.
4. **Use the Compass components the consumer's installed package has.** The installed `.d.ts` wins over any table.
5. **Carry over the prototype's spacing values.** Don't pick your own. Form gaps: 24px between fields in a group, 16px between paired fields, 32px between field groups.
6. **Menus, pickers and tooltips inside a modal must show above it.** Confirm this in the running app.
7. **Real conditions, i18n and host patterns.** Never fixture fields, pasted English literals or ported demo state.
8. **Stop and ask** about what the prototype doesn't settle, before building (end of step 6).
9. **Run the app and look at it** (step 10). Lint and tests can't see layout, spacing, stacking or focus.
10. **Finish with the report in step 10.** It is the deliverable. A line that is missing means that step was skipped.

## When to use

- Implement / ship a prototype into webapp, desktop, or a plugin
- User provides a prototype URL, slug, or local playground path plus a target surface
- Agent must prefer Compass **components** (Button, inputs, badges, EmptyState, …) over hand-rolled controls when the consumer’s installed package has them

## When not to use

- Scaffolding or editing prototypes inside the playground → `scaffold-prototype` / `guided-walkthrough`
- Adding design-system components → work in **compass-design**
- Retrofitting UI that is already in production in the webapp or a plugin, with no prototype to translate → use `compass-build` (to change it) or `compass-review` (to audit it)
- **Mobile app** (native iOS / Android) — not supported yet; this skill targets web consumers (webapp, desktop, plugins) that can depend on `@mattermost/compass-ui`
- Consumer has no `@mattermost/compass-ui` and the user has not asked to add/adopt it → stop; point at INTEGRATION.md; do not hand-roll CSS replacements for Compass components

### Standard components vs overlays

| Kind                                            | Examples                                                                                           | Rule                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Standard components (must-use when present)** | `Button`, `TextInput`, `SearchInput`, `IconButton`, badges, `EmptyState`, `Chip`, `Tag`, `Tabs`, … | Use consumer’s installed compass-ui. Do not invent a parallel control.                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Overlays / menus (per consumer)**             | `Modal`, `Tooltip`, `PopoverMenu`, `TourPoint`, `ProfilePopover`                                   | Depends on the consumer; see [references/boundaries.md](references/boundaries.md) rule 5. `Modal`: use Compass in **plugins**; in the **webapp** keep the host modal unless the task adopts it (adoption is the goal). Menus: keep the consumer’s existing menu unless the task is to adopt Compass `PopoverMenu`; if it has none, use `PopoverMenu` (rule 6). Others: use what the consumer already uses; don’t add a third stack. Re-check consumer usage; this list can change. |

## Install

This skill lives in the **compass-design** repo at `skills/prototype-to-production/`. Install it with the other toolkit skills by following [skills/README.md](../README.md). Install it **together with `compass-build`**: the final check and the "Where the Compass rules live" table read `../compass-build/references/`, so the skill folders must sit side by side. Copy the `references/` folder along with `SKILL.md`; omitting it breaks the links in this playbook.

Once installed, neither compass-design nor the playground needs to be open: fetch prototype source from GitHub; use the consumer’s `node_modules/@mattermost/compass-ui`.

## Required reads

Read each file when its row says, before doing that step. Linking to a file isn't reading it.

| File                                                         | Read it                | Contents                                                     |
| ------------------------------------------------------------ | ---------------------- | ------------------------------------------------------------ |
| [references/resolve-source.md](references/resolve-source.md) | at the start of step 2 | URL/slug → GitHub or local source                            |
| [references/boundaries.md](references/boundaries.md)         | before step 3          | ui vs proto vs playground drop, skew policy, lookup commands |
| `../compass-build/references/spacing-and-hierarchy.md`       | before step 7          | Spacing scale, form gaps, containers                         |
| `../compass-build/references/checklist.md`                   | at step 9              | The Compass pre-finish checklist                             |

## Process

### 1. Lock the consumer first (required gate)

Do **not** resolve the prototype or write product code until the consumer is known.

**Infer** when obvious:

- Open repo `mattermost-plugin-*` / playbooks / boards / agents → that plugin
- Webapp layout (`channels/`, System Console paths) → webapp
- User named desktop, a plugin, or a console category

**Ask once** if ambiguous (URL only, multi-root workspace, vague “Mattermost”). Collect:

- Kind: `webapp` | `desktop` | `plugin` (which plugin) | `other`
- Target surface: route / console category / RHS / modal / etc.
- Access or licensing constraints if relevant
- **UX spec (optional):** a Confluence page, a Figma file or page, or a markdown file. Don't block on it; ask once, and carry on from the prototype alone if there isn't one

Do not re-ask every turn; keep the answer for the session.

**Scope to the stated focus.** Multi-scene prototypes often wrap the real change in full channel chrome (`ChannelShell`, sidebars, headers). Limit implementation to the **target surface / intent** from this gate (e.g. threads viewing, one System Console page, plugin RHS). Treat surrounding proto chrome as context — wire into existing host shells; do **not** replace ChannelShell / global nav / whole sidebars unless the user asked for that. If focus is unclear, ask once which surface(s) are in scope.

**Desktop:** its own consumer kind, but **it doesn't depend on `@mattermost/compass-ui` yet**. So for a desktop target the "missing compass-ui" branch below applies by default: stop and point at INTEGRATION.md unless the user asked to adopt it. Once the desktop app adopts compass-ui, replacing its Button / IconButton / form controls with Compass components is in scope. Unless the user names a **desktop-only** surface or repo, prefer implementing shared product UI with **webapp** host patterns (desktop often embeds or shares that UI); don’t invent a parallel Electron component layer. Still confirm which repo owns the change and follow that repo’s INTEGRATION.md.

**Branch from the answer:**

1. Confirm `@mattermost/compass-ui` in that consumer (`package.json` / `node_modules`).
   - **Missing and user did not ask to add it** → **fail fast**. Point at [INTEGRATION.md](https://github.com/mattermost/compass-design/blob/main/packages/compass-ui/INTEGRATION.md); do not hand-roll CSS stand-ins.
   - **Missing and user asked to add/adopt it** → follow INTEGRATION.md **end-to-end** for that consumer (package + peers, style entry, bundler/Jest/React alias pitfalls) — not `npm install` alone. **Webapp: never** `styles/standalone`.
2. If already present, confirm style entry matches INTEGRATION.md for that kind.
3. Scope host-pattern search to that repo’s shells and routes.
4. Shared rules always apply: no proto, drop playground chrome, must-use ui components.

### 2. Resolve prototype source

Follow [references/resolve-source.md](references/resolve-source.md).

- **Require** a playground git ref (branch, PR, or commit) before reading source — ask once if missing. Do not assume `main`.
- Prefer local `src/pages/prototypes/<slug>/` on that ref when available.
- Else GitHub: `mattermost/mattermost-proto-playground` → `src/pages/prototypes/<slug>/` at that ref.
- If the ref **cannot be read** (auth/404/no `gh`) → stop and ask for a local path, access, or files. Do not invent UI from the demo URL alone.
- Published URL is visual context only; hashed CSS classes are not component IDs.

**Compare compass-ui versions now, before inventorying.** A version gap changes what you can use, so find it up front:

1. **Prototype's version:** `@mattermost/compass-ui` in the playground's `package.json` (and lockfile) at the recorded ref.
2. **Consumer's version:** `node_modules/@mattermost/compass-ui/package.json` in the consumer.
3. **Compare** and act:

| Situation                                                                  | Action                                                                                                                                                                                                                                                                                                                                                                                          |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Same version                                                               | Proceed.                                                                                                                                                                                                                                                                                                                                                                                        |
| Consumer **older** than the prototype                                      | Expect missing exports, props or variants. Use the skew table in [references/boundaries.md](references/boundaries.md) for each one found in step 3. If a gap affects the scoped surface in a way that matters (a component the surface depends on is missing), **tell the developer before building** and let them decide whether to upgrade first. Don't bump the consumer's version yourself. |
| Consumer **newer** than the prototype                                      | Prefer the consumer's APIs where they cover the same role.                                                                                                                                                                                                                                                                                                                                      |
| Version can't be read (no `package.json` at the ref, no installed package) | Say so, record it as unknown, and rely on the installed `.d.ts`.                                                                                                                                                                                                                                                                                                                                |

Version numbers are a signal, not a gate: the installed `.d.ts` always wins. Record both versions for the final report.

### 3. Inventory imports

From orchestrator, `scenes/`, and `components/`, bucket every import:

| Bucket            | Action                                                                         |
| ----------------- | ------------------------------------------------------------------------------ |
| `compass-ui`      | Keep if present in consumer ui; if **missing**, see moved-composite skew below |
| `compass-proto`   | Decompose — never depend in product                                            |
| Playground chrome | Drop                                                                           |
| Prototype-local   | Rebuild with ui / host patterns                                                |
| Tokens / CSS vars | Keep (see styles below)                                                        |

Use the version comparison from step 2 to anticipate missing exports. Details: [references/boundaries.md](references/boundaries.md).

**Styles / SCSS:** keep Compass **tokens** (`--spacing-*`, `--center-channel-color`, …). Do **not** copy playground `.module.scss` wholesale (including SceneSwitcher / DeviceFrame / walkthrough focus CSS). **Carry over the prototype's spacing values; don't estimate them.** Read the `gap`, `padding` and `margin` values in the prototype's SCSS and reproduce them, mapped to the host's units (the Compass spacing tokens are 2, 4, 6, 8, 10, 12, 16, 20, 24 and 32px: `--spacing-xxxxs` through `--spacing-xxxl`). The prototype's spacing already follows Compass, so a value you chose yourself (20px where it uses 24px) is a regression. For forms, also check the result against the form gaps in `compass-build/references/spacing-and-hierarchy.md` (fields in one group 24px, paired fields 16px, field groups 32px). Re-express layout with host style conventions; use Compass `className` overrides only when that consumer already does so for standard components. Prototype-local visuals with no host equivalent → small product-local styles, tokens-first (follow host BEM/CSS conventions).

**Moved composite (common):** prototype still imports something from `compass-ui` (e.g. older `ChannelsSidebar`) but consumer ui no longer exports it → treat as **proto decompose** (host shell + ui components), not as “build the whole thing from primitives.”

### 4. Map variants and conditions

Prototypes often use scenes to show different perspectives and states. The product has to handle each one, so find them before matching components, and don't assume the scenes cover every case.

**If there is a UX spec, read it first** and use it to fill the condition and source-of-truth columns. **The spec wins on behavior** (who sees what, which states exist, edge cases); **the prototype wins on look** (it is built from Compass components). Where they disagree on behavior, follow the spec and flag the mismatch; don't choose silently. Read a Confluence spec with the Atlassian MCP (most developers have it), a Figma spec with the Figma MCP, and a markdown spec from disk. If the spec can't be read (no connector, no access, private page), say so and continue from the prototype; don't invent its contents.

**A spec copy inside the prototype can be newer or older than the source.** Prototypes often keep a condensed copy (for example `docs/*spec*.md`). It may record changes made after the source page was written (a rename, new options, changed defaults), or it may have fallen behind. Don't assume either side is current. Read both when you can, and treat anything the copy explicitly marks as a later change as the latest word on that point. If you could only read one, say which in the report. Report every behavior mismatch between the source, the copy and the prototype, and which one you followed. If a mismatch changes behavior and nothing marks which is newer, ask the developer once (see "Stop and ask before building") instead of choosing silently.

Read the orchestrator, `scenes/*`, `components/*` and any walkthrough file for anything that renders conditionally, or that differs between scenes. For each, note:

| Element or section | Condition in the prototype | Kind | Product source of truth |
| ------------------ | -------------------------- | ---- | ----------------------- |

- **Kind** is one of: **viewer or role** (admin, member, guest, author vs reader), **feature flag or license**, or **app state** (empty, unread, loading, error, connected, offline, a call in progress, multi-step progress).
- **Condition in the prototype** is how the source expresses it: a prop, a scene id, a fixture field, a hardcoded current user, or a walkthrough note. A scene can be a different **perspective** (viewer or role) or a different **state of the same surface**, not only a step in a flow.
- **Product source of truth** is the consumer's real check: a role or permission selector, a license or flag check, or store or async state. Never copy the fixture field or prop.
- Look for a **hardcoded viewer** in the fixtures (a fixed current user). Variants that depend on that user can be invisible in the source: ask which other viewers the surface should handle.
- **Drop the switcher, keep the variants.** A control that toggles viewer, role, scene or state is prototype chrome (see `boundaries.md` rule 7) and does not ship. Every variant it reveals still gets a row in the table and is implemented from the host's real condition, not from the toggle.
- **Scenes can be design alternatives, not only perspectives or states.** If scenes show competing versions of the same surface rather than different viewers or states, don't build all of them: ask which one to implement.
- **Walkthrough files** are worth reading here even though the translation skips them elsewhere, because they sometimes spell out who sees what and when.
- If a condition is only implied by a fixture and you can't find its product equivalent, **ask the developer once** instead of guessing. List unresolved ones.

Keep this table in your working notes and implement every row. In the final report, list the variants you handled, any you couldn't resolve, any prototype-vs-spec mismatches, and any prototype-local controls you treated as chrome and dropped.

### 5. Match each UI piece

Matching is a **lookup procedure**, not screenshot matching. “Structure matches” = same **role** confirmed by export name / JSDoc / props on the **consumer’s** installed package.

Per bucket from step 3:

| Bucket                                | Do                                                                                                                                                                                                                                                                       |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **compass-ui import**                 | Confirm it in the consumer's `node_modules/@mattermost/compass-ui/dist/components/<kebab>/`; use the subpath and the props from the `.d.ts`.                                                                                                                             |
| **compass-ui import, export missing** | If it moved to proto or is a shell composite, decompose like proto (host layout + components). If it is a missing component or variant, use the closest component or compose from primitives, and note the gap. Don't reimplement full sidebars or headers from scratch. |
| **compass-proto import**              | Read the usage intent, search the consumer's ui for component equivalents, and compose components + **host** layout. Never add proto.                                                                                                                                    |
| **Playground chrome**                 | Drop it; wire into the consumer's nav and shell.                                                                                                                                                                                                                         |
| **Prototype-local**                   | Name the role, search the consumer's ui, then use host surface patterns (layout, routing, data only), else ui primitives + tokens.                                                                                                                                       |

**Before inventing any control:**

```sh
ls node_modules/@mattermost/compass-ui/dist/components/
grep -i "<RoleOrName>" node_modules/@mattermost/compass-ui/dist/index.d.ts
```

Read `dist/components/<kebab>/<Name>.d.ts` for props. Skill tables are hints; **installed `.d.ts` wins**.

When host and Compass both have a control: for **standard components**, prefer Compass ui. For overlays and menus, follow the table above and `boundaries.md` rules 5–6. Host always wins for shells, permissions, store, routing.

Plugins: same order; grep the **plugin** repo, not webapp System Console paths. Use the plugin’s own installed compass-ui version.

### 6. Capture behavior intent; implement with product patterns

Do **not** port prototype logic verbatim. Do **capture the intent** of what the prototype demonstrates, then implement that intent with the **target product’s** existing patterns.

| From the prototype (intent)                                   | In the product (implementation)                                                                                                                                                                                                                                                |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| User flows between scenes / panels                            | Host routing, deep links, RHS/modal entry points — not `SceneSwitcher` or walkthrough `sceneState`                                                                                                                                                                             |
| Clicks, toggles, “happy path” stubs                           | Host actions, thunks/selectors, plugin APIs — not copied `useState` demos                                                                                                                                                                                                      |
| Fixture users, channels, threads (`*Data.ts`, proto builders) | Real data loading, store shape, and empty/error states the host already uses                                                                                                                                                                                                   |
| Apparent permissions / who can see what                       | Host license, roles, and feature flags — never invent policy from fixtures                                                                                                                                                                                                     |
| Loading / success / error that the UX shows                   | Host async/optimistic patterns for that surface                                                                                                                                                                                                                                |
| Hardcoded English labels / titles / helper text               | **Wording intent** only — wire through the consumer’s **i18n** pattern (`defineMessages` / `FormattedMessage`, plugin i18n helpers, …). Do not land new user-visible English literals where that host expects translated messages (unless that area already uses raw strings). |

**How to extract intent:** read orchestrator + scenes for what happens on interaction and what states are shown (empty, selected, error, multi-step). Treat fixtures and stubs as **examples of outcomes**, not as production code to copy.

**How to implement:** grep the consumer for the same surface (threads, System Console page, plugin RHS, …) and follow that repo’s folder, state, API, and i18n conventions. Compass supplies look (props/slots); the product owns behavior.

#### Prototype-only helpers that don't carry over

Some helpers exist only so a prototype works on its own. Replace each with what the consumer uses.

- **`WithTooltip`** (from `compass-proto`, wraps icon buttons in prototypes) → drop the proto wrapper and use the host's tooltip. In the **webapp** and in **plugins** that is `WithTooltip` from `@mattermost/shared/components/tooltip`. Compass plans full tooltip support, so check whether the consumer's installed `@mattermost/compass-ui` offers a tooltip that covers the case and prefer it if so. Keep the `IconButton`'s `aria-label` either way. **Inside a plugin modal**, the host tooltip layer sits below the modal, so check how the plugin lifts tooltips above modals (for example a wrapper like `TooltipAboveModals` in `mattermost-plugin-agents`) instead of nesting a plain `WithTooltip`.

**Prototype strictness is relaxed; production's is not.** `compass-build`'s prototype context allows plain strings, fake data and simple state, but still expects tokens, hierarchy and accessibility. Production needs all of it: i18n, real data and states, tests, and the consumer kind's rules in `compass-build/references/context.md`. Don't treat the prototype's code as proof that tokens or accessibility were followed. Step 8 audits what you write, not what you copied from.

#### Stop and ask before building

Before writing code, ask the developer **once, in a single batched message**, about anything the prototype and spec don't settle. Typical cases:

- **Persistence:** where the data is stored when the product has no field for it, and who else reads it.
- **Moved or removed existing UI:** settings or features that the prototype relocates, so the existing code and its callers change.
- **Behavior that needs work outside the client:** a server, plugin or job (for example something that must happen automatically at a time), and whether to build, stub or leave it as a listed gap.
- **Access and licensing:** who sees the surface.
- **Spec vs prototype conflicts** that change behavior (step 4).

If the developer can't be reached, pick the most conservative option, mark it as an **assumption** and list it in the report. Never make these choices silently.

### 7. Implement in the consumer

- Stay within the **scoped surface** from step 1 — don’t rebuild unrelated proto chrome.
- Follow that repo’s folder, routing, and data patterns.
- Do not copy playground scene/orchestrator structure wholesale.
- Subpath imports only for compass-ui; kebab-case variant strings.
- Overlay and menu ownership stays in product code. Follow [references/boundaries.md](references/boundaries.md) rules 5–6.
- Before running an install or a generator that installs (an i18n extract, a codegen step), check that `node_modules` is this consumer's own. Never run an install through a symlink to another checkout: it modifies that checkout.

### 8. Audit with `compass-review`

Before the checklist, run `compass-review` on the code you wrote or changed (the diff, not the whole consumer repo). It is read-only and reports findings with file, line and the rule broken.

- Tell it the context is the consumer kind from step 1 (**core feature** for webapp and desktop, **plugin** for a plugin), not prototype, so `compass-proto` imports and playground stand-ins count as violations.
- Fix every **Blocker** and **Should fix** that your change introduced. Don't touch findings in code you didn't change; list them for the developer instead.
- Findings that come from a Compass gap or version skew (a prop the consumer's installed ui lacks) go in the "gaps" note, not in code workarounds.
- Report **Suggestion** items as suggestions, never as required changes.

### 9. Validation checklist

Translation-specific checks. The Compass design rules (tokens, one primary action, kebab-case variants, accessibility, writing) are owned by `compass-build`; don't restate them here.

- [ ] Consumer kind and **scoped surface** recorded for the session (no unsolicited full-shell rewrite)
- [ ] Playground ref recorded for the session
- [ ] Every file in "Required reads" was read at its step
- [ ] Decisions the prototype doesn't settle were confirmed with the developer (step 6), or listed as assumptions
- [ ] Every variant from step 4 is implemented with the product's real condition, or listed as unresolved in the report
- [ ] `@mattermost/compass-ui` present; no `@mattermost/compass-proto` in product deps or imports
- [ ] No playground chrome (`PrototypeTopNav`, `SceneSwitcher`, `DeviceFrame`, `MobileModalStage`, walkthrough runtime), and no other prototype-only controls (viewer, state or theme toggles, demo resets)
- [ ] Every Compass import resolves in the consumer's installed ui
- [ ] Style entry correct for consumer kind (webapp: no `styles/standalone`)
- [ ] No wholesale copy of playground SCSS modules
- [ ] Any `Select`, `Combobox`, `DateRangePicker` or emoji menu used inside a modal was opened in the running app and shows above the modal (see `boundaries.md` rule 5); lint and unit tests can't see this
- [ ] The surface was run and every variant and entry point was looked at (step 10), or the report says it was not verified in a running app
- [ ] Spacing between and within fields matches the prototype's SCSS values (and the form gaps in `compass-build`), not values you picked
- [ ] Prototype **behavior intent** preserved; implementation uses **host** patterns (no ported playground state/fixtures as production logic)
- [ ] User-visible strings use the consumer's **i18n** pattern (prototype copy is wording intent, not pasted literals)
- [ ] Prototype and consumer compass-ui versions recorded, and gaps from version skew noted briefly for the developer
- [ ] Ran the `compass-build` `references/checklist.md` on the result, using the **plugin** or **core feature** column of `references/context.md` for the consumer kind (not the prototype column)

The last item is not optional. If you could not run the `compass-build` checklist or the step 8 audit, say so plainly in the final report and list what was not checked; don't present the translation as finished without it.

### 10. Verify in the running app and report

Lint, types and unit tests can't see layout, spacing, stacking or focus. Look at it.

1. Start the consumer with its own dev workflow (webapp: its dev server against a running Mattermost server; plugin: the plugin's deploy or watch command).
2. If sign-in is needed, ask the developer to sign in, or to give a test account for this local app. Never use a real person's credentials.
3. Open the scoped surface and walk **every row of the step 4 table** (each viewer, role, state and flag) and **every entry point**. Note any variant you couldn't reach, and why.
4. Compare with the prototype: run the playground at the recorded ref, or use the screenshots in the prototype's `docs/`. Check spacing, alignment, states, wording and keyboard focus order.
5. Open every menu, picker, tooltip and popover that sits inside a modal and confirm it shows **above** the modal.
6. Capture screenshots of the main states for the developer.
7. If you can't run the app, say so and mark it **not verified in a running app**. Never describe it as verified.

**Final report (required).** Use this shape. Give every line a status: done, skipped (with the reason), or not applicable.

- Consumer, scoped surface and playground ref
- compass-ui versions: prototype, consumer, and gaps from skew
- Spec: source read (Confluence, Figma, markdown, none) or "copy only"; behavior mismatches with the prototype and which side you followed
- Decisions confirmed with the developer, and assumptions made without one
- Variants: handled, and unresolved
- Prototype-only controls dropped as chrome
- Compass components used; anything hand-rolled, and why
- Spacing: carried over from the prototype; any deviation
- Menus and pickers in modals checked above the modal
- Behavior intent not built (needs server or other work), listed as gaps
- Checks run: step 8 audit, `compass-build` checklist, lint, types, tests, running-app check
- What was **not** checked

## Where the Compass rules live

This skill owns the translation process. For how to use Compass once you know what to build, read the `compass-build` references (installed next to this skill; see [skills/README.md](../README.md)):

| Need                                                           | Read                                                    |
| -------------------------------------------------------------- | ------------------------------------------------------- |
| Which component fits a role, and how to choose a field control | `compass-build/references/components.md`                |
| Imports, tokens, variant props                                 | `compass-build/references/tokens-and-implementation.md` |
| Core vs plugin rules and style import                          | `compass-build/references/context.md`                   |
| Final pre-finish check                                         | `compass-build/references/checklist.md`                 |

The consumer's installed `.d.ts` always wins over any table, including those.

Large chrome often lives in **proto** (never a product dependency): shells, sidebars, headers, hardcoded menu recipes, `Mobile*`, `Call*` (full list in [references/boundaries.md](references/boundaries.md)). Decompose them to ui components plus host layout, and map menu recipes to **host** menus. Always `ls` the consumer's installed ui; alphas differ.

## Example prompt shapes

Include **consumer**, **surface/intent**, and a **prototype git ref** (branch, PR, or commit). A URL/slug alone is not enough — ask for the ref. The skill still gates on consumer if omitted.

**Webapp feature (branch):**

> Implement the changes from this prototype in the Mattermost webapp. Focus: a new and improved threads viewing experience. Prototype branch: `<branch>` in mattermost-proto-playground. Use prototype-to-production.

**System Console page:**

> Create a System Console page under `<category>` named `<name>`. Access: `<rules>`. Prototype PR: `<pr-url>` (or branch `<branch>`). Use prototype-to-production.

**Plugin surface:**

> Implement this prototype in the Playbooks RHS. Prototype branch: `<branch>`. Optional demo URL: `<url>`. Use prototype-to-production.
