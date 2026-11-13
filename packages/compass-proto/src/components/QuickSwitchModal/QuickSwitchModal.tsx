import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { ChannelSidebarItem } from '@mattermost/compass-ui/components/channel-sidebar-item';
import type {
  ChannelSidebarItemLeadingVisual,
  ChannelSidebarItemStatus,
} from '@mattermost/compass-ui/components/channel-sidebar-item';
import { Modal, ModalOverlay } from '@mattermost/compass-ui/components/modal';
import type { ModalOverlayProps } from '@mattermost/compass-ui/components/modal';
import { SearchInput } from '@mattermost/compass-ui/components/search-input';
import { filterQuickSwitchItems } from './filterQuickSwitchItems';
import styles from './QuickSwitchModal.module.scss';

/** One destination in the switcher: a channel, DM, or group message. */
export interface QuickSwitchItem {
  /** Stable key; also used to build the option `id`. */
  id: string;
  /**
   * Display name. A string because it is also the text matched against the
   * query; use `label` to render something richer.
   */
  name: string;
  /** Rendered in place of `name` when set (e.g. a translated node). Matching still uses `name`. */
  label?: ReactNode;
  /** Row glyph, forwarded to `ChannelSidebarItem`. Default: `'public'`. */
  leadingVisual?: ChannelSidebarItemLeadingVisual | ReactNode;
  /** Avatar URL for `leadingVisual='direct-message'`. */
  avatarSrc?: string;
  /** Member count for `leadingVisual='group-message'`. */
  memberCount?: number;
  /** Read / unread / mention state shown on the row. */
  status?: ChannelSidebarItemStatus;
  mentionCount?: number;
  muted?: boolean;
  sharedChannel?: boolean;
  /**
   * Where the destination lives, shown after the name (e.g. `['Design', 'Product']`
   * for team › category). Strings, because they are also matched against the query.
   */
  breadcrumb?: string[];
  /** Extra lowercase-insensitive search terms (handle, full name, purpose). */
  keywords?: string[];
}

export interface QuickSwitchModalProps {
  /** Whether the dialog is shown. The host owns this state (and any Cmd/Ctrl+K shortcut). */
  open: boolean;
  /** Called on Escape, the close button and backdrop press. */
  onClose: () => void;
  /** Called after the exit motion finishes and the dialog unmounts. */
  onExited?: () => void;
  /** Destinations, in the order shown when the query is empty. */
  items: QuickSwitchItem[];
  /**
   * Called when a row is chosen with Enter or a click. The host navigates; the
   * dialog does not close itself, so call `onClose` as well when that is wanted.
   */
  onSelect: (item: QuickSwitchItem) => void;
  /**
   * Custom match. Default: every whitespace-separated term of the query is a
   * case-insensitive substring of the name, breadcrumb or keywords.
   */
  filter?: (item: QuickSwitchItem, query: string) => boolean;
  /** Called as the query changes (e.g. to fetch more results). */
  onQueryChange?: (query: string) => void;
  /**
   * Passed to the `ModalOverlay` scrim: `container`, `lockScroll`, `zIndex`,
   * `style`, etc. The host owns the portal node and stacking.
   */
  overlayProps?: Omit<
    ModalOverlayProps,
    'open' | 'onClose' | 'onExited' | 'children'
  >;
  /** Dialog name (visually hidden). Default: "Switch channels". */
  title?: ReactNode;
  /** Search input placeholder. Default: "Find or jump to…". */
  placeholder?: string;
  /** Accessible name of the search input. Default: "Find or jump to a channel or person". */
  searchLabel?: string;
  /** Accessible name of the results list. Default: "Results". */
  listLabel?: string;
  /** Shown when nothing matches. Default: "No results found". */
  emptyLabel?: ReactNode;
  /** Footer keyboard hints. Default: "↑↓ to navigate · Enter to select · Esc to dismiss". */
  hintLabel?: ReactNode;
  /** Accessible name for the close button. Default: "Close". */
  closeLabel?: string;
  className?: string;
}

const DEFAULT_HINT = '↑↓ to navigate · Enter to select · Esc to dismiss';

/**
 * Quick switcher: a search field over a keyboard-navigable list of channels, DMs
 * and group messages (the "Ctrl/Cmd+K" dialog). Composes `ModalOverlay`,
 * `Modal`, `SearchInput` and `ChannelSidebarItem`. Focus stays in the input;
 * Arrow keys move the highlighted row (`aria-activedescendant`), Enter selects.
 * The host owns `open`, the shortcut, and what selecting does.
 */
export default function QuickSwitchModal({
  open,
  onClose,
  onExited,
  items,
  onSelect,
  filter,
  onQueryChange,
  overlayProps,
  title = 'Switch channels',
  placeholder = 'Find or jump to…',
  searchLabel = 'Find or jump to a channel or person',
  listLabel = 'Results',
  emptyLabel = 'No results found',
  hintLabel = DEFAULT_HINT,
  closeLabel = 'Close',
  className,
}: QuickSwitchModalProps) {
  return (
    <ModalOverlay
      {...overlayProps}
      open={open}
      onClose={onClose}
      onExited={onExited}
    >
      <QuickSwitchPanel
        open={open}
        onClose={onClose}
        items={items}
        onSelect={onSelect}
        filter={filter}
        onQueryChange={onQueryChange}
        title={title}
        placeholder={placeholder}
        searchLabel={searchLabel}
        listLabel={listLabel}
        emptyLabel={emptyLabel}
        hintLabel={hintLabel}
        closeLabel={closeLabel}
        className={className}
      />
    </ModalOverlay>
  );
}

type PanelProps = Required<
  Pick<
    QuickSwitchModalProps,
    | 'open'
    | 'onClose'
    | 'items'
    | 'onSelect'
    | 'title'
    | 'placeholder'
    | 'searchLabel'
    | 'listLabel'
    | 'emptyLabel'
    | 'hintLabel'
    | 'closeLabel'
  >
> &
  Pick<QuickSwitchModalProps, 'filter' | 'onQueryChange' | 'className'>;

function QuickSwitchPanel({
  open,
  onClose,
  items,
  onSelect,
  filter,
  onQueryChange,
  title,
  placeholder,
  searchLabel,
  listLabel,
  emptyLabel,
  hintLabel,
  closeLabel,
  className,
}: PanelProps) {
  const baseId = useId();
  const listId = `${baseId}-list`;
  const optionId = (index: number) => `${baseId}-opt-${index}`;
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => {
    if (!filter) return filterQuickSwitchItems(items, query);
    return query.trim() === '' ? items : items.filter((i) => filter(i, query));
  }, [items, query, filter]);

  const count = results.length;
  const active = count === 0 ? -1 : Math.min(activeIndex, count - 1);

  useEffect(() => {
    if (active < 0) return;
    listRef.current
      ?.querySelector<HTMLElement>(`#${CSS.escape(optionId(active))}`)
      ?.scrollIntoView?.({ block: 'nearest' });
    // optionId is derived from baseId, which is stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  function updateQuery(next: string) {
    setQuery(next);
    setActiveIndex(0);
    onQueryChange?.(next);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing) return;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (count > 0) setActiveIndex((active + 1) % count);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (count > 0) setActiveIndex((active - 1 + count) % count);
        break;
      case 'Home':
        if (count > 0 && !event.shiftKey) {
          event.preventDefault();
          setActiveIndex(0);
        }
        break;
      case 'End':
        if (count > 0 && !event.shiftKey) {
          event.preventDefault();
          setActiveIndex(count - 1);
        }
        break;
      case 'Enter':
        if (active >= 0) {
          event.preventDefault();
          onSelect(results[active]);
        }
        break;
    }
  }

  return (
    <Modal
      className={[styles['quick-switch-modal'], className]
        .filter(Boolean)
        .join(' ')}
      open={open}
      size="small"
      title={title}
      hideTitle
      onClose={onClose}
      closeLabel={closeLabel}
      initialFocusRef={inputRef}
      bodyPadding="none"
      headerLeading={
        <SearchInput
          ref={inputRef}
          className={styles['quick-switch-modal__search']}
          size="large"
          placeholder={placeholder}
          aria-label={searchLabel}
          role="combobox"
          aria-expanded
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-controls={listId}
          aria-activedescendant={active >= 0 ? optionId(active) : undefined}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={query}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            updateQuery(e.target.value)
          }
          onClear={() => updateQuery('')}
          onKeyDown={handleKeyDown}
        />
      }
      footerType="pagination"
      footerLeading={
        <span className={styles['quick-switch-modal__hint']}>{hintLabel}</span>
      }
    >
      {count === 0 ? (
        <p className={styles['quick-switch-modal__empty']} role="status">
          {emptyLabel}
        </p>
      ) : (
        <ul
          ref={listRef}
          id={listId}
          className={styles['quick-switch-modal__list']}
          role="listbox"
          aria-label={listLabel}
        >
          {results.map((item, index) => (
            // Focus stays in the input (aria-activedescendant); the pointer
            // handlers only mirror what the keys do.
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <li
              key={item.id}
              id={optionId(index)}
              role="option"
              aria-selected={index === active}
              className={styles['quick-switch-modal__option']}
              onMouseMove={() => index !== active && setActiveIndex(index)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onSelect(item)}
            >
              <ChannelSidebarItem
                className={styles['quick-switch-modal__row']}
                name={item.label ?? item.name}
                leadingVisual={item.leadingVisual}
                avatarSrc={item.avatarSrc}
                memberCount={item.memberCount}
                status={item.status}
                mentionCount={item.mentionCount}
                muted={item.muted}
                sharedChannel={item.sharedChannel}
                active={index === active}
                hideMenu
              />
              {item.breadcrumb && item.breadcrumb.length > 0 && (
                <span className={styles['quick-switch-modal__crumbs']}>
                  {item.breadcrumb.join(' › ')}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
