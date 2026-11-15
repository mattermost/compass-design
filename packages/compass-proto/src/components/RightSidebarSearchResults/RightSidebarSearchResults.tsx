import type { ReactNode } from 'react';
import { EmptyState } from '@mattermost/compass-ui/components/empty-state';
import MentionsEmptyIllustration from '@mattermost/compass-ui/illustrations/mentions-empty';
import MessageSearchEmptyIllustration from '@mattermost/compass-ui/illustrations/message-search-empty';
import PinnedEmptyIllustration from '@mattermost/compass-ui/illustrations/pinned-empty';
import SavedEmptyIllustration from '@mattermost/compass-ui/illustrations/saved-empty';
import SearchResultMessage, {
  type SearchResultMessageData,
} from './SearchResultMessage';
import styles from './RightSidebarSearchResults.module.scss';

export type RightSidebarSearchResultsKind =
  | 'search'
  | 'mentions'
  | 'saved'
  | 'pinned';

export interface RightSidebarSearchResultsProps {
  /** Which list this is. Only picks the default empty-state copy. Default: `search`. */
  kind?: RightSidebarSearchResultsKind;
  results: SearchResultMessageData[];
  /** Terms to highlight in each result. For `search`, the query words. */
  terms?: readonly string[];
  /** Called when a result's Jump button is pressed. */
  onJump?: (result: SearchResultMessageData) => void;
  /** Replaces the count line ("3 results"). Receives the number of results. */
  countLabel?: (count: number) => ReactNode;
  /** Accessible name for the results list. Default: "Search results". */
  listLabel?: string;
  jumpLabel?: string;
  /** Accessible name for each Jump button. Default: "Jump to message". */
  jumpAriaLabel?: string;
  /** Empty-state title. Defaults per `kind`. */
  emptyTitle?: ReactNode;
  /** Empty-state description. Defaults per `kind`. */
  emptyDescription?: ReactNode;
  className?: string;
}

const EMPTY_COPY: Record<
  RightSidebarSearchResultsKind,
  { title: string; description: string }
> = {
  search: {
    title: 'No results found',
    description:
      'Check the spelling or try a different search. Use quotes to match an exact phrase.',
  },
  mentions: {
    title: 'No mentions yet',
    description:
      'Messages that mention you or your keywords will show up here.',
  },
  saved: {
    title: 'No saved messages yet',
    description:
      'Save a message to follow up on it later. Only you can see it.',
  },
  pinned: {
    title: 'No pinned messages yet',
    description:
      'Pin important messages so everyone in the channel can find them.',
  },
};

const EMPTY_ILLUSTRATION: Record<
  RightSidebarSearchResultsKind,
  () => ReactNode
> = {
  search: () => <MessageSearchEmptyIllustration />,
  mentions: () => <MentionsEmptyIllustration />,
  saved: () => <SavedEmptyIllustration />,
  pinned: () => <PinnedEmptyIllustration />,
};

const defaultCount = (count: number) =>
  `${count} ${count === 1 ? 'result' : 'results'}`;

/**
 * RHS body for search results, mentions, saved and pinned messages: a count
 * line, then one {@link SearchResultMessage} per result, or an empty state.
 * Pair with `RightSidebar alignBody="stretch"` + `RightSidebarHeader` (title per kind); stretch lets the empty state center vertically.
 */
export default function RightSidebarSearchResults({
  kind = 'search',
  results,
  terms = [],
  onJump,
  countLabel = defaultCount,
  listLabel = 'Search results',
  jumpLabel,
  jumpAriaLabel,
  emptyTitle,
  emptyDescription,
  className = '',
}: RightSidebarSearchResultsProps) {
  const rootClass = [styles['right-sidebar-search-results'], className]
    .filter(Boolean)
    .join(' ');

  if (results.length === 0) {
    const copy = EMPTY_COPY[kind];
    return (
      <div className={rootClass}>
        <EmptyState
          className={styles['right-sidebar-search-results__empty']}
          illustration={{ children: EMPTY_ILLUSTRATION[kind]() }}
          title={emptyTitle ?? copy.title}
          titleLevel={3}
          description={emptyDescription ?? copy.description}
        />
      </div>
    );
  }

  return (
    <div className={rootClass}>
      <p
        className={styles['right-sidebar-search-results__count']}
        role="status"
      >
        {countLabel(results.length)}
      </p>
      <ul
        className={styles['right-sidebar-search-results__list']}
        aria-label={listLabel}
      >
        {results.map((result) => (
          <SearchResultMessage
            key={result.id}
            result={result}
            terms={terms}
            onJump={onJump}
            jumpLabel={jumpLabel}
            jumpAriaLabel={jumpAriaLabel}
          />
        ))}
      </ul>
    </div>
  );
}
