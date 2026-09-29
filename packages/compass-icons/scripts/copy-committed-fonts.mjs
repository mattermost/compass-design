#!/usr/bin/env node
/**
 * Copies committed css/ and font/ assets into build/ for offline builds.
 * Fontello regeneration is not required for everyday CI or docs builds.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const buildPath = path.join(root, 'build');

function copyDir(srcName) {
  const src = path.join(root, srcName);
  const dest = path.join(buildPath, srcName);
  if (!fs.existsSync(src)) {
    throw new Error(`Missing committed ${srcName}/ at ${src}. Run build:with-font first.`);
  }
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    fs.copyFileSync(path.join(src, entry), path.join(dest, entry));
  }
  console.log(`Copied ${srcName}/ → build/${srcName}/`);
}

fs.mkdirSync(buildPath, { recursive: true });
copyDir('css');
copyDir('font');
