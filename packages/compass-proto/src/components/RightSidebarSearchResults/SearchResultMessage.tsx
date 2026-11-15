import type { ReactNode } from 'react';
import { Button } from '@mattermost/compass-ui/components/button';
import { Message, messageStyles } from '@/components/Message';
import SearchHighlight from './SearchHighlight';
import styles from './SearchResultMessage.module.scss';

export interface SearchResultMessageData {
  id: string;
  avatarSrc?: string;
  avatarAlt: string;
  username: string;
  timestamp: string;
  /** Channel (or DM) the message was posted in. */
  channelLabel: ReactNode;
  /** Team shown muted after the channel. Omit for DMs or single-team servers. */
  teamLabel?: ReactNode;
  /** Message text. A string has the search terms highlighted; a node renders as given. */
  body: ReactNode;
  /** Shows the Pinned + Saved row above the message. */
  pinned?: boolean;
  saved?: boolean;
}

export interface SearchResultMessageProps {
  result: SearchResultMessageData;
  /** Terms to highlight in a string `body`. */
  terms?: readonly string[];
  /** Called when the jump link is pressed. */
  onJump?: (result: SearchResultMessageData) => void;
  /** Visible and accessible jump link text. Default: "Jump". */
  jumpLabel?: string;
  className?: string;
}

/**
 * One RHS search result: channel context line with a jump link, then the
 * message with search terms highlighted. Shared by search, mentions, saved,
 * pinned. The jump link shows on hover or focus and stays reachable by keyboard.
 */
export default function SearchResultMessage({
  result,
  terms = [],
  onJump,
  jumpLabel = 'Jump',
  className = '',
}: SearchResultMessageProps) {
  const { body } = result;
  const rootClass = [styles['search-result'], className]
    .filter(Boolean)
    .join(' ');
  return (
    <li className={rootClass}>
      <div className={styles['search-result__context']}>
        <span className={styles['search-result__channel']}>
          {result.channelLabel}
        </span>
        {result.teamLabel != null && (
          <span className={styles['search-result__team']}>
            {result.teamLabel}
          </span>
        )}
        <Button
          emphasis="tertiary"
          size="x-small"
          className={styles['search-result__jump']}
          onClick={() => onJump?.(result)}
        >
          {jumpLabel}
        </Button>
      </div>
      <Message
        avatarSrc={result.avatarSrc}
        avatarAlt={result.avatarAlt}
        username={result.username}
        timestamp={result.timestamp}
        showMessageActions={false}
        showPinnedSavedIndicators={Boolean(result.pinned || result.saved)}
      >
        {typeof body === 'string' ? (
          <p className={messageStyles['message__body-text']}>
            <SearchHighlight text={body} terms={terms} />
          </p>
        ) : (
          body
        )}
      </Message>
    </li>
  );
}
