---
paths:
  - 'packages/compass-proto/**'
---

# Proto area

When working under `packages/compass-proto/` (or composing proto UI in docs), read and follow [packages/compass-proto/AGENTS.md](../../packages/compass-proto/AGENTS.md). `IconButton` icons use `<Icon glyph={…} />` (no raw glyph, no `size`). Desktop `IconButton`s wrap with `WithTooltip` for now; do not add hover or portals to published `IconButton` / `Tooltip`.
