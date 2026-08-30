import GlobeIcon from '@mattermost/compass-icons/components/globe';
import LockOutlineIcon from '@mattermost/compass-icons/components/lock-outline';
import MessageTextOutlineIcon from '@mattermost/compass-icons/components/message-text-outline';
import SendOutlineIcon from '@mattermost/compass-icons/components/send-outline';
import ChartLineIcon from '@mattermost/compass-icons/components/chart-line';
import CircleMultipleOutlineIcon from '@mattermost/compass-icons/components/circle-multiple-outline';
import PhoneInTalkIcon from '@mattermost/compass-icons/components/phone-in-talk';
import DialpadIcon from '@mattermost/compass-icons/components/dialpad';
import { UserAvatar } from '@mattermost/compass-ui/components/user-avatar';
import { MentionBadge } from '@mattermost/compass-ui/components/mention-badge';
import styles from './MobileChannelSidebarItem.module.scss';

export type MobileChannelSidebarItemLeadingVisual =
  | 'public'
  | 'private'
  | 'group-message'
  | 'direct-message'
  | 'drafts'
  | 'insights'
  | 'threads'
  | 'dial-pad';

export type MobileChannelSidebarItemStatus = 'read' | 'unread' | 'mention';

export interface MobileChannelSidebarItemProps {
  className?: string;
  /** Channel or user display name. */
  name: string;
  /**
   * Text-only row: no channel glyph; name aligns with label padding.
   */
  hideLeadingVisual?: boolean;
  /** Leading visual type. Default: Public. Ignored when `hideLeadingVisual`. */
  leadingVisual?: MobileChannelSidebarItemLeadingVisual;
  /** Read/unread/mention state. Default: Read. */
  status?: MobileChannelSidebarItemStatus;
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
}

function LeadingVisualContent({
  leadingVisual,
  memberCount,
  avatarSrc,
  avatarAlt,
  showAvatarStatus,
}: {
  leadingVisual: MobileChannelSidebarItemLeadingVisual;
  memberCount: number | undefined;
  avatarSrc: string | undefined;
  avatarAlt: string | undefined;
  showAvatarStatus: boolean | undefined;
}) {
  switch (leadingVisual) {
    case 'private':
      return <LockOutlineIcon size={20} />;
    case 'group-message':
      return (
        <div className={styles['mobile-channel-sidebar-item__group-icon']}>
          {memberCount ?? 2}
        </div>
      );
    case 'direct-message':
      return (
        <UserAvatar
          src={avatarSrc ?? ''}
          alt={avatarAlt ?? ''}
          size='24'
          status={!!showAvatarStatus}
        />
      );
    case 'drafts':
      return <SendOutlineIcon size={20} />;
    case 'insights':
      return <ChartLineIcon size={20} />;
    case 'threads':
      return <MessageTextOutlineIcon size={20} />;
    case 'dial-pad':
      return <DialpadIcon size={20} />;
    case 'public':
    default:
      return <GlobeIcon size={20} />;
  }
}

/**
 * Touch-sized sibling of desktop Channel Sidebar Item.
 */
export default function MobileChannelSidebarItem({
  className,
  name,
  hideLeadingVisual = false,
  leadingVisual = 'public',
  status = 'read',
  muted = false,
  callActive = false,
  sharedChannel = false,
  mentionCount,
  memberCount,
  avatarSrc,
  avatarAlt,
  showAvatarStatus = false,
  customStatusEmoji,
  onClick,
}: MobileChannelSidebarItemProps) {
  const isDM = !hideLeadingVisual && leadingVisual === 'direct-message';
  const isDrafts = !hideLeadingVisual && leadingVisual === 'drafts';
  const effectiveStatus = isDrafts && status === 'unread' ? 'read' : status;
  const hasMentionBadge = effectiveStatus === 'mention';

  const rootClass = [
    styles['mobile-channel-sidebar-item'],
    hideLeadingVisual
      ? styles['mobile-channel-sidebar-item--text-only']
      : '',
    muted ? styles['mobile-channel-sidebar-item--muted'] : '',
    styles[
      `mobile-channel-sidebar-item--status-${effectiveStatus.toLowerCase()}`
    ],
    isDrafts ? styles['mobile-channel-sidebar-item--drafts'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const iconContainerClass = [
    styles['mobile-channel-sidebar-item__icon-container'],
    isDM ? styles['mobile-channel-sidebar-item__icon-container--dm'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      role='button'
      tabIndex={0}
      className={rootClass}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className={styles['mobile-channel-sidebar-item__left']}>
        {!hideLeadingVisual && (
          <div className={iconContainerClass}>
            <LeadingVisualContent
              leadingVisual={leadingVisual}
              memberCount={memberCount}
              avatarSrc={avatarSrc}
              avatarAlt={avatarAlt}
              showAvatarStatus={showAvatarStatus}
            />
          </div>
        )}
        <div className={styles['mobile-channel-sidebar-item__content']}>
          <span className={styles['mobile-channel-sidebar-item__name']}>
            {name}
          </span>
          {sharedChannel && (
            <span className={styles['mobile-channel-sidebar-item__shared-icon']}>
              <CircleMultipleOutlineIcon size={16} />
            </span>
          )}
          {isDM && customStatusEmoji && (
            <span
              className={styles['mobile-channel-sidebar-item__custom-status']}
            >
              {customStatusEmoji}
            </span>
          )}
        </div>
      </div>
      <div className={styles['mobile-channel-sidebar-item__right']}>
        {callActive && (
          <div className={styles['mobile-channel-sidebar-item__call']}>
            <PhoneInTalkIcon size={16} />
          </div>
        )}
        {hasMentionBadge && (
          <span
            className={styles['mobile-channel-sidebar-item__mention-badge']}
          >
            <MentionBadge
              count={mentionCount ?? 1}
              location='sidebar'
              size='medium'
            />
          </span>
        )}
      </div>
    </div>
  );
}
