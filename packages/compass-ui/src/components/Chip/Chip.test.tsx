import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@/test-utils/render';
import Chip from './Chip';

function fireKey(el: HTMLElement, key: string) {
  el.dispatchEvent(
    new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }),
  );
}

describe('Chip pressable mode', () => {
  it('keeps the inert div by default', () => {
    const { container } = render(<Chip>Label</Chip>);
    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe('DIV');
    expect(root.hasAttribute('role')).toBe(false);
    expect(root.hasAttribute('tabindex')).toBe(false);
  });

  it('renders a native button that fires onClick', () => {
    const onClick = vi.fn();
    const { container } = render(
      <Chip as="button" onClick={onClick}>
        Run
      </Chip>,
    );
    const btn = container.querySelector('button') as HTMLButtonElement;
    expect(btn.type).toBe('button');
    btn.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not click and is disabled when disabled', () => {
    const onClick = vi.fn();
    const { container } = render(
      <Chip as="button" disabled onClick={onClick}>
        Run
      </Chip>,
    );
    const btn = container.querySelector('button') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    btn.click();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards ref to the button and to the div', () => {
    const buttonRef = createRef<HTMLElement>();
    const divRef = createRef<HTMLElement>();
    render(
      <>
        <Chip as="button" ref={buttonRef}>
          A
        </Chip>
        <Chip ref={divRef}>B</Chip>
      </>,
    );
    expect(buttonRef.current?.tagName).toBe('BUTTON');
    expect(divRef.current?.tagName).toBe('DIV');
  });

  it('pressable + removable: one control; body clicks, Delete and × remove', () => {
    const onClick = vi.fn();
    const onRemove = vi.fn();
    const { container } = render(
      <Chip as="button" onClick={onClick} onRemove={onRemove}>
        A
      </Chip>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe('DIV');
    expect(root.getAttribute('role')).toBe('button');
    root.click();
    expect(onClick).toHaveBeenCalledTimes(1);
    fireKey(root, 'Enter');
    expect(onClick).toHaveBeenCalledTimes(2);
    fireKey(root, 'Delete');
    expect(onRemove).toHaveBeenCalledTimes(1);
    (root.querySelector('[data-chip-remove]') as HTMLElement).click();
    expect(onRemove).toHaveBeenCalledTimes(2);
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('disabled pressable + removable blocks everything', () => {
    const onClick = vi.fn();
    const onRemove = vi.fn();
    const { container } = render(
      <Chip as="button" disabled onClick={onClick} onRemove={onRemove}>
        A
      </Chip>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute('aria-disabled')).toBe('true');
    expect(root.tabIndex).toBe(-1);
    root.click();
    fireKey(root, 'Enter');
    fireKey(root, 'Delete');
    (root.querySelector('[data-chip-remove]') as HTMLElement).click();
    expect(onClick).not.toHaveBeenCalled();
    expect(onRemove).not.toHaveBeenCalled();
  });
});
