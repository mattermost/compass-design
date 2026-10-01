/**
 * Smoke test: build @mattermost/compass-icons, pack from build/, and verify
 * every consumer-contract path resolves from the tarball.
 */
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {execSync} from 'child_process';
import {mkdtempSync, rmSync} from 'fs';
import {tmpdir} from 'os';
import {createRequire} from 'module';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageRoot = path.join(root, 'packages/compass-icons');
const buildRoot = path.join(packageRoot, 'build');

function run(cmd, cwd = root) {
  execSync(cmd, {cwd, stdio: 'inherit'});
}

function assertTarballContents(tarballPath) {
  const listing = execSync(`tar -tzf "${tarballPath}"`, {encoding: 'utf8'});
  const required = [
    'package/package.json',
    'package/config.json',
    'package/IconGlyphs.js',
    'package/IconGlyphs.d.ts',
    'package/components/index.js',
    'package/components/index.d.ts',
    'package/components/check.js',
    'package/css/compass-icons.css',
    'package/font/compass-icons.ttf',
  ];
  for (const entry of required) {
    if (!listing.includes(`${entry}\n`) && !listing.endsWith(entry)) {
      throw new Error(`Tarball missing required entry: ${entry}`);
    }
  }
  if (listing.includes('package/svgs/')) {
    throw new Error('Tarball must not include package/svgs/');
  }
  if (listing.includes('package/generate-data.mjs')) {
    throw new Error('Tarball must not include generate-data.mjs');
  }
}

function assertManifest(tarballDir) {
  const pkg = JSON.parse(fs.readFileSync(path.join(tarballDir, 'package.json'), 'utf8'));
  if (pkg.main !== 'css/compass-icons.css') {
    throw new Error(`Expected main css/compass-icons.css, got ${pkg.main}`);
  }
  if (!pkg.exports?.['./components'] || !pkg.exports?.['./components/*']) {
    throw new Error('Published package.json missing components exports');
  }
  if (!pkg.exports?.['./config.json'] || !pkg.exports?.['./font/*']) {
    throw new Error('Published package.json missing config.json / font exports');
  }
  if (!pkg.peerDependencies?.react) {
    throw new Error('Published package.json missing react peerDependency');
  }
  if (!pkg.repository?.directory) {
    throw new Error('Published package.json missing repository.directory');
  }
}

function assertResolutions(extractDir) {
  const req = createRequire(path.join(extractDir, 'package.json'));
  // Install react next to the extracted package so CJS icon modules can load.
  run('npm install --no-save --omit=dev react@19', extractDir);

  const paths = [
    '@mattermost/compass-icons/components',
    '@mattermost/compass-icons/components/check',
    // compass-ui dist appends .js (vite-plugin-compass-icons-ext) — must resolve
    '@mattermost/compass-icons/components/check.js',
    '@mattermost/compass-icons/components/close.js',
    '@mattermost/compass-icons/IconGlyphs',
    '@mattermost/compass-icons/IconGlyphs.js',
    '@mattermost/compass-icons/config.json',
  ];

  // Point a fake node_modules entry at the extracted package.
  const nm = path.join(extractDir, 'node_modules', '@mattermost');
  fs.mkdirSync(nm, {recursive: true});
  const link = path.join(nm, 'compass-icons');
  if (fs.existsSync(link)) {
    fs.rmSync(link, {recursive: true, force: true});
  }
  fs.symlinkSync(extractDir, link);

  for (const id of paths) {
    const mod = req(id);
    if (mod == null) {
      throw new Error(`Resolved ${id} to null/undefined`);
    }
  }

  const barrel = req('@mattermost/compass-icons/components');
  if (typeof barrel.CheckIcon !== 'function' && typeof barrel.default?.check !== 'function') {
    // CheckIcon named export OR glyphMap default
    if (typeof barrel.default !== 'object') {
      throw new Error('components barrel missing CheckIcon and glyphMap default');
    }
  }
  if (typeof barrel.default !== 'object') {
    throw new Error('components barrel missing default glyphMap');
  }

  const css = req.resolve('@mattermost/compass-icons/css/compass-icons.css');
  const font = req.resolve('@mattermost/compass-icons/font/compass-icons.ttf');
  if (!fs.existsSync(css) || !fs.existsSync(font)) {
    throw new Error('css or font file missing after resolve');
  }

  const glyphs = req('@mattermost/compass-icons/IconGlyphs.js');
  const list = Array.isArray(glyphs) ? glyphs : glyphs.default;
  if (!Array.isArray(list) || list.length < 300) {
    throw new Error(`Unexpected IconGlyphs length: ${list?.length}`);
  }

  console.log(`Resolved all consumer-contract paths (${list.length} glyphs)`);
}

function main() {
  console.log('Building @mattermost/compass-icons (with Fontello)…');
  // Fonts are not committed — same as the old repo. Fontello runs here and on publish.
  run('npm run build:with-font --workspace=@mattermost/compass-icons');

  if (!fs.existsSync(path.join(buildRoot, 'package.json'))) {
    throw new Error('build/package.json missing after build');
  }

  const tempDir = mkdtempSync(path.join(tmpdir(), 'compass-icons-smoke-'));
  try {
    console.log('Packing from build/…');
    run('npm pack --pack-destination "' + tempDir + '"', buildRoot);
    const tarballs = fs.readdirSync(tempDir).filter((f) => f.endsWith('.tgz'));
    if (tarballs.length !== 1) {
      throw new Error(`Expected one tarball, found: ${tarballs.join(', ')}`);
    }
    const tarballPath = path.join(tempDir, tarballs[0]);
    assertTarballContents(tarballPath);

    const extractDir = path.join(tempDir, 'extract');
    fs.mkdirSync(extractDir);
    run(`tar -xzf "${tarballPath}" -C "${extractDir}"`);
    const pkgDir = path.join(extractDir, 'package');
    assertManifest(pkgDir);
    assertResolutions(pkgDir);

    console.log('compass-icons smoke test passed');
  } finally {
    rmSync(tempDir, {recursive: true, force: true});
  }
}

main();
