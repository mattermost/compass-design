interface ScrollLockState {
  count: number;
  savedOverflow: string;
}

// Shared on globalThis so every bundled compass-ui copy on the page counts the same locks.
const STATE_KEY = Symbol.for('@mattermost/compass-ui/scroll-lock/v1');

function getState(): ScrollLockState {
  const host = globalThis as unknown as Record<
    symbol,
    ScrollLockState | undefined
  >;
  let state = host[STATE_KEY];
  if (!state) {
    state = { count: 0, savedOverflow: '' };
    host[STATE_KEY] = state;
  }
  return state;
}

/**
 * Locks `document.body` scroll. Ref-counted so stacked locks restore the
 * original `overflow` only once the last one is released. Returns the release
 * function; calling it more than once is a no-op.
 */
export function lockBodyScroll(): () => void {
  if (typeof document === 'undefined') return () => {};

  const { body } = document;
  const state = getState();
  if (state.count === 0) {
    state.savedOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
  }
  state.count += 1;

  let released = false;
  return () => {
    if (released) return;
    released = true;
    state.count -= 1;
    if (state.count === 0) body.style.overflow = state.savedOverflow;
  };
}
