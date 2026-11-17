import { useLayoutEffect, useRef } from 'react';

/** How close to the bottom (px) still counts as "at the bottom". */
const STICK_THRESHOLD = 24;

/**
 * Anchors a scroll region to its bottom, like a channel: it opens on the
 * newest message and stays there while the content grows (images, fonts,
 * new messages), until the user scrolls up. Scrolling back to the bottom
 * re-anchors it. Pass a `resetKey` (e.g. the channel id) to jump back to the
 * bottom when the content is swapped for another channel.
 *
 * Attach the returned ref to the element that scrolls (`Scrollbar` forwards
 * its ref to it).
 */
export function useStickToBottom<T extends HTMLElement = HTMLDivElement>(
  resetKey?: unknown,
) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

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

    return () => {
      el.removeEventListener('scroll', onScroll);
      observer?.disconnect();
    };
  }, [resetKey]);

  return ref;
}
