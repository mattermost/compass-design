import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.dirname(fileURLToPath(import.meta.url));
const srcRoot = path.join(packageRoot, 'src');

/** PascalCase / camelCase → kebab-case (Button → button, useExitAnimation → use-exit-animation). */
export function toKebabSegment(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

export type CompassUiEntryMap = Record<string, string>;

/** Rollup lib entry map: dist-relative keys → absolute source paths. */
export function collectLibEntries(): CompassUiEntryMap {
  const entries: CompassUiEntryMap = {
    index: path.join(srcRoot, 'index.ts'),
    'utils/string': path.join(srcRoot, 'utils/string.ts'),
  };

  const componentsDir = path.join(srcRoot, 'components');
  for (const folder of fs.readdirSync(componentsDir)) {
    const dir = path.join(componentsDir, folder);
    if (!fs.statSync(dir).isDirectory()) continue;

    const indexTs = path.join(dir, 'index.ts');
    const componentTsx = path.join(dir, `${folder}.tsx`);
    if (fs.existsSync(indexTs)) {
      entries[`components/${folder}/index`] = indexTs;
    } else if (fs.existsSync(componentTsx)) {
      entries[`components/${folder}/index`] = componentTsx;
    }
  }

  const hooksDir = path.join(srcRoot, 'hooks');
  for (const file of fs.readdirSync(hooksDir)) {
    if (!file.endsWith('.ts')) continue;
    const base = file.replace(/\.ts$/, '');
    entries[`hooks/${base}`] = path.join(hooksDir, file);
  }

  return entries;
}

/** Component folder PascalCase name → public kebab subpath segment. */
export function componentSubpath(folderName: string): string {
  return `components/${toKebabSegment(folderName)}`;
}
