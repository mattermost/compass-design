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
import GlobeIcon from '@mattermost/compass-icons/components/globe';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { MenuGroupHeading } from '@mattermost/compass-ui/components/menu-group-heading';
import { MenuItem } from '@mattermost/compass-ui/components/menu-item';
import { PopoverMenuDivider } from '@mattermost/compass-ui/components/popover-menu';
import { Modal, ModalOverlay } from '@mattermost/compass-ui/components/modal';
import type { ModalOverlayProps } from '@mattermost/compass-ui/components/modal';
import { SearchInput } from '@mattermost/compass-ui/components/search-input';
import {
  filterQuickSwitchItems,
  hasSearchTerms,
} from './filterQuickSwitchItems';
import styles from './QuickSwitchModal.module.scss';

/** What a switcher item is. A leading `~` in the query limits to channels, `@` to direct messages. */
export type QuickSwitchKind = 'channel' | 'direct-message';

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
   * Channel or direct message, used to scope results when the query starts with
   * `~` (channels) or `@` (direct messages). Default: inferred from
   * `secondaryLabel` (`@handle` is a direct message), otherwise a channel.
   */
  kind?: QuickSwitchKind;
  /**
   * Muted text after the name, e.g. the channel handle `~bugs`. A string
   * because it is also matched against the query.
   */
  secondaryLabel?: string;
  /**
   * An emoji shown in place of the default globe (a channel whose name starts
   * with one; put the rest of the name in `name`). Ignored when `leadingVisual`
   * is set.
   */
  leadingEmoji?: string;
  /**
   * Leading visual. Pass `<Icon glyph={<SomeIcon />} />` (the row provides the
   * size) or a 16–24px node such as an avatar. Default: a globe icon.
   */
  leadingVisual?: ReactNode;
  /**
   * Section this item belongs to (e.g. "Unread", "Recent"). A heading shows
   * wherever the group changes between consecutive results, so keep items of
   * a group together. Ungrouped items render with no heading. Groups only
   * show while the query is empty; searching flattens them into one ranked list.
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
   * case-insensitive substring of the name, secondary label or keywords, and
   * results are ranked by closeness (name prefix first). A custom `filter`
   * keeps the original order.
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
  /** Accessible name for the search field's clear button. Default: "Clear search". */
  clearLabel?: string;
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
  clearLabel = 'Clear search',
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
        clearLabel={clearLabel}
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
    | 'clearLabel'
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
  clearLabel,
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

  // Consecutive results with the same `group` form one section.
  // While searching, groups flatten into one list ranked by match closeness.
  const searching = hasSearchTerms(query);
  const sections = useMemo(() => {
    const out: {
      group?: string;
      groupLabel?: ReactNode;
      start: number;
      items: QuickSwitchItem[];
    }[] = [];
    results.forEach((item, index) => {
      const last = out[out.length - 1];
      const group = searching ? undefined : item.group;
      if (last && last.group === group) {
        last.items.push(item);
      } else {
        out.push({
          group,
          groupLabel: searching ? undefined : item.groupLabel,
          start: index,
          items: [item],
        });
      }
    });
    return out;
  }, [results, searching]);

  const count = results.length;
  const active = count === 0 ? -1 : Math.min(activeIndex, count - 1);

  useEffect(() => {
    if (active < 0) return;
    listRef.current
      ?.querySelector<HTMLElement>(`#${CSS.escape(optionId(active))}`)
      ?.scrollIntoView?.({ block: 'nearest' });
    // optionId is derived from baseId, which is stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, results]);

  function updateQuery(next: string) {
    setQuery(next);
    setActiveIndex(0);
    onQueryChange?.(next);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing) return;
    switch (event.key) {
      case 'Escape':
        // A host that already handled Escape (defaultPrevented) keeps the dialog open.
        if (event.defaultPrevented) break;
        // SearchInput would clear a non-empty query on Escape and mark it
        // handled, which stops Modal closing; the hint promises dismiss.
        event.preventDefault();
        onClose();
        break;
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
          clearLabel={clearLabel}
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
          {sections.map((section, sectionIndex) => {
            const headingId = `${baseId}-group-${sectionIndex}`;
            const grouped = section.group != null;
            return (
              <li key={sectionIndex} role="presentation">
                {sectionIndex > 0 && <PopoverMenuDivider />}
                {grouped && (
                  <MenuGroupHeading
                    id={headingId}
                    className={styles['quick-switch-modal__heading']}
                    label={section.groupLabel ?? section.group}
                  />
                )}
                <ul
                  className={styles['quick-switch-modal__group']}
                  role={grouped ? 'group' : 'presentation'}
                  aria-labelledby={grouped ? headingId : undefined}
                >
                  {section.items.map((item, offset) => {
                    const index = section.start + offset;
                    return (
                      <li
                        key={item.id}
                        role="presentation"
                        onMouseMove={() =>
                          index !== active && setActiveIndex(index)
                        }
                      >
                        <MenuItem
                          id={optionId(index)}
                          role="option"
                          tabIndex={-1}
                          aria-selected={index === active}
                          label={item.label ?? item.name}
                          // The emoji sits in the (hidden) leading slot, so
                          // the accessible name carries it.
                          aria-label={
                            item.leadingEmoji && !item.label
                              ? [
                                  item.leadingEmoji,
                                  item.name,
                                  item.secondaryLabel,
                                ]
                                  .filter(Boolean)
                                  .join(' ')
                              : undefined
                          }
                          className={styles['quick-switch-modal__option']}
                          secondaryLabel={item.secondaryLabel}
                          secondaryLabelPosition="inline"
                          leadingVisual={
                            item.leadingVisual ??
                            (item.leadingEmoji ? (
                              <span
                                className={styles['quick-switch-modal__emoji']}
                              >
                                {item.leadingEmoji}
                              </span>
                            ) : (
                              <Icon glyph={<GlobeIcon />} />
                            ))
                          }
                          active={index === active}
                          // Focus stays in the input (aria-activedescendant).
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => onSelect(item)}
                        />
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      )}
    </Modal>
  );
}
