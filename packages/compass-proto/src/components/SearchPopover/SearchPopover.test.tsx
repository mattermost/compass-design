import { act, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { GlobalHeader, SearchPopover, useSearchPopover } from '../../index';
import type { SearchPopoverSelection } from './index';

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root | undefined;
let container: HTMLElement | undefined;
function render(ui: React.ReactElement) {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root!.render(ui));
  return container;
}
afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
});

const hints = [
  { id: 'from', modifier: 'From:', description: 'a specific user' },
  { id: 'in', modifier: 'In:', description: 'a specific channel' },
];
const recent = [
  { id: 'r1', query: 'Welcome in:town-square' },
  { id: 'r2', query: 'Figma' },
];

describe('SearchPopover', () => {
  it('renders headed groups in one named listbox of options', () => {
    const c = render(
      <SearchPopover
        hints={hints}
        recent={recent}
        suggestions={[{ id: 'amy', label: 'amy.blais' }]}
      />,
    );
    const box = c.querySelector('[role="listbox"]')!;
    expect(box.getAttribute('aria-label')).toBe('Search suggestions');
    expect(
      Array.from(c.querySelectorAll('[role="group"]')).map(
        (g) => g.textContent,
      ),
    ).toEqual([
      expect.stringContaining('Suggestions'),
      expect.stringContaining('Search options'),
      expect.stringContaining('Recent searches'),
    ]);
    expect(c.querySelectorAll('[role="option"]')).toHaveLength(5);
  });

  it('takes translated headings and labels', () => {
    const c = render(
      <SearchPopover
        hints={hints}
        recent={recent}
        hintsLabel="Options"
        recentLabel="Récentes"
        listboxLabel="Recherche"
        removeRecentLabel="Retirer"
      />,
    );
    expect(c.textContent).toContain('Options');
    expect(c.textContent).toContain('Récentes');
    expect(
      c.querySelector('[role="listbox"]')!.getAttribute('aria-label'),
    ).toBe('Recherche');
    expect(c.querySelector('[data-search-remove]')!.getAttribute('title')).toBe(
      'Retirer',
    );
  });

  it('renders nothing when there is nothing to show', () => {
    const c = render(<SearchPopover hints={[]} />);
    expect(c.querySelector('[role="listbox"]')).toBeNull();
  });

  it('reports a click on a row with its kind and item', () => {
    const onSelect = vi.fn();
    const c = render(
      <SearchPopover hints={hints} recent={recent} onSelect={onSelect} />,
    );
    act(() =>
      (c.querySelectorAll('[role="option"]')[0] as HTMLElement).click(),
    );
    expect(onSelect).toHaveBeenCalledWith({ kind: 'hint', item: hints[0] });
    act(() =>
      (c.querySelectorAll('[role="option"]')[3] as HTMLElement).click(),
    );
    expect(onSelect).toHaveBeenLastCalledWith({
      kind: 'recent',
      item: recent[1],
    });
  });

  it('removes a recent search from its control without selecting the row', () => {
    const onSelect = vi.fn();
    const onRemoveRecent = vi.fn();
    const c = render(
      <SearchPopover
        recent={recent}
        onSelect={onSelect}
        onRemoveRecent={onRemoveRecent}
      />,
    );
    act(() => (c.querySelector('[data-search-remove]') as HTMLElement).click());
    expect(onRemoveRecent).toHaveBeenCalledWith(recent[0]);
    expect(onSelect).not.toHaveBeenCalled();
  });
});

function Harness({
  onSelect = () => {},
  onSubmit = () => {},
  onRemoveRecent = () => {},
}: {
  onSelect?: (s: SearchPopoverSelection) => void;
  onSubmit?: (q: string) => void;
  onRemoveRecent?: (r: { id: string; query: string }) => void;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(true);
  const search = useSearchPopover({
    query,
    open,
    hints,
    recent,
    onSelect,
    onSubmit,
    onRemoveRecent,
    onClose: () => setOpen(false),
  });
  return (
    <GlobalHeader
      searchValue={query}
      onSearchChange={setQuery}
      searchInputProps={{ ...search.inputProps, onKeyDown: search.onKeyDown }}
      searchPopoverOpen={open}
      searchPopover={<SearchPopover {...search.popoverProps} />}
    />
  );
}

function press(el: Element, key: string, init: KeyboardEventInit = {}) {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...init,
  });
  act(() => {
    el.dispatchEvent(event);
  });
  return event;
}

describe('useSearchPopover with GlobalHeader', () => {
  it('exposes the field as a combobox that controls the listbox', () => {
    const c = render(<Harness />);
    const input = c.querySelector('input')!;
    const listbox = c.querySelector('[role="listbox"]')!;
    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(input.getAttribute('aria-controls')).toBe(listbox.id);
    expect(input.getAttribute('aria-activedescendant')).toBeNull();
    expect(c.querySelector('[aria-selected="true"]')).toBeNull();
  });

  it('searches on Enter until the user arrows into the list', () => {
    const onSubmit = vi.fn();
    const onSelect = vi.fn();
    const c = render(<Harness onSubmit={onSubmit} onSelect={onSelect} />);
    const input = c.querySelector('input')!;
    const event = press(input, 'Enter');
    expect(event.defaultPrevented).toBe(true);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('moves the highlight with arrows and picks it with Enter', () => {
    const onSelect = vi.fn();
    const c = render(<Harness onSelect={onSelect} />);
    const input = c.querySelector('input')!;
    press(input, 'ArrowDown');
    const first = c.querySelectorAll('[role="option"]')[0];
    expect(input.getAttribute('aria-activedescendant')).toBe(first.id);
    expect(first.getAttribute('aria-selected')).toBe('true');
    press(input, 'ArrowDown');
    press(input, 'Enter');
    expect(onSelect).toHaveBeenCalledWith({ kind: 'hint', item: hints[1] });
  });

  it('highlights the last row on the first ArrowUp', () => {
    const c = render(<Harness />);
    const input = c.querySelector('input')!;
    press(input, 'ArrowUp');
    const options = c.querySelectorAll('[role="option"]');
    expect(input.getAttribute('aria-activedescendant')).toBe(
      options[options.length - 1].id,
    );
  });

  it('closes on Escape and prevents the default', () => {
    const c = render(<Harness />);
    const event = press(c.querySelector('input')!, 'Escape');
    expect(event.defaultPrevented).toBe(true);
    expect(c.querySelector('[role="listbox"]')).toBeNull();
    expect(c.querySelector('input')!.getAttribute('aria-expanded')).toBe(
      'false',
    );
  });

  it('removes the highlighted recent search with Shift+Delete only', () => {
    const onRemoveRecent = vi.fn();
    const c = render(<Harness onRemoveRecent={onRemoveRecent} />);
    const input = c.querySelector('input')!;
    press(input, 'Delete', { shiftKey: true });
    expect(onRemoveRecent).not.toHaveBeenCalled(); // nothing highlighted yet
    // Down past the two hints to the first recent row.
    for (let i = 0; i < 3; i++) press(input, 'ArrowDown');
    press(input, 'Delete');
    expect(onRemoveRecent).not.toHaveBeenCalled();
    press(input, 'Delete', { shiftKey: true });
    expect(onRemoveRecent).toHaveBeenCalledWith(recent[0]);
  });

  it('drops the highlight when the text changes', () => {
    const c = render(<Harness />);
    const input = c.querySelector('input')!;
    press(input, 'ArrowDown');
    expect(input.getAttribute('aria-activedescendant')).not.toBeNull();
    const setValue = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    )!.set!;
    act(() => {
      setValue.call(input, 'a');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    expect(input.getAttribute('aria-activedescendant')).toBeNull();
  });

  it('keeps the header’s own Search handlers working', () => {
    const onSearchClick = vi.fn();
    const c = render(<GlobalHeader onSearchClick={onSearchClick} />);
    act(() => c.querySelector('input')!.click());
    expect(onSearchClick).toHaveBeenCalledTimes(1);
  });

  it('shows the popover only while open', () => {
    const c = render(
      <GlobalHeader searchPopover={<div id="p" />} searchPopoverOpen={false} />,
    );
    expect(c.querySelector('#p')).toBeNull();
  });
});
