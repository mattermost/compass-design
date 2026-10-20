let lockCount = 0;
let savedOverflow = '';

/**
 * Locks `document.body` scroll. Ref-counted so stacked locks restore the
 * original `overflow` only once the last one is released. Returns the release
 * function; calling it more than once is a no-op.
 */
export function lockBodyScroll(): () => void {
  if (typeof document === 'undefined') return () => {};

  const { body } = document;
  if (lockCount === 0) {
    savedOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
  }
  lockCount += 1;

  let released = false;
  return () => {
    if (released) return;
    released = true;
    lockCount -= 1;
    if (lockCount === 0) body.style.overflow = savedOverflow;
  };
}
