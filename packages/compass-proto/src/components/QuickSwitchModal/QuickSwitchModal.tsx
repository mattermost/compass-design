import {
  Fragment,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import GlobeIcon from '@mattermost/compass-icons/components/globe';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { MenuGroupHeading } from '@mattermost/compass-ui/components/menu-group-heading';
import { MenuItem } from '@mattermost/compass-ui/components/menu-item';
import { Modal, ModalOverlay } from '@mattermost/compass-ui/components/modal';
import type { ModalOverlayProps } from '@mattermost/compass-ui/components/modal';
import { SearchInput } from '@mattermost/compass-ui/components/search-input';
import { filterQuickSwitchItems } from './filterQuickSwitchItems';
import styles from './QuickSwitchModal.module.scss';

/** One destination in the switcher (a channel, DM, or group message). */
export interface QuickSwitchItem {
  /** Stable key; also used to build the option `id`. */
  id: string;
  /**
   * Display name. A string because it is also the text matched against the
   * query; use `label` to render something richer.
   */
  label?: ReactNode;
  name: string;
  /**
   * Muted text after the name, e.g. the channel handle `~bugs`. A string
   * because it is also matched against the query.
   */
  secondaryLabel?: string;
  /**
   * Leading visual. Pass `<Icon glyph={<SomeIcon />} />` (the row provides the
   * size) or a 16–24px node such as an avatar. Default: a globe icon.
   */
  leadingVisual?: ReactNode;
  /**
   * Section this item belongs to (e.g. "Unread", "Recent"). A heading shows
   * wherever the group changes between consecutive results, so keep items of
   * a group together. Ungrouped items render with no heading.
   */
  group?: string;
  /** Rendered as the group heading instead of `group` (e.g. a translated node). */
  groupLabel?: ReactNode;
  /** Extra search terms (handle, full name, purpose). */
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
   * case-insensitive substring of the name, secondary label or keywords.
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
  /** Dialog heading. Default: "Find channels". */
  title?: ReactNode;
  /**
   * Line under the title. Default: "Type to find a channel. Use UP/DOWN to
   * browse, ENTER to select, ESC to dismiss." Pass `null` to hide it.
   */
  subtitle?: ReactNode;
  /** Search input placeholder. Default: "Search". */
  placeholder?: string;
  /** Accessible name of the search input. Default: "Search channels". */
  searchLabel?: string;
  /** Accessible name of the results list. Default: "Results". */
  listLabel?: string;
  /** Shown when nothing matches. Default: "No results found". */
  emptyLabel?: ReactNode;
  /** Accessible name for the close button. Default: "Close". */
  closeLabel?: string;
  className?: string;
}

const DEFAULT_SUBTITLE =
  'Type to find a channel. Use UP/DOWN to browse, ENTER to select, ESC to dismiss.';

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
  title = 'Find channels',
  subtitle = DEFAULT_SUBTITLE,
  placeholder = 'Search',
  searchLabel = 'Search channels',
  listLabel = 'Results',
  emptyLabel = 'No results found',
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
        subtitle={subtitle}
        placeholder={placeholder}
        searchLabel={searchLabel}
        listLabel={listLabel}
        emptyLabel={emptyLabel}
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
    | 'subtitle'
    | 'placeholder'
    | 'searchLabel'
    | 'listLabel'
    | 'emptyLabel'
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
  subtitle,
  placeholder,
  searchLabel,
  listLabel,
  emptyLabel,
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
      subtitle={subtitle ?? undefined}
      onClose={onClose}
      closeLabel={closeLabel}
      initialFocusRef={inputRef}
      bodyPadding="none"
      headerSlot={
        <SearchInput
          ref={inputRef}
          className={styles['quick-switch-modal__search']}
          size="medium"
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
            <Fragment key={item.id}>
              {item.group != null &&
                item.group !== results[index - 1]?.group && (
                  <li role="presentation">
                    <MenuGroupHeading
                      className={styles['quick-switch-modal__heading']}
                      label={item.groupLabel ?? item.group}
                    />
                  </li>
                )}
              <li
                role="presentation"
                onMouseMove={() => index !== active && setActiveIndex(index)}
              >
                <MenuItem
                  id={optionId(index)}
                  role="option"
                  tabIndex={-1}
                  aria-selected={index === active}
                  label={item.label ?? item.name}
                  className={styles['quick-switch-modal__option']}
                  secondaryLabel={item.secondaryLabel}
                  secondaryLabelPosition="inline"
                  leadingVisual={
                    item.leadingVisual ?? <Icon glyph={<GlobeIcon />} />
                  }
                  active={index === active}
                  // Focus stays in the input (aria-activedescendant).
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onSelect(item)}
                />
              </li>
            </Fragment>
          ))}
        </ul>
      )}
    </Modal>
  );
}
