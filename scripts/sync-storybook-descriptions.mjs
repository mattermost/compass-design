/**
 * Set component JSDoc descriptions from the first prose paragraph of matching
 * guidelines MDX (Storybook autodocs source).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const componentsDir = path.join(root, 'packages/compass-ui/src/components');
const guidelinesDir = path.join(root, 'src/guidelines/components');

function toKebabSlug(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

function extractFirstParagraph(mdx) {
  const lines = mdx.split('\n');
  const paragraphLines = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (paragraphLines.length > 0) break;
      continue;
    }
    if (
      trimmed.startsWith('#') ||
      trimmed.startsWith('<') ||
      trimmed.startsWith('import ') ||
      trimmed.startsWith('export ')
    ) {
      if (paragraphLines.length > 0) break;
      continue;
    }
    paragraphLines.push(trimmed);
  }

  return paragraphLines.join(' ').replace(/\s+/g, ' ').trim();
}

function escapeForJsdoc(text) {
  return text.replace(/\*\//g, '*\\/');
}

function wrapJsdoc(text) {
  const words = text.split(' ');
  const lines = [];
  let current = '';

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > 90 && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);

  return ['/**', ...lines.map((l) => ` * ${l}`), ' */'].join('\n');
}

function findAnchor(content, componentName) {
  const fnNeedle = `export default function ${componentName}`;
  const fnIdx = content.indexOf(fnNeedle);
  if (fnIdx !== -1) return { idx: fnIdx, needle: fnNeedle };

  const refNeedle = `const ${componentName} = forwardRef`;
  const refIdx = content.indexOf(refNeedle);
  if (refIdx !== -1) return { idx: refIdx, needle: refNeedle };

  return null;
}

function stripLeadingDocblock(before) {
  const trimmed = before.replace(/\s+$/, '');
  const lastOpen = trimmed.lastIndexOf('/**');
  if (lastOpen === -1) return { prefix: trimmed, removed: false };

  const candidate = trimmed.slice(lastOpen);
  if (!/^\/\*\*[\s\S]*?\*\/\s*$/.test(candidate)) {
    return { prefix: trimmed, removed: false };
  }

  return {
    prefix: trimmed.slice(0, lastOpen).replace(/\s+$/, ''),
    removed: true,
  };
}

function applyJsdoc(content, componentName, jsdoc) {
  const anchor = findAnchor(content, componentName);
  if (!anchor) return null;

  const before = content.slice(0, anchor.idx);
  const after = content.slice(anchor.idx);
  const { prefix } = stripLeadingDocblock(before);
  const separator = prefix.length > 0 ? '\n\n' : '';

  return `${prefix}${separator}${jsdoc}\n${after}`;
}

function updateComponentDoc(componentPath, paragraph) {
  const componentName = path.basename(componentPath, '.tsx');
  const content = fs.readFileSync(componentPath, 'utf8');
  const jsdoc = wrapJsdoc(escapeForJsdoc(paragraph));
  const updated = applyJsdoc(content, componentName, jsdoc);

  if (updated == null || updated === content) {
    return false;
  }

  fs.writeFileSync(componentPath, updated);
  return true;
}

function listComponentFiles(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      listComponentFiles(p, files);
      continue;
    }
    if (ent.name.endsWith('.tsx') && !ent.name.endsWith('.stories.tsx')) {
      const base = ent.name.replace(/\.tsx$/, '');
      const parent = path.basename(path.dirname(p));
      if (base === parent) files.push(p);
    }
  }
  return files;
}

const componentFiles = listComponentFiles(componentsDir);
let updated = 0;
let skipped = 0;

for (const componentPath of componentFiles) {
  const componentName = path.basename(componentPath, '.tsx');
  const slug = toKebabSlug(componentName);
  const guidelinePath = path.join(
    guidelinesDir,
    slug,
    `${slug}.guideline.mdx`,
  );

  if (!fs.existsSync(guidelinePath)) {
    skipped++;
    continue;
  }

  const paragraph = extractFirstParagraph(fs.readFileSync(guidelinePath, 'utf8'));
  if (!paragraph) {
    console.warn(`Skip (empty paragraph): ${slug}`);
    skipped++;
    continue;
  }

  if (updateComponentDoc(componentPath, paragraph)) {
    console.log(`Updated ${componentName}`);
    updated++;
  } else {
    console.warn(`Skip (could not apply): ${componentName}`);
    skipped++;
  }
}

console.log(`Done: ${updated} updated, ${skipped} skipped`);
