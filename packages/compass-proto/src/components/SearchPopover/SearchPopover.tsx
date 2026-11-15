import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { SuggestionList } from '@mattermost/compass-ui/components/suggestion-list';
import {
  buildSearchSections,
  resolveSelection,
  type SearchPopoverData,
  type SearchPopoverLabels,
  type SearchPopoverSelection,
} from './searchSections';
import styles from './SearchPopover.module.scss';

export interface SearchPopoverProps
  extends
    SearchPopoverData,
    SearchPopoverLabels,
    Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onSelect'> {
  /** Called when a row is clicked. Keyboard accept comes from `useSearchPopover`. */
  onSelect?: (selection: SearchPopoverSelection) => void;
  /** Highlighted row (from `useSearchPopover`). */
  activeValue?: string;
  onActiveValueChange?: (value: string) => void;
  /** Id of the listbox, for the field's `aria-controls`. */
  listboxId?: string;
}

/**
 * The panel under the global search field: search modifiers (hints), completions
 * for the term being typed, and recent searches, as one listbox of Compass rows.
 * Presentational — the host owns open state, outside click and where it sits
 * (`GlobalHeader` anchors it under the field). Pair with `useSearchPopover` for
 * the field's keyboard and combobox wiring. Renders nothing when empty.
 */
const SearchPopover = forwardRef<HTMLDivElement, SearchPopoverProps>(
  function SearchPopover(
    {
      hints,
      suggestions,
      recent,
      onRemoveRecent,
      hintsLabel,
      suggestionsLabel,
      recentLabel,
      removeRecentLabel,
      listboxLabel = 'Search suggestions',
      onSelect,
      className,
      ...rest
    },
    ref,
  ) {
    const data = { hints, suggestions, recent, onRemoveRecent };
    const sections = buildSearchSections(data, {
      hintsLabel,
      suggestionsLabel,
      recentLabel,
      removeRecentLabel,
    });
    if (sections.length === 0) return null;
    return (
      <SuggestionList
        {...rest}
        ref={ref}
        className={[styles['search-popover'], className]
          .filter(Boolean)
          .join(' ')}
        sections={sections}
        listboxLabel={listboxLabel}
        onSelect={(option) => {
          const selection = resolveSelection(option.value, data);
          if (selection) onSelect?.(selection);
        }}
      />
    );
  },
);

SearchPopover.displayName = 'SearchPopover';

export default SearchPopover;
