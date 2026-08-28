#!/usr/bin/env node
/**
 * Renames dist/components/{PascalCase} → dist/components/{kebab-case},
 * dist/hooks/{camelCase} → dist/hooks/{kebab-case}, and rewrites import paths.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageRoot = path.join(repoRoot, 'packages/compass-ui');
const distRoot = path.join(packageRoot, 'dist');
const srcComponentsDir = path.join(packageRoot, 'src/components');
const srcHooksDir = path.join(packageRoot, 'src/hooks');

function toKebabSegment(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

function buildComponentRenameMap() {
  const map = new Map();
  if (!fs.existsSync(srcComponentsDir)) return map;

  for (const folder of fs.readdirSync(srcComponentsDir)) {
    const kebab = toKebabSegment(folder);
    if (folder !== kebab) map.set(folder, kebab);
  }
  return map;
}

function buildHookRenameMap() {
  const map = new Map();
  if (!fs.existsSync(srcHooksDir)) return map;

  for (const file of fs.readdirSync(srcHooksDir)) {
    if (!file.endsWith('.ts')) continue;
    const base = file.replace(/\.ts$/, '');
    const kebab = toKebabSegment(base);
    if (base !== kebab) map.set(base, kebab);
  }
  return map;
}

function replacePathSegments(content, componentMap, hookMap) {
  let next = content;

  for (const [from, to] of componentMap) {
    const replacements = [
      [`components/${from}/`, `components/${to}/`],
      [`components/${from}"`, `components/${to}"`],
      [`components/${from}'`, `components/${to}'`],
      [`components\\\\${from}\\\\`, `components\\\\${to}\\\\`],
      [`../${from}/`, `../${to}/`],
      [`..\\\\${from}\\\\`, `..\\\\${to}\\\\`],
    ];
    for (const [search, replace] of replacements) {
      next = next.split(search).join(replace);
    }
  }

  for (const [from, to] of hookMap) {
    const replacements = [
      [`hooks/${from}.`, `hooks/${to}.`],
      [`hooks/${from}"`, `hooks/${to}"`],
      [`hooks/${from}'`, `hooks/${to}'`],
      [`hooks\\\\${from}.`, `hooks\\\\${to}.`],
    ];
    for (const [search, replace] of replacements) {
      next = next.split(search).join(replace);
    }
  }

  return next;
}

function walkFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, acc);
    else acc.push(full);
  }
  return acc;
}

function renameDir(oldPath, newPath) {
  if (!fs.existsSync(oldPath)) return;
  if (!fs.existsSync(newPath)) {
    fs.renameSync(oldPath, newPath);
    return;
  }

  for (const entry of fs.readdirSync(oldPath, { withFileTypes: true })) {
    const src = path.join(oldPath, entry.name);
    const dest = path.join(newPath, entry.name);
    if (entry.isDirectory()) {
      renameDir(src, dest);
    } else if (!fs.existsSync(dest)) {
      fs.renameSync(src, dest);
    } else {
      fs.unlinkSync(src);
    }
  }
  fs.rmdirSync(oldPath);
}

function renameDistDirs(componentMap, hookMap) {
  const componentsDist = path.join(distRoot, 'components');
  for (const [from, to] of componentMap) {
    renameDir(
      path.join(componentsDist, from),
      path.join(componentsDist, to),
    );
  }

  const hooksDist = path.join(distRoot, 'hooks');
  for (const [from, to] of hookMap) {
    const oldFile = path.join(hooksDist, from);
    const newFile = path.join(hooksDist, to);
    for (const ext of ['.js', '.cjs', '.d.ts', '.map']) {
      const oldPath = `${oldFile}${ext}`;
      const newPath = `${newFile}${ext}`;
      if (fs.existsSync(oldPath) && !fs.existsSync(newPath)) {
        fs.renameSync(oldPath, newPath);
      }
    }
  }
}

function patchDistFiles(componentMap, hookMap) {
  const exts = new Set(['.js', '.cjs', '.d.ts', '.map']);
  for (const file of walkFiles(distRoot)) {
    if (!exts.has(path.extname(file))) continue;
    const original = fs.readFileSync(file, 'utf8');
    const updated = replacePathSegments(original, componentMap, hookMap);
    if (updated !== original) fs.writeFileSync(file, updated);
  }
}

function fixComponentIndexRequires(componentMap) {
  for (const [from, to] of componentMap) {
    for (const ext of ['.cjs', '.js']) {
      const indexFile = path.join(distRoot, 'components', to, `index${ext}`);
      if (!fs.existsSync(indexFile)) continue;
      let code = fs.readFileSync(indexFile, 'utf8');
      const patched = code.replace(
        new RegExp(String.raw`require\((["'])\.\./${from}/`, 'g'),
        'require($1./',
      );
      if (patched !== code) fs.writeFileSync(indexFile, patched);
    }
  }
}

function bundleComponentStylesCss() {
  const cssChunks = [];
  const simplebarCss = path.join(
    packageRoot,
    'node_modules/simplebar-react/dist/simplebar.min.css',
  );
  if (fs.existsSync(simplebarCss)) {
    cssChunks.push(fs.readFileSync(simplebarCss, 'utf8'));
  }

  const moduleCssFiles = walkFiles(distRoot)
    .filter((file) => file.endsWith('.module.css'))
    .sort();
  for (const file of moduleCssFiles) {
    cssChunks.push(fs.readFileSync(file, 'utf8'));
  }

  fs.writeFileSync(
    path.join(distRoot, 'index.css'),
    `${cssChunks.join('\n')}\n`,
  );
}

function main() {
  const componentMap = buildComponentRenameMap();
  const hookMap = buildHookRenameMap();

  if (componentMap.size === 0 && hookMap.size === 0) {
    console.log('[normalize-compass-ui-dist] No renames needed');
  } else {
    patchDistFiles(componentMap, hookMap);
    renameDistDirs(componentMap, hookMap);
    patchDistFiles(componentMap, hookMap);
    fixComponentIndexRequires(componentMap);
    console.log(
      `[normalize-compass-ui-dist] Renamed ${componentMap.size} component and ${hookMap.size} hook paths to kebab-case`,
    );
  }

  bundleComponentStylesCss();
  console.log('[normalize-compass-ui-dist] Wrote dist/index.css component-styles bundle');
}

main();
