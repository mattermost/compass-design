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
  {
    id: 'ask',
    name: 'Ask Anything',
    secondaryLabel: '~announcements',
    group: 'Unread',
  },
  { id: 'bugs', name: 'Bugs', secondaryLabel: '~bugs', group: 'Unread' },
  {
    id: 'dev',
    name: 'Developers: Webapp',
    secondaryLabel: '~developers-web-app',
    group: 'Recent',
    keywords: ['frontend'],
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
  it('matches name, secondary label and keywords, all terms required', () => {
    expect(filterQuickSwitchItems(items, 'dev ~dev').map((i) => i.id)).toEqual([
      'dev',
    ]);
    expect(filterQuickSwitchItems(items, 'frontend').map((i) => i.id)).toEqual([
      'dev',
    ]);
    expect(filterQuickSwitchItems(items, 'bugs announcements')).toEqual([]);
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
    type('bug');
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

  it('shows a heading where the group changes', () => {
    mount();
    expect(document.body.textContent).toContain('Unread');
    expect(document.body.textContent).toContain('Recent');
    expect(document.body.querySelectorAll('[role="separator"]')).toHaveLength(
      1,
    );
    type('bug');
    expect(document.body.textContent).not.toContain('Recent');
    expect(document.body.querySelectorAll('[role="separator"]')).toHaveLength(
      0,
    );
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
    type('bugs');
    expect(options().map((o) => o.textContent)).toEqual(['Bugs~bugs']);
    type('x');
    expect(document.body.textContent).toContain('Sin resultados');
  });

  it('shows the keyboard-help subtitle by default and lets it be replaced or hidden', () => {
    mount();
    expect(document.body.textContent).toContain(
      'Type to find a channel. Use UP/DOWN to browse, ENTER to select, ESC to dismiss.',
    );
  });

  it('hides the subtitle when null', () => {
    mount({ subtitle: null });
    expect(document.body.textContent).not.toContain('Type to find');
  });

  it('flattens groups and ranks results by closeness while searching', () => {
    mount({
      items: [
        { id: 'a', name: 'Webapp bugs', group: 'Recent' },
        { id: 'b', name: 'Bugs', group: 'Unread' },
        { id: 'c', name: 'Prebugs', group: 'Recent' },
        {
          id: 'd',
          name: 'QA',
          secondaryLabel: '~bugs-triage',
          group: 'Unread',
        },
      ],
    });
    expect(document.body.querySelectorAll('[role="group"]')).toHaveLength(4);
    type('bugs');
    expect(options().map((o) => o.id)).toHaveLength(4);
    expect(options().map((o) => o.textContent)).toEqual([
      'Bugs',
      'Webapp bugs',
      'Prebugs',
      'QA~bugs-triage',
    ]);
    expect(document.body.querySelectorAll('[role="group"]')).toHaveLength(0);
    expect(document.body.querySelectorAll('[role="separator"]')).toHaveLength(
      0,
    );
    type('');
    expect(document.body.querySelectorAll('[role="group"]')).toHaveLength(4);
  });

  it('keeps groups while the query is only a handle sigil', () => {
    mount();
    type('~');
    expect(document.body.querySelectorAll('[role="group"]')).toHaveLength(2);
    expect(options()).toHaveLength(3);
  });

  it('closes on Escape from the search field even with a query typed', () => {
    const { onClose } = mount();
    type('bug');
    key('Escape');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('names each group for assistive tech', () => {
    mount();
    const groups = Array.from(
      document.body.querySelectorAll<HTMLElement>('[role="group"]'),
    );
    expect(groups).toHaveLength(2);
    expect(
      document.getElementById(groups[0].getAttribute('aria-labelledby')!)
        ?.textContent,
    ).toBe('Unread');
  });

  it('forwards clearLabel to the clear button', () => {
    mount({ clearLabel: 'Borrar' });
    type('bug');
    expect(document.body.querySelector('[aria-label="Borrar"]')).not.toBeNull();
  });

  it('scrolls the highlighted option into view when results change', () => {
    mount();
    const spy = vi.fn();
    HTMLElement.prototype.scrollIntoView = spy;
    type('e');
    expect(spy).toHaveBeenCalled();
  });

  it('renders nothing when closed', () => {
    mount({ open: false });
    expect(document.body.querySelector('[role="dialog"]')).toBeNull();
  });
});
