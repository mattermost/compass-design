/**
 * Smoke test: build @mattermost/compass-ui, pack a tarball, install it in a
 * minimal Vite consumer, and verify the app builds with styles + components.
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
  'dist/index.css',
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
    'package/dist/index.css',
    'package/dist/compass-ui.css',
    'package/dist/compass-ui-standalone.css',
    'package/dist/components/button/index.js',
    'package/dist/components/button/index.cjs',
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
        scripts: { build: 'vite build' },
        dependencies: {
          '@mattermost/compass-icons': '^0.1.53',
          '@mattermost/compass-ui': `file:./${tgzName}`,
          react: '^19.0.0',
          'react-dom': '^19.0.0',
          'simplebar-react': '^3.3.2',
        },
        devDependencies: {
          '@vitejs/plugin-react': '^4.3.4',
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
import { Scrollbar } from '@mattermost/compass-ui/components/scrollbar';
import '@mattermost/compass-ui/styles';
import '@mattermost/compass-ui/component-styles';

function App() {
  const items = Array.from({ length: 20 }, (_, i) => \`Row \${i + 1}\`);
  return (
    <div style={{ padding: 24, fontFamily: 'system-ui' }}>
      <Button emphasis="primary">Compass UI</Button>
      <Button leading-icon={<Icon glyph={<GlobeIcon />} size="16" />}>With icon</Button>
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
const tarballName = packOutput
  .trim()
  .split(/\r?\n/)
  .filter(Boolean)
  .at(-1);
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
  console.log('[smoke] Installing tarball in minimal Vite consumer…');
  run('npm install', consumerDir);
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
