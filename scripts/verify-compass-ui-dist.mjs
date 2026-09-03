#!/usr/bin/env node
/**
 * Post-build assertions for @mattermost/compass-ui dist output.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageRoot = path.join(repoRoot, 'packages/compass-ui');
const distRoot = path.join(packageRoot, 'dist');

function walkFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, acc);
    else acc.push(full);
  }
  return acc;
}

function assertCjsIconUnwrap() {
  const cjsFiles = walkFiles(distRoot).filter((f) => f.endsWith('.cjs'));
  const withIcons = cjsFiles.filter((f) => {
    const code = fs.readFileSync(f, 'utf8');
    return code.includes('@mattermost/compass-icons/');
  });

  const missingUnwrap = withIcons.filter((f) => {
    const code = fs.readFileSync(f, 'utf8');
    return !code.includes('?.default??');
  });

  if (missingUnwrap.length > 0) {
    throw new Error(
      `CJS icon unwrap missing in:\n${missingUnwrap.slice(0, 5).join('\n')}`,
    );
  }

  console.log(
    `[verify-compass-ui-dist] CJS icon unwrap OK (${withIcons.length} chunks)`,
  );
}

function assertIllustrationDts() {
  const dtsPath = path.join(packageRoot, 'dist/illustrations/search.d.ts');
  if (!fs.existsSync(dtsPath)) {
    throw new Error('Missing dist/illustrations/search.d.ts');
  }
  const dts = fs.readFileSync(dtsPath, 'utf8');
  if (dts.includes('.svg?react')) {
    throw new Error(
      'Illustration declarations must not re-export .svg?react paths',
    );
  }
  if (!dts.includes('SVGProps<SVGSVGElement>')) {
    throw new Error(
      'Illustration declarations must export a React SVG component type',
    );
  }

  const svgDts = fs
    .readdirSync(path.join(packageRoot, 'dist/illustrations'))
    .filter((f) => f.endsWith('.svg.d.ts'));
  if (svgDts.length > 0) {
    throw new Error(
      `Unexpected illustration SVG declaration files: ${svgDts.slice(0, 5).join(', ')}`,
    );
  }

  console.log('[verify-compass-ui-dist] Illustration declarations OK');
}

function assertSubpathLayout() {
  const required = [
    'dist/index.js',
    'dist/index.cjs',
    'dist/index.css',
    'dist/components/button/index.js',
    'dist/components/button/index.cjs',
    'dist/components/admin-console-sidebar/AdminConsoleSidebar.cjs',
    'dist/illustrations/search.js',
    'dist/illustrations/search.cjs',
    'dist/illustrations/search.d.ts',
    'dist/illustrations/names.js',
    'dist/illustrations/names.d.ts',
  ];
  for (const rel of required) {
    const full = path.join(packageRoot, rel);
    if (!fs.existsSync(full)) {
      throw new Error(`Missing required dist file: ${rel}`);
    }
  }
  console.log('[verify-compass-ui-dist] Subpath layout OK');
}

function assertDtsImportPaths() {
  const modelDts = fs.readFileSync(
    path.join(
      packageRoot,
      'dist/components/channels-sidebar/channelsSidebarModel.d.ts',
    ),
    'utf8',
  );
  if (!modelDts.includes('../channel-sidebar-item/')) {
    throw new Error(
      'channelsSidebarModel.d.ts must import from ../channel-sidebar-item/',
    );
  }

  const indexDts = fs.readFileSync(
    path.join(packageRoot, 'dist/index.d.ts'),
    'utf8',
  );
  if (indexDts.includes('./hooks/usePopoverTransition')) {
    throw new Error(
      'index.d.ts must use kebab-case hook paths (use-popover-transition)',
    );
  }

  console.log('[verify-compass-ui-dist] Declaration import paths OK');
}

function assertSourcemapUrls() {
  const missing = [];
  for (const file of walkFiles(distRoot)) {
    if (file.endsWith('.map')) continue;
    if (
      !file.endsWith('.js') &&
      !file.endsWith('.cjs') &&
      !file.endsWith('.d.ts')
    ) {
      continue;
    }
    const code = fs.readFileSync(file, 'utf8');
    const match = code.match(/sourceMappingURL=(\S+)/);
    if (!match) continue;
    const mapPath = path.join(path.dirname(file), match[1]);
    if (!fs.existsSync(mapPath)) {
      missing.push(`${path.relative(packageRoot, file)} -> ${match[1]}`);
    }
  }
  if (missing.length > 0) {
    throw new Error(
      `sourceMappingURL points at missing map:\n${missing.slice(0, 10).join('\n')}`,
    );
  }
  console.log('[verify-compass-ui-dist] Source map URLs OK');
}

function assertSubpathIsolation() {
  const buttonIndex = fs.readFileSync(
    path.join(packageRoot, 'dist/components/button/index.cjs'),
    'utf8',
  );
  const buttonImpl = fs.readFileSync(
    path.join(packageRoot, 'dist/components/button/Button.cjs'),
    'utf8',
  );

  if (
    buttonIndex.includes('admin-console-sidebar') ||
    buttonImpl.includes('admin-console-sidebar')
  ) {
    throw new Error(
      'components/button subpath must not reference admin-console-sidebar',
    );
  }

  const rootIndex = fs.readFileSync(
    path.join(packageRoot, 'dist/index.cjs'),
    'utf8',
  );
  if (!rootIndex.includes('admin-console-sidebar')) {
    throw new Error('Root barrel should still re-export admin-console-sidebar');
  }

  console.log('[verify-compass-ui-dist] Subpath isolation OK');
}

function main() {
  assertSubpathLayout();
  assertDtsImportPaths();
  assertIllustrationDts();
  assertSourcemapUrls();
  assertCjsIconUnwrap();
  assertSubpathIsolation();
  console.log('[verify-compass-ui-dist] All checks passed');
}

main();
