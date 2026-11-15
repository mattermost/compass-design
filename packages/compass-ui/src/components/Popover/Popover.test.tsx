import { act, createRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POPOVER_TRANSITION_MS } from '@/hooks/usePopoverTransition';
import { click, getByRole, keyDown, render } from '@/test-utils/render';
import Popover from './Popover';

const q = (id: string) =>
  document.querySelector(`[data-testid="${id}"]`) as HTMLElement | null;

describe('Popover semantics', () => {
  it('is a non-modal dialog named by its title', () => {
    render(
      <Popover title="Filter" data-testid="p">
        Body
      </Popover>,
    );
    const root = q('p')!;
    expect(root.getAttribute('role')).toBe('dialog');
    expect(root.getAttribute('aria-modal')).toBeNull();
    const labelledBy = root.getAttribute('aria-labelledby')!;
    expect(document.getElementById(labelledBy)?.textContent).toBe('Filter');
  });

  it('lets the host name it without a title', () => {
    render(
      <Popover aria-label="Help" data-testid="p">
        Body
      </Popover>,
    );
    expect(q('p')!.getAttribute('aria-labelledby')).toBeNull();
    expect(q('p')!.getAttribute('aria-label')).toBe('Help');
  });

  it('renders header close only with onClose and footer only when given', () => {
    const onClose = vi.fn();
    const { rerender } = render(<Popover data-testid="p">Body</Popover>);
    expect(document.querySelector('button')).toBeNull();
    expect(q('p')!.querySelector('[class*="footer"]')).toBeNull();
    rerender(
      <Popover data-testid="p" onClose={onClose} footer={<span>Apply</span>}>
        Body
      </Popover>,
    );
    click(getByRole('button', 'Close'));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(q('p')!.textContent).toContain('Apply');
  });

  it('maps size to a kebab modifier', () => {
    render(
      <Popover size="large" data-testid="p">
        x
      </Popover>,
    );
    expect(q('p')!.className).toMatch(/size-large/);
  });
});

describe('Popover focus and Escape', () => {
  it('focuses the root on mount and restores focus on unmount', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();
    const { rerender } = render(
      <Popover title="T" data-testid="p">
        Body
      </Popover>,
    );
    expect(document.activeElement).toBe(q('p'));
    rerender(<div />);
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });

  it('focuses initialFocusRef when given', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <Popover title="T" initialFocusRef={ref}>
        <input ref={ref} aria-label="Name" />
      </Popover>,
    );
    expect(document.activeElement).toBe(ref.current);
  });

  it('leaves focus alone with manageFocus={false}', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();
    render(
      <Popover manageFocus={false} data-testid="p">
        Body
      </Popover>,
    );
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });

  it('does not steal focus back when the user moved it elsewhere', () => {
    const trigger = document.createElement('button');
    const other = document.createElement('button');
    document.body.append(trigger, other);
    trigger.focus();
    const { rerender } = render(<Popover data-testid="p">Body</Popover>);
    other.focus();
    rerender(<div />);
    expect(document.activeElement).toBe(other);
    trigger.remove();
    other.remove();
  });

  it('calls onClose on Escape and marks it handled', () => {
    const onClose = vi.fn();
    render(
      <Popover onClose={onClose} data-testid="p">
        Body
      </Popover>,
    );
    const event = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
      cancelable: true,
    });
    act(() => {
      q('p')!.dispatchEvent(event);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(true);
  });

  it('ignores Escape an inner widget already handled', () => {
    const onClose = vi.fn();
    render(
      <Popover onClose={onClose}>
        <input
          aria-label="Name"
          data-testid="i"
          onKeyDown={(e) => e.preventDefault()}
        />
      </Popover>,
    );
    keyDown(q('i')!, 'Escape');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('ignores Escape with closeOnEscape={false}', () => {
    const onClose = vi.fn();
    render(
      <Popover onClose={onClose} closeOnEscape={false} data-testid="p">
        Body
      </Popover>,
    );
    keyDown(q('p')!, 'Escape');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('still calls a host onKeyDown', () => {
    const onKeyDown = vi.fn();
    render(
      <Popover onKeyDown={onKeyDown} data-testid="p">
        Body
      </Popover>,
    );
    keyDown(q('p')!, 'a');
    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it('does not trap Tab', () => {
    render(<Popover data-testid="p">Body</Popover>);
    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    });
    act(() => {
      q('p')!.dispatchEvent(event);
    });
    expect(event.defaultPrevented).toBe(false);
  });
});

describe('Popover open', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('renders without transition when open is omitted', () => {
    render(<Popover data-testid="p">x</Popover>);
    expect(q('p')!.className).not.toMatch(/transition/);
  });

  it('renders nothing when closed', () => {
    render(
      <Popover open={false} data-testid="p">
        x
      </Popover>,
    );
    expect(q('p')).toBeNull();
  });

  it('stays mounted through the exit, then unmounts and calls onExited', () => {
    const onExited = vi.fn();
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();
    const { rerender } = render(
      <Popover open onExited={onExited} data-testid="p">
        x
      </Popover>,
    );
    expect(document.activeElement).toBe(q('p'));
    rerender(
      <Popover open={false} onExited={onExited} data-testid="p">
        x
      </Popover>,
    );
    expect(q('p')).not.toBeNull();
    expect(onExited).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(POPOVER_TRANSITION_MS);
    });
    expect(q('p')).toBeNull();
    expect(onExited).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });

  it('refocuses when reopened during the exit', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();
    const { rerender } = render(
      <Popover open data-testid="p">
        x
      </Popover>,
    );
    rerender(
      <Popover open={false} data-testid="p">
        x
      </Popover>,
    );
    expect(document.activeElement).toBe(trigger);
    rerender(
      <Popover open data-testid="p">
        x
      </Popover>,
    );
    expect(document.activeElement).toBe(q('p'));
    trigger.remove();
  });
});
