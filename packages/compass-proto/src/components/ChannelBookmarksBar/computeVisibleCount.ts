/**
 * Number of leading items that fit in `available` px.
 *
 * When every item fits, room for the always-present trailing control (the add
 * button, `trailingWidth`) is reserved. When not every item fits, the add
 * button and the overflow control are one combined control (`overflowWidth`),
 * so only that is reserved.
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
  while (n > 0 && items(n) + gap + overflowWidth > available) n -= 1;
  return n;
}
