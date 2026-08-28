#!/usr/bin/env node
/**
 * Writes package.json exports + typesVersions for @mattermost/compass-ui subpaths.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageRoot = path.join(repoRoot, 'packages/compass-ui');
const packageJsonPath = path.join(packageRoot, 'package.json');
const distComponents = path.join(packageRoot, 'dist/components');
const distHooks = path.join(packageRoot, 'dist/hooks');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function listKebabComponents() {
  if (!fs.existsSync(distComponents)) return [];
  return fs
    .readdirSync(distComponents, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

function listKebabHooks() {
  if (!fs.existsSync(distHooks)) return [];
  return fs
    .readdirSync(distHooks)
    .filter((f) => f.endsWith('.js') && !f.endsWith('.cjs'))
    .map((f) => f.replace(/\.js$/, ''))
    .sort();
}

function buildExports() {
  const exportsMap = {
    '.': {
      import: './dist/index.js',
      require: './dist/index.cjs',
      types: './dist/index.d.ts',
    },
    './components/*': {
      import: './dist/components/*/index.js',
      require: './dist/components/*/index.cjs',
      types: './dist/components/*/index.d.ts',
    },
    './hooks/*': {
      import: './dist/hooks/*.js',
      require: './dist/hooks/*.cjs',
      types: './dist/hooks/*.d.ts',
    },
    './utils/string': {
      import: './dist/utils/string.js',
      require: './dist/utils/string.cjs',
      types: './dist/utils/string.d.ts',
    },
    './styles': {
      import: './dist/compass-ui.css',
      default: './dist/compass-ui.css',
    },
    './styles/standalone': {
      import: './dist/compass-ui-standalone.css',
      default: './dist/compass-ui-standalone.css',
    },
    './component-styles': {
      import: './dist/index.css',
      default: './dist/index.css',
    },
  };

  return exportsMap;
}

function buildTypesVersions(components, hooks) {
  const paths = {
    'components/*': ['./dist/components/*/index.d.ts'],
    'hooks/*': ['./dist/hooks/*.d.ts'],
    'utils/string': ['./dist/utils/string.d.ts'],
  };

  for (const name of components) {
    paths[`components/${name}`] = [`./dist/components/${name}/index.d.ts`];
  }
  for (const name of hooks) {
    paths[`hooks/${name}`] = [`./dist/hooks/${name}.d.ts`];
  }

  return {
    '>=3.1': {
      '*': ['./dist/index.d.ts'],
      ...paths,
    },
  };
}

function main() {
  const pkg = readJson(packageJsonPath);
  const components = listKebabComponents();
  const hooks = listKebabHooks();

  pkg.exports = buildExports();
  pkg.typesVersions = buildTypesVersions(components, hooks);
  pkg.main = './dist/index.cjs';
  pkg.module = './dist/index.js';
  pkg.types = './dist/index.d.ts';

  writeJson(packageJsonPath, pkg);

  console.log(
    `[generate-compass-ui-exports] ${components.length} components, ${hooks.length} hooks`,
  );
}

main();
