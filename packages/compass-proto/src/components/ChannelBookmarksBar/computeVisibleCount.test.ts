import { describe, expect, it } from 'vitest';
import { computeVisibleCount } from './computeVisibleCount';

describe('computeVisibleCount', () => {
  const widths = [100, 100, 100];

  it('shows everything when all items fit (no overflow control needed)', () => {
    expect(computeVisibleCount(widths, 320, 8, 32)).toBe(3);
  });

  it('reserves room for the overflow control when items are dropped', () => {
    expect(computeVisibleCount(widths, 300, 8, 32)).toBe(2);
    expect(computeVisibleCount(widths, 240, 8, 32)).toBe(1);
  });

  it('reserves the trailing add button only while everything fits', () => {
    // 316 fits in 320 alone, but not with a 32px add button (316 + 8 + 32 = 356)
    expect(computeVisibleCount(widths, 320, 8, 32, 32)).toBe(2);
    expect(computeVisibleCount(widths, 360, 8, 32, 32)).toBe(3);
  });

  it('uses the combined control instead of add + overflow when overflowing', () => {
    // 2 items (208) + gap (8) + combined (40) = 256 fits in 260; if the add
    // button (32 + 8) were reserved on top it would not (296 > 260).
    expect(computeVisibleCount(widths, 260, 8, 40, 32)).toBe(2);
  });

  it('can hide every item', () => {
    expect(computeVisibleCount(widths, 50, 8, 32)).toBe(0);
  });

  it('handles an empty list', () => {
    expect(computeVisibleCount([], 100, 8, 32)).toBe(0);
  });
});
