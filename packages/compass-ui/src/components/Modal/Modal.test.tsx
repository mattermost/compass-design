import { act, createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
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
