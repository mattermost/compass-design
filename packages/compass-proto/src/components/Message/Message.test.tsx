import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@/test-utils/render';
import Message from './Message';

const base = {
  avatarAlt: 'Sofia Bauer',
  username: 'sofia.bauer',
  timestamp: '10:24 AM',
  showMessageActions: false,
};

describe('Message', () => {
  it('passes rest attributes, handlers and className to the root', () => {
    const onClick = vi.fn();
    const { container } = render(
      <Message
        {...base}
        data-testid="post-1"
        data-walkthrough="first-post"
        id="post_1"
        aria-label="Message from sofia.bauer"
        className="host-class"
        onClick={onClick}
      >
        Hello
      </Message>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.dataset.testid).toBe('post-1');
    expect(root.dataset.walkthrough).toBe('first-post');
    expect(root.id).toBe('post_1');
    expect(root.getAttribute('aria-label')).toBe('Message from sofia.bauer');
    expect(root.className).toContain('host-class');
    expect(root.className).toContain('message');
    root.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <Message {...base} ref={ref}>
        Hello
      </Message>,
    );
    expect(ref.current).toBe(container.firstElementChild);
  });

  it('renders a custom avatar and a node username', () => {
    const onProfile = vi.fn();
    const { container } = render(
      <Message
        {...base}
        avatar={<button type="button" data-testid="avatar" />}
        username={
          <button type="button" data-testid="username" onClick={onProfile}>
            sofia.bauer
          </button>
        }
      >
        Hello
      </Message>,
    );
    expect(container.querySelector('[data-testid="avatar"]')).not.toBeNull();
    expect(container.querySelector('img')).toBeNull();
    (
      container.querySelector('[data-testid="username"]') as HTMLElement
    ).click();
    expect(onProfile).toHaveBeenCalledTimes(1);
  });

  it('renders the default avatar when no avatar slot is given', () => {
    const { container } = render(<Message {...base}>Hello</Message>);
    expect(
      container.querySelector('[role="img"]')?.getAttribute('aria-label'),
    ).toBe('Sofia Bauer');
  });

  it('falls back to the default avatar when avatar is falsy', () => {
    const { container } = render(
      <Message {...base} avatar={false}>
        Hello
      </Message>,
    );
    const col = container.querySelector('[class*="avatar-col"]')!;
    expect(col.children.length).toBeGreaterThan(0);
  });

  it('shows the priority label in the header row, after the timestamp', () => {
    const { container } = render(
      <Message {...base} priority="urgent">
        Body text
      </Message>,
    );
    const header = container.querySelector('[class*="message-header"]')!;
    const text = header.textContent ?? '';
    expect(text).toContain('Urgent');
    expect(text.indexOf('Urgent')).toBeGreaterThan(
      text.indexOf(base.timestamp),
    );
    expect(container.textContent?.match(/Urgent/g)).toHaveLength(1);
  });

  it('uses translated priority labels, and shows none without a priority', () => {
    const { container, rerender } = render(
      <Message
        {...base}
        priority="important"
        priorityLabels={{ important: 'Wichtig' }}
      >
        Body
      </Message>,
    );
    expect(container.textContent).toContain('Wichtig');
    expect(container.textContent).not.toContain('Important');
    rerender(<Message {...base}>Body</Message>);
    expect(container.textContent).not.toContain('Wichtig');
  });
});
