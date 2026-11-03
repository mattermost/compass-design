import { describe, expect, it } from 'vitest';
import { render } from '@/test-utils/render';
import EmptyState from './EmptyState';

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
