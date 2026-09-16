import type { HTMLAttributes } from 'react';
import IconButton from '@/components/IconButton/IconButton';
import Icon from '@/components/Icon/Icon';
import ReactionButton from '@/components/ReactionButton/ReactionButton';
import CheckCircleOutlineIcon from '@mattermost/compass-icons/components/check-circle-outline';
import EmoticonPlusOutlineIcon from '@mattermost/compass-icons/components/emoticon-plus-outline';
import styles from './ReactionsRow.module.scss';

export interface ReactionItem {
  emoji: string;
  count: number;
  /** Whether the current user reacted with this emoji. */
  byCurrentUser?: boolean;
}

export interface ReactionsRowProps extends HTMLAttributes<HTMLDivElement> {
  /** List of reactions to display. */
  reactions?: ReactionItem[];
  /** Whether to show the add-reaction button. Default: false. */
  showAddReaction?: boolean;
  /** Whether to show the acknowledge button. */
  acknowledged?: boolean;
  /** Acknowledge count. */
  acknowledgeCount?: number;
  /** Whether the current user has acknowledged. Default: false. */
  currentUserAcknowledged?: boolean;
  /** Called when add-reaction is clicked. */
  onAddReaction?: () => void;
  /** Called when a Reaction Button is clicked. */
  onReactionClick?: (emoji: string) => void;
  /** Called when the acknowledge button is clicked. */
  onAcknowledge?: () => void;
  /** Optional CSS class name. */
  className?: string;
}

const DEFAULT_REACTIONS: ReactionItem[] = [
  { emoji: '👍', count: 1 },
  { emoji: '😀', count: 4 },
  { emoji: '🙌', count: 1 },
];

/**
 * Reactions Row is the strip of Reaction Buttons below a message — the lightest weight way to
 * respond, applaud, or acknowledge without adding to the thread. The component handles the
 * count, the "this is mine" highlight, and the add-reaction affordance.
 */
export default function ReactionsRow({
  reactions = DEFAULT_REACTIONS,
  showAddReaction = false,
  acknowledged = false,
  acknowledgeCount = 0,
  currentUserAcknowledged = false,
  onAddReaction,
  onReactionClick,
  onAcknowledge,
  className = '',
  ...rest
}: ReactionsRowProps) {
  const rootClass = [styles['reactions-row'], className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClass} {...rest}>
      {/* Acknowledge button */}
      {acknowledged && (
        <button
          type="button"
          className={[
            styles['reactions-row__ack'],
            currentUserAcknowledged
              ? styles['reactions-row__ack--active']
              : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={onAcknowledge}
          aria-pressed={currentUserAcknowledged}
          aria-label="Acknowledge message"
        >
          <span className={styles['reactions-row__ack-icon']} aria-hidden>
            <Icon size="16" glyph={<CheckCircleOutlineIcon />} />
          </span>
          {currentUserAcknowledged ? (
            <span className={styles['reactions-row__ack-count']}>
              {acknowledgeCount}
            </span>
          ) : (
            <span className={styles['reactions-row__ack-label']}>
              Acknowledge
            </span>
          )}
        </button>
      )}

      {/* Reaction buttons */}
      <div className={styles['reactions-row__buttons']}>
        {reactions.map(({ emoji, count, byCurrentUser }) => (
          <ReactionButton
            key={emoji}
            emoji={emoji}
            count={count}
            byCurrentUser={byCurrentUser}
            onClick={() => onReactionClick?.(emoji)}
          />
        ))}

        {/* Add reaction button */}
        {showAddReaction && (
          <IconButton
            aria-label="Add reaction"
            className={styles['reactions-row__add-reaction']}
            size="x-small"
            onClick={onAddReaction}
            icon={<Icon size="16" glyph={<EmoticonPlusOutlineIcon />} />}
          />
        )}
      </div>
    </div>
  );
}
