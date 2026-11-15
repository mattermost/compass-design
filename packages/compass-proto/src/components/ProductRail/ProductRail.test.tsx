import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ProductRail, ProductRailItem } from './index';

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

const items = [
  { id: 'channels', label: 'Channels', icon: <svg />, unreadBadge: true },
  { id: 'boards', label: 'Boards', icon: <svg />, mentionBadge: 3 },
  { id: 'playbooks', label: 'Playbooks', icon: <svg /> },
];

describe('ProductRail', () => {
  it('renders a labeled nav with one button per item', () => {
    const c = render(<ProductRail items={items} />);
    const nav = c.querySelector('nav');
    expect(nav?.getAttribute('aria-label')).toBe('Products');
    expect(c.querySelectorAll('button')).toHaveLength(3);
  });

  it('marks the active item with aria-current and folds badges into names', () => {
    const c = render(<ProductRail items={items} activeId="boards" />);
    const [channels, boards, playbooks] = Array.from(
      c.querySelectorAll('button'),
    );
    expect(boards.getAttribute('aria-current')).toBe('page');
    expect(channels.getAttribute('aria-current')).toBeNull();
    expect(channels.getAttribute('aria-label')).toBe('Channels, unread');
    expect(boards.getAttribute('aria-label')).toBe('Boards, 3 mentions');
    expect(playbooks.getAttribute('aria-label')).toBe('Playbooks');
  });

  it('calls onSelect with the item id', () => {
    const onSelect = vi.fn();
    const c = render(<ProductRail items={items} onSelect={onSelect} />);
    act(() => c.querySelectorAll('button')[2].click());
    expect(onSelect).toHaveBeenCalledWith('playbooks');
  });

  it('honors navLabel and renders header/footer slots', () => {
    const c = render(
      <ProductRail
        items={items}
        navLabel="Produits"
        header={<span data-testid="h" />}
        footer={<span data-testid="f" />}
      />,
    );
    expect(c.querySelector('nav')?.getAttribute('aria-label')).toBe('Produits');
    expect(c.querySelector('[data-testid="h"]')).not.toBeNull();
    expect(c.querySelector('[data-testid="f"]')).not.toBeNull();
  });
});

describe('ProductRail label hooks', () => {
  it('forwards mentionsLabel and unreadLabel to every item', () => {
    const c = render(
      <ProductRail
        items={items}
        mentionsLabel={(n) => `${n} mentions (fr)`}
        unreadLabel="non lu"
      />,
    );
    const [channels, boards] = Array.from(c.querySelectorAll('button'));
    expect(channels.getAttribute('aria-label')).toBe('Channels, non lu');
    expect(boards.getAttribute('aria-label')).toBe('Boards, 3 mentions (fr)');
  });
});

describe('ProductRailItem', () => {
  it('keeps unread status for a rich label that supplies the name', () => {
    const c = render(
      <ProductRailItem
        icon={<svg />}
        label={<span>Boards</span>}
        unreadBadge
      />,
    );
    const b = c.querySelector('button')!;
    expect(b.getAttribute('aria-label')).toBeNull();
    expect(b.textContent).toContain('Boards');
    expect(b.textContent).toContain(', unread');
  });

  it('passes through attributes and supports translatable badge labels', () => {
    const c = render(
      <ProductRailItem
        icon={<svg />}
        label="Boards"
        mentionBadge={2}
        mentionsLabel={(n) => `${n} mentions (fr)`}
        data-testid="x"
      />,
    );
    const b = c.querySelector('button')!;
    expect(b.getAttribute('data-testid')).toBe('x');
    expect(b.getAttribute('aria-label')).toBe('Boards, 2 mentions (fr)');
    expect(b.type).toBe('button');
  });

  it('hides the unread dot when mentions are shown', () => {
    const c = render(
      <ProductRailItem icon={<svg />} label="A" mentionBadge={1} unreadBadge />,
    );
    expect(c.querySelector('button')!.getAttribute('aria-label')).toBe(
      'A, 1 mention',
    );
  });
});
