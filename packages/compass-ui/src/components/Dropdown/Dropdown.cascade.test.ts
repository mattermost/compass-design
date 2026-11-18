// @vitest-environment node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Window } from 'happy-dom';
import { describe, expect, it } from 'vitest';
import * as sass from 'sass';

const srcDir = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  '../..',
);

function resolveSassPath(url: string): string | null {
  if (!url.startsWith('@/')) return null;
  const base = path.join(srcDir, url.slice(2));
  const candidates = [
    base,
    `${base}.scss`,
    `${base}.sass`,
    path.join(base, 'index.scss'),
  ];
  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

const importer: sass.Importer<'sync'> = {
  canonicalize(url) {
    const resolved = resolveSassPath(url);
    return resolved ? pathToFileURL(resolved) : null;
  },
  load(canonicalUrl) {
    return {
      contents: readFileSync(canonicalUrl, 'utf8'),
      syntax: 'scss',
    };
  },
};

function compile(relativeFile: string): string {
  const abs = path.join(srcDir, relativeFile);
  const source =
    `@use "@/styles/breakpoints" as *;\n@use "@/styles/mixins" as *;\n` +
    readFileSync(abs, 'utf8');
  return sass.compileString(source, {
    url: pathToFileURL(abs),
    importers: [importer],
    syntax: 'scss',
  }).css;
}

function paddingOf(document: Window['document'], className: string): string {
  const button = document.createElement('button');
  button.className = className;
  document.body.appendChild(button);
  const style = document.defaultView!.getComputedStyle(button);
  return [
    style.paddingTop,
    style.paddingRight,
    style.paddingBottom,
    style.paddingLeft,
  ].join(' ');
}

describe('Dropdown cascade against Button', () => {
  const dropdownCss = compile('components/Dropdown/Dropdown.module.scss');
  const buttonCss = compile('components/Button/Button.module.scss');

  it('keeps Dropdown padding when the Button sheet loads second', () => {
    const window = new Window();
    const { document } = window;
    const tokens: Record<string, string> = {
      '--spacing-xxxxs': '2px',
      '--spacing-xxxs': '4px',
      '--spacing-xxs': '6px',
      '--spacing-xs': '8px',
      '--spacing-s': '10px',
      '--spacing-m': '12px',
      '--spacing-l': '16px',
      '--spacing-xl': '20px',
    };
    for (const [name, value] of Object.entries(tokens)) {
      document.documentElement.style.setProperty(name, value);
    }
    // Button after Dropdown: equal specificity would let Button win.
    const style = document.createElement('style');
    style.textContent = `${dropdownCss}\n${buttonCss}`;
    document.head.appendChild(style);

    const buttonClasses =
      'button button--emphasis-quaternary button--size-medium';
    expect(paddingOf(document, buttonClasses)).toBe('10px 20px 10px 20px');
    expect(
      paddingOf(document, `dropdown dropdown--size-large ${buttonClasses}`),
    ).toBe('2px 4px 2px 6px');
    expect(
      paddingOf(
        document,
        `dropdown dropdown--size-large dropdown--padding-default ${buttonClasses}`,
      ),
    ).toBe('12px 16px 12px 20px');
    expect(
      paddingOf(
        document,
        `dropdown dropdown--size-large dropdown--padding-compact ${buttonClasses}`,
      ),
    ).toBe('4px 8px 4px 12px');
    expect(
      paddingOf(document, `dropdown dropdown--size-medium ${buttonClasses}`),
    ).toBe('2px 2px 2px 4px');
    expect(
      paddingOf(document, `dropdown dropdown--size-x-small ${buttonClasses}`),
    ).toBe('0px 2px 0px 4px');
    expect(
      paddingOf(document, `dropdown dropdown--size-small ${buttonClasses}`),
    ).toBe('2px 2px 2px 4px');
    expect(
      paddingOf(document, `dropdown dropdown--size-x-large ${buttonClasses}`),
    ).toBe('0px 6px 0px 8px');
    window.close();
  });

  it('triples the default hover and active selectors so they beat quaternary', () => {
    expect(dropdownCss).toMatch(
      /\.dropdown\.dropdown\.dropdown:hover:not\(:disabled\)\s*\{[^}]*rgba\(var\(--center-channel-color-rgb\), 0\.08\)/,
    );
    expect(dropdownCss).toMatch(
      /\.dropdown\.dropdown\.dropdown:active:not\(:disabled\)\s*\{[^}]*rgba\(var\(--center-channel-color-rgb\), 0\.12\)/,
    );
  });
});
