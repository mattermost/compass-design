// @vitest-environment node
// Sass rejects importer URLs built from happy-dom's URL class.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import * as sass from 'sass';
import { describe, expect, it } from 'vitest';

/**
 * Chromium can't scope style invalidation for `:has()` paired with a pseudo-element that
 * lives in the element's UA shadow tree (`::placeholder`, `::file-selector-button`). A
 * single such rule anywhere on the page makes every DOM change restyle the whole
 * document: in the Mattermost webapp, every keystroke in the message box. Express the
 * condition without `:has()` instead, e.g. a sibling combinator when the element it
 * looks for precedes the target.
 *
 * Checks compiled CSS, since nesting can put the pseudo-element and `:has()` in
 * different blocks.
 */
const SHADOW_PSEUDO =
  /::(?:placeholder|file-selector-button|-webkit-input-placeholder)\b/;

// Same preamble and alias as the scss options in vite.config.ts.
const ADDITIONAL_DATA = `@use "@/styles/breakpoints" as *;\n@use "@/styles/mixins" as *;\n`;
const srcDir = path.resolve(__dirname, '..');
const aliasImporter: sass.FileImporter<'sync'> = {
  findFileUrl: (url) =>
    url.startsWith('@/')
      ? pathToFileURL(path.join(srcDir, url.slice(2)))
      : null,
};

function moduleFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return moduleFiles(full);
    return entry.name.endsWith('.module.scss') ? [full] : [];
  });
}

/** Splits a selector list on top-level commas (not those inside `:has(a, b)`). */
function splitSelectorList(list: string): string[] {
  const selectors: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < list.length; i++) {
    if (list[i] === '(') depth++;
    else if (list[i] === ')') depth--;
    else if (list[i] === ',' && depth === 0) {
      selectors.push(list.slice(start, i));
      start = i + 1;
    }
  }
  selectors.push(list.slice(start));
  return selectors.map((selector) => selector.trim().replace(/\s+/g, ' '));
}

function slowSelectors(css: string): string[] {
  return css
    .split('{')
    .slice(0, -1)
    .map((chunk) =>
      chunk
        .slice(Math.max(chunk.lastIndexOf('}'), chunk.lastIndexOf(';')) + 1)
        .trim(),
    )
    .filter((prelude) => prelude && !prelude.startsWith('@'))
    .flatMap(splitSelectorList)
    .filter(
      (selector) => selector.includes(':has(') && SHADOW_PSEUDO.test(selector),
    );
}

describe(':has() with UA shadow pseudo-elements', () => {
  it('detects the pattern, including through nesting', () => {
    const css = sass.compileString(
      '.a { &:has(.b) .c { color: red; &::placeholder { color: red; } } .d:has(.e, .f) { color: red; } }',
    ).css;

    expect(slowSelectors(css)).toEqual(['.a:has(.b) .c::placeholder']);
  });

  it('is not used by any component', () => {
    const offenders = moduleFiles(__dirname).flatMap((file) => {
      const source = fs.readFileSync(file, 'utf8');
      const { css } = sass.compileString(ADDITIONAL_DATA + source, {
        url: pathToFileURL(file),
        importers: [aliasImporter],
      });
      return slowSelectors(css).map(
        (selector) => `${path.relative(__dirname, file)}: ${selector}`,
      );
    });

    expect(offenders).toEqual([]);
  });
});
