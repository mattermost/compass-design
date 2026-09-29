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
# Offline build (uses committed css/ + font/)
npm run build:icons

# Regenerate fonts via Fontello (network required), then sync committed assets
npm run build:icons:font
```

### Adding an icon

1. Add an SVG under `svgs/` named `{icon-name}_{CODEPOINT}.svg` (for example `dialpad_F061C.svg`). Prefer outline MDI names and codepoints when replacing an MDI icon. Custom icons use the `E8xx` block; jumbo icons use `E9xx` and a `jumbo-` name prefix. To see which codes are already taken, open the docs [Iconography specimen](https://mattermost.github.io/compass-design/foundations/iconography/specimen) and turn on **Show codes** (or inspect `config.json` / the `_CODEPOINT` suffix in `svgs/`).
2. Use a 24×24 viewBox and a single compound path:

```svg
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <path d="…" />
</svg>
```

3. Run `npm run build:icons:font` to regenerate components, `config.json`, and fonts (Fontello must be reachable). Commit the updated `svgs/` plus regenerated `css/` and `font/`.
4. Bump the package version when ready to release.

Do not edit `components/`, `IconGlyphs.ts`, or `config.json` by hand — they are generated.

### Package layout

| Path | Role |
|------|------|
| `svgs/` | Source SVGs (committed) |
| `css/`, `font/` | Committed Fontello output for offline builds |
| `generate-data.mjs`, `utils.mjs` | Generate `config.json`, `IconGlyphs.ts`, `components/*.tsx`, and `build/package.json` |
| `build/` | Publishable output (gitignored except via the copy-from-committed-fonts step) |

Publishing is from `build/` (see `.github/workflows/publish-compass-icons.yml`). Release tags use the form `compass-icons-<version>`.

## Related

- [compass-icons-integration.md](../../docs/compass-icons-integration.md) — migration notes, consumer contract, cutover
- [AGENTS.md](./AGENTS.md) — agent guidance for this package
