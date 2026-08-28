#!/usr/bin/env node
/**
 * Rewrites root-barrel `@mattermost/compass-ui` imports to subpath imports.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildExportManifest } from './compass-ui-export-manifest.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const targets = [
  path.join(repoRoot, 'src'),
  path.join(repoRoot, 'packages/compass-proto/src'),
];

const IMPORT_RE =
  /import\s+(type\s+)?\{([^}]+)\}\s+from\s+(['"])@mattermost\/compass-ui\3\s*;?/g;

const DEFAULT_IMPORT_RE =
  /import\s+(\w+)\s+from\s+(['"])@mattermost\/compass-ui\2\s*;?/g;

function splitSpecifiers(raw) {
  const specs = [];
  let current = '';
  let depth = 0;
  for (const char of raw) {
    if (char === '{') depth += 1;
    if (char === '}') depth -= 1;
    if (char === ',' && depth === 0) {
      if (current.trim()) specs.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }
  if (current.trim()) specs.push(current.trim());
  return specs;
}

function specifierExportName(spec) {
  const trimmed = spec.trim();
  const typePrefix = trimmed.startsWith('type ') ? 'type ' : '';
  const body = typePrefix ? trimmed.slice(5).trim() : trimmed;
  const asMatch = body.match(/^(\w+)\s+as\s+(\w+)$/);
  if (asMatch) return { exportName: asMatch[1], localName: asMatch[2], typePrefix };
  return { exportName: body, localName: body, typePrefix };
}

function groupBySubpath(specs, manifest) {
  /** @type {Map<string, string[]>} */
  const groups = new Map();
  for (const spec of specs) {
    const { exportName, localName, typePrefix } = specifierExportName(spec);
    const subpath = manifest.get(exportName);
    if (!subpath) {
      throw new Error(`Unknown export "${exportName}" — update compass-ui-export-manifest`);
    }
    const rendered =
      localName === exportName
        ? `${typePrefix}${exportName}`
        : `${typePrefix}${exportName} as ${localName}`;
    const list = groups.get(subpath) ?? [];
    list.push(rendered);
    groups.set(subpath, list);
  }
  return groups;
}

function rewriteNamedImports(source, manifest) {
  return source.replace(IMPORT_RE, (full, typeKeyword, specifiersRaw, quote) => {
    const specs = splitSpecifiers(specifiersRaw);
    const groups = groupBySubpath(specs, manifest);
    const lines = [];
    for (const [subpath, specsForPath] of groups) {
      const typePart = typeKeyword ?? '';
      lines.push(
        `import ${typePart}{ ${specsForPath.join(', ')} } from ${quote}${subpath}${quote};`,
      );
    }
    return lines.join('\n');
  });
}

function walkFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, acc);
    else if (/\.(tsx?|jsx?|mdx)$/.test(entry.name)) acc.push(full);
  }
  return acc;
}

function main() {
  const manifest = buildExportManifest();
  let changed = 0;

  for (const root of targets) {
    for (const file of walkFiles(root)) {
      const original = fs.readFileSync(file, 'utf8');
      if (!original.includes('@mattermost/compass-ui')) continue;

      let updated = rewriteNamedImports(original, manifest);
      updated = updated.replace(DEFAULT_IMPORT_RE, () => {
        throw new Error(
          `Default import from @mattermost/compass-ui in ${file} — convert manually`,
        );
      });

      if (updated !== original) {
        fs.writeFileSync(file, updated);
        changed += 1;
      }
    }
  }

  console.log(`[migrate-compass-ui-imports] Updated ${changed} files`);
}

main();
