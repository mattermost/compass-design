import { act, createRef, useRef, useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushSync } from 'react-dom';
import { POPOVER_TRANSITION_MS } from '@/hooks/usePopoverTransition';
import { click, getByRole, keyDown, render } from '@/test-utils/render';
import Combobox from '@/components/Combobox/Combobox';
import DateRangePicker from '@/components/DateRangePicker/DateRangePicker';
import Select from '@/components/Select/Select';
import Modal from './Modal';

const OPTIONS = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
];

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

describe('Modal headerLeading', () => {
  it('names the dialog from the title, not the leading control', () => {
    const { container } = render(
      <Modal
        title="Search"
        subtitle="Should stay hidden"
        headerLeading={<button type="button">Channels</button>}
        headerAction={<button type="button">All teams</button>}
      >
        body
      </Modal>,
    );
    const labelledBy = dialog().getAttribute('aria-labelledby');
    const heading = container.querySelector('h2');
    expect(heading?.id).toBe(labelledBy);
    expect(heading?.textContent).toBe('Search');
    expect(heading?.querySelector('button')).toBeNull();
    expect(
      container.querySelector('[class*="modal-header__leading"] button')
        ?.textContent,
    ).toBe('Channels');
    expect(container.textContent).not.toContain('Should stay hidden');
  });
});

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

describe('Modal Escape with host and inner-widget listeners (#247)', () => {
  let hostListener: ((e: KeyboardEvent) => void) | null = null;
  afterEach(() => {
    if (hostListener) document.removeEventListener('keydown', hostListener);
    hostListener = null;
  });

  it('closes from inside the dialog when a host document listener prevents Escape first', () => {
    // Registered before the modal mounts, like the webapp header search.
    hostListener = (e) => {
      if (e.key === 'Escape') e.preventDefault();
    };
    document.addEventListener('keydown', hostListener);
    const onClose = vi.fn();
    render(
      <Modal title="T" onClose={onClose}>
        <button data-testid="in">in</button>
      </Modal>,
    );
    key(dialog(), 'Escape');
    expect(onClose).toHaveBeenCalledTimes(1);

    const e = key(document.querySelector('[data-testid="in"]')!, 'Escape');
    expect(onClose).toHaveBeenCalledTimes(2);
    expect(e.defaultPrevented).toBe(true);
  });

  it('calls onClose once per Escape (dialog handler and document fallback do not both fire)', () => {
    const onClose = vi.fn();
    render(
      <Modal title="T" onClose={onClose}>
        body
      </Modal>,
    );
    const e = key(dialog(), 'Escape');
    expect(e.defaultPrevented).toBe(true);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('lets the host onKeyDown keep the modal open', () => {
    const onClose = vi.fn();
    render(
      <Modal title="T" onClose={onClose} onKeyDown={(e) => e.preventDefault()}>
        body
      </Modal>,
    );
    key(dialog(), 'Escape');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not close when an open Select consumed Escape', () => {
    const onClose = vi.fn();
    render(
      <Modal title="T" onClose={onClose}>
        <Select aria-label="Letter" options={OPTIONS} />
      </Modal>,
    );
    const trigger = getByRole('combobox');
    keyDown(trigger, 'ArrowDown');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    keyDown(trigger, 'Escape');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(onClose).not.toHaveBeenCalled();

    keyDown(trigger, 'Escape');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when an open Combobox consumed Escape', () => {
    const onClose = vi.fn();
    render(
      <Modal title="T" onClose={onClose}>
        <Combobox aria-label="Letter" options={OPTIONS} />
      </Modal>,
    );
    const input = getByRole('combobox');
    keyDown(input, 'ArrowDown');
    expect(input.getAttribute('aria-expanded')).toBe('true');
    keyDown(input, 'Escape');
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not close when Escape is pressed inside an open DateRangePicker calendar', () => {
    const onClose = vi.fn();
    render(
      <Modal title="T" onClose={onClose}>
        <DateRangePicker aria-label="Date" />
      </Modal>,
    );
    const trigger = getByRole('combobox');
    click(trigger);
    const calendar = document.querySelector(
      '[role="dialog"][aria-modal="false"]',
    ) as HTMLElement;
    expect(calendar).toBeTruthy();
    const day = calendar.querySelector('button') as HTMLElement;
    day.focus();
    key(day, 'Escape');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(onClose).not.toHaveBeenCalled();
  });

  // A nested confirm mounts after its parent, so it lands on top of the stack.
  function NestedStack({
    onLowerClose,
    onUpperClose,
  }: {
    onLowerClose: () => void;
    onUpperClose: (hide: () => void) => void;
  }) {
    const [upperOpen, setUpperOpen] = useState(false);
    return (
      <Modal title="A" onClose={onLowerClose}>
        <button data-testid="open" onClick={() => setUpperOpen(true)}>
          open
        </button>
        {upperOpen && (
          <Modal
            title="B"
            onClose={() => onUpperClose(() => setUpperOpen(false))}
          >
            <button data-testid="b">b</button>
          </Modal>
        )}
      </Modal>
    );
  }

  it('closes only the top modal when it is nested inside the lower one', () => {
    const lower = vi.fn();
    const upper = vi.fn();
    render(<NestedStack onLowerClose={lower} onUpperClose={upper} />);
    click(document.querySelector('[data-testid="open"]')!);
    key(document.querySelector('[data-testid="b"]')!, 'Escape');
    expect(upper).toHaveBeenCalledTimes(1);
    expect(lower).not.toHaveBeenCalled();
  });

  it('closes only the top modal when focus sits in the lower one', () => {
    const lower = vi.fn();
    const upper = vi.fn();
    render(
      <>
        <Modal title="A" onClose={lower}>
          <button data-testid="a">a</button>
        </Modal>
        <Modal title="B" onClose={upper}>
          b
        </Modal>
      </>,
    );
    key(document.querySelector('[data-testid="a"]')!, 'Escape');
    expect(upper).toHaveBeenCalledTimes(1);
    expect(lower).not.toHaveBeenCalled();
  });

  it('closes only the top modal when its onClose unmounts it synchronously', () => {
    const lower = vi.fn();
    render(
      <NestedStack
        onLowerClose={lower}
        onUpperClose={(hide) => flushSync(hide)}
      />,
    );
    click(document.querySelector('[data-testid="open"]')!);
    expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(2);
    key(document.querySelector('[data-testid="b"]')!, 'Escape');
    expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(1);
    expect(lower).not.toHaveBeenCalled();
  });
});

describe('Modal manageFocus={false}', () => {
  it('leaves initial focus, the Tab trap and focus restore to the host', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();
    const { rerender } = render(
      <Modal title="T" onClose={() => {}} manageFocus={false}>
        <button data-testid="ok">ok</button>
      </Modal>,
    );
    expect(document.activeElement).toBe(trigger);

    const ok = document.querySelector('[data-testid="ok"]') as HTMLElement;
    ok.focus();
    expect(key(ok, 'Tab').defaultPrevented).toBe(false);

    const other = document.createElement('button');
    document.body.appendChild(other);
    other.focus();
    rerender(<div />);
    expect(document.activeElement).toBe(other);
  });

  it('still closes on Escape unless closeOnEscape is false', () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <Modal title="T" onClose={onClose} manageFocus={false}>
        body
      </Modal>,
    );
    key(document.body, 'Escape');
    expect(onClose).toHaveBeenCalledTimes(1);

    rerender(
      <Modal
        title="T"
        onClose={onClose}
        manageFocus={false}
        closeOnEscape={false}
      >
        body
      </Modal>,
    );
    key(document.body, 'Escape');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('keeps a lower modal from trapping Tab or handling Escape', () => {
    const lower = vi.fn();
    render(
      <>
        <Modal title="A" onClose={lower}>
          a
        </Modal>
        <Modal
          title="B"
          manageFocus={false}
          closeOnEscape={false}
          onClose={() => {}}
        >
          <button data-testid="b">b</button>
        </Modal>
      </>,
    );
    const b = document.querySelector('[data-testid="b"]') as HTMLElement;
    b.focus();
    expect(key(b, 'Tab').defaultPrevented).toBe(false);
    key(document.body, 'Escape');
    expect(lower).not.toHaveBeenCalled();
  });

  it('picks up Tab-trap changes to manageFocus after mount', () => {
    const { rerender } = render(
      <Modal title="T" onClose={() => {}} manageFocus={false}>
        <button data-testid="ok">ok</button>
      </Modal>,
    );
    const ok = document.querySelector('[data-testid="ok"]') as HTMLElement;
    ok.focus();
    expect(key(ok, 'Tab').defaultPrevented).toBe(false);

    rerender(
      <Modal title="T" onClose={() => {}} manageFocus>
        <button data-testid="ok">ok</button>
      </Modal>,
    );
    ok.focus();
    expect(key(ok, 'Tab').defaultPrevented).toBe(true);
    expect(dialog().contains(document.activeElement)).toBe(true);
  });
});

describe('Modal stack across compass-ui copies', () => {
  it('only the topmost modal handles Escape when each copy has its own module', async () => {
    vi.resetModules();
    const { useModalFocus: useCopyA } = await import('@/hooks/useModalFocus');
    vi.resetModules();
    const { useModalFocus: useCopyB } = await import('@/hooks/useModalFocus');
    expect(useCopyA).not.toBe(useCopyB);

    function CopyModal({
      hook,
      onClose,
    }: {
      hook: typeof useCopyA;
      onClose: () => void;
    }) {
      const ref = useRef<HTMLDivElement>(null);
      hook(ref, { onClose });
      return <div ref={ref} tabIndex={-1} />;
    }

    const lower = vi.fn();
    const upper = vi.fn();
    render(
      <>
        <CopyModal hook={useCopyA} onClose={lower} />
        <CopyModal hook={useCopyB} onClose={upper} />
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
