import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Built-in accessible names and text attributes must come from a prop with an
 * English default (e.g. `closeLabel = 'Close'`), never a literal in JSX, so
 * hosts can translate them. See "Component API contract" in
 * packages/compass-ui/AGENTS.md.
 */
const TEXT_ATTRIBUTES = [
  'aria-label',
  'aria-roledescription',
  'aria-valuetext',
  'aria-placeholder',
  'placeholder',
  'title',
  'alt',
  'label',
];

/** `file:attribute=value` entries that are allowed to stay literal. Keep this short. */
const ALLOWLIST = new Set<string>([]);

const componentsDir = __dirname;

function componentFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return componentFiles(full);
    if (!entry.name.endsWith('.tsx')) return [];
    if (/\.(stories|test|specimen)\.tsx$/.test(entry.name)) return [];
    return [full];
  });
}

/** Returns the `{…}` expression starting at `start` (which points at `{`). */
function braceExpression(source: string, start: number): string {
  let depth = 0;
  for (let i = start; i < source.length; i++) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}' && --depth === 0) {
      return source.slice(start + 1, i);
    }
  }
  return '';
}

const HAS_WORD = /[A-Za-z]{2,}/;

/** English-looking string and template literal text inside an expression. */
function literalsIn(rawExpression: string): string[] {
  // Index keys (`rest['aria-label']`) and comparison operands (`type === 'x'`) aren't copy.
  const expression = rawExpression
    .replace(/\[\s*(['"])[^'"\n]*\1\s*\]/g, '')
    .replace(/[!=]==\s*(['"])[^'"\n]*\1/g, '')
    .replace(/(['"])[^'"\n]*\1\s*[!=]==/g, '');
  const found: string[] = [];
  for (const match of expression.matchAll(/'([^'\n]*)'|"([^"\n]*)"/g)) {
    const text = match[1] ?? match[2];
    if (HAS_WORD.test(text)) found.push(text);
  }
  for (const match of expression.matchAll(/`([^`]*)`/g)) {
    const text = match[1].replace(/\$\{[^}]*\}/g, '');
    if (HAS_WORD.test(text)) found.push(match[1]);
  }
  return found;
}

export function findEnglishLiterals(source: string): string[] {
  const attr = TEXT_ATTRIBUTES.join('|');
  const pattern = new RegExp(`\\s(${attr})=(?:"([^"]*)"|\\{)`, 'g');
  const found: string[] = [];
  for (const match of source.matchAll(pattern)) {
    const [whole, name, quoted] = match;
    if (quoted !== undefined) {
      if (HAS_WORD.test(quoted)) found.push(`${name}="${quoted}"`);
      continue;
    }
    const expression = braceExpression(source, match.index! + whole.length - 1);
    for (const text of literalsIn(expression)) {
      found.push(`${name}={…${text}…}`);
    }
  }
  return found;
}

describe('no hardcoded English in component attributes', () => {
  it('flags literal and computed English, and ignores prop references', () => {
    expect(findEnglishLiterals('<b aria-label="Close" />')).toEqual([
      'aria-label="Close"',
    ]);
    expect(
      findEnglishLiterals(`<b aria-label={open ? 'Collapse' : 'Expand'} />`),
    ).toHaveLength(2);
    expect(
      findEnglishLiterals('<b aria-label={`${n} mentions`} />'),
    ).toHaveLength(1);
    expect(findEnglishLiterals('<b aria-label={closeLabel} />')).toEqual([]);
    expect(findEnglishLiterals('<b aria-label={`${a}, ${b}`} />')).toEqual([]);
    expect(findEnglishLiterals('<b alt="" title={tab.title} />')).toEqual([]);
    expect(
      findEnglishLiterals(
        `<b aria-label={type === 'jump' ? rest['aria-label'] : x} />`,
      ),
    ).toEqual([]);
  });

  for (const file of componentFiles(componentsDir)) {
    const relative = path.relative(componentsDir, file);
    it(relative, () => {
      const offenders = findEnglishLiterals(
        fs.readFileSync(file, 'utf8'),
      ).filter((literal) => !ALLOWLIST.has(`${relative}:${literal}`));
      expect(
        offenders,
        `Move these into optional label props with English defaults (see packages/compass-ui/AGENTS.md, "Component API contract")`,
      ).toEqual([]);
    });
  }
});
