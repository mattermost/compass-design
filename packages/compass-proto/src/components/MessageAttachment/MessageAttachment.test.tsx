import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@/test-utils/render';
import { MessageAttachment } from './index';

describe('MessageAttachment', () => {
  it('renders title, text, footer and names the region after the title', () => {
    const { container } = render(
      <MessageAttachment title="Alert" text="Body text" footer="Splunk" />,
    );
    const section = container.querySelector('section');
    expect(section?.getAttribute('aria-label')).toBe('Alert');
    expect(container.textContent).toContain('Body text');
    expect(container.textContent).toContain('Splunk');
  });

  it('uses a semantic color class, or an inline CSS color for anything else', () => {
    const { container, rerender } = render(
      <MessageAttachment color="danger" title="t" />,
    );
    const card = () => container.querySelector('section') as HTMLElement;
    expect(card().className).toContain('message-attachment__card--danger');
    expect(card().style.getPropertyValue('--message-attachment-color')).toBe(
      '',
    );
    rerender(<MessageAttachment color="#FFA500" title="t" />);
    expect(card().className).not.toContain('--danger');
    expect(card().style.getPropertyValue('--message-attachment-color')).toBe(
      '#FFA500',
    );
  });

  it('keeps fields in their original order, long ones spanning both columns', () => {
    const { container } = render(
      <MessageAttachment
        fields={[
          { title: 'Node', value: 'admin panel', short: true },
          { title: 'Details', value: 'Long description' },
          { title: 'Type', value: 'Brute force', short: true },
        ]}
      />,
    );
    const grid = container.querySelector(
      '[class*="message-attachment__fields"]',
    )!;
    expect(grid.children).toHaveLength(3);
    expect(
      [...grid.children].map((el) => el.firstElementChild?.textContent),
    ).toEqual(['Node', 'Details', 'Type']);
    expect(
      [...grid.children].map((el) => el.className.includes('field--long')),
    ).toEqual([false, true, false]);
  });

  it('renders link actions as external anchors and plain actions as buttons', () => {
    const onClick = vi.fn();
    const { container } = render(
      <MessageAttachment
        actions={[
          { label: 'View alert', href: 'https://example.com/a' },
          { label: 'Acknowledge', onClick },
        ]}
      />,
    );
    const a = container.querySelector('a') as HTMLAnchorElement;
    expect(a.getAttribute('href')).toBe('https://example.com/a');
    expect(a.getAttribute('target')).toBe('_blank');
    expect(a.getAttribute('rel')).toBe('noopener noreferrer');
    const button = container.querySelector('button') as HTMLButtonElement;
    act(() => button.click());
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('shows the pretext outside the card and omits empty parts', () => {
    const { container } = render(<MessageAttachment pretext="Heads up" />);
    expect(container.textContent).toContain('Heads up');
    expect(
      container
        .querySelector('section')
        ?.contains(container.querySelector('p')),
    ).toBe(false);
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('button')).toBeNull();
  });

  it('passes rest attributes to the root', () => {
    const { container } = render(
      <MessageAttachment data-testid="att-1" className="host" title="t" />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute('data-testid')).toBe('att-1');
    expect(root.className).toContain('host');
  });

  it('runs onClick on a link action that also has an href', () => {
    const onClick = vi.fn();
    const { container } = render(
      <MessageAttachment
        actions={[{ label: 'View', href: 'https://example.com/a', onClick }]}
      />,
    );
    const a = container.querySelector('a') as HTMLAnchorElement;
    a.addEventListener('click', (e) => e.preventDefault());
    act(() => a.click());
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  describe('thumbnail column', () => {
    const column = (c: HTMLElement) =>
      c.querySelector(
        '[class*="message-attachment__aside"]',
      ) as HTMLElement | null;

    it('puts thumbSrc in its own column after all the content', () => {
      const { container } = render(
        <MessageAttachment
          title="Hurricane warning"
          text="Landfall in 6 hours."
          fields={[{ title: 'Winds', value: '130 mph', short: true }]}
          actions={[{ label: 'View' }]}
          footer="Weather"
          thumbSrc="radar.jpg"
        />,
      );
      const aside = column(container)!;
      expect(aside.querySelector('img')?.getAttribute('src')).toBe('radar.jpg');
      const inner = aside.parentElement!;
      const content = inner.firstElementChild!;
      // Content first, thumbnail column last, and the thumbnail is not inside the content.
      expect(inner.lastElementChild).toBe(aside);
      expect(content.contains(aside)).toBe(false);
      for (const part of [
        'Hurricane warning',
        'Landfall',
        'Winds',
        'View',
        'Weather',
      ])
        expect(content.textContent).toContain(part);
    });

    it('lets the thumbnail slot replace the image, and shows no column without either', () => {
      const { container, rerender } = render(
        <MessageAttachment
          title="t"
          thumbSrc="radar.jpg"
          thumbnail={<span data-testid="custom">map</span>}
        />,
      );
      expect(column(container)?.querySelector('img')).toBeNull();
      expect(column(container)?.textContent).toBe('map');
      rerender(<MessageAttachment title="t" />);
      expect(column(container)).toBeNull();
    });

    it('uses the image alt text for thumbSrc, and nothing for a decorative one', () => {
      const { container, rerender } = render(
        <MessageAttachment title="t" thumbSrc="a.jpg" imageAlt="Radar" />,
      );
      expect(column(container)?.querySelector('img')?.getAttribute('alt')).toBe(
        'Radar',
      );
      rerender(<MessageAttachment title="t" thumbSrc="a.jpg" />);
      expect(column(container)?.querySelector('img')?.getAttribute('alt')).toBe(
        '',
      );
    });
  });
});
