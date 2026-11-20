import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { render } from '@/test-utils/render';
import { describe, expect, it } from 'vitest';
import Dropdown from './Dropdown';

const dropdownScss = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), 'Dropdown.module.scss'),
  'utf8',
);

describe('Dropdown', () => {
  it('renders its own button, without Button classes or a label wrapper', () => {
    const { container } = render(
      <Dropdown size="large" className="host" aria-label="Channel">
        Town square
      </Dropdown>,
    );
    const button = container.querySelector('button');
    expect(button).not.toBeNull();
    expect(button?.getAttribute('type')).toBe('button');
    expect(button?.className).toMatch(/dropdown--size-large/);
    expect(button?.className).toContain('host');
    expect(button?.className).not.toMatch(/button--/);
    expect(button?.querySelector('[class*="button__label"]')).toBeNull();
    expect(button?.getAttribute('aria-haspopup')).toBe('listbox');
    expect(button?.getAttribute('aria-expanded')).toBe('false');
    expect(button?.getAttribute('aria-label')).toBe('Channel');
    expect(button?.textContent).toContain('Town square');
  });

  it('keeps disabled, the open state, and the leading icon', () => {
    const { container } = render(
      <Dropdown disabled isOpen leadingIcon={<span data-testid="lead" />}>
        Open
      </Dropdown>,
    );
    const button = container.querySelector('button');
    expect(button?.disabled).toBe(true);
    expect(button?.getAttribute('aria-expanded')).toBe('true');
    expect(button?.className).toMatch(/dropdown--open/);
    expect(button?.querySelector('[data-testid="lead"]')).not.toBeNull();
  });

  // happy-dom does not resolve CSS-module computed styles on the button; assert
  // the shrink path in source so a flex host can ellipsize a long label.
  it('keeps overflow and a full-width flex trigger for host truncation', () => {
    expect(dropdownScss).toMatch(/min-width:\s*0;/);
    expect(dropdownScss).toMatch(/max-width:\s*100%;/);
    expect(dropdownScss).toMatch(/overflow:\s*hidden;/);
    expect(dropdownScss).toMatch(
      /&__trigger\s*\{[^}]*display:\s*flex;[^}]*width:\s*100%;/s,
    );
    expect(dropdownScss).toMatch(
      /&__label\s*\{[^}]*text-overflow:\s*ellipsis;/s,
    );
  });
});
