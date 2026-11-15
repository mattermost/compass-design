import type { ReactNode } from 'react';
import ClockOutlineIcon from '@mattermost/compass-icons/components/clock-outline';
import CloseIcon from '@mattermost/compass-icons/components/close';
import PlusBoxOutlineIcon from '@mattermost/compass-icons/components/plus-box-outline';
import { Icon } from '@mattermost/compass-ui/components/icon';
import type {
  SuggestionOption,
  SuggestionSection,
} from '@mattermost/compass-ui/components/suggestion-list';
import styles from './SearchPopover.module.scss';

/** A search modifier the user can add, e.g. `From:` + "a specific user". */
export interface SearchPopoverHint {
  id: string;
  /** The modifier itself, shown bold, e.g. `From:`. Accepts translated nodes. */
  modifier: ReactNode;
  /** What it does, e.g. "a specific user". Accepts translated nodes. */
  description: ReactNode;
}

/** A completion for the term being typed (a user, a channel). */
export interface SearchPopoverSuggestion {
  id: string;
  label: ReactNode;
  secondaryLabel?: ReactNode;
  /** A 24px `UserAvatar`, `TeamAvatar` or `<Icon glyph={…} />`. */
  leadingVisual?: ReactNode;
  trailingLabel?: ReactNode;
}

/** A past search. `query` is the text put back in the field when chosen. */
export interface SearchPopoverRecent {
  id: string;
  query: string;
}

export type SearchPopoverSelection =
  | { kind: 'hint'; item: SearchPopoverHint }
  | { kind: 'suggestion'; item: SearchPopoverSuggestion }
  | { kind: 'recent'; item: SearchPopoverRecent };

/** Translatable copy. Every string has an English default. */
export interface SearchPopoverLabels {
  /** Heading above the modifiers. Default: "Search options". */
  hintsLabel?: ReactNode;
  /** Heading above completions. Default: "Suggestions". */
  suggestionsLabel?: ReactNode;
  /** Heading above past searches. Default: "Recent searches". */
  recentLabel?: ReactNode;
  /** Accessible name of a recent row's remove control. Default: "Remove recent search". */
  removeRecentLabel?: string;
  /** Accessible name of the listbox. Default: "Search suggestions". */
  listboxLabel?: string;
}

export interface SearchPopoverData {
  hints?: SearchPopoverHint[];
  suggestions?: SearchPopoverSuggestion[];
  recent?: SearchPopoverRecent[];
  /** Called when a recent row's remove control is pressed. */
  onRemoveRecent?: (item: SearchPopoverRecent) => void;
}

const HINT = 'hint:';
const SUGGESTION = 'suggestion:';
const RECENT = 'recent:';

export function buildSearchSections(
  { hints, suggestions, recent, onRemoveRecent }: SearchPopoverData,
  {
    hintsLabel = 'Search options',
    suggestionsLabel = 'Suggestions',
    recentLabel = 'Recent searches',
    removeRecentLabel = 'Remove recent search',
  }: SearchPopoverLabels = {},
): SuggestionSection[] {
  const sections: SuggestionSection[] = [];
  if (suggestions?.length) {
    sections.push({
      key: 'suggestions',
      heading: suggestionsLabel,
      options: suggestions.map(
        (s): SuggestionOption => ({
          value: SUGGESTION + s.id,
          label: s.label,
          secondaryLabel: s.secondaryLabel,
          leadingVisual: s.leadingVisual,
          trailingLabel: s.trailingLabel,
        }),
      ),
    });
  }
  if (hints?.length) {
    sections.push({
      key: 'hints',
      heading: hintsLabel,
      options: hints.map(
        (h): SuggestionOption => ({
          value: HINT + h.id,
          label: (
            <>
              <span className={styles['search-popover__modifier']}>
                {h.modifier}
              </span>{' '}
              {h.description}
            </>
          ),
          leadingVisual: <Icon glyph={<PlusBoxOutlineIcon />} />,
        }),
      ),
    });
  }
  if (recent?.length) {
    sections.push({
      key: 'recent',
      heading: recentLabel,
      options: recent.map(
        (r): SuggestionOption => ({
          value: RECENT + r.id,
          label: r.query,
          leadingVisual: <Icon glyph={<ClockOutlineIcon />} />,
          // A pointer shortcut only: keyboard users remove the active row with
          // Shift+Delete, so this stays out of the a11y tree.
          trailingLabel: (
            // A span, not a button: the row is already a <button>.
            <span
              aria-hidden
              data-search-remove
              title={removeRecentLabel}
              className={styles['search-popover__remove']}
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                e.stopPropagation();
                onRemoveRecent?.(r);
              }}
            >
              <Icon size="16" glyph={<CloseIcon />} />
            </span>
          ),
        }),
      ),
    });
  }
  return sections;
}

export function resolveSelection(
  value: string,
  { hints, suggestions, recent }: SearchPopoverData,
): SearchPopoverSelection | undefined {
  if (value.startsWith(HINT)) {
    const item = hints?.find((h) => HINT + h.id === value);
    return item && { kind: 'hint', item };
  }
  if (value.startsWith(SUGGESTION)) {
    const item = suggestions?.find((s) => SUGGESTION + s.id === value);
    return item && { kind: 'suggestion', item };
  }
  const item = recent?.find((r) => RECENT + r.id === value);
  return item && { kind: 'recent', item };
}

export const isRecentValue = (value: string | undefined) =>
  value?.startsWith(RECENT) ?? false;
