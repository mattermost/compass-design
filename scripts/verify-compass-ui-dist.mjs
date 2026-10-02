#!/usr/bin/env node
/**
 * Post-build assertions for @mattermost/compass-ui dist output.
 *
 * Token contract: design tokens are ADDITIVE-ONLY. Hosts load several
 * compass-ui copies of different versions on one page (Mattermost core ships
 * one, every plugin bundles its own), and older copies stay around long after
 * a newer one ships. A token a newer copy renames, removes, or revalues still
 * resolves to the old definition wherever an older copy wins, so components
 * on both sides must keep working with either value. Therefore:
 *
 * - Every token in the shipped stylesheets is snapshotted in
 *   packages/compass-ui/tokens.snapshot.json. Removing a token or changing its
 *   value fails the build unless the snapshot is updated in the same PR
 *   (`npm run tokens:snapshot`), which makes the break visible in review.
 *   New tokens are allowed; the check reports them so they get snapshotted.
 * - Every declaration in those stylesheets must sit inside a `compass-ui.*`
 *   cascade layer, and each sheet must open with the layer order statement
 *   from src/styles/layers.scss. Unlayered declarations beat the host's
 *   values and fight other copies by load order.
 *
 * Pass --update-token-snapshot to rewrite the snapshot from the current build.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const packageRoot = path.join(repoRoot, 'packages/compass-ui');
const distRoot = path.join(packageRoot, 'dist');
const tokenSnapshotPath = path.join(packageRoot, 'tokens.snapshot.json');
const layeredSheets = [
  'compass-ui.css',
  'compass-ui-standalone.css',
  'components/scrollbar/simplebar-vendor.css',
];
const tokenSheets = ['compass-ui.css', 'compass-ui-standalone.css'];

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

function listIllustrationNames() {
  const illustrationsSrc = path.join(packageRoot, 'src/illustrations');
  return fs
    .readdirSync(illustrationsSrc)
    .filter((f) => f.endsWith('.svg'))
    .map((f) => f.replace(/\.svg$/, ''))
    .sort((a, b) => a.localeCompare(b));
}

function assertIllustrationDts() {
  const names = listIllustrationNames();
  if (names.length === 0) {
    throw new Error('No illustration SVGs found under src/illustrations');
  }

  const distIllustrations = path.join(packageRoot, 'dist/illustrations');
  for (const name of names) {
    const dtsPath = path.join(distIllustrations, `${name}.d.ts`);
    if (!fs.existsSync(dtsPath)) {
      throw new Error(`Missing dist/illustrations/${name}.d.ts`);
    }
    const dts = fs.readFileSync(dtsPath, 'utf8');
    if (dts.includes('.svg?react')) {
      throw new Error(
        `Illustration declarations must not re-export .svg?react paths (${name}.d.ts)`,
      );
    }
    if (!dts.includes('SVGProps<SVGSVGElement>')) {
      throw new Error(
        `Illustration declarations must export a React SVG component type (${name}.d.ts)`,
      );
    }
  }

  const svgDts = fs
    .readdirSync(distIllustrations)
    .filter((f) => f.endsWith('.svg.d.ts'));
  if (svgDts.length > 0) {
    throw new Error(
      `Unexpected illustration SVG declaration files: ${svgDts.slice(0, 5).join(', ')}`,
    );
  }

  console.log(
    `[verify-compass-ui-dist] Illustration declarations OK (${names.length})`,
  );
}

function assertSubpathLayout() {
  const required = [
    'dist/index.js',
    'dist/index.cjs',
    'dist/components/button/index.js',
    'dist/components/button/index.cjs',
    'dist/components/channel-sidebar-item/ChannelSidebarItem.cjs',
    'dist/illustrations/names.js',
    'dist/illustrations/names.d.ts',
  ];
  for (const rel of required) {
    const full = path.join(packageRoot, rel);
    if (!fs.existsSync(full)) {
      throw new Error(`Missing required dist file: ${rel}`);
    }
  }

  const names = listIllustrationNames();
  for (const name of names) {
    for (const ext of ['.js', '.cjs', '.d.ts']) {
      const rel = `dist/illustrations/${name}${ext}`;
      const full = path.join(packageRoot, rel);
      if (!fs.existsSync(full)) {
        throw new Error(`Missing required dist file: ${rel}`);
      }
    }
  }

  console.log(
    `[verify-compass-ui-dist] Subpath layout OK (${names.length} illustrations)`,
  );
}

function assertDtsImportPaths() {
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
    buttonIndex.includes('channels-sidebar') ||
    buttonImpl.includes('channels-sidebar')
  ) {
    throw new Error(
      'components/button subpath must not reference channels-sidebar',
    );
  }

  const rootIndex = fs.readFileSync(
    path.join(packageRoot, 'dist/index.cjs'),
    'utf8',
  );
  if (!rootIndex.includes('channel-sidebar-item')) {
    throw new Error('Root barrel should still re-export channel-sidebar-item');
  }
  if (rootIndex.includes('channels-sidebar')) {
    throw new Error(
      'Root barrel must not re-export channels-sidebar (moved to compass-proto)',
    );
  }
  if (rootIndex.includes('team-sidebar')) {
    throw new Error(
      'Root barrel must not re-export team-sidebar (moved to compass-proto)',
    );
  }

  console.log('[verify-compass-ui-dist] Subpath isolation OK');
}

const normalizeList = (value) =>
  value
    .split(',')
    .map((s) => s.trim())
    .join(', ');

function expectedLayerOrder() {
  const source = fs.readFileSync(
    path.join(packageRoot, 'src/styles/layers.scss'),
    'utf8',
  );
  const match = source.match(/^@layer\s+([^;{]+);/m);
  if (!match) throw new Error('src/styles/layers.scss has no @layer statement');
  return normalizeList(match[1]);
}

function parseSheet(rel) {
  const full = path.join(distRoot, rel);
  if (!fs.existsSync(full)) throw new Error(`Missing dist/${rel}`);
  return postcss.parse(fs.readFileSync(full, 'utf8'), { from: full });
}

function enclosingLayer(node) {
  for (let parent = node.parent; parent; parent = parent.parent) {
    if (parent.type === 'atrule' && parent.name === 'layer') {
      return parent.params.trim();
    }
  }
  return null;
}

function assertLayering() {
  const order = expectedLayerOrder();
  for (const rel of layeredSheets) {
    const root = parseSheet(rel);
    const first = root.nodes.find((n) => n.type !== 'comment');
    if (
      first?.type !== 'atrule' ||
      first.name !== 'layer' ||
      first.nodes ||
      normalizeList(first.params) !== order
    ) {
      throw new Error(
        `dist/${rel} must open with \`@layer ${order};\` (from src/styles/layers.scss)`,
      );
    }

    const unlayered = [];
    root.walkDecls((decl) => {
      const layer = enclosingLayer(decl);
      if (!layer?.startsWith('compass-ui.')) {
        unlayered.push(`${decl.parent.selector ?? '?'} { ${decl.prop} }`);
      }
    });
    if (unlayered.length > 0) {
      throw new Error(
        `dist/${rel} has declarations outside a compass-ui.* cascade layer:\n${unlayered.slice(0, 10).join('\n')}`,
      );
    }
  }
  console.log(
    `[verify-compass-ui-dist] Cascade layers OK (${layeredSheets.length} sheets)`,
  );
}

/** `{ sheet: { "<layer> <selector>": { "--name": "value" } } }` */
function collectTokens() {
  const tokens = {};
  for (const rel of tokenSheets) {
    const groups = {};
    parseSheet(rel).walkDecls(/^--/, (decl) => {
      const key = `@layer ${enclosingLayer(decl)} ${normalizeList(decl.parent.selector)}`;
      groups[key] ??= {};
      groups[key][decl.prop] = decl.value.replace(/\s+/g, ' ').trim();
    });
    tokens[rel] = groups;
  }
  return tokens;
}

function assertCompatTokensDisjoint(tokens) {
  const names = (layer) =>
    Object.entries(tokens['compass-ui.css'])
      .filter(([key]) => key.startsWith(`@layer ${layer} `))
      .flatMap(([, decls]) => Object.keys(decls));
  const compat = new Set(names('compass-ui.webapp-compat'));
  const overlap = names('compass-ui.tokens').filter((n) => compat.has(n));
  if (overlap.length > 0) {
    throw new Error(
      `compass-ui.tokens and compass-ui.webapp-compat must not declare the same names (legacy copies can register the layers in either order): ${overlap.join(', ')}`,
    );
  }
}

function assertTokenSnapshot({ update }) {
  const tokens = collectTokens();
  assertCompatTokensDisjoint(tokens);

  if (!update && !fs.existsSync(tokenSnapshotPath)) {
    throw new Error(
      `Missing ${path.relative(repoRoot, tokenSnapshotPath)}; run \`npm run tokens:snapshot\``,
    );
  }
  if (update) {
    fs.writeFileSync(tokenSnapshotPath, `${JSON.stringify(tokens, null, 2)}\n`);
    console.log(
      `[verify-compass-ui-dist] Wrote ${path.relative(repoRoot, tokenSnapshotPath)}`,
    );
    return;
  }

  const snapshot = JSON.parse(fs.readFileSync(tokenSnapshotPath, 'utf8'));
  const broken = [];
  const added = [];
  let count = 0;
  for (const [sheet, groups] of Object.entries(snapshot)) {
    for (const [group, decls] of Object.entries(groups)) {
      for (const [name, value] of Object.entries(decls)) {
        count += 1;
        const actual = tokens[sheet]?.[group]?.[name];
        if (actual === undefined) {
          broken.push(`removed  ${sheet} ${group} ${name}`);
        } else if (actual !== value) {
          broken.push(
            `changed  ${sheet} ${group} ${name}: ${value} -> ${actual}`,
          );
        }
      }
    }
  }
  for (const [sheet, groups] of Object.entries(tokens)) {
    for (const [group, decls] of Object.entries(groups)) {
      for (const name of Object.keys(decls)) {
        if (snapshot[sheet]?.[group]?.[name] === undefined) {
          added.push(`${sheet} ${group} ${name}`);
        }
      }
    }
  }

  if (broken.length > 0) {
    throw new Error(
      `Design tokens are additive-only: older compass-ui copies share the page with newer ones.\n` +
        `${broken.join('\n')}\n` +
        `Add a new token instead. If this break is intentional, run \`npm run tokens:snapshot\` and commit tokens.snapshot.json in the same PR.`,
    );
  }
  if (added.length > 0) {
    console.warn(
      `[verify-compass-ui-dist] ${added.length} new token(s) not in tokens.snapshot.json; run \`npm run tokens:snapshot\`:\n  ${added.join('\n  ')}`,
    );
  }
  console.log(
    `[verify-compass-ui-dist] Token snapshot OK (${count} tokens unchanged)`,
  );
}

function main() {
  assertLayering();
  assertTokenSnapshot({
    update: process.argv.includes('--update-token-snapshot'),
  });
  assertSubpathLayout();
  assertDtsImportPaths();
  assertIllustrationDts();
  assertSourcemapUrls();
  assertCjsIconUnwrap();
  assertSubpathIsolation();
  console.log('[verify-compass-ui-dist] All checks passed');
}

main();
