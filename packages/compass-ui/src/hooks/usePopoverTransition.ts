import { useEffect, useState } from 'react';
import { readDurationMs } from '@/utils/duration';

/** Fallback for `--duration-quick` when the token is not available. */
export const POPOVER_TRANSITION_MS = 150;

/**
 * Keeps a surface mounted for the duration of its exit animation so the close
 * transition can play before React unmounts the node. The exit wait is read
 * from `durationToken` (default `--duration-quick`) so it always matches the
 * CSS transition. See CLAUDE.md: "Animation: popover panel open/close".
 */
export function usePopoverTransition(
  open: boolean,
  durationToken = '--duration-quick',
) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setVisible(true));
      });
      return () => {
        cancelAnimationFrame(raf1);
        if (raf2) cancelAnimationFrame(raf2);
      };
    }
    setVisible(false);
    const t = window.setTimeout(
      () => setMounted(false),
      readDurationMs(durationToken, POPOVER_TRANSITION_MS),
    );
    return () => window.clearTimeout(t);
  }, [open, durationToken]);

  return { mounted, visible };
}
