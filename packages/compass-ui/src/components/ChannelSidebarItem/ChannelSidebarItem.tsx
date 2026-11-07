import type { MouseEvent, ReactNode } from 'react';
import GlobeIcon from '@mattermost/compass-icons/components/globe';
import LockOutlineIcon from '@mattermost/compass-icons/components/lock-outline';
import MessageTextOutlineIcon from '@mattermost/compass-icons/components/message-text-outline';
import SendOutlineIcon from '@mattermost/compass-icons/components/send-outline';
import ChartLineIcon from '@mattermost/compass-icons/components/chart-line';
import CircleMultipleOutlineIcon from '@mattermost/compass-icons/components/circle-multiple-outline';
import PhoneInTalkIcon from '@mattermost/compass-icons/components/phone-in-talk';
import DotsVerticalIcon from '@mattermost/compass-icons/components/dots-vertical';
import DialpadIcon from '@mattermost/compass-icons/components/dialpad';
import ChevronDownIcon from '@mattermost/compass-icons/components/chevron-down';
import ChevronRightIcon from '@mattermost/compass-icons/components/chevron-right';
import UserAvatar from '@/components/UserAvatar/UserAvatar';
import MentionBadge from '@/components/MentionBadge/MentionBadge';
import Icon, { IconSlotContext } from '@/components/Icon/Icon';
import IconButton from '@/components/IconButton/IconButton';
import { mergeClassNames, type BuiltInButtonProps } from '@/utils/props';
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
  /** Channel or user display name. Accepts translated nodes. */
  name: ReactNode;
  /**
   * Text-only row (e.g. System Console navigation): no channel glyph or
   * overflow menu; name aligns with channel sidebar label padding.
   */
  hideLeadingVisual?: boolean;
  /**
   * Leading visual. A built-in type string (`'public'`, `'private'`, …) keeps its
   * glyph; any other node (not a string) replaces the icon, like `MenuItem`. Custom
   * nodes render in the same 24px icon column, so the label stays aligned. For an
   * icon use `<Icon glyph={<SomeIcon />} />` — the size (16) comes from context.
   * A 16–24px element such as a 20px avatar is centered in the column.
   * Default: Public. Ignored when `hideLeadingVisual`.
   */
  leadingVisual?: ChannelSidebarItemLeadingVisual | ReactNode;
  /**
   * Custom content for the trailing slot, after the name and before the mention
   * badge / menu button (e.g. a responding indicator). Status-only: on rows with
   * the overflow menu it fades out on hover / focus, like the mention badge, so
   * don't put interactive content in it. `status` styling is independent of it.
   * When omitted, nothing is rendered.
   */
  trailingVisual?: ReactNode;
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
  /** Avatar image URL for leadingVisual='direct-message' (not used with a custom node). */
  avatarSrc?: string;
  /** Avatar alt text for leadingVisual='direct-message'. */
  avatarAlt?: string;
  /** Shows status badge on the avatar when leadingVisual='direct-message' (not used with a custom node). */
  showAvatarStatus?: boolean;
  /** Custom status emoji shown after the name for leadingVisual='direct-message' or a custom leadingVisual node (e.g. your own avatar). */
  customStatusEmoji?: string;
  onClick?: () => void;
  /** Overflow menu (kebab). Sibling of the channel control so it is keyboard-reachable. */
  onMenuClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Visually hidden mention hint. Default: `{count} mention(s)`. */
  formatMentionLabel?: (count: number) => ReactNode;
  /** Visually hidden unread hint. Default: "unread". */
  unreadLabel?: ReactNode;
  /** Accessible name for the overflow menu button. Default: "Channel options". */
  menuLabel?: string;
  /**
   * Interactive controls (e.g. an `IconButton`) shown at the right edge, in the
   * overflow menu's place: it replaces the built-in menu. Unlike
   * `trailingVisual`, actions stay clickable. See `actionsReveal`.
   */
  actions?: ReactNode;
  /**
   * When `actions` show. `hover` (default): hidden until the row is hovered or
   * has focus, like the built-in menu (the mention badge and `trailingVisual`
   * give way). `always`: visible, slightly dimmed, at rest and at full
   * strength on hover / focus; the badge and `trailingVisual` stay visible
   * beside it.
   */
  actionsReveal?: 'hover' | 'always';
  /** Keeps `actions` revealed, e.g. while a menu opened from them is open. */
  actionsOpen?: boolean;
  /** Hides the built-in overflow menu without adding `actions`. */
  hideMenu?: boolean;
  /**
   * Turns the row into the parent of a collapsible group: shows a chevron
   * toggle in the left gutter (revealed on hover / focus) and sets
   * `aria-expanded` on it. The row itself stays a navigation control; the
   * group's list and animation are up to the host. Omit for a normal row.
   */
  expanded?: boolean;
  /** Called with the next state when the chevron toggle is activated. */
  onExpandedChange?: (expanded: boolean) => void;
  /** `id` of the list the toggle controls (`aria-controls`). */
  controlsId?: string;
  /**
   * Accessible name of the toggle. It stays the same in both states;
   * `aria-expanded` carries the state. Default: "Toggle".
   */
  toggleLabel?: string;
  /** Extra attributes for the chevron toggle button. */
  toggleButtonProps?: BuiltInButtonProps;
}

const defaultFormatMentions = (count: number) =>
  `${count} mention${count === 1 ? '' : 's'}`;

function isBuiltInLeadingVisual(
  value: unknown,
): value is ChannelSidebarItemLeadingVisual | undefined {
  // Strings (and omitted) keep today's built-in behavior, including the
  // fallback to the public glyph for unknown strings.
  return value === undefined || typeof value === 'string';
}

function LeadingVisualContent({
  leadingVisual,
  memberCount,
  avatarSrc,
  showAvatarStatus,
}: {
  leadingVisual: ChannelSidebarItemLeadingVisual | undefined;
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
  leadingVisual,
  trailingVisual,
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
  formatMentionLabel = defaultFormatMentions,
  unreadLabel = 'unread',
  menuLabel = 'Channel options',
  actions,
  actionsReveal = 'hover',
  actionsOpen = false,
  hideMenu = false,
  expanded,
  onExpandedChange,
  controlsId,
  toggleLabel = 'Toggle',
  toggleButtonProps,
}: ChannelSidebarItemProps) {
  const isCustomVisual =
    !hideLeadingVisual &&
    leadingVisual !== null &&
    !isBuiltInLeadingVisual(leadingVisual);
  const builtInVisual: ChannelSidebarItemLeadingVisual = isBuiltInLeadingVisual(
    leadingVisual,
  )
    ? (leadingVisual ?? 'public')
    : 'public';
  const isDM =
    !hideLeadingVisual && builtInVisual === 'direct-message' && !isCustomVisual;
  const isDrafts =
    !hideLeadingVisual && builtInVisual === 'drafts' && !isCustomVisual;
  const effectiveStatus = isDrafts && status === 'unread' ? 'read' : status;
  const hasMentionBadge = effectiveStatus === 'mention';
  const isChannelOrDM =
    !hideLeadingVisual &&
    (isCustomVisual ||
      ['public', 'private', 'group-message', 'direct-message'].includes(
        builtInVisual,
      ));

  const hasActions = actions != null && actions !== false;
  const actionsAlways = hasActions && actionsReveal === 'always';
  const showMenu = isChannelOrDM && !hideMenu && !hasActions;
  // Trailing content gives way on hover only when something takes its place.
  const revealsOnHover = showMenu || (hasActions && !actionsAlways);
  const hasToggle = expanded !== undefined;

  const rootClass = [
    styles['channel-sidebar-item'],
    hideLeadingVisual ? styles['channel-sidebar-item--text-only'] : '',
    active ? styles['channel-sidebar-item--active'] : '',
    muted ? styles['channel-sidebar-item--muted'] : '',
    styles[`channel-sidebar-item--status-${effectiveStatus.toLowerCase()}`],
    isDrafts ? styles['channel-sidebar-item--drafts'] : '',
    actionsAlways ? styles['channel-sidebar-item--actions-always'] : '',
    !revealsOnHover ? styles['channel-sidebar-item--no-hover-menu'] : '',
    hasActions && actionsOpen && !actionsAlways
      ? styles['channel-sidebar-item--actions-open']
      : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const iconContainerClass = [
    styles['channel-sidebar-item__icon-container'],
    isDM ? styles['channel-sidebar-item__icon-container--dm'] : '',
    isCustomVisual
      ? styles['channel-sidebar-item__icon-container--custom']
      : '',
  ]
    .filter(Boolean)
    .join(' ');

  const rightClass = styles['channel-sidebar-item__right'];

  const statusHint =
    effectiveStatus === 'mention'
      ? formatMentionLabel(mentionCount ?? 1)
      : effectiveStatus === 'unread'
        ? unreadLabel
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
            {isCustomVisual ? (
              <IconSlotContext.Provider value={{ size: '16' }}>
                {leadingVisual as ReactNode}
              </IconSlotContext.Provider>
            ) : (
              <LeadingVisualContent
                leadingVisual={builtInVisual}
                memberCount={memberCount}
                avatarSrc={avatarSrc}
                showAvatarStatus={showAvatarStatus}
              />
            )}
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
              <Icon glyph={<CircleMultipleOutlineIcon />} size="12" />
            </span>
          )}
          {(isDM || isCustomVisual) && customStatusEmoji && (
            <span
              className={styles['channel-sidebar-item__custom-status']}
              aria-hidden
            >
              {customStatusEmoji}
            </span>
          )}
        </div>
      </button>
      {hasToggle && (
        <button
          type="button"
          {...toggleButtonProps}
          {...(controlsId ? { 'aria-controls': controlsId } : {})}
          className={mergeClassNames(
            styles['channel-sidebar-item__toggle'],
            toggleButtonProps?.className,
          )}
          aria-expanded={expanded}
          aria-label={toggleLabel}
          onClick={(e) => {
            toggleButtonProps?.onClick?.(e);
            onExpandedChange?.(!expanded);
          }}
        >
          <Icon
            glyph={expanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
            size="12"
          />
        </button>
      )}
      <div className={rightClass}>
        {trailingVisual != null && trailingVisual !== false && (
          <span
            className={[
              styles['channel-sidebar-item__trailing-visual'],
              revealsOnHover
                ? styles['channel-sidebar-item__trailing-visual--with-menu']
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <IconSlotContext.Provider value={{ size: '16' }}>
              {trailingVisual}
            </IconSlotContext.Provider>
          </span>
        )}
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
        {hasActions && (
          <span
            className={mergeClassNames(
              styles['channel-sidebar-item__actions'],
              actionsAlways && styles['channel-sidebar-item__actions--always'],
              actionsOpen && styles['channel-sidebar-item__actions--open'],
            )}
          >
            {actions}
          </span>
        )}
        {showMenu && (
          <span className={styles['channel-sidebar-item__menu-button']}>
            <IconButton
              className={styles['channel-sidebar-item__menu-icon']}
              size="x-small"
              style="inverted"
              icon={<Icon glyph={<DotsVerticalIcon />} />}
              aria-label={menuLabel}
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
