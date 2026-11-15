import { describe, expect, it, vi } from 'vitest';
import { act, createRef, useState } from 'react';
import { click, render } from '@/test-utils/render';
import SuggestionList from './SuggestionList';
import {
  useSuggestionList,
  type SuggestionOption,
  type SuggestionSection,
} from './useSuggestionList';

const OPTIONS: SuggestionOption[] = [
  { value: 'alice', label: 'alice', secondaryLabel: 'Alice Smith' },
  { value: 'bob', label: 'bob', disabled: true },
  { value: 'carol', label: 'carol', trailingLabel: 'Not in channel' },
];

const SECTIONS: SuggestionSection[] = [
  { key: 'members', heading: 'Channel members', options: [OPTIONS[0]] },
  { key: 'others', heading: 'Not in channel', options: [OPTIONS[2]] },
];

function key(el: Element, k: string, init: KeyboardEventInit = {}) {
  const event = new KeyboardEvent('keydown', {
    key: k,
    bubbles: true,
    cancelable: true,
    ...init,
  });
  act(() => {
    el.dispatchEvent(event);
  });
  return event;
}

function Composer({
  onSelect = () => {},
  onClose = () => {},
  options = OPTIONS,
  sections,
  selectKeys,
  open = true,
  onFieldKeyDown,
}: {
  onSelect?: (o: SuggestionOption) => void;
  onClose?: () => void;
  options?: SuggestionOption[];
  sections?: SuggestionSection[];
  selectKeys?: ('Enter' | 'Tab')[];
  open?: boolean;
  onFieldKeyDown?: (e: React.KeyboardEvent) => void;
}) {
  const s = useSuggestionList({
    options: sections ? undefined : options,
    sections,
    open,
    onSelect,
    onClose,
    selectKeys,
    id: 'sg',
  });
  return (
    <div>
      <textarea
        aria-label="Message"
        {...s.inputProps}
        onKeyDown={(e) => {
          onFieldKeyDown?.(e);
          s.onKeyDown(e);
        }}
      />
      {open && (
        <SuggestionList
          {...s.listProps}
          options={sections ? undefined : options}
          sections={sections}
          data-testid="list"
        />
      )}
    </div>
  );
}

const field = () => document.querySelector('textarea')!;
const activeId = () => field().getAttribute('aria-activedescendant');

describe('SuggestionList', () => {
  it('renders a labelled listbox of options with the active row selected', () => {
    render(<Composer />);
    const listbox = document.querySelector('[role="listbox"]')!;
    expect(listbox.id).toBe('sg');
    expect(listbox.getAttribute('aria-label')).toBe('Suggestions');
    const options = [...document.querySelectorAll('[role="option"]')];
    expect(options.map((o) => o.getAttribute('aria-selected'))).toEqual([
      'true',
      'false',
      'false',
    ]);
    expect(options[1].hasAttribute('disabled')).toBe(true);
    expect(options[2].textContent).toContain('Not in channel');
    expect(options[0].textContent).toContain('Alice Smith');
  });

  it('lets the host translate the listbox name', () => {
    render(<SuggestionList options={OPTIONS} listboxLabel="Vorschläge" />);
    expect(
      document.querySelector('[role="listbox"]')!.getAttribute('aria-label'),
    ).toBe('Vorschläge');
  });

  it('renders section headings as labelled groups', () => {
    render(<Composer sections={SECTIONS} />);
    const groups = [...document.querySelectorAll('[role="group"]')];
    expect(groups).toHaveLength(2);
    const labelled = document.getElementById(
      groups[1].getAttribute('aria-labelledby')!,
    )!;
    expect(labelled.textContent).toBe('Not in channel');
  });

  it('wires combobox ARIA onto the field and tracks the active row', () => {
    render(<Composer />);
    expect(field().getAttribute('role')).toBe('combobox');
    expect(field().getAttribute('aria-expanded')).toBe('true');
    expect(field().getAttribute('aria-controls')).toBe('sg');
    expect(activeId()).toBe('sg-option-alice');
    expect(document.getElementById(activeId()!)!.getAttribute('role')).toBe(
      'option',
    );
  });

  it('reports collapsed state when closed or empty', () => {
    render(<Composer open={false} />);
    expect(field().getAttribute('aria-expanded')).toBe('false');
    expect(field().hasAttribute('aria-controls')).toBe(false);
    expect(field().hasAttribute('aria-activedescendant')).toBe(false);
  });

  it('moves with the arrow keys, skips disabled rows, and wraps', () => {
    render(<Composer />);
    expect(key(field(), 'ArrowDown').defaultPrevented).toBe(true);
    expect(activeId()).toBe('sg-option-carol');
    key(field(), 'ArrowDown');
    expect(activeId()).toBe('sg-option-alice');
    key(field(), 'ArrowUp');
    expect(activeId()).toBe('sg-option-carol');
  });

  it('accepts the active row with Enter and Tab', () => {
    const onSelect = vi.fn();
    render(<Composer onSelect={onSelect} />);
    key(field(), 'ArrowDown');
    expect(key(field(), 'Enter').defaultPrevented).toBe(true);
    expect(onSelect).toHaveBeenLastCalledWith(
      expect.objectContaining({ value: 'carol' }),
    );
    key(field(), 'Tab');
    expect(onSelect).toHaveBeenCalledTimes(2);
  });

  it('leaves Shift+Enter, Shift+Tab and IME composition to the field', () => {
    const onSelect = vi.fn();
    render(<Composer onSelect={onSelect} />);
    expect(key(field(), 'Enter', { shiftKey: true }).defaultPrevented).toBe(
      false,
    );
    expect(key(field(), 'Tab', { shiftKey: true }).defaultPrevented).toBe(
      false,
    );
    expect(key(field(), 'Enter', { isComposing: true }).defaultPrevented).toBe(
      false,
    );
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('honors selectKeys', () => {
    const onSelect = vi.fn();
    render(<Composer onSelect={onSelect} selectKeys={['Tab']} />);
    expect(key(field(), 'Enter').defaultPrevented).toBe(false);
    expect(onSelect).not.toHaveBeenCalled();
    key(field(), 'Tab');
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape and marks it handled', () => {
    const onClose = vi.fn();
    render(<Composer onClose={onClose} />);
    expect(key(field(), 'Escape').defaultPrevented).toBe(true);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('skips Escape an earlier handler already handled', () => {
    const onClose = vi.fn();
    render(
      <Composer onClose={onClose} onFieldKeyDown={(e) => e.preventDefault()} />,
    );
    key(field(), 'Escape');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes on Escape even when no row is enabled', () => {
    const onClose = vi.fn();
    render(<Composer onClose={onClose} options={[]} />);
    key(field(), 'Escape');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('ignores every key while closed or without enabled rows', () => {
    const onClose = vi.fn();
    const onSelect = vi.fn();
    render(<Composer open={false} onClose={onClose} onSelect={onSelect} />);
    for (const k of ['ArrowDown', 'Enter', 'Tab', 'Escape']) {
      expect(key(field(), k).defaultPrevented).toBe(false);
    }
    expect(onClose).not.toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('resets to the first enabled row when the options change', () => {
    function Harness() {
      const [q, setQ] = useState(0);
      const options = q === 0 ? OPTIONS : [OPTIONS[0], OPTIONS[2]].slice(0, 1);
      return (
        <>
          <button onClick={() => setQ(1)}>filter</button>
          <Composer options={options} />
        </>
      );
    }
    render(<Harness />);
    key(field(), 'ArrowDown');
    expect(activeId()).toBe('sg-option-carol');
    click(document.querySelector('button')!);
    expect(activeId()).toBe('sg-option-alice');
    const next = [...document.querySelectorAll('[role="option"]')];
    expect(next[0].getAttribute('aria-selected')).toBe('true');
  });

  it('selects on click, moves the highlight on pointer move, and keeps focus in the field', () => {
    const onSelect = vi.fn();
    render(<Composer onSelect={onSelect} />);
    const carol = document.getElementById('sg-option-carol')!;
    act(() => {
      carol.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
    });
    expect(activeId()).toBe('sg-option-carol');
    const down = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });
    act(() => {
      carol.dispatchEvent(down);
    });
    expect(down.defaultPrevented).toBe(true);
    click(carol);
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'carol' }),
    );
  });

  it('does not select a disabled row on click', () => {
    const onSelect = vi.fn();
    render(<Composer onSelect={onSelect} />);
    click(document.getElementById('sg-option-bob')!);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('scrolls the active row into view when the host supports it', () => {
    const scroll = vi.fn();
    const proto = HTMLElement.prototype as { scrollIntoView?: unknown };
    const original = proto.scrollIntoView;
    proto.scrollIntoView = scroll;
    try {
      render(<Composer />);
      key(field(), 'ArrowDown');
      expect(scroll).toHaveBeenCalledWith({ block: 'nearest' });
    } finally {
      proto.scrollIntoView = original;
    }
  });

  it('forwards a ref to the root', () => {
    const ref = createRef<HTMLDivElement>();
    render(<SuggestionList ref={ref} options={OPTIONS} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(
      ref.current!.contains(document.querySelector('[role="listbox"]')),
    ).toBe(true);
  });

  it('passes menuItemProps through to a row', () => {
    render(
      <SuggestionList
        options={[
          {
            value: 'a',
            label: 'A',
            menuItemProps: { 'data-testid': 'row-a', mentionCount: 2 },
          },
        ]}
      />,
    );
    expect(document.querySelector('[data-testid="row-a"]')).not.toBeNull();
  });
});
