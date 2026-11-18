import { useCallback, useRef } from 'react';

/** How close to the bottom (px) still counts as "at the bottom". */
const STICK_THRESHOLD = 24;

/**
 * Anchors a scroll region to its bottom, like a channel: it opens on the
 * newest message and stays there while the content grows (images, fonts,
 * new messages), until the user scrolls up. Scrolling back to the bottom
 * re-anchors it. Pass a `resetKey` (e.g. the channel id) to jump back to the
 * bottom when the content is swapped for another channel.
 *
 * Attach the returned callback ref to the element that scrolls (`Scrollbar` forwards
 * its ref to it).
 */
export function useStickToBottom<T extends HTMLElement = HTMLDivElement>(
  resetKey?: unknown,
) {
  const cleanupRef = useRef<(() => void) | undefined>(undefined);

  // A callback ref, so the anchoring follows the element itself: when the
  // scroller unmounts and remounts (even with the same key) React detaches
  // the old node and attaches the new one, which is anchored afresh.
  // `resetKey` is part of the callback's identity so changing it re-attaches.
  return useCallback(
    (el: T | null) => {
      cleanupRef.current?.();
      cleanupRef.current = undefined;
      if (!el) return;

      let stuck = true;
      const toBottom = () => {
        el.scrollTop = el.scrollHeight;
      };
      const onScroll = () => {
        stuck =
          el.scrollHeight - el.scrollTop - el.clientHeight <= STICK_THRESHOLD;
      };
      toBottom();
      el.addEventListener('scroll', onScroll, { passive: true });

      // Keep the bottom in view when the content resizes. Guarded for hosts
      // without ResizeObserver.
      const content = el.firstElementChild;
      const observer =
        typeof ResizeObserver !== 'undefined' && content
          ? new ResizeObserver(() => {
              if (stuck) toBottom();
            })
          : undefined;
      if (content) observer?.observe(content);

      cleanupRef.current = () => {
        el.removeEventListener('scroll', onScroll);
        observer?.disconnect();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resetKey],
  );
}
