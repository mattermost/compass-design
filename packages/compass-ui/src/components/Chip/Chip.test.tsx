import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@/test-utils/render';
import Chip from './Chip';

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

  it('ignores onRemove (no nested button)', () => {
    const { container } = render(
      <Chip as="button" onRemove={() => {}}>
        A
      </Chip>,
    );
    expect(container.querySelectorAll('button')).toHaveLength(1);
  });
});
