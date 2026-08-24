# Illustration SVGs

Illustrations from Figma live here as `.svg` files and are used as React components via SVGR.

## Bringing in illustrations from Figma

### Option 1: Figma MCP asset server (same as icons)

1. In Figma, get the asset URL for each illustration (e.g. from your design system or MCP export).
2. Add entries to `scripts/figma-illustration-urls.json`: key = filename without `.svg`, value = `http://localhost:3845/assets/<hash>.svg`.
3. With Figma Desktop and MCP running, run:
   ```bash
   npm run illustrations:fetch
   ```
4. SVGs are written to this folder. Use them as:
   ```tsx
   import MyIllustration from '@/assets/illustrations/my-illustration.svg?react';
   import { Illustration } from '@/components/ui/Illustration';
   <Illustration aria-label="Description">
     <MyIllustration />
   </Illustration>;
   ```

### Option 2: Manual export from Figma

1. In Figma, select the illustration frame/component.
2. In the right panel, under **Export**, add **SVG** and export (or use a plugin like **Bulk Export SVGs** for many at once).
3. Save the `.svg` files into this folder (`src/assets/illustrations/`).
4. Import and use as in Option 1.

### Option 3: Figma REST API + script

For large or automated syncs, use the Figma REST API (with a personal access token) and a script such as [figma-export-assets](https://github.com/mariohamann/figma-export-assets) or [@figma-export/output-components-as-svgr](https://www.npmjs.com/package/@figma-export/output-components-as-svgr) to export by file and node IDs into this directory.
