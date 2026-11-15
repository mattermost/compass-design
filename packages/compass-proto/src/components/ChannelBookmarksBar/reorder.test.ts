import { describe, expect, it } from 'vitest';
import { dropIndex, moveItem } from './reorder';

describe('moveItem', () => {
  const list = ['a', 'b', 'c', 'd'];

  it('moves an item forward and backward', () => {
    expect(moveItem(list, 0, 2)).toEqual(['b', 'c', 'a', 'd']);
    expect(moveItem(list, 3, 1)).toEqual(['a', 'd', 'b', 'c']);
  });

  it('returns the same list for a no-op or out-of-range source', () => {
    expect(moveItem(list, 1, 1)).toBe(list);
    expect(moveItem(list, 9, 0)).toBe(list);
  });

  it('clamps the destination and does not mutate the input', () => {
    expect(moveItem(list, 0, 99)).toEqual(['b', 'c', 'd', 'a']);
    expect(moveItem(list, 3, -5)).toEqual(['d', 'a', 'b', 'c']);
    expect(list).toEqual(['a', 'b', 'c', 'd']);
  });
});

describe('dropIndex', () => {
  it('accounts for the dragged item leaving its slot', () => {
    // drag "a" (0) and drop after "c" (2) -> a lands at index 2
    expect(dropIndex(0, 2, true)).toBe(2);
    // drop before "c" (2) -> a lands at index 1
    expect(dropIndex(0, 2, false)).toBe(1);
  });

  it('is unaffected when dragging backward', () => {
    expect(dropIndex(3, 1, false)).toBe(1);
    expect(dropIndex(3, 1, true)).toBe(2);
  });

  it('yields the current index when dropped next to itself', () => {
    expect(dropIndex(2, 2, false)).toBe(2);
    expect(dropIndex(2, 2, true)).toBe(2);
  });
});
