---
name: prototype-to-production
description: >-
  Translate a mattermost-proto-playground prototype into production UI in the Mattermost
  webapp, desktop app, or a plugin (Playbooks, Boards, Agents, …). Use when the
  user asks to implement a prototype, translate prototype to production, build
  from a prototype URL/slug into product code, or apply Compass UI from a
  published prototype. Process-first: resolve source, map compass-ui vs
  compass-proto vs playground chrome, must-use installed compass-ui — not a
  versioned component catalog.
---

# Prototype to production

## Purpose

Turn a **mattermost-proto-playground** prototype into product code in a consumer repo, using that consumer’s installed `@mattermost/compass-ui` and host patterns for routing/behavior. Install it with the other Compass toolkit skills (see [Install](#install)).

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

| Kind                                            | Examples                                                                                           | Rule                                                                                                                                                                                                                                                                                                                                       |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Standard components (must-use when present)** | `Button`, `TextInput`, `SearchInput`, `IconButton`, badges, `EmptyState`, `Chip`, `Tag`, `Tabs`, … | Use consumer’s installed compass-ui. Do not invent a parallel control.                                                                                                                                                                                                                                                                     |
| **Overlays / menus (per consumer)**             | `Modal`, `Tooltip`, `PopoverMenu`, `TourPoint`, `ProfilePopover`                                   | Depends on the consumer; see [references/boundaries.md](references/boundaries.md) rule 5. `Modal`: use Compass in **plugins**; in the **webapp** keep the host modal unless the task adopts it (adoption is the goal). Others: use what the consumer already uses; don’t add a third stack. Re-check consumer usage; this list can change. |

## Install

This skill lives in the **compass-design** repo at `skills/prototype-to-production/`. Install it with the other toolkit skills by following [skills/README.md](../README.md). Install it **together with `compass-build`**: the final check and the "Where the Compass rules live" table read `../compass-build/references/`, so the skill folders must sit side by side. Copy the `references/` folder along with `SKILL.md`; omitting it breaks the links in this playbook.

Once installed, neither compass-design nor the playground needs to be open: fetch prototype source from GitHub; use the consumer’s `node_modules/@mattermost/compass-ui`.

## References (read as needed)

| File                                                         | Contents                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [references/resolve-source.md](references/resolve-source.md) | URL/slug → GitHub or local source                            |
| [references/boundaries.md](references/boundaries.md)         | ui vs proto vs playground drop, skew policy, lookup commands |

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

Do not re-ask every turn; keep the answer for the session.

**Scope to the stated focus.** Multi-scene prototypes often wrap the real change in full channel chrome (`ChannelShell`, sidebars, headers). Limit implementation to the **target surface / intent** from this gate (e.g. threads viewing, one System Console page, plugin RHS). Treat surrounding proto chrome as context — wire into existing host shells; do **not** replace ChannelShell / global nav / whole sidebars unless the user asked for that. If focus is unclear, ask once which surface(s) are in scope.

**Desktop:** keep as a valid kind (e.g. replacing desktop Button / IconButton / form controls with Compass components once that app depends on compass-ui). Unless the user names a **desktop-only** surface/repo, prefer implementing shared product UI with **webapp** host patterns (desktop often embeds or shares that UI) — don’t invent a parallel Electron component layer. Still confirm which repo owns the change and follow that repo’s INTEGRATION.md.

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

### 3. Inventory imports

From orchestrator, `scenes/`, and `components/`, bucket every import:

| Bucket            | Action                                                                         |
| ----------------- | ------------------------------------------------------------------------------ |
| `compass-ui`      | Keep if present in consumer ui; if **missing**, see moved-composite skew below |
| `compass-proto`   | Decompose — never depend in product                                            |
| Playground chrome | Drop                                                                           |
| Prototype-local   | Rebuild with ui / host patterns                                                |
| Tokens / CSS vars | Keep (see styles below)                                                        |

Note prototype vs consumer compass-ui versions when visible. Details: [references/boundaries.md](references/boundaries.md).

**Styles / SCSS:** keep Compass **tokens** (`--spacing-*`, `--center-channel-color`, …). Do **not** copy playground `.module.scss` wholesale (including SceneSwitcher / DeviceFrame / walkthrough focus CSS). Re-express layout/spacing intent with host style conventions + tokens; use Compass `className` overrides only when that consumer already does so for standard components. Prototype-local visuals with no host equivalent → small product-local styles, tokens-first (follow host BEM/CSS conventions).

**Moved composite (common):** prototype still imports something from `compass-ui` (e.g. older `ChannelsSidebar`) but consumer ui no longer exports it → treat as **proto decompose** (host shell + ui components), not as “build the whole thing from primitives.”

### 4. Match each UI piece

Matching is a **lookup procedure**, not screenshot matching. “Structure matches” = same **role** confirmed by export name / JSDoc / props on the **consumer’s** installed package.

Per piece:

1. **compass-ui import** → confirm in consumer `node_modules/@mattermost/compass-ui/dist/components/<kebab>/`; use subpath + props from `.d.ts`. If the **export is missing**: check whether it moved to proto / is a shell composite → decompose like proto (host layout + components). If it’s a missing **component** / variant → closest component or compose from primitives; note the gap. Do not reimplement full sidebars/headers from scratch.
2. **compass-proto import** → read usage intent; search consumer ui for component equivalents; compose components + **host** layout. Never add proto.
3. **Playground chrome** → drop; wire into consumer nav/shell.
4. **Prototype-local** → name the role → search consumer ui → then host surface patterns (layout/routing/data only) → else ui primitives + tokens.

**Before inventing any control:**

```sh
ls node_modules/@mattermost/compass-ui/dist/components/
grep -i "<RoleOrName>" node_modules/@mattermost/compass-ui/dist/index.d.ts
```

Read `dist/components/<kebab>/<Name>.d.ts` for props. Skill tables are hints; **installed `.d.ts` wins**.

When host and Compass both have a control: for **standard components**, prefer Compass ui. For **overlays/menus the consumer hasn’t adopted** (see table above), prefer host. Host always wins for shells, permissions, store, routing.

Plugins: same order; grep the **plugin** repo, not webapp System Console paths. Use the plugin’s own installed compass-ui version.

### 5. Capture behavior intent; implement with product patterns

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

### 6. Implement in the consumer

- Stay within the **scoped surface** from step 1 — don’t rebuild unrelated proto chrome.
- Follow that repo’s folder, routing, and data patterns.
- Do not copy playground scene/orchestrator structure wholesale.
- Subpath imports only for compass-ui; kebab-case variant strings.
- Overlay/menu host ownership stays in product code. Whether to use Compass `Modal` / `Tooltip` / `PopoverMenu` / `TourPoint` / `ProfilePopover` depends on the consumer (plugins use `Modal`; the webapp doesn’t yet) — follow [references/boundaries.md](references/boundaries.md) rule 5.

### 7. Audit with `compass-review`

Before the checklist, run `compass-review` on the code you wrote or changed (the diff, not the whole consumer repo). It is read-only and reports findings with file, line and the rule broken.

- Tell it the context is the consumer kind from step 1 (**core feature** for webapp and desktop, **plugin** for a plugin), not prototype, so `compass-proto` imports and playground stand-ins count as violations.
- Fix every **Blocker** and **Should fix** that your change introduced. Don't touch findings in code you didn't change; list them for the developer instead.
- Findings that come from a Compass gap or version skew (a prop the consumer's installed ui lacks) go in the "gaps" note, not in code workarounds.
- Report **Suggestion** items as suggestions, never as required changes.

### 8. Validation checklist

Translation-specific checks. The Compass design rules (tokens, one primary action, kebab-case variants, accessibility, writing) are owned by `compass-build`; don't restate them here.

- [ ] Consumer kind and **scoped surface** recorded for the session (no unsolicited full-shell rewrite)
- [ ] Playground ref recorded for the session
- [ ] `@mattermost/compass-ui` present; no `@mattermost/compass-proto` in product deps or imports
- [ ] No playground chrome (`PrototypeTopNav`, `SceneSwitcher`, `DeviceFrame`, `MobileModalStage`, walkthrough runtime)
- [ ] Every Compass import resolves in the consumer's installed ui
- [ ] Style entry correct for consumer kind (webapp: no `styles/standalone`)
- [ ] No wholesale copy of playground SCSS modules
- [ ] Prototype **behavior intent** preserved; implementation uses **host** patterns (no ported playground state/fixtures as production logic)
- [ ] User-visible strings use the consumer's **i18n** pattern (prototype copy is wording intent, not pasted literals)
- [ ] Gaps from version skew noted briefly for the developer
- [ ] Ran the `compass-build` `references/checklist.md` on the result, using the **plugin** or **core feature** column of `references/context.md` for the consumer kind (not the prototype column)

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
