import { describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { render } from '@/test-utils/render';
import ChannelSidebarItem from './ChannelSidebarItem';

const query = (container: HTMLElement, part: string) =>
  container.querySelector(`[class*="${part}"]`);

describe('ChannelSidebarItem visual slots', () => {
  it('renders the built-in icon by default and for type strings', () => {
    const { container } = render(<ChannelSidebarItem name="Town Square" />);
    expect(
      query(container, 'icon-container')?.querySelector('svg'),
    ).toBeTruthy();
    expect(query(container, 'icon-container--custom')).toBeNull();
  });

  it('renders a custom leadingVisual node in the icon container', () => {
    const { container } = render(
      <ChannelSidebarItem
        name="Agent"
        leadingVisual={<span data-testid="custom-lead" />}
      />,
    );
    const slot = query(container, 'icon-container');
    expect(slot?.querySelector('[data-testid="custom-lead"]')).toBeTruthy();
    expect(slot?.className).toContain('icon-container--custom');
    // Built-in globe is replaced, and the row still gets the overflow menu.
    expect(slot?.querySelector('svg')).toBeNull();
    expect(
      container.querySelector('button[aria-label="Channel options"]'),
    ).toBeTruthy();
  });

  it('keeps status styling with a custom visual', () => {
    const { container } = render(
      <ChannelSidebarItem
        name="Agent"
        status="mention"
        mentionCount={2}
        leadingVisual={<span />}
      />,
    );
    expect(container.firstElementChild?.className).toContain('status-mention');
    expect(container.textContent).toContain('2 mentions');
  });

  it('renders trailingVisual only when provided', () => {
    const none = render(<ChannelSidebarItem name="A" />);
    expect(query(none.container, 'trailing-visual')).toBeNull();
    const some = render(
      <ChannelSidebarItem
        name="B"
        trailingVisual={<span data-testid="custom-trail" />}
      />,
    );
    expect(
      query(some.container, 'trailing-visual')?.querySelector(
        '[data-testid="custom-trail"]',
      ),
    ).toBeTruthy();
  });

  it('falls back to the default glyph for an omitted or null leadingVisual', () => {
    const { container } = render(
      <ChannelSidebarItem name="X" leadingVisual={null} />,
    );
    expect(
      query(container, 'icon-container')?.querySelector('svg'),
    ).toBeTruthy();
  });
});

const click = (el: Element | null) => {
  expect(el).toBeTruthy();
  act(() => (el as HTMLElement).click());
};

describe('ChannelSidebarItem actions and disclosure', () => {
  const byLabel = (c: HTMLElement, label: string) =>
    c.querySelector(`button[aria-label="${label}"]`);

  it('replaces the built-in menu with actions, which stay clickable', () => {
    const onAction = vi.fn();
    const { container } = render(
      <ChannelSidebarItem
        name="Agent"
        leadingVisual="direct-message"
        actions={
          <button aria-label="New chat" onClick={onAction}>
            +
          </button>
        }
      />,
    );
    expect(byLabel(container, 'Channel options')).toBeNull();
    click(byLabel(container, 'New chat'));
    expect(onAction).toHaveBeenCalledTimes(1);
    const slot = query(container, 'channel-sidebar-item__actions');
    expect(slot).toBeTruthy();
    expect(slot?.className).not.toContain('actions--always');
  });

  it('marks always-visible and open actions', () => {
    const { container } = render(
      <ChannelSidebarItem
        name="Agent"
        actions={<button>Go</button>}
        actionsReveal="always"
        actionsOpen
      />,
    );
    const slot = query(container, 'channel-sidebar-item__actions');
    expect(slot?.className).toContain('actions--always');
    expect(slot?.className).toContain('actions--open');
    expect(container.firstElementChild?.className).toContain(
      'channel-sidebar-item--actions-always',
    );
  });

  it('hides the built-in menu with hideMenu', () => {
    const { container } = render(<ChannelSidebarItem name="Agent" hideMenu />);
    expect(byLabel(container, 'Channel options')).toBeNull();
  });

  it('keeps the badge on hover only where nothing replaces it', () => {
    const hasClass = (c: HTMLElement) =>
      c.firstElementChild?.className.includes('no-hover-menu');
    const channel = render(<ChannelSidebarItem name="A" />);
    expect(hasClass(channel.container)).toBe(false);
    const noMenu = render(<ChannelSidebarItem name="B" hideMenu />);
    expect(hasClass(noMenu.container)).toBe(true);
    const always = render(
      <ChannelSidebarItem
        name="C"
        actions={<button>Go</button>}
        actionsReveal="always"
      />,
    );
    expect(hasClass(always.container)).toBe(true);
  });

  it('renders no toggle unless expanded is set', () => {
    const { container } = render(<ChannelSidebarItem name="Agent" />);
    expect(byLabel(container, 'Toggle')).toBeNull();
  });

  it('exposes the toggle state and reports the next state', () => {
    const onExpandedChange = vi.fn();
    const props = {
      name: 'Agent',
      onExpandedChange,
      controlsId: 'chats',
      toggleLabel: 'Research chats',
    };
    const { container, rerender } = render(
      <ChannelSidebarItem {...props} expanded={false} />,
    );
    const collapsed = byLabel(container, 'Research chats');
    expect(collapsed?.getAttribute('aria-expanded')).toBe('false');
    expect(collapsed?.getAttribute('aria-controls')).toBe('chats');
    click(collapsed);
    expect(onExpandedChange).toHaveBeenCalledWith(true);

    rerender(<ChannelSidebarItem {...props} expanded />);
    const open = byLabel(container, 'Research chats');
    // Same name in both states; only aria-expanded changes.
    expect(open).toBe(collapsed);
    expect(open?.getAttribute('aria-expanded')).toBe('true');
    click(open);
    expect(onExpandedChange).toHaveBeenLastCalledWith(false);
  });

  it('does not activate the row when the toggle is clicked', () => {
    const onClick = vi.fn();
    const { container } = render(
      <ChannelSidebarItem name="Agent" expanded onClick={onClick} />,
    );
    click(byLabel(container, 'Toggle'));
    expect(onClick).not.toHaveBeenCalled();
  });
});
