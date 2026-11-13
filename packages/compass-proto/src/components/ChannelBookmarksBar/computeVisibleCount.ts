/**
 * Number of leading items that fit in `available` px. When not every item
 * fits, space is reserved for the overflow button first.
 */
export function computeVisibleCount(
  widths: number[],
  available: number,
  gap: number,
  overflowWidth: number,
): number {
  const total = (n: number) =>
    widths.slice(0, n).reduce((sum, w) => sum + w, 0) +
    Math.max(0, n - 1) * gap;
  if (total(widths.length) <= available) return widths.length;
  let n = widths.length;
  while (n > 0 && total(n) + gap + overflowWidth > available) n -= 1;
  return n;
}
