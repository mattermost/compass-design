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

  it('puts short fields in one row and long fields on their own rows', () => {
    const { container } = render(
      <MessageAttachment
        fields={[
          { title: 'Node', value: 'admin panel', short: true },
          { title: 'Type', value: 'Brute force', short: true },
          { title: 'Details', value: 'Long description' },
        ]}
      />,
    );
    const rows = container.querySelectorAll(
      '[class*="message-attachment__fields"]',
    );
    expect(rows).toHaveLength(2);
    expect(rows[0]!.children).toHaveLength(2);
    expect(rows[1]!.children).toHaveLength(1);
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
});
