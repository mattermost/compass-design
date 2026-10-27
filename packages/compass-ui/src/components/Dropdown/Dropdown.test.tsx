import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { click, getByRole, render } from '@/test-utils/render';
import Dropdown from './Dropdown';

describe('Dropdown', () => {
  it('renders a plain button, not a Compass Button', () => {
    render(<Dropdown>Agents</Dropdown>);
    const trigger = getByRole('button');
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger.className).not.toMatch(/\bbutton\b|button--|button__/);
  });

  it('forwards ref to the button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Dropdown ref={ref}>Agents</Dropdown>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('defaults to type="button" and reflects isOpen in aria-expanded', () => {
    const { rerender } = render(<Dropdown>Agents</Dropdown>);
    const trigger = getByRole('button');
    expect(trigger.getAttribute('type')).toBe('button');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    rerender(<Dropdown isOpen>Agents</Dropdown>);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('lets a host override aria-haspopup and aria-expanded', () => {
    render(
      <Dropdown aria-haspopup="menu" aria-expanded>
        Agents
      </Dropdown>,
    );
    const trigger = getByRole('button');
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('calls onClick, and not when disabled', () => {
    const onClick = vi.fn();
    const { rerender } = render(<Dropdown onClick={onClick}>Agents</Dropdown>);
    click(getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(
      <Dropdown onClick={onClick} disabled>
        Agents
      </Dropdown>,
    );
    click(getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
