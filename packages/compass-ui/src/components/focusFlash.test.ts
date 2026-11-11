// @vitest-environment node
// Sass rejects importer URLs built from happy-dom's URL class.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import * as sass from 'sass';
import { describe, expect, it } from 'vitest';

/**
 * Guards the #184 "no flash" invariants (see the `focus-ring` mixin in
 * `src/styles/mixins.scss` and the Focus rings section of the styling rule):
 *
 * - `outline-*` is never transitioned, so a ring can't fade out on the control that
 *   lost focus when a host reset (`*:focus { outline: none }`) loads after Compass.
 * - No resting transparent outline (`color-mix(... 0%, transparent)`); the ring is
 *   drawn only under `:focus-visible`.
 * - Controls that set `aria-pressed` / `toggled` / `selected` don't put a
 *   `background-color` / `color` transition on their base state; fades are declared
 *   under `:hover` / `:active` so state changes are instant.
 *
 * Checks compiled CSS, since nesting and mixins decide the final selectors.
 */

// Same preamble and alias as the scss options in vite.config.ts.
const ADDITIONAL_DATA = `@use "@/styles/breakpoints" as *;\n@use "@/styles/mixins" as *;\n`;
const srcDir = path.resolve(__dirname, '..');
const aliasImporter: sass.FileImporter<'sync'> = {
  findFileUrl: (url) =>
    url.startsWith('@/')
      ? pathToFileURL(path.join(srcDir, url.slice(2)))
      : null,
};

/** Controls whose base state must not fade fills/colours (#184). */
const NO_BASE_FADE = [
  'Button',
  'IconButton',
  'EmojiButton',
  'TileButton',
  'CardButton',
  'Chip',
  'Tabs',
  'SegmentedControl',
  'ReactionButton',
  'ReactionsRow',
  'PaginationDots',
  'MoreUnreadsBanner',
  'AttachmentCard',
  'MenuItem',
];

/** Components that transition `outline-*` as a hover/active border, not a focus ring. */
const OUTLINE_TRANSITION_ALLOWLIST = ['TeamAvatar'];

interface Rule {
  selector: string;
  body: string;
}

function moduleFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return moduleFiles(full);
    return entry.name.endsWith('.module.scss') ? [full] : [];
  });
}

/** Innermost `selector { declarations }` blocks of compiled CSS. */
function rules(rawCss: string): Rule[] {
  const css = rawCss.replace(/\/\*[\s\S]*?\*\//g, '');
  return [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((match) => ({
    selector: match[1]!.trim().replace(/\s+/g, ' '),
    body: match[2]!,
  }));
}

function compile(file: string): Rule[] {
  const { css } = sass.compileString(
    ADDITIONAL_DATA + fs.readFileSync(file, 'utf8'),
    { url: pathToFileURL(file), importers: [aliasImporter] },
  );
  return rules(css);
}

// `color` as a property, not the tail of `outline-color` / `border-color`.
const FILL_OR_COLOR = /(?<![-\w])(?:background-color|color)(?![-\w])/;

function transitionOf(body: string): string {
  return /(?:^|[;\s])transition\s*:([^;]*)/.exec(body)?.[1] ?? '';
}

/** True when the selector targets only the resting state (no state pseudo-class). */
function isBaseState(selector: string): boolean {
  return !/:(?:hover|active|focus|focus-visible|focus-within|disabled)\b/.test(
    selector,
  );
}

describe('#184 no-flash invariants', () => {
  const files = moduleFiles(__dirname);

  it('detects each violation', () => {
    const css = `.a { outline: 2px solid color-mix(in srgb, red 0%, transparent); transition: outline-color 1s; } .b { transition: background-color 1s; } .b:hover { transition: color 1s; }`;
    const found = rules(css);

    expect(
      found.filter((r) => /outline-/.test(transitionOf(r.body))),
    ).toHaveLength(1);
    expect(
      found.filter((r) => /0%\s*,\s*transparent/.test(r.body)),
    ).toHaveLength(1);
    expect(
      found.filter(
        (r) =>
          isBaseState(r.selector) && FILL_OR_COLOR.test(transitionOf(r.body)),
      ),
    ).toHaveLength(1);
  });

  it('never transitions outline-*', () => {
    const offenders = files
      .filter(
        (file) =>
          !OUTLINE_TRANSITION_ALLOWLIST.includes(
            path.basename(path.dirname(file)),
          ),
      )
      .flatMap((file) =>
        compile(file)
          .filter((r) => /outline-/.test(transitionOf(r.body)))
          .map((r) => `${path.relative(__dirname, file)}: ${r.selector}`),
      );

    expect(offenders).toEqual([]);
  });

  it('has no resting transparent outline', () => {
    const offenders = files.flatMap((file) =>
      compile(file)
        .filter(
          (r) =>
            isBaseState(r.selector) &&
            /outline\s*:[^;]*0%\s*,\s*transparent/.test(r.body),
        )
        .map((r) => `${path.relative(__dirname, file)}: ${r.selector}`),
    );

    expect(offenders).toEqual([]);
  });

  it('keeps background-color / color fades off the base state of listed controls', () => {
    const offenders = files
      .filter((file) =>
        NO_BASE_FADE.includes(path.basename(path.dirname(file))),
      )
      .flatMap((file) =>
        compile(file)
          .filter(
            (r) =>
              isBaseState(r.selector) &&
              FILL_OR_COLOR.test(transitionOf(r.body)),
          )
          .map((r) => `${path.relative(__dirname, file)}: ${r.selector}`),
      );

    expect(offenders).toEqual([]);
  });
});
