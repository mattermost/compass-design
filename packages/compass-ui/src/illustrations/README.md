# Illustration SVGs

Brand illustration artwork shipped with `@mattermost/compass-ui`. Each file is
published as a React component:

```tsx
import SearchIllustration from '@mattermost/compass-ui/illustrations/search';
import { Illustration } from '@mattermost/compass-ui/components/illustration';

<Illustration aria-label="No results">
  <SearchIllustration />
</Illustration>
```

The kebab-case filename is the subpath (`search.svg` → `illustrations/search`).
`ILLUSTRATION_NAMES` is exported from `@mattermost/compass-ui/illustrations/names`.

After adding or renaming an SVG, run from the repo root:

```bash
npm run generate:illustrations
```

That regenerates the TypeScript wrappers, the name catalog, and the docs
specimen loaders.

## Color

Fills and strokes use theme CSS variables, not baked Denim hex, so the
artwork follows the active theme:

- Line art → `var(--center-channel-color)`
- Paper surfaces → `var(--center-channel-bg)`
- Accent washes → `var(--button-bg)` (keep `fill-opacity` for tints)
- Success / warning / error → `var(--color-success)`, `var(--color-warning)`, `var(--error-text)`
- Depicted sidebar chrome → `var(--sidebar-bg)`, `var(--sidebar-header-bg)`, `var(--sidebar-text-hover-bg)`
- Files named `*-on-sidebar-bg.svg` (drawn to sit on the sidebar) → paper/ink `var(--sidebar-text)`
- `call-welcome-bg.svg` (light pattern on Calls) → `var(--button-color)`

Leave `<mask>` luminance maps as `white` / `black`. Partner logos and a
few decorative hues (rating stars) may stay as hex.

If a Figma export still contains Denim hex (`#3F4350`, `#1C58D9`,
`white`, …), run from the repo root:

```bash
node scripts/theme-illustration-svgs.mjs
```

## Adding artwork

1. Export SVG from Figma (or save into this folder).
2. Use a kebab-case filename that describes the scene (`drafts-empty.svg`).
3. Bind fills and strokes to theme tokens (or run `node scripts/theme-illustration-svgs.mjs`).
4. Run `npm run generate:illustrations`.
5. Import from the matching subpath — do not copy SVGs into consuming apps.
