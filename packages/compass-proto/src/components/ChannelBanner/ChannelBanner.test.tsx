import { describe, expect, it } from 'vitest';
import { render } from '@/test-utils/render';
import ChannelBanner from './ChannelBanner';

const textOf = (c: HTMLElement) =>
  c.querySelector('[class*="channel-banner__text"]') as HTMLElement | null;

describe('ChannelBanner', () => {
  it('renders nothing without text', () => {
    for (const empty of [undefined, null, ''])
      expect(
        render(<ChannelBanner>{empty}</ChannelBanner>).container.innerHTML,
      ).toBe('');
  });

  it('shows the text with the default accessible name, or a translated one', () => {
    const { container, rerender } = render(
      <ChannelBanner>Triage within 15 mins</ChannelBanner>,
    );
    expect(textOf(container)?.textContent).toBe('Triage within 15 mins');
    expect(textOf(container)?.getAttribute('aria-label')).toBe(
      'Channel banner text',
    );
    rerender(<ChannelBanner textAriaLabel="Kanalbanner">Hallo</ChannelBanner>);
    expect(textOf(container)?.getAttribute('aria-label')).toBe('Kanalbanner');
  });

  it('sets the background and picks a contrasting text color', () => {
    const { container, rerender } = render(
      <ChannelBanner backgroundColor="#FFF0BA">Notice</ChannelBanner>,
    );
    const root = () => container.firstElementChild as HTMLElement;
    expect(root().style.backgroundColor.toLowerCase()).toBe('#fff0ba');
    expect(textOf(container)?.style.color.toLowerCase()).toBe('#000000');
    expect(
      textOf(container)?.style.getPropertyValue('--channel-banner-text-color'),
    ).toBe('#000000');
    rerender(<ChannelBanner backgroundColor="#1C58D9">Notice</ChannelBanner>);
    expect(textOf(container)?.style.color.toLowerCase()).toBe('#ffffff');
  });

  it('lets textColor win, and leaves the color alone without a usable background', () => {
    const { container, rerender } = render(
      <ChannelBanner backgroundColor="#FFF0BA" textColor="#123456">
        Notice
      </ChannelBanner>,
    );
    expect(textOf(container)?.style.color.toLowerCase()).toBe('#123456');
    rerender(<ChannelBanner>Notice</ChannelBanner>);
    expect(textOf(container)?.style.color).toBe('');
  });

  it('passes rest attributes and className to the root, and keeps inline content', () => {
    const { container } = render(
      <ChannelBanner data-testid="banner" className="host">
        See <a href="https://example.com">the policy</a>
      </ChannelBanner>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute('data-testid')).toBe('banner');
    expect(root.className).toContain('host');
    expect(container.querySelector('a')?.textContent).toBe('the policy');
  });

  it('has no tooltip wrapper while the text fits', () => {
    // happy-dom does no layout, so the text never measures as cut off.
    const { container } = render(
      <ChannelBanner tooltip="Full text">Short</ChannelBanner>,
    );
    expect(container.firstElementChild?.getAttribute('aria-label')).toBeNull();
  });
});
