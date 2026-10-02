/**
 * Smoke test: build @mattermost/compass-ui, pack a tarball, install it in a
 * minimal Vite consumer with only the package's required peer dependencies,
 * then import every `components/*` subpath through Vite (`import`), Node ESM
 * (`import`), and Node CJS (`require`, as Jest does), type-check them along
 * with the public API contract, and verify the app builds with styles.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageRoot = path.join(root, 'packages/compass-ui');
const requiredDistFiles = [
  'dist/index.js',
  'dist/index.cjs',
  'dist/index.d.ts',
  'dist/compass-ui.css',
  'dist/compass-ui-standalone.css',
];

function run(cmd, cwd = root) {
  execSync(cmd, { cwd, stdio: 'inherit' });
}

function assertTarballContents(tarballPath) {
  const listing = execSync(`tar -tzf "${tarballPath}"`, { encoding: 'utf8' });
  const required = [
    'package/package.json',
    'package/dist/index.js',
    'package/dist/index.cjs',
    'package/dist/compass-ui.css',
    'package/dist/compass-ui-standalone.css',
    'package/dist/components/button/index.js',
    'package/dist/components/button/index.cjs',
    'package/dist/illustrations/search.js',
    'package/dist/illustrations/search.cjs',
    'package/dist/illustrations/search.d.ts',
    'package/dist/index.d.ts',
  ];
  for (const entry of required) {
    if (!listing.includes(`${entry}\n`) && !listing.endsWith(entry)) {
      throw new Error(`Tarball missing required entry: ${entry}`);
    }
  }
  if (listing.includes('package/src/')) {
    throw new Error('Tarball must not include package/src/');
  }
  if (listing.includes('.stories.')) {
    throw new Error('Tarball must not include Storybook stories');
  }
}

function requiredPeerDependencies() {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf8'),
  );
  return Object.fromEntries(
    Object.entries(pkg.peerDependencies ?? {}).filter(
      ([name]) => !pkg.peerDependenciesMeta?.[name]?.optional,
    ),
  );
}

function componentSubpaths() {
  const componentsDir = path.join(packageRoot, 'dist/components');
  return fs
    .readdirSync(componentsDir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        fs.existsSync(path.join(componentsDir, entry.name, 'index.js')),
    )
    .map((entry) => `@mattermost/compass-ui/components/${entry.name}`)
    .sort();
}

// Node can't load the CSS that component modules side-effect import; stub it
// the way Jest's moduleNameMapper / identity-obj-proxy setups do.
function writeSubpathChecks(tempDir, subpaths) {
  const list = JSON.stringify(subpaths, null, 2);
  const assertExports = `
const empty = loaded.filter(([, mod]) => Object.keys(mod).length === 0);
if (empty.length > 0) {
  throw new Error('Subpaths with no exports: ' + empty.map(([s]) => s).join(', '));
}
console.log('[smoke] Loaded ' + loaded.length + ' component subpaths');`;

  fs.writeFileSync(
    path.join(tempDir, 'src', 'all-components.ts'),
    subpaths
      .map((subpath, i) => `import * as m${i} from '${subpath}';`)
      .join('\n') +
      `\n\nexport const componentModules = [${subpaths.map((_, i) => `m${i}`).join(', ')}];\n`,
  );

  fs.writeFileSync(
    path.join(tempDir, 'css-stub-hooks.mjs'),
    `export async function load(url, context, nextLoad) {
  if (url.endsWith('.css')) {
    return { format: 'module', source: '', shortCircuit: true };
  }
  return nextLoad(url, context);
}
`,
  );
  fs.writeFileSync(
    path.join(tempDir, 'register-css-stub.mjs'),
    `import { register } from 'node:module';
register('./css-stub-hooks.mjs', import.meta.url);
`,
  );
  fs.writeFileSync(
    path.join(tempDir, 'check-esm.mjs'),
    `const subpaths = ${list};
const loaded = [];
for (const subpath of subpaths) {
  loaded.push([subpath, await import(subpath)]);
}
${assertExports}
`,
  );
  fs.writeFileSync(
    path.join(tempDir, 'check-cjs.cjs'),
    `require.extensions['.css'] = (module) => {
  module.exports = {};
};
const subpaths = ${list};
const loaded = subpaths.map((subpath) => [subpath, require(subpath)]);
${assertExports}
`,
  );
}

function writeConsumer(tempDir, tarballPath) {
  const tgzName = path.basename(tarballPath);
  fs.copyFileSync(tarballPath, path.join(tempDir, tgzName));

  fs.writeFileSync(
    path.join(tempDir, 'package.json'),
    JSON.stringify(
      {
        name: 'compass-ui-smoke-consumer',
        private: true,
        type: 'module',
        scripts: {
          build: 'vite build',
          typecheck: 'tsc -p tsconfig.json',
          'check:esm': 'node --import ./register-css-stub.mjs check-esm.mjs',
          'check:cjs': 'node check-cjs.cjs',
        },
        // Only what the package declares as required peers, so an import
        // that needs an optional or undeclared peer fails here.
        dependencies: {
          ...requiredPeerDependencies(),
          '@mattermost/compass-ui': `file:./${tgzName}`,
        },
        devDependencies: {
          '@types/react': '^19.0.0',
          '@types/react-dom': '^19.0.0',
          '@vitejs/plugin-react': '^4.3.4',
          typescript: '~5.7.2',
          vite: '^6.0.5',
        },
      },
      null,
      2,
    ),
  );

  fs.mkdirSync(path.join(tempDir, 'src'), { recursive: true });
  fs.writeFileSync(
    path.join(tempDir, 'index.html'),
    `<!doctype html>
<html lang="en" data-theme="denim">
  <head><meta charset="UTF-8" /><title>compass-ui smoke</title></head>
  <body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body>
</html>`,
  );

  fs.writeFileSync(
    path.join(tempDir, 'src', 'main.tsx'),
    `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import GlobeIcon from '@mattermost/compass-icons/components/globe';
import { Button } from '@mattermost/compass-ui/components/button';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { Illustration } from '@mattermost/compass-ui/components/illustration';
import { Scrollbar } from '@mattermost/compass-ui/components/scrollbar';
import SearchIllustration from '@mattermost/compass-ui/illustrations/search';
import '@mattermost/compass-ui/styles';
import { componentModules } from './all-components';

if (componentModules.some((mod) => Object.keys(mod).length === 0)) {
  throw new Error('A component subpath has no exports');
}

function App() {
  const items = Array.from({ length: 20 }, (_, i) => \`Row \${i + 1}\`);
  return (
    <div style={{ padding: 24, fontFamily: 'system-ui' }}>
      <Button emphasis="primary">Compass UI</Button>
      <Button leadingIcon={<Icon glyph={<GlobeIcon />} size="16" />}>With icon</Button>
      <Illustration aria-label="Search" width="120px" height="80px">
        <SearchIllustration />
      </Illustration>
      <div style={{ width: 240, height: 120, marginTop: 16, border: '1px solid #ccc' }}>
        <Scrollbar>
          <ul style={{ margin: 0, padding: 8 }}>
            {items.map((label) => (
              <li key={label}>{label}</li>
            ))}
          </ul>
        </Scrollbar>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>,
);`,
  );

  // Classic "node" resolution goes through typesVersions and has no synthetic
  // default imports, so a declaration that needs either fails here.
  fs.writeFileSync(
    path.join(tempDir, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          lib: ['ES2022', 'DOM'],
          module: 'ESNext',
          moduleResolution: 'node',
          jsx: 'react-jsx',
          strict: true,
          noEmit: true,
          skipLibCheck: true,
        },
        include: ['src/api-contract.tsx', 'src/all-components.ts'],
      },
      null,
      2,
    ),
  );

  fs.writeFileSync(
    path.join(tempDir, 'src', 'api-contract.tsx'),
    `import { useRef, type ReactNode } from 'react';
import { Button } from '@mattermost/compass-ui/components/button';
import { Checkbox } from '@mattermost/compass-ui/components/checkbox';
import { Tag } from '@mattermost/compass-ui/components/tag';

function Message({ children }: { children: ReactNode }) {
  return <span>{children}</span>;
}

export function ExistingUsage({ onConfirm }: { onConfirm: () => void }) {
  return (
    <Button emphasis="primary" destructive id="x" autoFocus onClick={onConfirm}>
      Delete
    </Button>
  );
}

export function NewUsage() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <Button ref={buttonRef}>Focus me</Button>
      <Checkbox ref={inputRef}>Remember</Checkbox>
      <Tag label={<Message>Beta</Message>} />
      {/* @ts-expect-error Button refs must target HTMLButtonElement */}
      <Button ref={inputRef}>Wrong ref</Button>
    </>
  );
}
`,
  );

  fs.writeFileSync(
    path.join(tempDir, 'vite.config.ts'),
    `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist' },
});`,
  );
}

console.log('[smoke] Building @mattermost/compass-ui…');
run('npm run build --workspace=@mattermost/compass-ui');

for (const file of requiredDistFiles) {
  const fullPath = path.join(packageRoot, file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing built file: ${file}`);
  }
}

const packDir = mkdtempSync(path.join(tmpdir(), 'compass-ui-pack-'));

console.log('[smoke] Packing tarball…');
const packOutput = execSync(
  `npm pack --workspace=@mattermost/compass-ui --pack-destination "${packDir}"`,
  { cwd: root, encoding: 'utf8', stdio: ['inherit', 'pipe', 'inherit'] },
);
const tarballName = packOutput.trim().split(/\r?\n/).filter(Boolean).at(-1);
if (!tarballName?.endsWith('.tgz')) {
  throw new Error(
    `npm pack did not print a tarball name; got: ${JSON.stringify(packOutput)}`,
  );
}
const tarballPath = path.join(packDir, tarballName);

assertTarballContents(tarballPath);
console.log('[smoke] Tarball contents OK');

const consumerDir = mkdtempSync(path.join(tmpdir(), 'compass-ui-consumer-'));
try {
  writeConsumer(consumerDir, tarballPath);
  const subpaths = componentSubpaths();
  writeSubpathChecks(consumerDir, subpaths);
  console.log(
    `[smoke] Installing tarball in minimal Vite consumer (peers: ${Object.keys(requiredPeerDependencies()).join(', ')})…`,
  );
  run('npm install', consumerDir);
  console.log(`[smoke] Importing ${subpaths.length} component subpaths (ESM)…`);
  run('npm run check:esm', consumerDir);
  console.log(`[smoke] Requiring ${subpaths.length} component subpaths (CJS)…`);
  run('npm run check:cjs', consumerDir);
  console.log('[smoke] Type-checking public API contract and subpaths…');
  run('npm run typecheck', consumerDir);
  console.log('[smoke] Building consumer…');
  run('npm run build', consumerDir);

  const distDir = path.join(consumerDir, 'dist');
  const hasJsOutput = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && hasJsOutput(fullPath)) return true;
      if (entry.isFile() && entry.name.endsWith('.js')) return true;
    }
    return false;
  };
  if (!hasJsOutput(distDir)) {
    throw new Error('Consumer build produced no JS output');
  }
  console.log('[smoke] Consumer build OK');
} finally {
  rmSync(consumerDir, { recursive: true, force: true });
  rmSync(packDir, { recursive: true, force: true });
}

console.log('[smoke] All checks passed');
