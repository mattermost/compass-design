import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

export interface AnchoredMenuHostProps {
  /** Trigger element (e.g. `event.currentTarget` from the click). Null = closed. */
  anchor: HTMLElement | null;
  onClose: () => void;
  /** The menu surface, e.g. `<ChannelHeaderMenu />`. */
  children: ReactNode;
}

/**
 * Docs host for a popover menu: portals it to `document.body` and positions it
 * under `anchor` (flipping above when there is no room), with focus on open,
 * arrow-key navigation, and Escape / Tab / outside press to close with focus
 * returned to the trigger. Hosts own the portal; the menu itself stays chrome.
 */
export default function AnchoredMenuHost({
  anchor,
  onClose,
  children,
}: AnchoredMenuHostProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLElement | null>(null);
  anchorRef.current = anchor;
  const open = anchor !== null;
  const [style, setStyle] = useState<CSSProperties>({ visibility: 'hidden' });

  useLayoutEffect(() => {
    if (!anchor) return undefined;
    const place = () => {
      const layer = layerRef.current;
      if (!layer) return;
      const rect = anchor.getBoundingClientRect();
      const { offsetWidth: width, offsetHeight: height } = layer;
      const margin = 8;
      const fitsBelow = rect.bottom + 4 + height <= window.innerHeight - margin;
      const top = fitsBelow
        ? rect.bottom + 4
        : Math.max(margin, rect.top - 4 - height);
      const left = Math.min(
        Math.max(margin, rect.left),
        Math.max(margin, window.innerWidth - width - margin),
      );
      setStyle({ top, left });
    };
    place();
    const ro = new ResizeObserver(place);
    if (layerRef.current) ro.observe(layerRef.current);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [anchor]);

  useEffect(() => {
    if (!anchor) return undefined;
    const frame = requestAnimationFrame(() => {
      layerRef.current?.querySelector<HTMLElement>('button')?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [anchor]);

  // Outside press closes the menu, except on the trigger, the menu itself, or
  // a submenu it opened (portaled elsewhere, marked `data-popover-submenu`).
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target) return;
      if (layerRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      if (target.closest('[data-popover-submenu]')) return;
      onClose();
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open, onClose]);

  if (typeof document === 'undefined') return null;

  const closeToTrigger = () => {
    onClose();
    anchor?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' || e.key === 'Tab') {
      e.preventDefault();
      e.stopPropagation();
      closeToTrigger();
      return;
    }
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const items = Array.from(
      layerRef.current?.querySelectorAll<HTMLElement>('button') ?? [],
    );
    if (items.length === 0) return;
    e.preventDefault();
    const i = items.indexOf(document.activeElement as HTMLElement);
    items[
      (i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length
    ].focus();
  };

  return createPortal(
    open ? (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- keyboard handler for the menu surface inside this layer
      <div
        ref={layerRef}
        style={{ position: 'fixed', zIndex: 'var(--z-menu, 1100)', ...style }}
        onKeyDown={onKeyDown}
      >
        {children}
      </div>
    ) : null,
    document.body,
  );
}
