import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';
import BookmarkOutlineIcon from '@mattermost/compass-icons/components/bookmark-outline';
import ChevronRightIcon from '@mattermost/compass-icons/components/chevron-right';
import LinkVariantIcon from '@mattermost/compass-icons/components/link-variant';
import PaperclipIcon from '@mattermost/compass-icons/components/paperclip';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { MenuItem } from '@mattermost/compass-ui/components/menu-item';
import {
  PopoverMenu,
  PopoverMenuGroup,
} from '@mattermost/compass-ui/components/popover-menu';

export type BookmarksBarSubmenuChoice = 'link' | 'file';

export interface BookmarksBarSubmenuProps {
  /** Called with what the user chose to add. */
  onAddBookmark: (type: BookmarksBarSubmenuChoice) => void;
}

/** Hover grace so the pointer can travel from the row into the submenu. */
const HOVER_CLOSE_MS = 150;

/**
 * "Bookmarks bar" row of the channel header menu. It opens a submenu to the
 * side with **Add a link** and **Attach a file**, as in the webapp. The
 * submenu is portaled to `document.body` and positioned against the row;
 * the layer carries `data-popover-submenu` so a host's outside-press check can
 * treat it as part of the open menu.
 */
export default function BookmarksBarSubmenu({
  onAddBookmark,
}: BookmarksBarSubmenuProps) {
  const rowRef = useRef<HTMLButtonElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(false);
  // Opened by click / keyboard: stays open until closed, ignoring hover leave.
  const [pinned, setPinned] = useState(false);
  const [style, setStyle] = useState<CSSProperties>({ visibility: 'hidden' });

  const clearTimer = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
  };
  const close = () => {
    clearTimer();
    setOpen(false);
    setPinned(false);
  };
  useEffect(() => clearTimer, []);

  const scheduleClose = () => {
    if (pinned) return;
    clearTimer();
    hoverTimer.current = setTimeout(close, HOVER_CLOSE_MS);
  };

  useLayoutEffect(() => {
    if (!open) return undefined;
    const place = () => {
      const row = rowRef.current;
      const layer = layerRef.current;
      if (!row || !layer) return;
      const rect = row.getBoundingClientRect();
      const { offsetWidth: width, offsetHeight: height } = layer;
      const margin = 8;
      // Submenu recipe: overlap the parent by 8px, first item level with the row.
      const overlap = 8;
      const first = layer.querySelector<HTMLElement>('button');
      const inset = first
        ? first.getBoundingClientRect().top - layer.getBoundingClientRect().top
        : 0;
      const rtl = getComputedStyle(row).direction === 'rtl';
      const fitsRight =
        rect.right - overlap + width <= window.innerWidth - margin;
      const fitsLeft = rect.left + overlap - width >= margin;
      const toRight = rtl ? !fitsLeft : fitsRight || !fitsLeft;
      const left = toRight ? rect.right - overlap : rect.left + overlap - width;
      const top = Math.min(
        Math.max(margin, rect.top - inset),
        Math.max(margin, window.innerHeight - height - margin),
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
  }, [open]);

  // Keyboard open: move focus into the submenu.
  useEffect(() => {
    if (!open || !pinned) return undefined;
    const frame = requestAnimationFrame(() => {
      layerRef.current?.querySelector<HTMLElement>('button')?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [open, pinned]);

  const openPinned = () => {
    clearTimer();
    setOpen(true);
    setPinned(true);
  };

  const onRowKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
      if ((e.key === 'ArrowRight') !== rtl) {
        e.preventDefault();
        e.stopPropagation();
        openPinned();
      }
    }
  };

  const onLayerKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const rtl = rowRef.current
      ? getComputedStyle(rowRef.current).direction === 'rtl'
      : false;
    const backKey = rtl ? 'ArrowRight' : 'ArrowLeft';
    if (e.key === 'Escape' || e.key === backKey) {
      // Back to the parent menu only; the parent keeps its own Escape.
      e.preventDefault();
      e.stopPropagation();
      close();
      rowRef.current?.focus();
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      e.stopPropagation();
      const items = Array.from(
        layerRef.current?.querySelectorAll<HTMLElement>('button') ?? [],
      );
      if (items.length === 0) return;
      const i = items.indexOf(document.activeElement as HTMLElement);
      items[
        (i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length
      ].focus();
    }
  };

  const choose = (type: BookmarksBarSubmenuChoice) => {
    close();
    onAddBookmark(type);
  };

  return (
    <>
      <MenuItem
        ref={rowRef}
        label="Bookmarks bar"
        aria-haspopup="menu"
        aria-expanded={open}
        active={open}
        leadingVisual={<Icon glyph={<BookmarkOutlineIcon />} size="16" />}
        trailingElement
        trailingVisual={<Icon glyph={<ChevronRightIcon />} size="16" />}
        onClick={openPinned}
        onKeyDown={onRowKeyDown}
        onMouseEnter={() => {
          clearTimer();
          setOpen(true);
        }}
        onMouseLeave={scheduleClose}
      />
      {open &&
        createPortal(
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- keyboard and hover handling for the submenu surface inside this layer
          <div
            ref={layerRef}
            data-popover-submenu=""
            style={{
              position: 'fixed',
              zIndex: 'var(--z-menu, 1100)',
              ...style,
            }}
            onKeyDown={onLayerKeyDown}
            onMouseEnter={clearTimer}
            onMouseLeave={scheduleClose}
          >
            <PopoverMenu variant="child" role="menu" aria-label="Bookmarks bar">
              <PopoverMenuGroup>
                <MenuItem
                  label="Add a link"
                  leadingVisual={<Icon glyph={<LinkVariantIcon />} size="16" />}
                  onClick={() => choose('link')}
                />
                <MenuItem
                  label="Attach a file"
                  leadingVisual={<Icon glyph={<PaperclipIcon />} size="16" />}
                  onClick={() => choose('file')}
                />
              </PopoverMenuGroup>
            </PopoverMenu>
          </div>,
          document.body,
        )}
    </>
  );
}
