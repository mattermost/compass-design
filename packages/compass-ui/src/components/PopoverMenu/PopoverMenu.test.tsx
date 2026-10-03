import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POPOVER_TRANSITION_MS } from '@/hooks/usePopoverTransition';
import { render } from '@/test-utils/render';
import PopoverMenu from './PopoverMenu';

const q = (id: string) => document.querySelector(`[data-testid="${id}"]`);

describe('PopoverMenu open', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('renders without transition when open is omitted', () => {
    render(<PopoverMenu data-testid="m">x</PopoverMenu>);
    expect(q('m')?.className).not.toMatch(/transition/);
  });

  it('renders nothing when closed', () => {
    render(
      <PopoverMenu open={false} data-testid="m">
        x
      </PopoverMenu>,
    );
    expect(q('m')).toBeNull();
  });

  it('stays mounted through the exit, then unmounts and calls onExited', () => {
    const onExited = vi.fn();
    const { rerender } = render(
      <PopoverMenu open onExited={onExited} data-testid="m">
        x
      </PopoverMenu>,
    );
    rerender(
      <PopoverMenu open={false} onExited={onExited} data-testid="m">
        x
      </PopoverMenu>,
    );
    expect(q('m')).not.toBeNull();
    expect(onExited).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(POPOVER_TRANSITION_MS + 1);
    });
    expect(q('m')).toBeNull();
    expect(onExited).toHaveBeenCalledTimes(1);
  });
});
