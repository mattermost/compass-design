import type { MouseEvent } from 'react';
import GlobeIcon from '@mattermost/compass-icons/components/globe';
import LockOutlineIcon from '@mattermost/compass-icons/components/lock-outline';
import MessageTextOutlineIcon from '@mattermost/compass-icons/components/message-text-outline';
import SendOutlineIcon from '@mattermost/compass-icons/components/send-outline';
import ChartLineIcon from '@mattermost/compass-icons/components/chart-line';
import CircleMultipleOutlineIcon from '@mattermost/compass-icons/components/circle-multiple-outline';
import PhoneInTalkIcon from '@mattermost/compass-icons/components/phone-in-talk';
import DotsVerticalIcon from '@mattermost/compass-icons/components/dots-vertical';
import DialpadIcon from '@mattermost/compass-icons/components/dialpad';
import UserAvatar from '@/components/UserAvatar/UserAvatar';
import MentionBadge from '@/components/MentionBadge/MentionBadge';
import IconButton from '@/components/IconButton/IconButton';
import styles from './ChannelSidebarItem.module.scss';

export type ChannelSidebarItemLeadingVisual =
  | 'public'
  | 'private'
  | 'group-message'
  | 'direct-message'
  | 'drafts'
  | 'insights'
  | 'threads'
  | 'dial-pad';

export type ChannelSidebarItemStatus = 'read' | 'unread' | 'mention';

export interface ChannelSidebarItemProps {
  className?: string;
  /** Channel or user display name. */
  name: string;
  /**
   * Text-only row (e.g. System Console navigation): no channel glyph or
   * overflow menu; name aligns with channel sidebar label padding.
   */
  hideLeadingVisual?: boolean;
  /** Leading visual type. Default: Public. Ignored when `hideLeadingVisual`. */
  leadingVisual?: ChannelSidebarItemLeadingVisual;
  /** Read/unread/mention state. Default: Read. */
  status?: ChannelSidebarItemStatus;
  /** Highlighted as the currently active item. */
  active?: boolean;
  /** Muted channel — reduces visual prominence. */
  muted?: boolean;
  /** Shows a call-in-progress indicator on the right. */
  callActive?: boolean;
  /** Shows the shared-channel icon after the name. */
  sharedChannel?: boolean;
  /** Mention count shown in the badge when status='mention'. */
  mentionCount?: number;
  /** Member count shown in the group icon when leadingVisual='group-message'. */
  memberCount?: number;
  /** Avatar image URL for leadingVisual='direct-message'. */
  avatarSrc?: string;
  /** Avatar alt text for leadingVisual='direct-message'. */
  avatarAlt?: string;
  /** Shows status badge on the avatar when leadingVisual='direct-message'. */
  showAvatarStatus?: boolean;
  /** Custom status emoji shown after the name for leadingVisual='direct-message'. */
  customStatusEmoji?: string;
  onClick?: () => void;
  /** Overflow menu (kebab). Sibling of the channel control so it is keyboard-reachable. */
  onMenuClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

function LeadingVisualContent({
  leadingVisual,
  memberCount,
  avatarSrc,
  showAvatarStatus,
}: {
  leadingVisual: ChannelSidebarItemLeadingVisual;
  memberCount: number | undefined;
  avatarSrc: string | undefined;
  showAvatarStatus: boolean | undefined;
}) {
  switch (leadingVisual) {
    case 'private':
      return <LockOutlineIcon size={16} />;
    case 'group-message':
      return (
        <div className={styles['channel-sidebar-item__group-icon']}>
          {memberCount ?? 2}
        </div>
      );
    case 'direct-message':
      return (
        <UserAvatar
          src={avatarSrc ?? ''}
          alt=""
          size="20"
          status={!!showAvatarStatus}
        />
      );
    case 'drafts':
      return <SendOutlineIcon size={16} />;
    case 'insights':
      return <ChartLineIcon size={16} />;
    case 'threads':
      return <MessageTextOutlineIcon size={16} />;
    case 'dial-pad':
      return <DialpadIcon size={16} />;
    case 'public':
    default:
      return <GlobeIcon size={16} />;
  }
}

/**
 * The Channel Sidebar Item is the row people use to move between channels, DMs, and group
 * messages. It compresses a lot of state — channel type, unread, mention count, mute,
 * in-call — into a single, scannable line.
 */
export default function ChannelSidebarItem({
  className,
  name,
  hideLeadingVisual = false,
  leadingVisual = 'public',
  status = 'read',
  active = false,
  muted = false,
  callActive = false,
  sharedChannel = false,
  mentionCount,
  memberCount,
  avatarSrc,
  showAvatarStatus = false,
  customStatusEmoji,
  onClick,
  onMenuClick,
}: ChannelSidebarItemProps) {
  const isDM = !hideLeadingVisual && leadingVisual === 'direct-message';
  const isDrafts = !hideLeadingVisual && leadingVisual === 'drafts';
  const effectiveStatus = isDrafts && status === 'unread' ? 'read' : status;
  const hasMentionBadge = effectiveStatus === 'mention';
  const isChannelOrDM =
    !hideLeadingVisual &&
    ['public', 'private', 'group-message', 'direct-message'].includes(
      leadingVisual,
    );

  const rootClass = [
    styles['channel-sidebar-item'],
    hideLeadingVisual ? styles['channel-sidebar-item--text-only'] : '',
    active ? styles['channel-sidebar-item--active'] : '',
    muted ? styles['channel-sidebar-item--muted'] : '',
    styles[`channel-sidebar-item--status-${effectiveStatus.toLowerCase()}`],
    isDrafts ? styles['channel-sidebar-item--drafts'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const iconContainerClass = [
    styles['channel-sidebar-item__icon-container'],
    isDM ? styles['channel-sidebar-item__icon-container--dm'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const rightClass = styles['channel-sidebar-item__right'];

  const statusHint =
    effectiveStatus === 'mention'
      ? `${mentionCount ?? 1} mention${(mentionCount ?? 1) === 1 ? '' : 's'}`
      : effectiveStatus === 'unread'
        ? 'unread'
        : undefined;

  return (
    <div className={rootClass}>
      {active && (
        <div className={styles['channel-sidebar-item__active-border']} />
      )}
      <button
        type="button"
        className={styles['channel-sidebar-item__left']}
        onClick={onClick}
        aria-current={active ? true : undefined}
      >
        {!hideLeadingVisual && (
          <div className={iconContainerClass} aria-hidden>
            <LeadingVisualContent
              leadingVisual={leadingVisual}
              memberCount={memberCount}
              avatarSrc={avatarSrc}
              showAvatarStatus={showAvatarStatus}
            />
          </div>
        )}
        <div className={styles['channel-sidebar-item__content']}>
          <span className={styles['channel-sidebar-item__name']}>{name}</span>
          {statusHint && (
            <span className={styles['channel-sidebar-item__status-hint']}>
              {statusHint}
            </span>
          )}
          {sharedChannel && (
            <span
              className={styles['channel-sidebar-item__shared-icon']}
              aria-hidden
            >
              <CircleMultipleOutlineIcon size={12} />
            </span>
          )}
          {isDM && customStatusEmoji && (
            <span
              className={styles['channel-sidebar-item__custom-status']}
              aria-hidden
            >
              {customStatusEmoji}
            </span>
          )}
        </div>
      </button>
      <div className={rightClass}>
        {callActive && (
          <div className={styles['channel-sidebar-item__call']} aria-hidden>
            <PhoneInTalkIcon size={12} />
          </div>
        )}
        {hasMentionBadge && (
          <span
            className={styles['channel-sidebar-item__mention-badge']}
            aria-hidden
          >
            <MentionBadge
              count={mentionCount ?? 1}
              location="sidebar"
              size="medium"
            />
          </span>
        )}
        {isChannelOrDM && (
          <span className={styles['channel-sidebar-item__menu-button']}>
            <IconButton
              className={styles['channel-sidebar-item__menu-icon']}
              size="x-small"
              style="inverted"
              icon={<DotsVerticalIcon size={12} />}
              aria-label="Channel options"
              onClick={(e) => {
                e.stopPropagation();
                onMenuClick?.(e);
              }}
            />
          </span>
        )}
      </div>
    </div>
  );
}
