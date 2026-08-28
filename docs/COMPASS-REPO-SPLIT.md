# Compass repo split

How we are splitting Compass UI work across two repositories. Replaces the earlier three-repo extraction plan.

## Repositories

| Layer | Repository | Role |
| ----- | ---------- | ---- |
| Design system repo | `mattermost/compass-design` (this repo) | `@mattermost/compass-ui` (published), `@mattermost/compass-proto` (unpublished), docs + Storybook, GitHub Pages |
| Prototypes catalog | `mattermost/mattermost-proto-playground` | Multi-scene prototype flows, device chrome (`PrototypeTopNav`, `DeviceFrame`), registry |

Icons stay in [`mattermost/compass-icons`](https://github.com/mattermost/compass-icons) for now (peer dependency; may move into `compass-design` later).

## Packages (today, in this monorepo)

| Package | Published | Contents |
| ------- | --------- | -------- |
| `@mattermost/compass-ui` | Yes (`alpha` until stable) | Foundations, primitives, props-driven web chrome (sidebars, headers, Message stack, …) |
| `@mattermost/compass-proto` | No (workspace / `npm pack` only) | Mobile*, `ChannelShell`, Call* composites, demo RHS panels, sidebar fixture builders |

**Chrome vs fixtures:** Core keeps presentational shells (`ChannelsSidebar`, `AdminConsoleSidebar`, `RightSidebar` header). Demo trees and specimen RHS screens live in proto or docs fixtures — not in the published core API.

### Layouts and shells (who uses what)

Layouts are composed MDX specimens in `src/guidelines/layouts/`. They are **not** an npm export — they stitch published chrome and unpublished proto together for documentation.

| Layer | Package / location | Published | What lives here |
| ----- | ------------------ | --------- | --------------- |
| UI (chrome) | `@mattermost/compass-ui` | Yes | Foundations, primitives, props-driven web chrome |
| Proto | `@mattermost/compass-proto` | Never npm | `ChannelShell`, Mobile*, Call*, demo RHS panels, sidebar fixture helpers |
| Docs chrome | `src/components/layout/` (this repo) | No | `DeviceFrame`, `MobileModalStage` — specimen framing only |

Layout specimens import ui + proto (and docs chrome where needed) to show full screens. Proto is **not** on npm; playground and docs consume it via workspace / `file:` links.

| Consumer | What it uses |
| -------- | ------------ |
| `compass-design` | Guidelines: workspace `compass-ui` + `compass-proto`. **Storybook:** published `@mattermost/compass-ui` only |
| Proto playground | Published `@mattermost/compass-ui` + `file:` / `npm pack` for `@mattermost/compass-proto` |
| Webapp | `@mattermost/compass-ui` only — no proto |

**Compass vs product:** Compass owns look (props/slots). Webapp owns behavior (permissions, markdown, optimistic UI). Adopt leaf-first; do not grow Compass into a second Post/sidebar controller.

**Docs presentation chrome (this repo):** `DeviceFrame`, `MobileModalStage` — mobile specimen framing in guidelines, not published packages.

**Playground-only (not proto):** `PrototypeTopNav`, `SceneSwitcher`, per-prototype scene code.

## Phases

| Phase | Status | Summary |
| ----- | ------ | ------- |
| **0 — Boundary + webapp spike** | Done | `compass-proto` package; core barrel pruned; chrome vs fixtures; pack/smoke tests; local webapp `file:` + watch validation |
| **1 — Create `compass-design`** | Done (initial import) | Move packages + docs app; CI publishes core only; GitHub Pages on design repo |
| **2 — Slim playground** | Done | Flows + chrome only; depend on published core + packed proto; rewrite README for catalog role |
| **3 — Alpha release** | Done | `@mattermost/compass-ui@0.1.0-alpha.0` on npm (`alpha` tag); GitHub pre-release; webapp npm consumption validated — no mergeable PR merged yet |
| **7 — Subpath imports** | Done (design repo); proto-playground PR | Multi-entry packaging + subpath exports in `@mattermost/compass-ui@0.1.0-alpha.3`. Docs/playground in this repo migrated; [`mattermost-proto-playground`](https://github.com/mattermost/mattermost-proto-playground) follows in a companion PR. Webapp migration documented in INTEGRATION.md. |

Stop after each phase; verify before starting the next.

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
