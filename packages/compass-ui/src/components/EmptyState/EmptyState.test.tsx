import { describe, expect, it } from 'vitest';
import { render } from '@/test-utils/render';
import EmptyState from './EmptyState';

const actionArea = (container: HTMLElement) =>
  container.querySelector('[class*="empty-state__action"]');

describe('EmptyState action area', () => {
  it('renders no action area without action or actionSlot', () => {
    const { container } = render(<EmptyState title="Nothing here" />);
    expect(actionArea(container)).toBeNull();
  });

  it('renders the button from `action`', () => {
    const { container } = render(
      <EmptyState title="Nothing here" action={{ children: 'Do it' }} />,
    );
    expect(actionArea(container)?.querySelector('button')?.textContent).toBe(
      'Do it',
    );
  });

  it('renders `actionSlot` in the action area', () => {
    const { container } = render(
      <EmptyState
        title="Nothing here"
        actionSlot={<button type="button">Menu trigger</button>}
      />,
    );
    expect(actionArea(container)?.querySelector('button')?.textContent).toBe(
      'Menu trigger',
    );
  });

  it('renders `action` before `actionSlot` when both are set', () => {
    const { container } = render(
      <EmptyState
        title="Nothing here"
        action={{ children: 'First' }}
        actionSlot={<button type="button">Second</button>}
      />,
    );
    const labels = Array.from(
      actionArea(container)?.querySelectorAll('button') ?? [],
    ).map((b) => b.textContent);
    expect(labels).toEqual(['First', 'Second']);
  });
});

describe('EmptyState title and description elements', () => {
  it('renders the title as an h2 and the description as a p by default', () => {
    const { container } = render(
      <EmptyState title="Nothing here" description="Try again later." />,
    );
    expect(container.querySelector('h2')?.textContent).toBe('Nothing here');
    expect(container.querySelector('p')?.textContent).toBe('Try again later.');
  });

  it('renders the title at the requested heading level', () => {
    const { container } = render(
      <EmptyState title="Nothing here" titleLevel={3} />,
    );
    expect(container.querySelector('h3')?.textContent).toBe('Nothing here');
    expect(container.querySelector('h2')).toBeNull();
  });

  it('wraps the description in a div when asked, so it can hold block content', () => {
    const { container } = render(
      <EmptyState
        title="Nothing here"
        description={<p>First paragraph</p>}
        descriptionAs="div"
      />,
    );
    const wrapper = container.querySelector(
      '[class*="empty-state__description"]',
    );
    expect(wrapper?.tagName).toBe('DIV');
    expect(wrapper?.querySelector('p')?.textContent).toBe('First paragraph');
  });
});
