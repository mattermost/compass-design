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
const distIllustrations = path.join(packageRoot, 'dist/illustrations');

const ILLUSTRATION_DTS = `import type { FunctionComponent, SVGProps } from 'react';
declare const Svg: FunctionComponent<SVGProps<SVGSVGElement>>;
export default Svg;
`;

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

function listIllustrations() {
  if (!fs.existsSync(distIllustrations)) return [];
  return fs
    .readdirSync(distIllustrations)
    .filter(
      (f) =>
        f.endsWith('.js') &&
        !f.endsWith('.cjs') &&
        !f.includes('.svg.'),
    )
    .map((f) => f.replace(/\.js$/, ''))
    .sort();
}

function rewriteIllustrationDeclarations(illustrations) {
  if (!fs.existsSync(distIllustrations)) return 0;

  for (const leftover of fs.readdirSync(distIllustrations)) {
    if (leftover.endsWith('.svg.d.ts') || leftover.endsWith('.svg.d.ts.map')) {
      fs.unlinkSync(path.join(distIllustrations, leftover));
    }
  }

  let rewritten = 0;
  for (const name of illustrations) {
    if (name === 'names') continue;
    const dtsPath = path.join(distIllustrations, `${name}.d.ts`);
    fs.writeFileSync(dtsPath, `${ILLUSTRATION_DTS}\n`);
    const mapPath = `${dtsPath}.map`;
    if (fs.existsSync(mapPath)) fs.unlinkSync(mapPath);
    rewritten += 1;
  }
  return rewritten;
}

function buildExports() {
  return {
    '.': {
      types: './dist/index.d.ts',
      import: './dist/index.js',
      require: './dist/index.cjs',
    },
    './components/*': {
      types: './dist/components/*/index.d.ts',
      import: './dist/components/*/index.js',
      require: './dist/components/*/index.cjs',
    },
    './hooks/*': {
      types: './dist/hooks/*.d.ts',
      import: './dist/hooks/*.js',
      require: './dist/hooks/*.cjs',
    },
    './illustrations/*': {
      types: './dist/illustrations/*.d.ts',
      import: './dist/illustrations/*.js',
      require: './dist/illustrations/*.cjs',
    },
    './utils/string': {
      types: './dist/utils/string.d.ts',
      import: './dist/utils/string.js',
      require: './dist/utils/string.cjs',
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
}

function buildTypesVersions(components, hooks, illustrations) {
  const paths = {
    'components/*': ['./dist/components/*/index.d.ts'],
    'hooks/*': ['./dist/hooks/*.d.ts'],
    'illustrations/*': ['./dist/illustrations/*.d.ts'],
    'utils/string': ['./dist/utils/string.d.ts'],
  };

  for (const name of components) {
    paths[`components/${name}`] = [`./dist/components/${name}/index.d.ts`];
  }
  for (const name of hooks) {
    paths[`hooks/${name}`] = [`./dist/hooks/${name}.d.ts`];
  }
  for (const name of illustrations) {
    paths[`illustrations/${name}`] = [`./dist/illustrations/${name}.d.ts`];
  }

  return {
    '>=3.1': {
      ...paths,
      '*': ['./dist/index.d.ts'],
    },
  };
}

function main() {
  const pkg = readJson(packageJsonPath);
  const components = listKebabComponents();
  const hooks = listKebabHooks();
  const illustrations = listIllustrations();
  const rewritten = rewriteIllustrationDeclarations(illustrations);

  pkg.exports = buildExports();
  pkg.typesVersions = buildTypesVersions(components, hooks, illustrations);
  pkg.main = './dist/index.cjs';
  pkg.module = './dist/index.js';
  pkg.types = './dist/index.d.ts';

  writeJson(packageJsonPath, pkg);

  console.log(
    `[generate-compass-ui-exports] ${components.length} components, ${hooks.length} hooks, ${illustrations.length} illustrations (${rewritten} dts rewritten)`,
  );
}

main();
