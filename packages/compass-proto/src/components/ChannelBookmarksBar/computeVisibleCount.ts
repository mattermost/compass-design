/**
 * Number of leading items that fit in `available` px.
 *
 * `trailingWidth` (e.g. the add button) is always reserved. When not every
 * item fits, room for the `+N` overflow control is reserved as well.
 */
export function computeVisibleCount(
  widths: number[],
  available: number,
  gap: number,
  overflowWidth: number,
  trailingWidth = 0,
): number {
  const items = (n: number) =>
    widths.slice(0, n).reduce((sum, w) => sum + w, 0) +
    Math.max(0, n - 1) * gap;
  const trailing = trailingWidth > 0 ? gap + trailingWidth : 0;
  if (items(widths.length) + trailing <= available) return widths.length;
  let n = widths.length;
  while (n > 0 && items(n) + gap + overflowWidth + trailing > available) n -= 1;
  return n;
}
