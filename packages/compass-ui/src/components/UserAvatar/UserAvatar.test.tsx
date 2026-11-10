import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@/test-utils/render';
import UserAvatar from './UserAvatar';

function fireError(img: Element) {
  act(() => {
    img.dispatchEvent(new Event('error'));
  });
}

describe('UserAvatar image failure', () => {
  it('shows initials and marks the root when the image fails to load', () => {
    const onError = vi.fn();
    const { container } = render(
      <UserAvatar alt="Sofia Bauer" src="/missing.png" onError={onError} />,
    );
    const root = container.firstElementChild!;
    expect(root.hasAttribute('data-image-failed')).toBe(false);

    fireError(container.querySelector('img')!);

    expect(onError).toHaveBeenCalledTimes(1);
    expect(container.querySelector('img')).toBeNull();
    expect(root.getAttribute('data-image-failed')).toBe('true');
    expect(root.textContent).toBe('So');
  });

  it('tries a new src after one failed', () => {
    const { container, rerender } = render(
      <UserAvatar alt="Sofia Bauer" src="/missing.png" />,
    );
    fireError(container.querySelector('img')!);
    rerender(<UserAvatar alt="Sofia Bauer" src="/other.png" />);
    expect(container.querySelector('img')).not.toBeNull();
    expect(container.firstElementChild!.hasAttribute('data-image-failed')).toBe(
      false,
    );
  });
});

describe('UserAvatar ref', () => {
  it('points at the root element for an image and for the fallback', () => {
    const ref = { current: null as HTMLDivElement | null };
    const { container, rerender } = render(
      <UserAvatar alt="Sofia Bauer" src="/a.png" ref={ref} />,
    );
    expect(ref.current).toBe(container.firstElementChild);
    rerender(<UserAvatar alt="Sofia Bauer" ref={ref} />);
    expect(ref.current).toBe(container.firstElementChild);
  });
});
