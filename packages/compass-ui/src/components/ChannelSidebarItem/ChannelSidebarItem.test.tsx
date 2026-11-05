import { describe, expect, it } from 'vitest';
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
