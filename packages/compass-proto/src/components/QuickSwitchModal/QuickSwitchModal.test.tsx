import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import QuickSwitchModal, {
  type QuickSwitchItem,
  type QuickSwitchModalProps,
} from './QuickSwitchModal';
import { filterQuickSwitchItems } from './filterQuickSwitchItems';

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const items: QuickSwitchItem[] = [
  { id: 'town', name: 'Town Square', breadcrumb: ['Mattermost'] },
  {
    id: 'design',
    name: 'Design',
    leadingVisual: 'private',
    breadcrumb: ['Product'],
  },
  {
    id: 'aiko',
    name: 'Aiko Tan',
    leadingVisual: 'direct-message',
    keywords: ['@aiko'],
  },
];

let root: Root | undefined;
let host: HTMLElement | undefined;

afterEach(() => {
  act(() => root?.unmount());
  host?.remove();
  document.body.innerHTML = '';
  root = host = undefined;
});

function mount(props: Partial<QuickSwitchModalProps> = {}) {
  const onSelect = vi.fn();
  const onClose = vi.fn();
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
  act(() =>
    root!.render(
      <QuickSwitchModal
        open
        items={items}
        onSelect={onSelect}
        onClose={onClose}
        {...props}
      />,
    ),
  );
  return { onSelect, onClose };
}

const input = () =>
  document.body.querySelector<HTMLInputElement>('input[role="combobox"]')!;
const options = () =>
  Array.from(document.body.querySelectorAll<HTMLElement>('[role="option"]'));

function type(value: string) {
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  )!.set!;
  act(() => {
    setter.call(input(), value);
    input().dispatchEvent(new Event('input', { bubbles: true }));
  });
}

function key(k: string, init: KeyboardEventInit = {}) {
  act(() => {
    input().dispatchEvent(
      new KeyboardEvent('keydown', {
        key: k,
        bubbles: true,
        cancelable: true,
        ...init,
      }),
    );
  });
}

describe('filterQuickSwitchItems', () => {
  it('returns everything for an empty query', () => {
    expect(filterQuickSwitchItems(items, '  ')).toBe(items);
  });
  it('matches name, breadcrumb and keywords, all terms required', () => {
    expect(
      filterQuickSwitchItems(items, 'design prod').map((i) => i.id),
    ).toEqual(['design']);
    expect(filterQuickSwitchItems(items, '@aiko').map((i) => i.id)).toEqual([
      'aiko',
    ]);
    expect(filterQuickSwitchItems(items, 'zzz')).toEqual([]);
  });
});

describe('QuickSwitchModal', () => {
  it('renders a named dialog with a combobox focused and a listbox of options', () => {
    mount();
    const dialog = document.body.querySelector('[role="dialog"]')!;
    expect(dialog.getAttribute('aria-labelledby')).toBeTruthy();
    expect(document.activeElement).toBe(input());
    expect(document.body.querySelector('[role="listbox"]')).not.toBeNull();
    expect(options()).toHaveLength(3);
    expect(input().getAttribute('aria-activedescendant')).toBe(options()[0].id);
    expect(options()[0].getAttribute('aria-selected')).toBe('true');
  });

  it('filters as you type and shows the empty state', () => {
    mount();
    type('des');
    expect(options()).toHaveLength(1);
    type('nope');
    expect(options()).toHaveLength(0);
    expect(document.body.textContent).toContain('No results found');
    expect(input().hasAttribute('aria-activedescendant')).toBe(false);
  });

  it('moves the highlight with arrows (wrapping), Home and End, then selects with Enter', () => {
    const { onSelect } = mount();
    key('ArrowDown');
    expect(options()[1].getAttribute('aria-selected')).toBe('true');
    key('ArrowUp');
    key('ArrowUp');
    expect(options()[2].getAttribute('aria-selected')).toBe('true');
    key('Home');
    expect(options()[0].getAttribute('aria-selected')).toBe('true');
    key('End');
    key('Enter');
    expect(onSelect).toHaveBeenCalledWith(items[2]);
  });

  it('resets the highlight to the first result when the query changes', () => {
    const { onSelect } = mount();
    key('ArrowDown');
    type('s');
    key('Enter');
    expect(onSelect).toHaveBeenCalledWith(
      filterQuickSwitchItems(items, 's')[0],
    );
  });

  it('selects on click and ignores Enter with no results', () => {
    const { onSelect } = mount();
    act(() => options()[1].click());
    expect(onSelect).toHaveBeenCalledWith(items[1]);
    onSelect.mockClear();
    type('nope');
    key('Enter');
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('calls onClose on Escape and on the close button', () => {
    const { onClose } = mount({ closeLabel: 'Dismiss' });
    key('Escape');
    expect(onClose).toHaveBeenCalledTimes(1);
    act(() =>
      document.body
        .querySelector<HTMLElement>('[aria-label="Dismiss"]')!
        .click(),
    );
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('uses label props and a custom filter', () => {
    mount({
      placeholder: 'Buscar…',
      emptyLabel: 'Sin resultados',
      listLabel: 'Resultados',
      filter: (item, q) => item.id === q,
      onQueryChange: undefined,
    });
    expect(input().placeholder).toBe('Buscar…');
    expect(
      document.body
        .querySelector('[role="listbox"]')!
        .getAttribute('aria-label'),
    ).toBe('Resultados');
    type('aiko');
    expect(options().map((o) => o.textContent)).toEqual(['Aiko Tan']);
    type('x');
    expect(document.body.textContent).toContain('Sin resultados');
  });

  it('renders nothing when closed', () => {
    mount({ open: false });
    expect(document.body.querySelector('[role="dialog"]')).toBeNull();
  });
});
