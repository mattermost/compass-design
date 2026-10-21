import { useEffect, useRef } from 'react';

/**
 * Calls `onExited` once `mounted` flips from true to false. Not called if the
 * component unmounts during the exit. Pass `enabled={false}` to skip it (e.g. a
 * mount-controlled `Modal`). Internal: `hooks/` is a public subpath export.
 */
export function useOnExited(
  mounted: boolean,
  onExited: (() => void) | undefined,
  enabled = true,
) {
  const wasMounted = useRef(mounted);
  const onExitedRef = useRef(onExited);
  // Declared before the exit effect so it commits the latest callback first.
  useEffect(() => {
    onExitedRef.current = onExited;
  });

  useEffect(() => {
    if (wasMounted.current && !mounted && enabled) onExitedRef.current?.();
    wasMounted.current = mounted;
  }, [mounted, enabled]);
}
