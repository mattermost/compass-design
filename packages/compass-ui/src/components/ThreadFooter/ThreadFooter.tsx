import type { HTMLAttributes } from 'react';
import Button from '@/components/Button/Button';
import Icon from '@/components/Icon/Icon';
import ReplyOutlineIcon from '@mattermost/compass-icons/components/reply-outline';
import MentionBadge from '@/components/MentionBadge/MentionBadge';
import UserAvatarGroup, {
  type UserAvatarGroupItem,
} from '@/components/UserAvatarGroup/UserAvatarGroup';
import styles from './ThreadFooter.module.scss';

export type ThreadFooterBadge = 'none' | 'unread' | 'mention';

export interface ThreadFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Reply count. Default: 3. */
  replyCount?: number;
  /** Participant avatars. Rendered with User Avatar Group (first 3 shown, overflow as +N). */
  avatars?: UserAvatarGroupItem[];
  /** Badge variant. Default: None. */
  badge?: ThreadFooterBadge;
  /** Shown when `badge` is Mention. Default: 1. */
  mentionCount?: number;
  /** Whether the current user is following the thread. Default: false. */
  following?: boolean;
  /** Last reply timestamp label. Shown on row hover when following. */
  lastReplyTime?: string;
  /** Called when Reply is clicked. */
  onReply?: () => void;
  /** Called when Follow/Following is clicked. */
  onFollowToggle?: () => void;
  /** Hover / active state for button highlight. Default: false. */
  hovered?: boolean;
  /** Optional CSS class name. */
  className?: string;
}

/**
 * The Thread Footer is the reply summary bar at the bottom of a message. It shows
 * participants, reply count, follow state, and last-reply time — the information someone
 * needs to decide whether to dive in.
 */
export default function ThreadFooter({
  replyCount = 3,
  avatars = [],
  badge = 'none',
  mentionCount = 1,
  following = false,
  lastReplyTime,
  onReply,
  onFollowToggle,
  hovered = false,
  className = '',
  ...rest
}: ThreadFooterProps) {
  const rootClass = [
    styles['thread-footer'],
    following ? styles['thread-footer--following'] : '',
    hovered ? styles['thread-footer--hovered'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const badgeStatusHint =
    badge === 'mention'
      ? `${mentionCount} mention${mentionCount === 1 ? '' : 's'}`
      : badge === 'unread'
        ? 'Unread replies'
        : undefined;

  return (
    <div className={rootClass} {...rest}>
      <div className={styles['thread-footer__inner']}>
        <div className={styles['thread-footer__avatars-group']}>
          {badgeStatusHint && (
            <span className={styles['thread-footer__status-hint']}>
              {badgeStatusHint}
            </span>
          )}
          {badge === 'unread' && (
            <span
              className={styles['thread-footer__unread-dot']}
              aria-hidden
            />
          )}
          {badge === 'mention' && (
            <span
              className={styles['thread-footer__mention-badge']}
              aria-hidden
            >
              <MentionBadge
                count={mentionCount}
                location="channel"
                size="medium"
              />
            </span>
          )}

          {avatars.length > 0 && (
            <UserAvatarGroup avatars={avatars} max={3} size="20" />
          )}
        </div>

        {/* Buttons */}
        <div className={styles['thread-footer__buttons']}>
          {/* Reply button */}
          <Button
            emphasis="quaternary"
            size="x-small"
            className={[
              styles['thread-footer__reply-btn'],
              hovered ? styles['thread-footer__reply-btn--hovered'] : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={onReply}
            aria-label={`${replyCount} repl${replyCount === 1 ? 'y' : 'ies'}`}
            leadingIcon={<Icon size="12" glyph={<ReplyOutlineIcon />} />}
          >
            <span className={styles['thread-footer__btn-label']}>
              {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
            </span>
          </Button>

          <div className={styles['thread-footer__divider']} aria-hidden />

          {/* Follow / Following button */}
          <Button
            emphasis="quaternary"
            size="x-small"
            className={[
              styles['thread-footer__follow-btn'],
              following ? styles['thread-footer__follow-btn--following'] : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={onFollowToggle}
            aria-pressed={following}
            aria-label={following ? 'Unfollow thread' : 'Follow thread'}
          >
            {following ? 'Following' : 'Follow'}
          </Button>

          {/* Last reply time — revealed on row hover when following */}
          {following && lastReplyTime && (
            <div className={styles['thread-footer__last-reply-group']}>
              <div className={styles['thread-footer__divider']} aria-hidden />
              <span className={styles['thread-footer__last-reply']}>
                {lastReplyTime}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
