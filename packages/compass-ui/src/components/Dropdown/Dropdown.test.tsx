import { render } from '@/test-utils/render';
import { describe, expect, it } from 'vitest';
import Dropdown from './Dropdown';

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
});
