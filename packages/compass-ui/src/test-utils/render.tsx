import type { ReactElement } from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach } from 'vitest';

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const mounted: Array<{ root: Root; container: HTMLElement }> = [];

afterEach(() => {
  for (const { root, container } of mounted.splice(0)) {
    act(() => root.unmount());
    container.remove();
  }
  document.body.innerHTML = '';
});

export function render(ui: ReactElement) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => root.render(ui));
  mounted.push({ root, container });
  return {
    container,
    rerender: (next: ReactElement) => act(() => root.render(next)),
  };
}

export function click(el: Element) {
  act(() => {
    (el as HTMLElement).click();
  });
}

export function keyDown(el: Element, key: string) {
  act(() => {
    el.dispatchEvent(
      new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }),
    );
  });
}

export function focus(el: Element) {
  act(() => {
    (el as HTMLElement).focus();
  });
}

/** Sets an input's value the way a user would, so React's onChange fires. */
export function type(el: HTMLInputElement, value: string) {
  act(() => {
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    )?.set;
    setter?.call(el, value);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

export function getByRole(
  role: string,
  name?: string | RegExp,
  root: ParentNode = document,
): HTMLElement {
  const matches = queryAllByRole(role, name, root);
  if (matches.length !== 1) {
    throw new Error(
      `Expected 1 element with role "${role}"${name ? ` and name ${name}` : ''}, found ${matches.length}`,
    );
  }
  return matches[0];
}

export function queryAllByRole(
  role: string,
  name?: string | RegExp,
  root: ParentNode = document,
): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>('*')).filter((el) => {
    if (implicitRole(el) !== role) return false;
    if (el.closest('[aria-hidden="true"]')) return false;
    if (name == null) return true;
    const accessible = accessibleName(el);
    return typeof name === 'string'
      ? accessible === name
      : name.test(accessible);
  });
}

function implicitRole(el: HTMLElement): string | null {
  const explicit = el.getAttribute('role');
  if (explicit) return explicit;
  const tag = el.tagName.toLowerCase();
  if (tag === 'button') return 'button';
  if (tag === 'input') {
    const type = (el as HTMLInputElement).type;
    if (type === 'checkbox') return 'checkbox';
    if (type === 'radio') return 'radio';
    return 'textbox';
  }
  return null;
}

function accessibleName(el: HTMLElement): string {
  return (el.getAttribute('aria-label') ?? el.textContent ?? '').trim();
}
