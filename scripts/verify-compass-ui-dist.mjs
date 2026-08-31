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

function assertSubpathLayout() {
  const required = [
    'dist/index.js',
    'dist/index.cjs',
    'dist/index.css',
    'dist/components/button/index.js',
    'dist/components/button/index.cjs',
    'dist/components/admin-console-sidebar/AdminConsoleSidebar.cjs',
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
  assertCjsIconUnwrap();
  assertSubpathIsolation();
  console.log('[verify-compass-ui-dist] All checks passed');
}

main();
