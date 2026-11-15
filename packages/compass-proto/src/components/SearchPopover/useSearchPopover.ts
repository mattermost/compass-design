import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useSuggestionList } from '@mattermost/compass-ui/components/suggestion-list';
import {
  buildSearchSections,
  isRecentValue,
  resolveSelection,
  type SearchPopoverData,
  type SearchPopoverLabels,
  type SearchPopoverSelection,
} from './searchSections';

export interface UseSearchPopoverOptions
  extends SearchPopoverData, SearchPopoverLabels {
  /** Current text in the field. A change drops the highlight, so Enter searches again. */
  query: string;
  /** Whether the popover is showing. Keys are left alone while it is closed. */
  open: boolean;
  /** A row was chosen (Enter on a highlighted row, or a click). The host applies it. */
  onSelect?: (selection: SearchPopoverSelection) => void;
  /** Enter with no row highlighted: run the search for `query`. */
  onSubmit?: (query: string) => void;
  /** Escape. The host closes the popover. */
  onClose?: () => void;
}

/**
 * Field-side wiring for {@link SearchPopover}. Focus stays in the input; no row
 * is highlighted until the user presses an arrow key, so Enter on typed text
 * still searches. Arrows move (wrapping), Enter picks the highlighted row,
 * Escape calls `onClose`, and Shift+Delete removes the highlighted recent search.
 *
 * ```tsx
 * const search = useSearchPopover({ query, open, hints, recent, onSelect, onClose });
 * <input {...search.inputProps} onKeyDown={search.onKeyDown} />
 * {open && <SearchPopover {...search.popoverProps} />}
 * ```
 */
export function useSearchPopover({
  query,
  open,
  hints,
  suggestions,
  recent,
  onRemoveRecent,
  hintsLabel,
  suggestionsLabel,
  recentLabel,
  removeRecentLabel,
  listboxLabel,
  onSelect,
  onSubmit,
  onClose,
}: UseSearchPopoverOptions) {
  const data = { hints, suggestions, recent, onRemoveRecent };
  const labels = {
    hintsLabel,
    suggestionsLabel,
    recentLabel,
    removeRecentLabel,
  };
  const sections = buildSearchSections(data, labels);
  const select = (value: string) => {
    const selection = resolveSelection(value, data);
    if (selection) onSelect?.(selection);
  };

  const list = useSuggestionList({
    sections,
    open,
    selectKeys: ['Enter'],
    onSelect: (option) => select(option.value),
    onClose,
  });

  // The highlight is only "engaged" once the user arrows into the list; typing
  // or reopening resets it (state is tied to the key it was set under).
  const engageKey = `${open}\u0000${query}`;
  const [engagedKey, setEngagedKey] = useState<string>();
  const engaged = engagedKey === engageKey;

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!open || event.defaultPrevented || event.nativeEvent.isComposing)
      return;
    if (event.key === 'Escape') return list.onKeyDown(event);
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      // The first press turns the highlight on: ArrowDown lands on the first
      // row, ArrowUp wraps to the last (the list starts on the first row).
      if (!engaged) {
        setEngagedKey(engageKey);
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          return;
        }
      }
      return list.onKeyDown(event);
    }
    if (
      event.key === 'Delete' &&
      event.shiftKey &&
      engaged &&
      isRecentValue(list.activeValue)
    ) {
      event.preventDefault();
      const selection = resolveSelection(list.activeValue!, data);
      if (selection?.kind === 'recent') onRemoveRecent?.(selection.item);
      return;
    }
    if (event.key === 'Enter' && !engaged) {
      if (
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey
      ) {
        // Handled here, so the header doesn't also fire its Search click.
        event.preventDefault();
        onSubmit?.(query);
      }
      return;
    }
    list.onKeyDown(event);
  };

  const showing = open && sections.length > 0;
  const activeValue = engaged ? list.activeValue : undefined;
  return {
    onKeyDown,
    /** Spread on the search input. */
    inputProps: {
      ...list.inputProps,
      'aria-activedescendant': engaged
        ? list.inputProps['aria-activedescendant']
        : undefined,
      'aria-expanded': showing,
    },
    /** Spread on `SearchPopover`. */
    popoverProps: {
      hints,
      suggestions,
      recent,
      onRemoveRecent,
      ...labels,
      listboxLabel,
      listboxId: list.listboxId,
      activeValue,
      onActiveValueChange: (value: string) => {
        setEngagedKey(engageKey);
        list.setActiveValue(value);
      },
      onSelect: (selection: SearchPopoverSelection) => onSelect?.(selection),
    },
  };
}
