import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import {
  ANCHORED_POPUP_GAP,
  ANCHORED_POPUP_Z_INDEX,
  computeAnchoredPopupFixedStyle,
  computeAnchoredPopupPlacement,
  getAnchoredPopupContainerFrame,
  type PopupPlacement,
} from '@/utils/anchoredPopupPlacement';

/**
 * What the popup is placed against: an element, or any object with a
 * `getBoundingClientRect` (a virtual anchor such as a character inside a
 * textarea). The rect is read on every placement.
 */
export type AnchoredPopupAnchor = Pick<HTMLElement, 'getBoundingClientRect'>;

export interface UseAnchoredPopupPortalOptions {
  /** Height used for the flip decision when content isn’t measured yet. */
  preferredHeight: number;
  /** Cap for scrollable menus (Select/Combobox). Omit for intrinsic panels. */
  maxHeightCap?: number;
  /** Ref to the portaled panel for measuring intrinsic height (DateRangePicker). */
  contentRef?: RefObject<HTMLElement | null>;
  /**
   * Portal mount node; defaults to `document.body` with viewport-fixed coords.
   * Custom containers must establish a positioning context (`position` other
   * than `static`); coords are converted to that container’s space.
   */
  portalContainer?: HTMLElement | null;
  zIndex?: number | string;
  /**
   * Which side of the anchor to open on. `auto` (default) prefers below and
   * flips above when there is no room. `above` / `below` never flip, so the
   * popup stays on that side as the page scrolls (a suggestion list above a
   * composer). `maxHeight` is then the room on that side.
   */
  side?: 'auto' | 'above' | 'below';
  /**
   * When true (default), fixed width matches the trigger.
   * DateRangePicker sets false and keeps its CSS width.
   */
  matchWidth?: boolean;
  gap?: number;
}

export interface UseAnchoredPopupPortalResult {
  placement: PopupPlacement;
  maxHeight: number;
  style: CSSProperties;
  /** Ref for the portaled surface — pass to `useOutsideClose` as a second root. */
  portalRef: RefObject<HTMLDivElement | null>;
  /** Wraps children in a portal to `portalContainer` or `document.body`. */
  renderPortal: (children: ReactNode) => ReactNode;
}

const DEFAULT_PLACEMENT: PopupPlacement = 'below';

function resolvePortalMount(
  portalContainer: HTMLElement | null | undefined,
): HTMLElement | null {
  if (typeof document === 'undefined') return null;
  return portalContainer ?? document.body;
}

function usesViewportFixedCoords(mount: HTMLElement): boolean {
  return mount === document.body;
}

/**
 * Positions a popup in a portal with viewport-aware above/below flip (or a fixed
 * `side`). Used by the form widgets (`Select`, `Combobox`, `DateRangePicker`) and
 * by hosts that portal a popup against an element or a virtual anchor. The
 * shared `Popover.Positioner` planned in #111 replaces it; hosts use this one only
 * as an interim positioner.
 *
 * The anchor's rect is re-read when the popup opens, on resize, on scroll (any
 * ancestor) and when the portaled popup changes size, not when the host
 * re-renders. A virtual anchor that moves on its own (a trigger character in a
 * textarea as text wraps) is not followed until one of those happens.
 */
export function useAnchoredPopupPortal(
  anchorRef: RefObject<AnchoredPopupAnchor | null>,
  isOpen: boolean,
  options: UseAnchoredPopupPortalOptions,
): UseAnchoredPopupPortalResult {
  const {
    preferredHeight,
    maxHeightCap,
    contentRef,
    portalContainer = null,
    zIndex = ANCHORED_POPUP_Z_INDEX,
    matchWidth = true,
    gap = ANCHORED_POPUP_GAP,
    side = 'auto',
  } = options;

  const portalRef = useRef<HTMLDivElement | null>(null);
  const [placement, setPlacement] = useState<PopupPlacement>(DEFAULT_PLACEMENT);
  const [maxHeight, setMaxHeight] = useState(maxHeightCap ?? preferredHeight);
  const [style, setStyle] = useState<CSSProperties>({
    position: 'fixed',
    top: 0,
    left: 0,
    width: matchWidth ? 0 : undefined,
    zIndex,
  });

  const update = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const mount = resolvePortalMount(portalContainer);
    if (!mount) return;

    const rect = anchor.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportFixed = usesViewportFixedCoords(mount);
    const containerFrame = viewportFixed
      ? undefined
      : getAnchoredPopupContainerFrame(mount);

    const measured =
      contentRef?.current?.offsetHeight ?? portalRef.current?.offsetHeight ?? 0;
    const heightForFlip = measured > 0 ? measured : preferredHeight;

    const { placement: nextPlacement, maxHeight: nextMaxHeight } =
      computeAnchoredPopupPlacement(rect, viewportHeight, {
        gap,
        preferredHeight: heightForFlip,
        maxHeightCap,
        bounds: containerFrame?.bounds,
        forcePlacement: side === 'auto' ? undefined : side,
      });

    const fixed = computeAnchoredPopupFixedStyle(rect, nextPlacement, {
      gap,
      zIndex,
      width: matchWidth ? rect.width : undefined,
      viewportHeight,
      containerFrame,
    });

    setPlacement(nextPlacement);
    setMaxHeight(nextMaxHeight);
    setStyle({
      position: fixed.position,
      left: fixed.left,
      zIndex: fixed.zIndex,
      ...(matchWidth ? { width: fixed.width } : null),
      ...(nextPlacement === 'below'
        ? { top: fixed.top, bottom: 'auto' }
        : { bottom: fixed.bottom, top: 'auto' }),
    });
  }, [
    anchorRef,
    contentRef,
    gap,
    matchWidth,
    maxHeightCap,
    portalContainer,
    preferredHeight,
    side,
    zIndex,
  ]);

  useLayoutEffect(() => {
    if (!isOpen) return;

    update();

    function handle() {
      update();
    }

    window.addEventListener('resize', handle);
    // Capture phase so nested scroll containers (modals, RHS) are covered.
    document.addEventListener('scroll', handle, true);
    return () => {
      window.removeEventListener('resize', handle);
      document.removeEventListener('scroll', handle, true);
    };
  }, [isOpen, update]);

  // Re-measure after content mounts / changes size (calendar, long lists).
  useLayoutEffect(() => {
    if (!isOpen) return;
    const el = contentRef?.current ?? portalRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    return () => ro.disconnect();
  }, [isOpen, contentRef, update]);

  const renderPortal = useCallback(
    (children: ReactNode) => {
      const mount = resolvePortalMount(portalContainer);
      if (!mount) return null;
      return createPortal(children, mount);
    },
    [portalContainer],
  );

  return {
    placement,
    maxHeight,
    style,
    portalRef,
    renderPortal,
  };
}
