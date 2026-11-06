import type { HTMLAttributes, ReactNode } from 'react';
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
  lastReplyTime?: ReactNode;
  /** Called when Reply is clicked. */
  onReply?: () => void;
  /** Called when Follow/Following is clicked. */
  onFollowToggle?: () => void;
  /** Hover / active state for button highlight. Default: false. */
  hovered?: boolean;
  /** Optional CSS class name. */
  className?: string;
  /** Visible reply count. Default: `{count} reply` / `{count} replies`. */
  formatReplyCount?: (count: number) => ReactNode;
  /** Accessible name for the reply button. Default: `{count} reply` / `{count} replies`. */
  formatReplyLabel?: (count: number) => string;
  /** Visually hidden mention hint. Default: `{count} mention(s)`. */
  formatMentionLabel?: (count: number) => ReactNode;
  /** Visually hidden unread hint. Default: "Unread replies". */
  unreadLabel?: ReactNode;
  /** Visible follow button text when not following. Default: "Follow". */
  followLabel?: ReactNode;
  /** Visible follow button text when following. Default: "Following". */
  followingLabel?: ReactNode;
  /** Accessible name for the follow button when not following. Default: "Follow thread". */
  followAriaLabel?: string;
  /** Accessible name for the follow button when following. Default: "Unfollow thread". */
  unfollowAriaLabel?: string;
}

const defaultFormatReplies = (count: number) =>
  `${count} ${count === 1 ? 'reply' : 'replies'}`;
const defaultFormatMentions = (count: number) =>
  `${count} mention${count === 1 ? '' : 's'}`;

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
  formatReplyCount = defaultFormatReplies,
  formatReplyLabel = defaultFormatReplies,
  formatMentionLabel = defaultFormatMentions,
  unreadLabel = 'Unread replies',
  followLabel = 'Follow',
  followingLabel = 'Following',
  followAriaLabel = 'Follow thread',
  unfollowAriaLabel = 'Unfollow thread',
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
      ? formatMentionLabel(mentionCount)
      : badge === 'unread'
        ? unreadLabel
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
          {(badge === 'unread' || badge === 'mention') && (
            <div
              className={styles['thread-footer__badge-container']}
              aria-hidden
            >
              {badge === 'unread' && (
                <span className={styles['thread-footer__unread-dot']} />
              )}
              {badge === 'mention' && (
                <span className={styles['thread-footer__mention-badge']}>
                  <MentionBadge
                    count={mentionCount}
                    location="channel"
                    size="medium"
                  />
                </span>
              )}
            </div>
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
            aria-label={formatReplyLabel(replyCount)}
            leadingIcon={<Icon size="12" glyph={<ReplyOutlineIcon />} />}
          >
            <span className={styles['thread-footer__btn-label']}>
              {formatReplyCount(replyCount)}
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
            aria-label={following ? unfollowAriaLabel : followAriaLabel}
          >
            {following ? followingLabel : followLabel}
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
