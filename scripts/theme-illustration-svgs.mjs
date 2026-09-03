#!/usr/bin/env node
/**
 * Bind Compass illustration SVG fills/strokes to theme CSS variables.
 *
 * Skips <mask> contents (luminance / alpha maps). Leaves unmapped hex
 * (partner logos, decorative beige) unchanged. Re-run after a Figma
 * export that still ships Denim hex.
 *
 * Usage: node scripts/theme-illustration-svgs.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const illustrationsDir = join(
  dirname(fileURLToPath(import.meta.url)),
  '../packages/compass-ui/src/illustrations',
);

const HEX_MAP = {
  '#3F4350': 'var(--center-channel-color)',
  '#1C58D9': 'var(--button-bg)',
  '#1E325C': 'var(--sidebar-bg)',
  '#192A4D': 'var(--sidebar-header-bg)',
  '#28427B': 'var(--color-indigo-500)',
  '#32539A': 'var(--color-indigo-500)',
  '#3DB887': 'var(--color-success)',
  '#F5AB00': 'var(--color-warning)',
  '#FFBC1F': 'var(--color-warning)',
  '#D24B4E': 'var(--error-text)',
  '#090A0B': 'var(--center-channel-color)',
  '#1B1D22': 'var(--center-channel-color)',
  '#D9D9D9': 'rgba(var(--center-channel-color-rgb), 0.24)',
};

const PAINT_ATTR = /(fill|stroke|stop-color)="([^"]*)"/gi;
const MASK_BLOCK = /<mask\b[^>]*>[\s\S]*?<\/mask>/gi;

function expandHex(value) {
  const hex = value.toUpperCase();
  if (/^#[0-9A-F]{3}$/.test(hex)) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  return hex;
}

function whiteToken(filename) {
  if (filename.endsWith('-on-sidebar-bg.svg')) {
    return 'var(--sidebar-text)';
  }
  return 'var(--center-channel-bg)';
}

function mapPaint(value, paper) {
  const trimmed = value.trim();
  const lower = trimmed.toLowerCase();
  if (lower === 'var(--fill-0, white)') {
    return paper;
  }
  if (lower === 'white' || lower === '#fff' || lower === '#ffffff') {
    return paper === 'var(--sidebar-text)' ? paper : 'var(--color-neutral-0)';
  }
  if (lower === 'black' || lower === '#000' || lower === '#000000') {
    return 'var(--center-channel-color)';
  }
  if (trimmed.startsWith('#')) {
    return HEX_MAP[expandHex(trimmed)] ?? value;
  }
  return value;
}

function rewriteOutsideMasks(svg, paper) {
  const masks = [];
  const withPlaceholders = svg.replace(MASK_BLOCK, (block) => {
    const key = `__COMPASS_MASK_${masks.length}__`;
    masks.push(block);
    return key;
  });
  const rewritten = withPlaceholders.replace(PAINT_ATTR, (full, attr, val) => {
    const next = mapPaint(val, paper);
    return next === val ? full : `${attr}="${next}"`;
  });
  return rewritten.replace(/__COMPASS_MASK_(\d+)__/g, (_, i) => masks[Number(i)]);
}

function postProcess(filename, svg) {
  if (filename !== 'no-unreads-on-sidebar-bg.svg') {
    return svg;
  }
  // Checkmark sits on --color-success; sidebar-bg washes out on Quartz.
  return svg.replace(
    'M28 31.5L31 34.5L37 28.5" stroke="var(--sidebar-bg)"',
    'M28 31.5L31 34.5L37 28.5" stroke="var(--center-channel-color)"',
  );
}

const files = readdirSync(illustrationsDir)
  .filter((name) => name.endsWith('.svg'))
  .sort();

if (files.length === 0) {
  throw new Error(`No SVGs in ${illustrationsDir}`);
}

let changed = 0;
for (const name of files) {
  const path = join(illustrationsDir, name);
  const before = readFileSync(path, 'utf8');
  const after = postProcess(name, rewriteOutsideMasks(before, whiteToken(name)));
  if (after !== before) {
    writeFileSync(path, after);
    changed += 1;
  }
}

console.log(`Themed ${changed} of ${files.length} illustration SVGs`);
