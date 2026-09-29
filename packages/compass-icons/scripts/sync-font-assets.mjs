#!/usr/bin/env node
/**
 * After Fontello generates build/css and build/font, copy them back to the
 * committed css/ and font/ directories so offline builds stay in sync.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function syncDir(name) {
  const src = path.join(root, 'build', name);
  const dest = path.join(root, name);
  if (!fs.existsSync(src)) {
    throw new Error(`Missing build/${name}/. Run build:font first.`);
  }
  fs.rmSync(dest, { recursive: true, force: true });
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    fs.copyFileSync(path.join(src, entry), path.join(dest, entry));
  }
  console.log(`Synced build/${name}/ → ${name}/`);
}

syncDir('css');
syncDir('font');
