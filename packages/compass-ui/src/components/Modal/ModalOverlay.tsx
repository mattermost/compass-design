import {
  useEffect,
  useRef,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { usePopoverTransition } from '@/hooks/usePopoverTransition';
import { mergeClassNames } from '@/utils/props';
import { lockBodyScroll } from '@/utils/scrollLock';
import { useOnExited } from '@/utils/useOnExited';
import styles from './ModalOverlay.module.scss';

export interface ModalOverlayProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether the overlay is shown. Setting it to `false` plays the exit and then unmounts. */
  open: boolean;
  /** Called when the backdrop is pressed. Presses that start inside the dialog do not call it. */
  onClose?: () => void;
  /**
   * Called once the exit finishes and the overlay has unmounted. Not called if
   * the overlay itself is unmounted before the exit finishes, so do any
   * cleanup on unmount as well.
   */
  onExited?: () => void;
  /**
   * Portal node. Defaults to `document.body`; pass another element so a modal
   * inside another top layer can join it. `null` renders nothing until the node
   * exists (e.g. a ref held in state). Override `position` through `style`
   * when the container is a positioned stage. Scroll lock applies to that
   * node's document.
   */
  container?: HTMLElement | null;
  /**
   * Lock `document.body` scroll while the overlay is mounted. Turn off for an
   * overlay staged inside a frame (docs, Storybook) so it doesn't freeze the page.
   */
  lockScroll?: boolean;
  /**
   * Stacking order. Defaults to `--z-modal` (200); a host whose chrome sits
   * higher passes this or redefines `--z-modal`. Applied before `style`, so
   * `style.zIndex` wins.
   */
  zIndex?: number;
  /** Usually a `Modal`. */
  children?: ReactNode;
}

/**
 * Modal scrim: portals to `document.body` (or `container`), locks body scroll
 * while shown (opt out with `lockScroll={false}`), closes on backdrop press, and stays mounted for
 * `--duration-quick` after `open` becomes false so the fade-out can play.
 * Escape and focus stay on `Modal`. Hosts that already position their own
 * node can use `modalOverlayStyles` instead.
 */
export default function ModalOverlay({
  open,
  onClose,
  onExited,
  container,
  lockScroll = true,
  zIndex,
  className,
  style,
  children,
  onMouseDown,
  onClick,
  ...rest
}: ModalOverlayProps) {
  const { mounted } = usePopoverTransition(open);
  useOnExited(mounted, onExited);
  const pressStartedInside = useRef(false);

  const target =
    container === undefined
      ? typeof document === 'undefined'
        ? null
        : document.body
      : container;

  useEffect(() => {
    if (!mounted || !target || !lockScroll) return undefined;
    return lockBodyScroll(target.ownerDocument);
  }, [mounted, target, lockScroll]);

  if (!mounted || !target) return null;

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    pressStartedInside.current = e.target !== e.currentTarget;
    onMouseDown?.(e);
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const startedInside = pressStartedInside.current;
    pressStartedInside.current = false;
    onClick?.(e);
    if (open && !startedInside && e.target === e.currentTarget) onClose?.();
  };

  return createPortal(
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- backdrop click is a pointer shortcut; keyboard users close with Escape (handled by Modal)
    <div
      {...rest}
      className={mergeClassNames(
        styles['modal-overlay'],
        !open && styles['modal-overlay--exiting'],
        className,
      )}
      style={{ ...(zIndex !== undefined && { zIndex }), ...style }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      {children}
    </div>,
    target,
  );
}
