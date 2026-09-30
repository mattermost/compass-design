# @mattermost/compass-icons

Icon font and React icon components for Mattermost Compass.

This package lives in the [`mattermost/compass-design`](https://github.com/mattermost/compass-design) monorepo. Source of truth is `svgs/` (one SVG per icon). React components, `IconGlyphs`, `config.json`, and the icon font are generated from that folder.

## Install

```bash
npm install @mattermost/compass-icons
```

Peer dependency: `react` `^18` or `^19`.

## Usage

```tsx
// Per-icon (preferred for tree-shaking)
import CheckIcon from '@mattermost/compass-icons/components/check';

// Barrel — named exports plus default glyphMap
import glyphMap, {CheckIcon} from '@mattermost/compass-icons/components';

import type {IconGlyphTypes} from '@mattermost/compass-icons/IconGlyphs';
```

Font CSS (when using `font-family: 'compass-icons'`):

```scss
@import '~@mattermost/compass-icons/css/compass-icons.css';
```

Mobile / native consumers copy `font/compass-icons.ttf` and may read `config.json` for glyph maps.

## Development (this monorepo)

```bash
# Offline build — React components / glyphs only (no Fontello)
npm run build:icons

# Full build including fonts via Fontello (network required) — use when
# adding/changing icons and for publish
npm run build:icons:font
```

Do not edit `components/`, `IconGlyphs.ts`, or `config.json` by hand — they are generated. Fonts/CSS are not committed; Fontello produces them under `build/` at release time (same as the old `compass-icons` repo).

## Adding icons

Stick to **outline** styles per the [Iconography](https://mattermost.github.io/compass-design/foundations/iconography) guide. Prefer icons from the open-source [Material Design Icons (Pictogrammers) library](https://pictogrammers.com/library/mdi/).

Every SVG in `svgs/` must match this shell exactly — XML declaration, those four `svg` attributes only, and one compound `<path>` (no DOCTYPE, `xlink`, groups, fills, comments, or empty rects):

```svg
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <path d="…" />
</svg>
```

Save under `svgs/` as `{icon-name}_{CODEPOINT}.svg` (for example `account-outline_F0013.svg`).

### Material Design Icons

1. Go to [pictogrammers.com/library/mdi](https://pictogrammers.com/library/mdi/) and find the outline icon you need.
2. Download as **SVG Optimized**, open the file, and copy the `<path />`.
3. Paste it into the template above and save.
4. Use the hexadecimal character code from the MDI page as the `_CODEPOINT` suffix (for example `_F0013`).

### Custom icons

1. Follow the design rules under [Foundations / Iconography](https://mattermost.github.io/compass-design/foundations/iconography). In Illustrator, keep a single compound path — no extra layers or groups.
2. Save as SVG with **decimal places = 3**, open **SVG Code…**, and copy the `<path>` into the template above.
3. **Naming:** match [MDI naming](https://pictogrammers.com/library/mdi/) when the concept is the same (drop any `mdi-` prefix). For new concepts, prefer names like `someconcept-outline`.
4. **Character code:**
   - Replacements: reuse the MDI hex code when you are replacing that icon.
   - New custom icons: use the `E8xx` block.
   - To see which codes are taken, open the docs [Iconography specimen](https://mattermost.github.io/compass-design/foundations/iconography/specimen), turn on **Show codes**, or inspect `svgs/` / `config.json`.

### Jumbo icons

1. Follow the same design rules (consult UX if jumbo-specific guidance is needed).
2. Prefix the name with `jumbo-` (for example `jumbo-attachment-code`).
3. Use the `E9xx` codepoint block. Check **Show codes** on the specimen for the next free value.

### Land the change

1. Add the SVG under [`packages/compass-icons/svgs/`](./svgs).
2. Run `npm run build:icons:font` locally if you want to verify fonts (Fontello must be reachable). Commit the new/changed files under `svgs/` only — do not commit `build/`.
3. Open a PR against `compass-design` and request review from the UX / design team.
4. When ready to publish, bump `packages/compass-icons/package.json`, merge, then create a GitHub Release tagged `compass-icons@<version>` (see [INTEGRATION.md](../compass-ui/INTEGRATION.md) for the shared `package@version` convention). CI runs Fontello and publishes from `build/`.

## Package layout

| Path | Role |
|------|------|
| `svgs/` | Source SVGs (committed) |
| `generate-data.mjs`, `utils.mjs` | Generate `config.json`, `IconGlyphs.ts`, `components/*.tsx`, and `build/package.json` |
| `build/` | Publishable output (gitignored) — components from `tsc`; `css/` + `font/` from Fontello at publish |

Publishing is from `build/` (see `.github/workflows/publish-compass-icons.yml`).

## Related

- [Iconography guidelines](https://mattermost.github.io/compass-design/foundations/iconography) — when to use icons, styles, design rules
- [Iconography specimen](https://mattermost.github.io/compass-design/foundations/iconography/specimen) — full set + **Show codes**
- [Material Design Icons (Pictogrammers)](https://pictogrammers.com/library/mdi/)
- [compass-icons-integration.md](../../docs/compass-icons-integration.md) — migration notes, consumer contract, cutover
- [AGENTS.md](./AGENTS.md) — agent guidance for this package
