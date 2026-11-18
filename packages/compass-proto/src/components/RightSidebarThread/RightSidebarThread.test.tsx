import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from '@/test-utils/render';
import RightSidebarThread from './RightSidebarThread';

const message = (body: string) => ({
  avatarAlt: 'Ana',
  username: 'Ana',
  timestamp: 'Today at 9:41 AM',
  body,
});

describe('RightSidebarThread', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders replies from the same person in the same minute without a duplicate-key warning', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { container } = render(
      <RightSidebarThread
        messages={[
          message('root'),
          message('one'),
          message('two'),
          message('three'),
        ]}
      />,
    );
    for (const text of ['root', 'one', 'two', 'three'])
      expect(container.textContent).toContain(text);
    const warned = error.mock.calls.some((c) =>
      String(c[0]).includes('same key'),
    );
    expect(warned).toBe(false);
  });
});
