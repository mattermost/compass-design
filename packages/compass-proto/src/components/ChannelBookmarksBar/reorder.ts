/** Returns a copy of `items` with the item at `from` moved to index `to`. */
export function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || from >= items.length) return items;
  const clamped = Math.min(Math.max(to, 0), items.length - 1);
  const next = items.slice();
  const [moved] = next.splice(from, 1);
  next.splice(clamped, 0, moved);
  return next;
}

/**
 * Index the dragged item ends up at when dropped before or after the item at
 * `targetIndex`. Removing the dragged item first shifts later targets left.
 */
export function dropIndex(
  from: number,
  targetIndex: number,
  after: boolean,
): number {
  const insertAt = targetIndex + (after ? 1 : 0);
  return from < insertAt ? insertAt - 1 : insertAt;
}
