import { describe, expect, it } from 'vitest';
import { computeVisibleCount } from './computeVisibleCount';

describe('computeVisibleCount', () => {
  const widths = [100, 100, 100];

  it('shows everything when all items fit (no overflow button needed)', () => {
    expect(computeVisibleCount(widths, 320, 8, 32)).toBe(3);
  });

  it('reserves room for the overflow button when items are dropped', () => {
    // 3 items need 316; at 300 only 2 fit with the 32px overflow button (208 + 8 + 32 = 248)
    expect(computeVisibleCount(widths, 300, 8, 32)).toBe(2);
    // 2 items + overflow = 248 > 240, so only 1 fits
    expect(computeVisibleCount(widths, 240, 8, 32)).toBe(1);
  });

  it('can hide every item', () => {
    expect(computeVisibleCount(widths, 50, 8, 32)).toBe(0);
  });

  it('handles an empty list', () => {
    expect(computeVisibleCount([], 100, 8, 32)).toBe(0);
  });
});
