import { act, createRef, useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POPOVER_TRANSITION_MS } from '@/hooks/usePopoverTransition';
import { render } from '@/test-utils/render';
import Modal from './Modal';

function key(target: EventTarget, k: string, init: KeyboardEventInit = {}) {
  const e = new KeyboardEvent('keydown', {
    key: k,
    bubbles: true,
    cancelable: true,
    ...init,
  });
  act(() => {
    target.dispatchEvent(e);
  });
  return e;
}

const dialog = () => document.querySelector('[role="dialog"]') as HTMLElement;

describe('Modal focus and keyboard', () => {
  it('focuses the dialog on mount', () => {
    render(<Modal title="T">body</Modal>);
    expect(document.activeElement).toBe(dialog());
  });

  it('focuses initialFocusRef when given', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <Modal title="T" initialFocusRef={ref}>
        <input ref={ref} />
      </Modal>,
    );
    expect(document.activeElement).toBe(ref.current);
  });

  it('wraps Tab and Shift+Tab using elements present at keypress time', () => {
    function Demo() {
      const [extra, setExtra] = useState(false);
      return (
        <Modal
          title="T"
          onClose={() => {}}
          footer={
            <button data-testid="toggle" onClick={() => setExtra(true)}>
              last
            </button>
          }
        >
          <button data-testid="first">first</button>
          {extra && <button data-testid="added">added</button>}
        </Modal>
      );
    }
    render(<Demo />);
    const q = (id: string) =>
      document.querySelector(`[data-testid="${id}"]`) as HTMLElement;
    const close = dialog().querySelector('button') as HTMLElement;

    close.focus();
    let e = key(close, 'Tab', { shiftKey: true });
    expect(e.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(q('toggle'));

    q('toggle').focus();
    act(() => q('toggle').click());
    expect(q('added')).toBeTruthy();

    e = key(q('toggle'), 'Tab');
    expect(e.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(close);

    q('added').focus();
    e = key(q('added'), 'Tab');
    expect(e.defaultPrevented).toBe(false);
  });

  it('calls onClose on Escape from anywhere in the document', () => {
    const onClose = vi.fn();
    render(
      <Modal title="T" onClose={onClose}>
        body
      </Modal>,
    );
    key(document.body, 'Escape');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('ignores Escape that was already handled', () => {
    const onClose = vi.fn();
    render(
      <Modal title="T" onClose={onClose}>
        <input data-testid="in" onKeyDown={(e) => e.preventDefault()} />
      </Modal>,
    );
    key(document.querySelector('[data-testid="in"]')!, 'Escape');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('ignores Escape when closeOnEscape is false', () => {
    const onClose = vi.fn();
    render(
      <Modal title="T" onClose={onClose} closeOnEscape={false}>
        body
      </Modal>,
    );
    key(document.body, 'Escape');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('restores focus to the previously focused element on unmount', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();
    const { rerender } = render(<Modal title="T">body</Modal>);
    expect(document.activeElement).toBe(dialog());
    rerender(<div />);
    expect(document.activeElement).toBe(trigger);
  });

  it('passes aria-describedby through', () => {
    render(
      <Modal title="T" aria-describedby="desc">
        body
      </Modal>,
    );
    expect(dialog().getAttribute('aria-describedby')).toBe('desc');
  });

  it('falls back to the dialog when initialFocusRef is disabled or outside', () => {
    const outside = document.createElement('input');
    document.body.appendChild(outside);
    const ref = { current: outside };
    render(
      <Modal title="T" initialFocusRef={ref}>
        body
      </Modal>,
    );
    expect(document.activeElement).toBe(dialog());
  });

  it('skips disabled [tabindex] and display:none controls when wrapping', () => {
    render(
      <Modal title="T" onClose={() => {}}>
        <button data-testid="ok">ok</button>
        <button disabled tabIndex={0}>
          disabled
        </button>
        <button style={{ display: 'none' }}>hidden</button>
      </Modal>,
    );
    const ok = document.querySelector('[data-testid="ok"]') as HTMLElement;
    ok.focus();
    const e = key(ok, 'Tab');
    expect(e.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(dialog().querySelector('button'));
  });

  it('pulls focus back in on Tab when focus is outside the dialog', () => {
    render(
      <Modal title="T" onClose={() => {}}>
        <button data-testid="ok">ok</button>
      </Modal>,
    );
    (document.activeElement as HTMLElement).blur();
    const e = key(document.body, 'Tab');
    expect(e.defaultPrevented).toBe(true);
    expect(dialog().contains(document.activeElement)).toBe(true);
  });

  it('only the topmost modal handles Escape', () => {
    const lower = vi.fn();
    const upper = vi.fn();
    render(
      <>
        <Modal title="A" onClose={lower}>
          a
        </Modal>
        <Modal title="B" onClose={upper}>
          b
        </Modal>
      </>,
    );
    key(document.body, 'Escape');
    expect(upper).toHaveBeenCalledTimes(1);
    expect(lower).not.toHaveBeenCalled();
  });
});

describe('Modal open', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    document.documentElement.style.removeProperty('--duration-quick');
  });

  it('renders without transition when open is omitted', () => {
    render(<Modal title="T">body</Modal>);
    expect(dialog().className).not.toMatch(/transition/);
  });

  it('renders nothing when closed', () => {
    render(
      <Modal title="T" open={false}>
        body
      </Modal>,
    );
    expect(dialog()).toBeNull();
  });

  it('stays mounted through the exit, restores focus after, then calls onExited', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();
    const onExited = vi.fn();
    const onClose = vi.fn();
    const { rerender } = render(
      <Modal title="T" open onExited={onExited} onClose={onClose}>
        body
      </Modal>,
    );
    expect(document.activeElement).toBe(dialog());
    rerender(
      <Modal title="T" open={false} onExited={onExited} onClose={onClose}>
        body
      </Modal>,
    );
    expect(dialog()).not.toBeNull();
    key(document.body, 'Escape');
    expect(onClose).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(dialog());
    act(() => {
      vi.advanceTimersByTime(POPOVER_TRANSITION_MS + 1);
    });
    expect(dialog()).toBeNull();
    expect(onExited).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(trigger);
  });

  it('waits for the --duration-quick token, not a hard-coded value', () => {
    document.documentElement.style.setProperty('--duration-quick', '400ms');
    const { rerender } = render(
      <Modal title="T" open>
        body
      </Modal>,
    );
    rerender(
      <Modal title="T" open={false}>
        body
      </Modal>,
    );
    act(() => {
      vi.advanceTimersByTime(POPOVER_TRANSITION_MS + 1);
    });
    expect(dialog()).not.toBeNull();
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(dialog()).toBeNull();
  });
});

describe('Modal stacked focus restore', () => {
  it('a lower modal unmounting under an open modal does not steal focus', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();
    const { rerender } = render(
      <>
        <Modal title="A" data-testid="a">
          a
        </Modal>
        <Modal title="B" data-testid="b">
          b
        </Modal>
      </>,
    );
    const b = document.querySelector('[data-testid="b"]') as HTMLElement;
    expect(document.activeElement).toBe(b);
    rerender(
      <Modal title="B" data-testid="b">
        b
      </Modal>,
    );
    expect(document.activeElement).not.toBe(trigger);
  });

  describe('controlled exit', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('restores focus when the exiting modal was topmost and nothing opened above', () => {
      const trigger = document.createElement('button');
      document.body.appendChild(trigger);
      trigger.focus();
      const { rerender } = render(
        <Modal title="T" open>
          body
        </Modal>,
      );
      rerender(
        <Modal title="T" open={false}>
          body
        </Modal>,
      );
      act(() => {
        vi.advanceTimersByTime(POPOVER_TRANSITION_MS + 1);
      });
      expect(document.activeElement).toBe(trigger);
    });

    it('does not restore focus if another modal opened during the exit', () => {
      const trigger = document.createElement('button');
      document.body.appendChild(trigger);
      trigger.focus();
      const { rerender } = render(
        <Modal title="A" open data-testid="a">
          a
        </Modal>,
      );
      rerender(
        <>
          <Modal title="A" open={false} data-testid="a">
            a
          </Modal>
          <Modal title="B" open data-testid="b">
            b
          </Modal>
        </>,
      );
      act(() => {
        vi.advanceTimersByTime(POPOVER_TRANSITION_MS + 1);
      });
      const b = document.querySelector('[data-testid="b"]') as HTMLElement;
      expect(document.activeElement).toBe(b);
    });
  });
});
