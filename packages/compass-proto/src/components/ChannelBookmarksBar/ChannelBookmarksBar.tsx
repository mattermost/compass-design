import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import ContentCopyIcon from '@mattermost/compass-icons/components/content-copy';
import DotsHorizontalIcon from '@mattermost/compass-icons/components/dots-horizontal';
import FileGenericOutlineIcon from '@mattermost/compass-icons/components/file-generic-outline';
import LinkVariantIcon from '@mattermost/compass-icons/components/link-variant';
import PencilOutlineIcon from '@mattermost/compass-icons/components/pencil-outline';
import PaperclipIcon from '@mattermost/compass-icons/components/paperclip';
import PlusIcon from '@mattermost/compass-icons/components/plus';
import TrashCanOutlineIcon from '@mattermost/compass-icons/components/trash-can-outline';
import { Emoji } from '@mattermost/compass-ui/components/emoji';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { IconButton } from '@mattermost/compass-ui/components/icon-button';
import { MenuItem } from '@mattermost/compass-ui/components/menu-item';
import {
  PopoverMenu,
  PopoverMenuGroup,
} from '@mattermost/compass-ui/components/popover-menu';
import { useOutsideClose } from '@mattermost/compass-ui/hooks/use-outside-close';
import { WithTooltip } from '../WithTooltip';
import { computeVisibleCount } from './computeVisibleCount';
import { dropIndex, moveItem } from './reorder';
import styles from './ChannelBookmarksBar.module.scss';

export interface ChannelBookmark {
  id: string;
  /** Display name. */
  label: ReactNode;
  /** Plain-text name used for accessible names of the item's actions menu. */
  labelText?: string;
  /** `link` (default) or `file` — picks the default leading icon. */
  type?: 'link' | 'file';
  /** Destination for link bookmarks. Rendered as an `<a>` when set. */
  href?: string;
  /** Emoji chosen for the bookmark. Replaces the default link / file icon. */
  emoji?: string;
  /** Overrides the default leading icon (pass `<Icon glyph={...} />`). */
  leadingIcon?: ReactNode;
}

export type ChannelBookmarkAddType = 'link' | 'file';

export interface ChannelBookmarksBarLabels {
  /** Accessible name of the bar (`role="toolbar"`). Default: "Channel bookmarks". */
  bar?: string;
  /** Plus button label and tooltip. Default: "Add a bookmark". */
  add?: string;
  /** Empty-state chip label. Default: "Add bookmark". */
  addBookmark?: string;
  /** Add menu: link row. Default: "Add a link". */
  addLink?: string;
  /** Add menu: file row. Default: "Attach a file". */
  addFile?: string;
  /** Overflow button label and tooltip. Default: "More bookmarks". */
  overflow?: string;
  /** Per-item actions button. Gets the bookmark name appended. Default: "Bookmark actions for". */
  itemActions?: string;
  edit?: string;
  copyLink?: string;
  delete?: string;
  /**
   * Screen-reader announcement after a bookmark is reordered (position is
   * 1-based). Default: "{name}, moved to position {n} of {total}".
   */
  reordered?: (name: string, position: number, total: number) => string;
}

const DEFAULT_LABELS: Required<ChannelBookmarksBarLabels> = {
  reordered: (name, position, total) =>
    `${name}, moved to position ${position} of ${total}`,
  bar: 'Channel bookmarks',
  add: 'Add a bookmark',
  addBookmark: 'Add bookmark',
  addLink: 'Add a link',
  addFile: 'Attach a file',
  overflow: 'More bookmarks',
  itemActions: 'Bookmark actions for',
  edit: 'Edit',
  copyLink: 'Copy link',
  delete: 'Delete',
};

export interface ChannelBookmarksBarProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  bookmarks: ChannelBookmark[];
  /** Shows the add button and the per-item edit / delete actions. Default: true. */
  canManage?: boolean;
  /** Called when a bookmark is activated (link bookmarks with `href` also navigate natively). */
  onBookmarkClick?: (bookmark: ChannelBookmark) => void;
  /**
   * The user chose what to add from the plus menu. The host opens its create
   * modal for that type (e.g. `ChannelBookmarkModal`).
   */
  onAdd?: (type: ChannelBookmarkAddType) => void;
  onEdit?: (bookmark: ChannelBookmark) => void;
  onCopyLink?: (bookmark: ChannelBookmark) => void;
  onDelete?: (bookmark: ChannelBookmark) => void;
  /**
   * Makes the visible bookmarks reorderable (when `canManage`): drag one onto
   * another, or press Alt + Arrow Left / Right on a focused bookmark. Called with
   * the full list in its new order.
   */
  onReorder?: (bookmarks: ChannelBookmark[]) => void;
  /** Overrides English defaults (pass translated strings). */
  labels?: ChannelBookmarksBarLabels;
  className?: string;
}

// Open-menu keys. Bookmark ids are caller-owned, so they are namespaced and can
// never collide with the bar's own `add` / `overflow` menus.
const ADD_MENU = 'menu:add';
const OVERFLOW_MENU = 'menu:overflow';
const itemMenu = (id: string) => `item:${id}`;

/** Used until the real controls have been measured. */
const CONTROL_WIDTH_FALLBACK = 40;

interface AnchoredMenuProps {
  open: boolean;
  /** Which edge of the trigger the menu lines up with. Default: `start`. */
  align?: 'start' | 'end';
  /** Set on the open menu's layer so outside-press treats it as inside. */
  portalRef: RefObject<HTMLDivElement | null>;
  /** Called when the menu asks to close from the keyboard (Escape, Tab). */
  onClose: () => void;
  children: ReactNode;
}

/**
 * Popover menu portaled to `document.body` and positioned against its
 * trigger, so it is never clipped by or part of the bar's layout. The parent
 * must be `position: relative`; a zero-size slot at its bottom edge is the anchor.
 */
function AnchoredMenu({
  open,
  align = 'start',
  portalRef,
  onClose,
  children,
}: AnchoredMenuProps) {
  const slotRef = useRef<HTMLSpanElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CSSProperties>({ visibility: 'hidden' });

  useLayoutEffect(() => {
    if (!open) return undefined;
    const place = () => {
      const slot = slotRef.current;
      const layer = layerRef.current;
      if (!slot || !layer) return;
      const rect = slot.getBoundingClientRect();
      const { offsetWidth: width, offsetHeight: height } = layer;
      const margin = 8;
      const gap = 4;
      const fitsBelow = rect.top + gap + height <= window.innerHeight - margin;
      // The slot has no height; flip above the trigger (the slot's parent).
      const triggerTop =
        slot.parentElement?.getBoundingClientRect().top ?? rect.top;
      const top = fitsBelow
        ? rect.top + gap
        : Math.max(margin, triggerTop - gap - height);
      const anchorLeft = align === 'end' ? rect.left - width : rect.left;
      const left = Math.min(
        Math.max(margin, anchorLeft),
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
  }, [open, align]);

  const focusTrigger = () =>
    slotRef.current?.parentElement
      ?.querySelector<HTMLElement>('[aria-haspopup="menu"]')
      ?.focus();

  // Portaled out of the toolbar, so move focus into the menu on open, and hand
  // it back to the trigger when the menu closes with focus still inside it
  // (item chosen, outside press) so it isn't lost when the rows unmount.
  useEffect(() => {
    if (!open) return undefined;
    const frame = requestAnimationFrame(() => {
      layerRef.current?.querySelector<HTMLElement>('button')?.focus();
    });
    return () => {
      cancelAnimationFrame(frame);
      if (layerRef.current?.contains(document.activeElement)) focusTrigger();
    };
  }, [open]);

  const closeToTrigger = () => {
    onClose();
    focusTrigger();
  };

  const onLayerKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' || e.key === 'Tab') {
      // Menu pattern: Escape / Tab close and return focus to the trigger.
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
    const index = items.indexOf(document.activeElement as HTMLElement);
    const next =
      e.key === 'ArrowDown'
        ? items[(index + 1) % items.length]
        : items[(index - 1 + items.length) % items.length];
    next.focus();
  };

  return (
    <>
      <span
        ref={slotRef}
        aria-hidden="true"
        className={[
          styles['channel-bookmarks-bar__menu-slot'],
          align === 'end' && styles['channel-bookmarks-bar__menu-slot--end'],
        ]
          .filter(Boolean)
          .join(' ')}
      />
      {createPortal(
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- keyboard handler for the role="menu" surface inside this layer
        <div
          ref={(node) => {
            layerRef.current = node;
            if (open) portalRef.current = node;
          }}
          className={styles['channel-bookmarks-bar__menu-layer']}
          style={style}
          onKeyDown={onLayerKeyDown}
          onClickCapture={(e) => {
            // Choosing an item: give focus back to the trigger before the item's
            // own handler runs (it may open a modal that restores focus here).
            if ((e.target as HTMLElement).closest('button')) focusTrigger();
          }}
        >
          <PopoverMenu open={open} role="menu">
            {children}
          </PopoverMenu>
        </div>,
        document.body,
      )}
    </>
  );
}

function defaultIcon(b: ChannelBookmark): ReactNode {
  if (b.leadingIcon) return b.leadingIcon;
  if (b.emoji) return <Emoji emoji={b.emoji} size="16" />;
  return (
    <Icon
      glyph={
        b.type === 'file' ? <FileGenericOutlineIcon /> : <LinkVariantIcon />
      }
      size="12"
    />
  );
}

/**
 * Channel bookmarks bar shown under the channel header. Bookmarks that do not
 * fit collapse into an overflow menu; each bookmark has an actions menu
 * (edit, copy link, delete). The host owns data and the create / edit modal.
 */
export default function ChannelBookmarksBar({
  bookmarks,
  canManage = true,
  onBookmarkClick,
  onAdd,
  onEdit,
  onCopyLink,
  onDelete,
  onReorder,
  labels,
  className = '',
  ...rest
}: ChannelBookmarksBarProps) {
  const l = { ...DEFAULT_LABELS, ...labels };
  const rowRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const plusRef = useRef<HTMLDivElement>(null);
  const overflowChipRef = useRef<HTMLButtonElement>(null);
  const [visibleCount, setVisibleCount] = useState(bookmarks.length);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropAt, setDropAt] = useState<{ id: string; after: boolean } | null>(
    null,
  );
  const [announcement, setAnnouncement] = useState('');

  useLayoutEffect(() => {
    const row = rowRef.current;
    const measure = measureRef.current;
    if (!row || !measure) return;
    const update = () => {
      const kids = Array.from(measure.children) as HTMLElement[];
      // Last child is the widest possible `+N` chip; the rest are items.
      const chip = kids.pop();
      const widths = kids.map((el) => el.offsetWidth);
      const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
      const trailing = canManage
        ? plusRef.current?.offsetWidth || CONTROL_WIDTH_FALLBACK
        : 0;
      setVisibleCount(
        computeVisibleCount(
          widths,
          row.clientWidth,
          gap,
          chip?.offsetWidth || CONTROL_WIDTH_FALLBACK,
          trailing,
        ),
      );
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(row);
    return () => ro.disconnect();
  }, [bookmarks, canManage]);

  const closeMenu = useCallback(() => setOpenMenu(null), []);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuLayerRef = useRef<HTMLDivElement>(null);
  useOutsideClose(rootRef, openMenu !== null, closeMenu, menuLayerRef);

  const visible = bookmarks.slice(0, visibleCount);
  const hidden = bookmarks.slice(visibleCount);
  const empty = bookmarks.length === 0;

  // After a delete the trigger (the bookmark's own actions button, or the
  // overflow chip) can unmount, so park focus on a control that stays: the
  // overflow chip when deleting from it and it still exists once the bar has
  // re-measured, else the add button, else the first control in the bar.
  const parkFocus = (preferChip: boolean) =>
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const chip = overflowChipRef.current;
        const target =
          (preferChip && chip?.isConnected ? chip : null) ??
          plusRef.current?.querySelector<HTMLElement>('button') ??
          rootRef.current?.querySelector<HTMLElement>('a, button');
        target?.focus();
      }),
    );

  const removeBookmark = (b: ChannelBookmark, fromOverflow = false) => {
    setOpenMenu(null);
    onDelete?.(b);
    parkFocus(fromOverflow);
  };

  const canReorder = canManage && Boolean(onReorder);
  const isRtl = () =>
    rowRef.current
      ? getComputedStyle(rowRef.current).direction === 'rtl'
      : false;

  const reorderTo = (id: string, to: number) => {
    const from = bookmarks.findIndex((x) => x.id === id);
    if (from < 0 || from === to) return;
    const next = moveItem(bookmarks, from, to);
    if (next === bookmarks) return;
    const landed = next.findIndex((x) => x.id === id);
    onReorder?.(next);
    const moved = bookmarks[from];
    const name =
      moved.labelText ?? (typeof moved.label === 'string' ? moved.label : '');
    setAnnouncement(l.reordered(name, landed + 1, next.length));
    // Re-inserting DOM nodes drops focus; hand it back to the moved bookmark,
    // or to the overflow chip if it moved out of view.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const moved = rootRef.current?.querySelector<HTMLElement>(
          `[data-bookmark-id="${CSS.escape(id)}"] a, [data-bookmark-id="${CSS.escape(id)}"] > button`,
        );
        (moved ?? overflowChipRef.current)?.focus();
      }),
    );
  };

  const activate = (b: ChannelBookmark) => {
    setOpenMenu(null);
    onBookmarkClick?.(b);
  };

  const content = (b: ChannelBookmark) => (
    <>
      <span className={styles['channel-bookmarks-bar__icon']}>
        {defaultIcon(b)}
      </span>
      <span className={styles['channel-bookmarks-bar__label']}>{b.label}</span>
    </>
  );

  const nameOf = (b: ChannelBookmark) =>
    b.labelText ?? (typeof b.label === 'string' ? b.label : '');

  const addMenu = (
    <AnchoredMenu
      open={openMenu === ADD_MENU}
      portalRef={menuLayerRef}
      onClose={closeMenu}
    >
      <PopoverMenuGroup>
        <MenuItem
          label={l.addLink}
          leadingVisual={<Icon glyph={<LinkVariantIcon />} size="16" />}
          onClick={() => {
            setOpenMenu(null);
            onAdd?.('link');
          }}
        />
        <MenuItem
          label={l.addFile}
          leadingVisual={<Icon glyph={<PaperclipIcon />} size="16" />}
          onClick={() => {
            setOpenMenu(null);
            onAdd?.('file');
          }}
        />
      </PopoverMenuGroup>
    </AnchoredMenu>
  );

  const toggleAdd = () => setOpenMenu(openMenu === ADD_MENU ? null : ADD_MENU);

  if (empty && !canManage) return null;

  return (
    <div
      ref={rootRef}
      role="toolbar"
      aria-label={l.bar}
      className={[styles['channel-bookmarks-bar'], className]
        .filter(Boolean)
        .join(' ')}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && openMenu) {
          e.preventDefault();
          setOpenMenu(null);
        }
      }}
      {...rest}
    >
      <div ref={rowRef} className={styles['channel-bookmarks-bar__row']}>
        {visible.map((b) => (
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- drag handlers on the wrapper; the focusable controls inside carry the semantics, and Alt+Arrow reorders from them
          <div
            key={b.id}
            data-bookmark-id={b.id}
            draggable={canReorder}
            className={[
              styles['channel-bookmarks-bar__item'],
              openMenu === itemMenu(b.id) &&
                styles['channel-bookmarks-bar__item--active'],
              dragId === b.id &&
                styles['channel-bookmarks-bar__item--dragging'],
              dropAt?.id === b.id &&
                styles[
                  `channel-bookmarks-bar__item--drop-${dropAt.after ? 'after' : 'before'}`
                ],
            ]
              .filter(Boolean)
              .join(' ')}
            onDragStart={(e) => {
              if (!canReorder) return;
              e.dataTransfer.effectAllowed = 'move';
              // Firefox only starts a drag when data is set.
              e.dataTransfer.setData('text/plain', b.id);
              setOpenMenu(null);
              setDragId(b.id);
            }}
            onDragOver={(e) => {
              if (!dragId || dragId === b.id) return;
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
              const rect = e.currentTarget.getBoundingClientRect();
              const pastMiddle = e.clientX > rect.left + rect.width / 2;
              const after = isRtl() ? !pastMiddle : pastMiddle;
              if (dropAt?.id !== b.id || dropAt.after !== after) {
                setDropAt({ id: b.id, after });
              }
            }}
            onDrop={(e) => {
              if (!dragId || dragId === b.id) return;
              e.preventDefault();
              const from = bookmarks.findIndex((x) => x.id === dragId);
              const target = bookmarks.findIndex((x) => x.id === b.id);
              const after = dropAt?.id === b.id ? dropAt.after : false;
              reorderTo(dragId, dropIndex(from, target, after));
              setDragId(null);
              setDropAt(null);
            }}
            onDragEnd={() => {
              setDragId(null);
              setDropAt(null);
            }}
            onKeyDown={(e) => {
              if (!canReorder || !e.altKey) return;
              if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
              e.preventDefault();
              const forward = (e.key === 'ArrowRight') !== isRtl();
              const from = bookmarks.findIndex((x) => x.id === b.id);
              reorderTo(b.id, from + (forward ? 1 : -1));
            }}
          >
            {b.href ? (
              <a
                className={styles['channel-bookmarks-bar__link']}
                draggable={false}
                href={b.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => activate(b)}
              >
                {content(b)}
              </a>
            ) : (
              <button
                type="button"
                className={styles['channel-bookmarks-bar__link']}
                onClick={() => activate(b)}
              >
                {content(b)}
              </button>
            )}
            <button
              type="button"
              className={styles['channel-bookmarks-bar__more']}
              aria-label={`${l.itemActions} ${nameOf(b)}`.trim()}
              aria-haspopup="menu"
              aria-expanded={openMenu === itemMenu(b.id)}
              onClick={() =>
                setOpenMenu(openMenu === itemMenu(b.id) ? null : itemMenu(b.id))
              }
            >
              <Icon glyph={<DotsHorizontalIcon />} size="12" />
            </button>
            <AnchoredMenu
              open={openMenu === itemMenu(b.id)}
              portalRef={menuLayerRef}
              onClose={closeMenu}
            >
              <PopoverMenuGroup>
                {canManage && (
                  <MenuItem
                    label={l.edit}
                    leadingVisual={
                      <Icon glyph={<PencilOutlineIcon />} size="16" />
                    }
                    onClick={() => {
                      setOpenMenu(null);
                      onEdit?.(b);
                    }}
                  />
                )}
                <MenuItem
                  label={l.copyLink}
                  leadingVisual={<Icon glyph={<ContentCopyIcon />} size="16" />}
                  onClick={() => {
                    setOpenMenu(null);
                    onCopyLink?.(b);
                  }}
                />
                {canManage && (
                  <MenuItem
                    label={l.delete}
                    destructive
                    leadingVisual={
                      <Icon glyph={<TrashCanOutlineIcon />} size="16" />
                    }
                    onClick={() => removeBookmark(b)}
                  />
                )}
              </PopoverMenuGroup>
            </AnchoredMenu>
          </div>
        ))}
        {hidden.length > 0 && (
          <div className={styles['channel-bookmarks-bar__trailing']}>
            <button
              ref={overflowChipRef}
              type="button"
              className={styles['channel-bookmarks-bar__chip']}
              aria-label={`${l.overflow}, ${hidden.length}`}
              aria-haspopup="menu"
              aria-expanded={openMenu === OVERFLOW_MENU}
              onClick={() =>
                setOpenMenu(openMenu === OVERFLOW_MENU ? null : OVERFLOW_MENU)
              }
            >
              +{hidden.length}
            </button>
            <AnchoredMenu
              open={openMenu === OVERFLOW_MENU}
              align="end"
              portalRef={menuLayerRef}
              onClose={closeMenu}
            >
              <PopoverMenuGroup>
                {hidden.map((b) => (
                  <div
                    key={b.id}
                    className={styles['channel-bookmarks-bar__overflow-row']}
                  >
                    <MenuItem
                      label={b.label}
                      leadingVisual={defaultIcon(b)}
                      onClick={() => {
                        activate(b);
                        if (b.href) window.open(b.href, '_blank', 'noopener');
                      }}
                    />
                    {canManage && (
                      <div
                        className={
                          styles['channel-bookmarks-bar__overflow-actions']
                        }
                      >
                        <WithTooltip label={l.edit}>
                          <IconButton
                            size="x-small"
                            padding="compact"
                            aria-label={`${l.edit} ${nameOf(b)}`.trim()}
                            icon={<Icon glyph={<PencilOutlineIcon />} />}
                            onClick={() => {
                              setOpenMenu(null);
                              onEdit?.(b);
                            }}
                          />
                        </WithTooltip>
                        <WithTooltip label={l.delete}>
                          <IconButton
                            size="x-small"
                            padding="compact"
                            destructive
                            aria-label={`${l.delete} ${nameOf(b)}`.trim()}
                            icon={<Icon glyph={<TrashCanOutlineIcon />} />}
                            onClick={() => removeBookmark(b, true)}
                          />
                        </WithTooltip>
                      </div>
                    )}
                  </div>
                ))}
              </PopoverMenuGroup>
            </AnchoredMenu>
          </div>
        )}
        {canManage && empty && (
          <div className={styles['channel-bookmarks-bar__trailing']}>
            <button
              type="button"
              className={[
                styles['channel-bookmarks-bar__chip'],
                styles['channel-bookmarks-bar__chip--borderless'],
              ].join(' ')}
              aria-haspopup="menu"
              aria-expanded={openMenu === ADD_MENU}
              onClick={toggleAdd}
            >
              <Icon glyph={<PlusIcon />} size="12" />
              {l.addBookmark}
            </button>
            {addMenu}
          </div>
        )}
        {canManage && !empty && (
          <div
            ref={plusRef}
            className={styles['channel-bookmarks-bar__trailing']}
          >
            <WithTooltip label={l.add}>
              <IconButton
                size="small"
                padding="compact"
                className={styles['channel-bookmarks-bar__add']}
                aria-haspopup="menu"
                aria-expanded={openMenu === ADD_MENU}
                icon={<Icon glyph={<PlusIcon />} />}
                onClick={toggleAdd}
              />
            </WithTooltip>
            {addMenu}
          </div>
        )}
      </div>
      <div
        role="status"
        aria-live="polite"
        className={styles['channel-bookmarks-bar__live']}
      >
        {announcement}
      </div>
      {/* Off-screen copy used only to measure natural widths. */}
      <div
        ref={measureRef}
        aria-hidden="true"
        className={styles['channel-bookmarks-bar__measure']}
      >
        {bookmarks.map((b) => (
          <div key={b.id} className={styles['channel-bookmarks-bar__link']}>
            {content(b)}
          </div>
        ))}
        <div className={styles['channel-bookmarks-bar__chip']}>
          +{bookmarks.length}
        </div>
      </div>
    </div>
  );
}
