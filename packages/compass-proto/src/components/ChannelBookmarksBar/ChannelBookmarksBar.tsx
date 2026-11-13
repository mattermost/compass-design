import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import ContentCopyIcon from '@mattermost/compass-icons/components/content-copy';
import DotsHorizontalIcon from '@mattermost/compass-icons/components/dots-horizontal';
import FileGenericOutlineIcon from '@mattermost/compass-icons/components/file-generic-outline';
import LinkVariantIcon from '@mattermost/compass-icons/components/link-variant';
import PencilOutlineIcon from '@mattermost/compass-icons/components/pencil-outline';
import PlusIcon from '@mattermost/compass-icons/components/plus';
import TrashCanOutlineIcon from '@mattermost/compass-icons/components/trash-can-outline';
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
  /** Overrides the default leading icon (pass `<Icon glyph={...} />`). */
  leadingIcon?: ReactNode;
}

export interface ChannelBookmarksBarLabels {
  /** Accessible name of the bar (`role="toolbar"`). Default: "Channel bookmarks". */
  bar?: string;
  /** Add-bookmark button label and tooltip. Default: "Add a bookmark". */
  add?: string;
  /** Overflow button label and tooltip. Default: "More bookmarks". */
  overflow?: string;
  /** Per-item actions button. Gets the bookmark name appended. Default: "Bookmark actions for". */
  itemActions?: string;
  edit?: string;
  copyLink?: string;
  delete?: string;
}

const DEFAULT_LABELS: Required<ChannelBookmarksBarLabels> = {
  bar: 'Channel bookmarks',
  add: 'Add a bookmark',
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
  /** Host opens its create modal (e.g. `ChannelBookmarkModal`). */
  onAdd?: () => void;
  onEdit?: (bookmark: ChannelBookmark) => void;
  onCopyLink?: (bookmark: ChannelBookmark) => void;
  onDelete?: (bookmark: ChannelBookmark) => void;
  /** Overrides English defaults (pass translated strings). */
  labels?: ChannelBookmarksBarLabels;
  className?: string;
}

/** Share of the row that stays free for the overflow + add controls. */
const CONTROL_WIDTH_FALLBACK = 40;

function defaultIcon(b: ChannelBookmark): ReactNode {
  if (b.leadingIcon) return b.leadingIcon;
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
  labels,
  className = '',
  ...rest
}: ChannelBookmarksBarProps) {
  const l = { ...DEFAULT_LABELS, ...labels };
  const rowRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const overflowBtnRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(bookmarks.length);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useLayoutEffect(() => {
    const row = rowRef.current;
    const measure = measureRef.current;
    if (!row || !measure) return;
    const update = () => {
      const widths = Array.from(measure.children).map(
        (el) => (el as HTMLElement).offsetWidth,
      );
      const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
      const overflowWidth =
        overflowBtnRef.current?.offsetWidth || CONTROL_WIDTH_FALLBACK;
      setVisibleCount(
        computeVisibleCount(widths, row.clientWidth, gap, overflowWidth),
      );
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(row);
    return () => ro.disconnect();
  }, [bookmarks]);

  const closeMenu = useCallback(() => setOpenMenu(null), []);
  const rootRef = useRef<HTMLDivElement>(null);
  useOutsideClose(rootRef, openMenu !== null, closeMenu);

  const visible = bookmarks.slice(0, visibleCount);
  const hidden = bookmarks.slice(visibleCount);

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
          <div key={b.id} className={styles['channel-bookmarks-bar__item']}>
            {b.href ? (
              <a
                className={styles['channel-bookmarks-bar__link']}
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
            <div className={styles['channel-bookmarks-bar__item-actions']}>
              <button
                type="button"
                className={styles['channel-bookmarks-bar__more']}
                aria-label={`${l.itemActions} ${nameOf(b)}`.trim()}
                aria-haspopup="menu"
                aria-expanded={openMenu === b.id}
                onClick={() => setOpenMenu(openMenu === b.id ? null : b.id)}
              >
                <Icon glyph={<DotsHorizontalIcon />} size="12" />
              </button>
              <PopoverMenu
                open={openMenu === b.id}
                className={styles['channel-bookmarks-bar__menu']}
                role="menu"
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
                    leadingVisual={
                      <Icon glyph={<ContentCopyIcon />} size="16" />
                    }
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
                      onClick={() => {
                        setOpenMenu(null);
                        onDelete?.(b);
                      }}
                    />
                  )}
                </PopoverMenuGroup>
              </PopoverMenu>
            </div>
          </div>
        ))}
        {hidden.length > 0 && (
          <div
            ref={overflowBtnRef}
            className={styles['channel-bookmarks-bar__overflow']}
          >
            <WithTooltip label={l.overflow}>
              <IconButton
                size="small"
                padding="compact"
                aria-haspopup="menu"
                aria-expanded={openMenu === 'overflow'}
                icon={<Icon glyph={<DotsHorizontalIcon />} />}
                onClick={() =>
                  setOpenMenu(openMenu === 'overflow' ? null : 'overflow')
                }
              />
            </WithTooltip>
            <PopoverMenu
              open={openMenu === 'overflow'}
              className={styles['channel-bookmarks-bar__menu']}
              role="menu"
            >
              <PopoverMenuGroup>
                {hidden.map((b) => (
                  <MenuItem
                    key={b.id}
                    label={b.label}
                    leadingVisual={defaultIcon(b)}
                    onClick={() => {
                      activate(b);
                      if (b.href) window.open(b.href, '_blank', 'noopener');
                    }}
                  />
                ))}
              </PopoverMenuGroup>
            </PopoverMenu>
          </div>
        )}
      </div>
      {canManage && (
        <WithTooltip label={l.add}>
          <IconButton
            size="small"
            padding="compact"
            icon={<Icon glyph={<PlusIcon />} />}
            onClick={onAdd}
          />
        </WithTooltip>
      )}
      {/* Off-screen copy used only to measure natural item widths. */}
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
      </div>
    </div>
  );
}
