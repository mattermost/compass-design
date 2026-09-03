#!/usr/bin/env node
/**
 * Build export name → subpath manifest from compass-ui source.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkgSrc = path.join(repoRoot, 'packages/compass-ui/src');

export function toKebabSegment(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

function parseNamedExports(text) {
  const names = new Set();

  for (const match of text.matchAll(/export\s+(?:type\s+)?(?:function|const|class|interface|type)\s+(\w+)/g)) {
    names.add(match[1]);
  }

  for (const match of text.matchAll(/export\s+\{\s*([^}]+)\s*\}/g)) {
    for (const part of match[1].split(',')) {
      const trimmed = part.trim();
      if (!trimmed || trimmed.startsWith('type ')) continue;
      const alias = trimmed.match(/(?:\w+\s+as\s+)?(\w+)/);
      if (alias) names.add(alias[1]);
    }
  }

  for (const match of text.matchAll(/export\s+(?:type\s+)?(?:\{([^}]+)\}|\*\s+from)/g)) {
    if (!match[1]) continue;
    for (const part of match[1].split(',')) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      const alias = trimmed.match(/(?:type\s+)?(?:\w+\s+as\s+)?(\w+)/);
      if (alias) names.add(alias[1]);
    }
  }

  for (const match of text.matchAll(/export\s+(?:type\s+)?\{([^}]+)\}/g)) {
    for (const part of match[1].split(',')) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      const alias = trimmed.match(/(?:type\s+)?(?:\w+\s+as\s+)?(\w+)/);
      if (alias) names.add(alias[1]);
    }
  }

  return names;
}

export function buildExportManifest() {
  /** @type {Map<string, string>} */
  const manifest = new Map();

  manifest.set('toKebab', '@mattermost/compass-ui/utils/string');

  const componentsDir = path.join(pkgSrc, 'components');
  for (const folder of fs.readdirSync(componentsDir)) {
    const dir = path.join(componentsDir, folder);
    if (!fs.statSync(dir).isDirectory()) continue;

    const subpath = `@mattermost/compass-ui/components/${toKebabSegment(folder)}`;

    for (const file of fs.readdirSync(dir)) {
      if (!/\.(ts|tsx)$/.test(file) || file.endsWith('.stories.tsx')) continue;
      const text = fs.readFileSync(path.join(dir, file), 'utf8');
      for (const name of parseNamedExports(text)) {
        manifest.set(name, subpath);
      }
      if (text.includes('btnStyles')) manifest.set('btnStyles', subpath);
      if (text.includes('messageStyles')) manifest.set('messageStyles', subpath);
      if (text.includes('channelsSidebarStyles')) {
        manifest.set('channelsSidebarStyles', subpath);
      }
    }
  }

  const hooksDir = path.join(pkgSrc, 'hooks');
  for (const file of fs.readdirSync(hooksDir)) {
    if (!file.endsWith('.ts')) continue;
    const base = file.replace(/\.ts$/, '');
    const subpath = `@mattermost/compass-ui/hooks/${toKebabSegment(base)}`;
    const text = fs.readFileSync(path.join(hooksDir, file), 'utf8');
    for (const name of parseNamedExports(text)) {
      manifest.set(name, subpath);
    }
  }

  // Root-only style aliases
  manifest.set('btnStyles', '@mattermost/compass-ui/components/button');
  manifest.set(
    'channelsSidebarStyles',
    '@mattermost/compass-ui/components/channels-sidebar',
  );

  return manifest;
}

if (import.meta.url === fileURLToPath(import.meta.url)) {
  const manifest = buildExportManifest();
  console.log(JSON.stringify(Object.fromEntries(manifest), null, 2));
}
