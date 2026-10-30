# Compass Design roadmap

Repo structure, package ownership, and phase plan for the Compass Design system. Replaces the earlier three-repo extraction plan.

## Repositories

| Layer              | Repository                               | Role                                                                                                            |
| ------------------ | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Design system repo | `mattermost/compass-design` (this repo)  | `@mattermost/compass-ui` (published), `@mattermost/compass-proto` (unpublished), docs + Storybook, GitHub Pages |
| Prototypes catalog | `mattermost/mattermost-proto-playground` | Multi-scene prototype flows, device chrome (`PrototypeTopNav`, `DeviceFrame`), registry                         |

Icons currently live in [`mattermost/compass-icons`](https://github.com/mattermost/compass-icons) as a peer dependency. **The intention is to bring `compass-icons` into this repo** — consolidating icon source, build pipeline, and releases alongside `compass-ui`. See [Phases](#phases) below.

## Packages (today, in this monorepo)

| Package                     | Published                        | Contents                                                                                                                                                                                                                                                                 |
| --------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `@mattermost/compass-ui`    | Yes (`alpha` until stable)       | Foundations, primitives, props-driven web chrome (sidebars, headers, Message leaves, Modal, …)                                                                                                                                                                           |
| `@mattermost/compass-proto` | No (workspace / `npm pack` only) | Mobile*, `ChannelShell`, Call* composites, Message / Message Input / Channel Header / Channels Sidebar / Admin Console Sidebar / Global Header / Team Sidebar / Right Sidebar shell / App Bar Item, hardcoded `*Menu` recipes, demo RHS panels, sidebar fixture builders |

**Chrome vs fixtures:** Core keeps presentational chrome (`ChannelSidebarItem`, `RightSidebarHeader`, Modal, Message leaves, `TourPoint`, `PopoverMenu` / `MenuItem`). Layout shells and unfinished composites (`ChannelsSidebar`, `AdminConsoleSidebar`, `GlobalHeader`, `TeamSidebar`, `RightSidebar`, `Message`, `MessageInput`, `ChannelHeader`, `AppBarItem`, hardcoded menu recipes) live in proto — not in the published core API.

### Layouts and shells (who uses what)

Layouts are composed MDX specimens in `src/guidelines/layouts/`. They are **not** an npm export — they stitch published chrome and unpublished proto together for documentation.

| Layer       | Package / location                   | Published | What lives here                                                                                                                                                                                                                                              |
| ----------- | ------------------------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| UI (chrome) | `@mattermost/compass-ui`             | Yes       | Foundations, primitives, props-driven web chrome                                                                                                                                                                                                             |
| Proto       | `@mattermost/compass-proto`          | Never npm | `ChannelShell`, Mobile*, Call*, Message / Message Input / Channel Header / Channels Sidebar / Admin Console Sidebar / Global Header / Team Sidebar / Right Sidebar shell / App Bar Item, hardcoded `*Menu` recipes, demo RHS panels, sidebar fixture helpers |
| Docs chrome | `src/components/layout/` (this repo) | No        | `DeviceFrame`, `MobileModalStage` — specimen framing only                                                                                                                                                                                                    |

Layout specimens import ui + proto (and docs chrome where needed) to show full screens. Proto is **not** on npm; playground and docs consume it via workspace / `file:` links.

| Consumer         | What it uses                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
| `compass-design` | Guidelines: workspace `compass-ui` + `compass-proto`. **Storybook:** published `@mattermost/compass-ui` only |
| Proto playground | Published `@mattermost/compass-ui` + `file:` / `npm pack` for `@mattermost/compass-proto`                    |
| Webapp           | `@mattermost/compass-ui` only — no proto                                                                     |

**Compass vs product:** Compass owns look (props/slots). Webapp owns behavior (permissions, markdown, optimistic UI). Adopt leaf-first; do not grow Compass into a second Post/sidebar controller.

**Docs presentation chrome (this repo):** `DeviceFrame`, `MobileModalStage` — mobile specimen framing in guidelines, not published packages.

**Playground-only (not proto):** `PrototypeTopNav`, `SceneSwitcher`, per-prototype scene code.

## Phases

| Phase                                                                  | Status                                  | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ---------------------------------------------------------------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **0 — Boundary + webapp spike**                                        | Done                                    | `compass-proto` package; core barrel pruned; chrome vs fixtures; pack/smoke tests; local webapp `file:` + watch validation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **1 — Create `compass-design`**                                        | Done (initial import)                   | Move packages + docs app; CI publishes core only; GitHub Pages on design repo                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **2 — Slim playground**                                                | Done                                    | Flows + chrome only; depend on published core + packed proto; rewrite README for catalog role                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **3 — Alpha release**                                                  | Done                                    | `@mattermost/compass-ui@0.1.0-alpha.0` on npm (`alpha` tag); GitHub pre-release; webapp npm consumption validated — no mergeable PR merged yet                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **7 — Subpath imports**                                                | Done (design repo); proto-playground PR | Multi-entry packaging + subpath exports in `@mattermost/compass-ui@0.1.0-alpha.3`. Docs/playground in this repo migrated; [`mattermost-proto-playground`](https://github.com/mattermost/mattermost-proto-playground) follows in a companion PR. Webapp migration documented in INTEGRATION.md.                                                                                                                                                                                                                                                                                                                                                                                    |
| **Later — Bring `compass-icons` into this repo**                       | Planned                                 | Move the `mattermost/compass-icons` source and build pipeline into `compass-design` as a workspace package (`@mattermost/compass-icons`). Consolidates icon authoring, versioning, and CI alongside `compass-ui`. Consumers continue to import from the same npm package name; only the publish pipeline and source location change. See [compass-icons-integration.md](./compass-icons-integration.md).                                                                                                                                                                                                                                                                          |
| **Later — Drop `@mattermost/shared` Button type dependency in webapp** | Planned                                 | The webapp currently imports `ButtonVariant = '' \| 'destructive' \| 'inverted'` from `@mattermost/shared/components/button` as a bridge type after migrating `Button` itself to `@mattermost/compass-ui`. This type is an app-level adapter concept (flattening compass-ui's separate `destructive` bool and `appearance` string into one string), not a design system type — it should not be added to compass-ui. The fix is to define the type locally in the webapp (inline or in a shared adapter util) and remove the `@mattermost/shared` import site-wide. Scope: audit all webapp files that import `ButtonVariant` from shared and migrate each to a local definition. |
| **Later — Webapp i18n**                                                | Deferred                                | Host-owned copy can be translated at the call site today. Compass chrome is English-only. Do not ship locale JSON from this package. Revisit after the webapp localization pipeline (extract, Weblate, in-repo translations, ICU checks) is stable — see INTEGRATION.md Translation.                                                                                                                                                                                                                                                                                                                                                                                              |
| **Later — Right-to-left (RTL) layout**                                 | Planned                                 | Make `@mattermost/compass-ui` chrome mirror correctly under `dir="rtl"`. Prefer logical CSS and inherited `dir` over a parallel RTL stylesheet or per-component `rtl` prop. See [Right-to-left (RTL) layout](#right-to-left-rtl-layout) below. Couples with webapp setting `dir` from locale; independent of shipping locale JSON (i18n phase).                                                                                                                                                                                                                                                                                                                                   |
| **Later — Unit testing (compass-ui)**                                  | Planned                                 | Keep Vitest + happy-dom; grow contract + behavior coverage for every new/changed component. Do **not** switch to Jest. Optionally adopt Testing Library on Vitest later if the custom harness becomes a burden. See [Unit testing (compass-ui)](#unit-testing-compass-ui) below.                                                                                                                                                                                                                                                                                                                                                                                                  |

Stop after each phase; verify before starting the next.

### Unit testing (compass-ui)

`@mattermost/compass-ui` already runs **Vitest** (`happy-dom`) via `npm test --workspace=@mattermost/compass-ui`, with a thin custom render harness in `packages/compass-ui/src/test-utils/render.tsx` (not `@testing-library/react`). The Mattermost webapp uses **Jest + Testing Library + `renderWithContext`**; that stack stays in product code. Library tests do not need to match the webapp runner.

**What exists today:**

| Kind                  | Files                                                                                                                               | Role                                                                                                                                                                           |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Contract / API guards | `contract.test.tsx`, `englishLiterals.test.ts`, `labels.test.tsx`, `translatedContent.test.tsx`, `refs.test.tsx`, `markup.test.tsx` | Enforce the [Component API contract](../packages/compass-ui/AGENTS.md#component-api-contract-consumers-mattermost-webapp-and-plugins); failures mean a rule broke, not a flake |
| Behavior              | Per-component `*.test.tsx` (e.g. Modal, Combobox, Select, Button) + utils                                                           | Interaction, ARIA, callbacks — sparse coverage today                                                                                                                           |
| Consumer Jest         | Documented in [INTEGRATION.md](../packages/compass-ui/INTEGRATION.md)                                                               | Webapp: subpath imports + `moduleNameMapper`; never require the root barrel in Jest                                                                                            |

**Approach (stay on Vitest):**

- **Contract tables first** — every new composite lands in `contract.test.tsx` (root attrs; every `*ButtonProps`); interactive primitives in `refs.test.tsx`; text props in `translatedContent` / `labels` as needed; `englishLiterals` stays clean.
- **Behavior tests for new props** — rendered content, ARIA, callbacks; use the existing helpers (`render`, `getByRole`, `click`, `keyDown`, `type`, `withoutScrollIntoView`).
- **Default DOM** — leave `markup.test.tsx` untouched unless the default DOM intentionally changes (then update/add the inline snapshot).
- **No Jest migration** — Vite build + Vitest + happy-dom already match the package toolchain; Jest would duplicate runners and fight ESM/`@/` aliases.
- **Testing Library (optional, later)** — if interaction suites need richer a11y queries, `userEvent`, or `waitFor`, add `@testing-library/react` + `user-event` **on Vitest**, not as a runner swap. Contract suites do not require it.
- **Webapp contrast** — product tests stay user-centric (`getByRole`, `userEvent`, `renderWithContext`). compass-ui mirrors role-ish queries via the local harness; do not pull Redux/Router/i18n providers into package tests.
- **RTL layout tests** — when mirroring lands, mount under `dir="rtl"` in Vitest (see [Right-to-left (RTL) layout](#right-to-left-rtl-layout)); unrelated to Testing Library.

**Sequencing:**

| Layer                    | When                                                                                                              |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| New / changed components | Follow the [review checklist](../.cursor/skills/review-compass-ui-component/SKILL.md) test steps on every PR      |
| High-risk widgets        | Deepen behavior coverage for Combobox, Select, Modal, menus, form fields                                          |
| Harness                  | Keep custom render until friction shows; then evaluate Testing Library under Vitest                               |
| Docs                     | Keep AGENTS.md + review skill as the source of required suites; expand this roadmap section if conventions change |

### Right-to-left (RTL) layout

Mattermost today mostly handles **bidirectional text** (`dir="auto"` on messages/inputs), not full **UI mirroring**. compass-ui is almost entirely physical `left`/`right` CSS today. When product commits to locale-driven chrome RTL, the design system should already be `dir`-clean.

**Two concerns (do not conflate):**

1. **Bidirectional text** — user content order and alignment. Mostly host-owned; compass inputs/fields must not force `text-align: left` (prefer `start` / inherit).
2. **Mirrored chrome** — paddings, icon rows, chevrons, menu placement, and reading-order slots flip when a subtree has `dir="rtl"`. This is the compass-ui job.

**Approach:**

- **Logical CSS as default** for new and touched styles: `padding-inline-*`, `margin-inline-*`, `inset-inline-*`, `border-inline-*`, `text-align: start`. Avoid a second `*.rtl.scss` tree or an `rtl` prop on every component.
- **Host owns `dir`** — webapp (or Storybook) sets `dir` on the document or locale root; components inherit. No locale detection inside the package.
- **Reading-order slots** — keep `leadingIcon` / `trailingIcon` (and similar) as start/end of reading order so they flip with `dir`, not as fixed screen-left/right.
- **Directional glyphs** — back/chevron/tour callouts flip via CSS (`scaleX(-1)` / logical transforms) or icon swap under `dir="rtl"`.
- **Placement JS** — anchored popovers/menus that hardcode `left`/`right` need logical placement when mirrored.
- **Storybook** — global `dir` toggle (and optional specimen locale) so mirroring is reviewable without webapp.
- **Tests** — Vitest cases that mount under `dir="rtl"` and assert order/placement for high-risk composites; stay on the existing Vitest harness (no Jest migration for this).

**Sequencing:**

| Layer               | When                                                                                                           |
| ------------------- | -------------------------------------------------------------------------------------------------------------- |
| New components      | Logical CSS + `dir`-safe from day one                                                                          |
| Touched components  | Convert physical → logical as you edit                                                                         |
| High-traffic chrome | Button/icon rows, Modal header (back/close), TextInput/Search, Select/Combobox menus, sidebar items, TourPoint |
| Placement JS        | Anchored popovers/menus with hardcoded physical sides                                                          |
| Full audit          | After webapp sets locale-driven `dir` on the shell                                                             |

## Consumption

- **Docs / Storybook (in this repo):** guidelines use workspace `compass-ui` + `compass-proto`; **Storybook** catalogs published `@mattermost/compass-ui` only
- **Playground (after split):** published `@mattermost/compass-ui@alpha` (subpath imports; `0.1.0-alpha.3+`) + `file:` / `npm pack` for `@mattermost/compass-proto`
- **Webapp (testing branch):** `file:` → `packages/compass-ui` + watch; webpack React aliases — see INTEGRATION.md
- **Webapp (mergeable PRs):** `@mattermost/compass-ui@alpha` — npm path validated and ready; no product PR merged yet — no Mobile*, `ChannelShell`, or Call* from proto in product code

## Related docs

- [`packages/compass-ui/INTEGRATION.md`](../packages/compass-ui/INTEGRATION.md) — consumer setup (Vite, webapp, styles, peers)
- [`packages/compass-ui/README.md`](../packages/compass-ui/README.md) — package quick start + Storybook
- [`packages/compass-proto/README.md`](../packages/compass-proto/README.md) — unpublished proto package (if present)
- [`AGENTS.md`](../AGENTS.md) — agent guidance (layers, overlays, package split)
- [`src/guidelines/AGENTS.md`](../src/guidelines/AGENTS.md) — docs specimens and MDX
