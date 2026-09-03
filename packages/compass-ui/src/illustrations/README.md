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

## Adding artwork

1. Export SVG from Figma (or save into this folder).
2. Use a kebab-case filename that describes the scene (`drafts-empty.svg`).
3. Run `npm run generate:illustrations`.
4. Import from the matching subpath — do not copy SVGs into consuming apps.
