interface ScrollLockState {
  count: number;
  savedOverflow: string;
  savedPaddingRight: string;
}

// Shared on globalThis so every bundled compass-ui copy on the page counts the same locks.
const STATE_KEY = Symbol.for('@mattermost/compass-ui/scroll-lock/v1');

// Keyed per document so a popout window or iframe locks and restores independently.
function getState(doc: Document): ScrollLockState {
  const host = globalThis as unknown as Record<
    symbol,
    WeakMap<Document, ScrollLockState> | undefined
  >;
  let states = host[STATE_KEY];
  if (!states) {
    states = new WeakMap();
    host[STATE_KEY] = states;
  }
  let state = states.get(doc);
  if (!state) {
    state = { count: 0, savedOverflow: '', savedPaddingRight: '' };
    states.set(doc, state);
  }
  return state;
}

function scrollbarWidth(doc: Document): number {
  const viewport = doc.documentElement.clientWidth;
  const outer = doc.defaultView?.innerWidth ?? 0;
  // clientWidth is 0 in non-layout environments (jsdom); don't treat that as a scrollbar.
  return viewport > 0 && outer > viewport ? outer - viewport : 0;
}

/**
 * Locks scroll on `doc.body` (default: the global `document`). Ref-counted so
 * stacked locks restore the original `overflow` only once the last one is
 * released. Pads the body by the scrollbar width so the page doesn't shift
 * sideways when the scrollbar disappears. Returns the release function; calling
 * it more than once is a no-op.
 */
export function lockBodyScroll(
  doc: Document | undefined = typeof document === 'undefined'
    ? undefined
    : document,
): () => void {
  if (!doc) return () => {};

  const { body } = doc;
  const state = getState(doc);
  if (state.count === 0) {
    const gap = scrollbarWidth(doc);
    state.savedOverflow = body.style.overflow;
    state.savedPaddingRight = body.style.paddingRight;
    if (gap > 0) {
      const base =
        parseFloat(
          doc.defaultView?.getComputedStyle(body).paddingRight ?? '',
        ) || 0;
      body.style.paddingRight = `${base + gap}px`;
    }
    body.style.overflow = 'hidden';
  }
  state.count += 1;

  let released = false;
  return () => {
    if (released) return;
    released = true;
    state.count -= 1;
    if (state.count === 0) {
      body.style.overflow = state.savedOverflow;
      body.style.paddingRight = state.savedPaddingRight;
    }
  };
}
