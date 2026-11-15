import { act, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SearchModal } from '../../index';
import type { SearchModalProps, SearchModalSelection } from './index';

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
}
afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
  document.body.innerHTML = '';
});

const hints = [
  { id: 'from', modifier: 'From:', description: 'a specific user' },
  { id: 'in', modifier: 'In:', description: 'a specific channel' },
];
const recent = [
  { id: 'r1', query: 'Welcome in:town-square' },
  { id: 'r2', query: 'Figma' },
];

const input = () => document.querySelector('input')!;
const options = () => Array.from(document.querySelectorAll('[role="option"]'));

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

function Harness({
  initialQuery = '',
  onSelect = () => {},
  onSubmit = () => {},
  onClose = () => {},
  onRemoveRecent = () => {},
  ...rest
}: Partial<SearchModalProps> & { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  return (
    <SearchModal
      open
      onClose={onClose}
      query={query}
      onQueryChange={setQuery}
      hints={hints}
      recent={recent}
      onSelect={(s: SearchModalSelection) => onSelect(s)}
      onSubmit={onSubmit}
      onRemoveRecent={onRemoveRecent}
      {...rest}
    />
  );
}

describe('SearchModal', () => {
  it('is a dialog whose field is a combobox controlling one named listbox', () => {
    render(<Harness />);
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    const box = document.querySelector('[role="listbox"]')!;
    expect(box.getAttribute('aria-label')).toBe('Search suggestions');
    expect(input().getAttribute('role')).toBe('combobox');
    expect(input().getAttribute('aria-expanded')).toBe('true');
    expect(input().getAttribute('aria-controls')).toBe(box.id);
    expect(input().getAttribute('aria-activedescendant')).toBeNull();
    expect(options()).toHaveLength(4);
    expect(
      Array.from(document.querySelectorAll('[role="group"]')).map(
        (g) => g.textContent,
      ),
    ).toEqual([
      expect.stringContaining('Search options'),
      expect.stringContaining('Recent searches'),
    ]);
  });

  it('names the dialog with the hidden title', () => {
    render(<Harness title="Recherche" />);
    const dialog = document.querySelector('[role="dialog"]')!;
    const name = document.getElementById(
      dialog.getAttribute('aria-labelledby')!,
    )!;
    expect(name.textContent).toBe('Recherche');
  });

  it('hangs from the anchor: transparent scrim, 8px below its top, centered on it', () => {
    const anchor = document.createElement('div');
    anchor.getBoundingClientRect = () =>
      ({ top: 4, left: 400, width: 200, height: 28 }) as DOMRect;
    document.body.appendChild(anchor);
    Object.defineProperty(window, 'innerWidth', {
      value: 1200,
      configurable: true,
    });
    render(<Harness anchor={anchor} />);
    const scrim = document.querySelector('[role="dialog"]')!
      .parentElement as HTMLElement;
    expect(scrim.style.backgroundColor).toBe('transparent');
    // top 4 + 8; left = center 500 - 352
    expect(scrim.style.padding).toBe('12px 0px 0px 148px');
  });

  it('still closes when the transparent scrim is pressed', () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    const scrim = document.querySelector('[role="dialog"]')!
      .parentElement as HTMLElement;
    act(() => scrim.click());
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders nothing while closed', () => {
    render(<Harness open={false} />);
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });

  it('takes translated copy', () => {
    render(
      <Harness
        title="Recherche"
        placeholder="Rechercher"
        searchLabel="Rechercher des messages"
        hintsLabel="Options"
        recentLabel="Récentes"
        listboxLabel="Suggestions de recherche"
        tipLabel="Astuce :"
        removeRecentLabel="Retirer"
      />,
    );
    expect(input().getAttribute('placeholder')).toBe('Rechercher');
    expect(input().getAttribute('aria-label')).toBe('Rechercher des messages');
    expect(document.body.textContent).toContain('Récentes');
    expect(document.body.textContent).toContain('Astuce :');
    expect(
      document.querySelector('[data-search-remove]')!.getAttribute('title'),
    ).toBe('Retirer');
    expect(
      document.querySelector('[role="listbox"]')!.getAttribute('aria-label'),
    ).toBe('Suggestions de recherche');
  });

  it('renders a header leading slot for future search modes', () => {
    render(<Harness headerLeading={<div id="modes">Modes</div>} />);
    expect(document.querySelector('#modes')).not.toBeNull();
  });

  it('shows modifier tips in the footer and reports a picked modifier', () => {
    const onSelect = vi.fn();
    render(<Harness onSelect={onSelect} />);
    const tip = Array.from(document.querySelectorAll('button')).find(
      (b) => b.textContent === 'From:',
    )!;
    act(() => tip.click());
    expect(onSelect).toHaveBeenCalledWith({ kind: 'hint', item: hints[0] });
  });

  it('swaps the tip for "Enter to search" once there is a query', () => {
    render(<Harness initialQuery="design" />);
    expect(document.body.textContent).toContain('Enter to search');
    expect(document.body.textContent).not.toContain('Tip: Try');
  });

  it('reports a click on a row with its kind and item', () => {
    const onSelect = vi.fn();
    render(<Harness onSelect={onSelect} />);
    act(() => (options()[3] as HTMLElement).click());
    expect(onSelect).toHaveBeenCalledWith({ kind: 'recent', item: recent[1] });
  });

  it('removes a recent search from its control without selecting the row', () => {
    const onSelect = vi.fn();
    const onRemoveRecent = vi.fn();
    render(<Harness onSelect={onSelect} onRemoveRecent={onRemoveRecent} />);
    act(() =>
      (document.querySelector('[data-search-remove]') as HTMLElement).click(),
    );
    expect(onRemoveRecent).toHaveBeenCalledWith(recent[0]);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('searches on Enter until the user arrows into the list', () => {
    const onSubmit = vi.fn();
    const onSelect = vi.fn();
    render(
      <Harness initialQuery="design" onSubmit={onSubmit} onSelect={onSelect} />,
    );
    const event = press(input(), 'Enter');
    expect(event.defaultPrevented).toBe(true);
    expect(onSubmit).toHaveBeenCalledWith('design');
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('moves the highlight with arrows and picks it with Enter', () => {
    const onSelect = vi.fn();
    render(<Harness onSelect={onSelect} />);
    press(input(), 'ArrowDown');
    expect(input().getAttribute('aria-activedescendant')).toBe(options()[0].id);
    expect(options()[0].getAttribute('aria-selected')).toBe('true');
    press(input(), 'ArrowDown');
    press(input(), 'Enter');
    expect(onSelect).toHaveBeenCalledWith({ kind: 'hint', item: hints[1] });
  });

  it('highlights the last row on the first ArrowUp', () => {
    render(<Harness />);
    press(input(), 'ArrowUp');
    const all = options();
    expect(input().getAttribute('aria-activedescendant')).toBe(
      all[all.length - 1].id,
    );
  });

  it('calls onClose on Escape and prevents the default', () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    const event = press(input(), 'Escape');
    expect(event.defaultPrevented).toBe(true);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('removes the highlighted recent search with Shift+Delete only', () => {
    const onRemoveRecent = vi.fn();
    render(<Harness onRemoveRecent={onRemoveRecent} />);
    press(input(), 'Delete', { shiftKey: true });
    expect(onRemoveRecent).not.toHaveBeenCalled(); // nothing highlighted yet
    for (let i = 0; i < 3; i++) press(input(), 'ArrowDown');
    press(input(), 'Delete');
    expect(onRemoveRecent).not.toHaveBeenCalled();
    press(input(), 'Delete', { shiftKey: true });
    expect(onRemoveRecent).toHaveBeenCalledWith(recent[0]);
  });

  it('drops the highlight when the text changes', () => {
    render(<Harness />);
    press(input(), 'ArrowDown');
    expect(input().getAttribute('aria-activedescendant')).not.toBeNull();
    const setValue = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    )!.set!;
    act(() => {
      setValue.call(input(), 'a');
      input().dispatchEvent(new Event('input', { bubbles: true }));
    });
    expect(input().getAttribute('aria-activedescendant')).toBeNull();
  });

  it('shows suggestions with their own heading', () => {
    render(
      <Harness
        hints={undefined}
        recent={undefined}
        suggestions={[{ id: 'amy', label: 'amy.blais' }]}
      />,
    );
    expect(document.body.textContent).toContain('Suggestions');
    expect(options()).toHaveLength(1);
  });
});
