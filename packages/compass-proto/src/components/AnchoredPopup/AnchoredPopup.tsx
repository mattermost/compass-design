import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import styles from './AnchoredPopup.module.scss';

/** The box a popup is placed against, in viewport coordinates. */
export interface AnchorRect {
  left: number;
  top: number;
  bottom: number;
  width: number;
}

export type AnchoredPopupPlacement = 'top-start' | 'bottom-start';

export interface AnchoredPopupProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  /** Element the popup is placed against, e.g. the composer. Its ref must be set before `open`. */
  anchorRef?: RefObject<HTMLElement | null>;
  /**
   * Places the popup against a box that is not an element, such as the trigger
   * character inside a textarea (see `getTextareaCharRect`). Called on every
   * placement; return `null` to keep the last position. Takes the place of
   * `anchorRef`, and `matchAnchorWidth` then defaults to false: give the popup a
   * `width` instead.
   */
  getAnchorRect?: () => AnchorRect | null;
  /** Renders the popup. The host owns this state. Default: true. */
  open?: boolean;
  /** Side of the anchor, left edges aligned. Flips when there is no room. Default: `top-start`. */
  placement?: AnchoredPopupPlacement;
  /** Space between anchor and popup, in px. Default: 4. */
  gap?: number;
  /** Make the popup as wide as the anchor. Default: true (false with `getAnchorRect`). */
  matchAnchorWidth?: boolean;
  /** Stacking. Default: `var(--z-popover)`. */
  zIndex?: CSSProperties['zIndex'];
  children: ReactNode;
}

const VIEWPORT_MARGIN = 8;

/**
 * Prototype host that portals a popover-style surface (such as a
 * `SuggestionList`) to `document.body` and fixes it against an anchor, so it
 * floats on top instead of taking space in the anchor's container. Repositions
 * on resize, capture-phase scroll and size changes. Open state, outside press
 * and keyboard handling stay with the host.
 */
export default function AnchoredPopup({
  anchorRef,
  getAnchorRect,
  open = true,
  placement = 'top-start',
  gap = 4,
  matchAnchorWidth = getAnchorRect === undefined,
  zIndex = 'var(--z-popover)',
  className,
  style,
  children,
  ...rest
}: AnchoredPopupProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const placeRef = useRef<() => void>(() => {});
  const [position, setPosition] = useState<CSSProperties>({
    visibility: 'hidden',
  });

  useLayoutEffect(() => {
    if (!open) return undefined;
    const place = () => {
      const layer = layerRef.current;
      const rect = getAnchorRect
        ? getAnchorRect()
        : anchorRef?.current?.getBoundingClientRect();
      if (!rect || !layer) return;
      const height = layer.offsetHeight;
      const popupWidth = matchAnchorWidth ? rect.width : layer.offsetWidth;
      const roomAbove = rect.top - gap - VIEWPORT_MARGIN;
      const roomBelow =
        window.innerHeight - rect.bottom - gap - VIEWPORT_MARGIN;
      const above =
        placement === 'top-start'
          ? height <= roomAbove || roomAbove >= roomBelow
          : !(height <= roomBelow || roomBelow < roomAbove);
      const next: CSSProperties = {
        // Keep a popup that is anchored near the right edge on screen.
        left: matchAnchorWidth
          ? rect.left
          : Math.max(
              VIEWPORT_MARGIN,
              Math.min(
                rect.left,
                window.innerWidth - popupWidth - VIEWPORT_MARGIN,
              ),
            ),
        // Not clamped to the viewport: the popup scrolls away with its anchor.
        top: above ? rect.top - gap - height : rect.bottom + gap,
        ...(matchAnchorWidth ? { width: rect.width } : null),
        visibility: 'visible',
      };
      // Same box: skip the state update so re-placing every render can't loop.
      setPosition((prev) =>
        prev.left === next.left &&
        prev.top === next.top &&
        prev.width === next.width &&
        prev.visibility === next.visibility
          ? prev
          : next,
      );
    };
    placeRef.current = place;
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    // The list grows and shrinks while someone types.
    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(place);
    if (layerRef.current) observer?.observe(layerRef.current);
    if (anchorRef?.current) observer?.observe(anchorRef.current);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
      observer?.disconnect();
    };
  }, [open, anchorRef, getAnchorRect, placement, gap, matchAnchorWidth]);

  // Re-place after every render: the anchor can move (the trigger character
  // shifts as text is typed) without the anchor element or the popup resizing.
  useLayoutEffect(() => {
    if (open) placeRef.current();
  });

  if (!open) return null;
  return createPortal(
    <div
      {...rest}
      ref={layerRef}
      className={[styles['anchored-popup'], className]
        .filter(Boolean)
        .join(' ')}
      style={{ ...style, ...position, zIndex }}
    >
      {children}
    </div>,
    document.body,
  );
}
