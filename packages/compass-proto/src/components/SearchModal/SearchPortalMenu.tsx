import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import { PopoverMenu } from '@mattermost/compass-ui/components/popover-menu';
import { useOutsideClose } from '@mattermost/compass-ui/hooks/use-outside-close';
import styles from './SearchModal.module.scss';

export interface SearchPortalMenuProps {
  open: boolean;
  /** The trigger the menu hangs from. */
  anchorRef: RefObject<HTMLElement | null>;
  /** Which edge of the trigger the menu lines up with. Default: `start`. */
  align?: 'start' | 'end';
  /** Open above the trigger when true (footer controls). Default: below. */
  above?: boolean;
  label: string;
  onClose: () => void;
  children: ReactNode;
}

/**
 * A popover menu portaled to `document.body` and positioned against its trigger
 * (viewport-fixed, above the dialog's layer), so the dialog never clips it or
 * grows to hold it. Escape and Tab close it and return focus to the trigger;
 * Arrow keys move between rows; an outside press closes it.
 */
export default function SearchPortalMenu({
  open,
  anchorRef,
  align = 'start',
  above = false,
  label,
  onClose,
  children,
}: SearchPortalMenuProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CSSProperties>({ visibility: 'hidden' });

  useOutsideClose(anchorRef, open, onClose, layerRef);

  useLayoutEffect(() => {
    if (!open) return undefined;
    const place = () => {
      const anchor = anchorRef.current;
      const layer = layerRef.current;
      if (!anchor || !layer) return;
      const rect = anchor.getBoundingClientRect();
      const { offsetWidth: width, offsetHeight: height } = layer;
      const margin = 8;
      const gap = 4;
      const top = above
        ? Math.max(margin, rect.top - gap - height)
        : rect.bottom + gap;
      const edge = align === 'end' ? rect.right - width : rect.left;
      const left = Math.min(
        Math.max(margin, edge),
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
  }, [open, anchorRef, align, above]);

  // Portaled out of the dialog: move focus into the menu on open, and hand it
  // back to the trigger if it closes with focus still inside.
  useEffect(() => {
    if (!open) return undefined;
    const layer = layerRef.current;
    const anchor = anchorRef.current;
    const frame = requestAnimationFrame(() => {
      layer?.querySelector<HTMLElement>('button')?.focus();
    });
    return () => {
      cancelAnimationFrame(frame);
      if (layer?.contains(document.activeElement)) anchor?.focus();
    };
  }, [open, anchorRef]);

  if (!open) return null;

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' || e.key === 'Tab') {
      // Keep the surrounding Modal open: only the menu closes.
      e.preventDefault();
      e.stopPropagation();
      onClose();
      anchorRef.current?.focus();
      return;
    }
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const items = Array.from(
      layerRef.current?.querySelectorAll<HTMLElement>('button') ?? [],
    );
    if (items.length === 0) return;
    e.preventDefault();
    const index = items.indexOf(document.activeElement as HTMLElement);
    const next =
      e.key === 'ArrowDown'
        ? items[(index + 1) % items.length]
        : items[(index - 1 + items.length) % items.length];
    next.focus();
  };

  return createPortal(
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- keyboard handler for the role="menu" surface inside this layer
    <div
      ref={layerRef}
      className={styles['search-modal__menu-layer']}
      style={style}
      onKeyDown={onKeyDown}
    >
      <PopoverMenu role="menu" aria-label={label}>
        {children}
      </PopoverMenu>
    </div>,
    document.body,
  );
}
