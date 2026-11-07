import { useEffect, useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import AccountOutlineIcon from '@mattermost/compass-icons/components/account-outline';
import CloseCircleIcon from '@mattermost/compass-icons/components/close-circle';
import ChevronRightIcon from '@mattermost/compass-icons/components/chevron-right';
import EmoticonHappyOutlineIcon from '@mattermost/compass-icons/components/emoticon-happy-outline';
import ExitToAppIcon from '@mattermost/compass-icons/components/exit-to-app';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { IconButton } from '@mattermost/compass-ui/components/icon-button';
import { MenuItem } from '@mattermost/compass-ui/components/menu-item';
import {
  PopoverMenu,
  PopoverMenuDivider,
  PopoverMenuGroup,
  PopoverMenuTitle,
} from '@mattermost/compass-ui/components/popover-menu';
import { StatusBadge } from '@mattermost/compass-ui/components/status-badge';
import { UserAvatar } from '@mattermost/compass-ui/components/user-avatar';
import { usePopoverTransition } from '@mattermost/compass-ui/hooks/use-popover-transition';
import styles from './UserAccountMenu.module.scss';

export type UserAccountMenuStatus =
  | 'online'
  | 'away'
  | 'do-not-disturb'
  | 'offline';

/** Statuses a person can pick directly (Do Not Disturb has its own submenu). */
export type UserAccountMenuPickableStatus = Exclude<
  UserAccountMenuStatus,
  'do-not-disturb'
>;

/** A custom status. The emoji is a node so hosts can render it their own way. */
export interface UserAccountMenuCustomStatus {
  emoji: ReactNode;
  text?: string;
}

export interface UserAccountMenuProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  /** Controls the enter/exit transition. Omit for an always-visible menu. */
  open?: boolean;
  /** Display name shown in the menu title. */
  userName?: string;
  /** Username shown under the display name, without the @. */
  username?: string;
  /** Avatar image for the menu title. */
  avatarSrc?: string;
  /** Current effective status. Default: online. */
  status?: UserAccountMenuStatus;
  /** Secondary label on Do Not Disturb, e.g. "until Monday 9:00 AM". */
  dndUntil?: string;
  /** Current custom status. When set, replaces the "Set a custom status" row. */
  customStatus?: UserAccountMenuCustomStatus;
  /** Expiry label shown after the status text, e.g. "Until 5:00 PM". */
  customStatusExpiry?: string;
  /** Label of the schedule row in the Do Not Disturb submenu. Default: "Notification Schedule". */
  scheduleLabel?: string;
  /** Shows "On" / "Off" next to the schedule row in the DND submenu. */
  scheduleOn?: boolean;
  /** Open the Do Not Disturb submenu on first render. */
  submenuInitiallyOpen?: boolean;
  onPickStatus?: (status: UserAccountMenuPickableStatus) => void;
  /** Called with the chosen Do Not Disturb duration label, e.g. "1 hour". */
  onPickDnd?: (duration: string) => void;
  onOpenSchedule?: () => void;
  onProfile?: () => void;
  onLogOut?: () => void;
  /** Opens the custom status editor (row click). */
  onCustomStatus?: () => void;
  /** Clears the custom status (end button on the status row). */
  onClearCustomStatus?: () => void;
  /** Called after any item that should dismiss the menu is chosen. */
  onClose?: () => void;
}

const STATUS_LABELS: Record<UserAccountMenuPickableStatus, string> = {
  online: 'Online',
  away: 'Away',
  offline: 'Offline',
};

const DND_DURATIONS = [
  "Don't clear",
  '30 mins',
  '1 hour',
  '2 hours',
  'Tomorrow',
  'Custom',
];

/**
 * Global header account menu (Figma: Patterns / Popover Menus / User Account
 * Menu) — avatar title, custom status, status rows with a Do Not Disturb
 * submenu, Profile and Log out. Positioning and click-outside dismissal belong to the
 * host; the submenu positions itself relative to the Do Not Disturb row.
 */
export default function UserAccountMenu({
  open,
  userName = 'Leonard Riley',
  username = 'leonard.riley',
  avatarSrc,
  status = 'online',
  dndUntil,
  customStatus,
  customStatusExpiry,
  scheduleLabel = 'Notification Schedule',
  scheduleOn = false,
  submenuInitiallyOpen = false,
  onPickStatus,
  onPickDnd,
  onOpenSchedule,
  onProfile,
  onLogOut,
  onCustomStatus,
  onClearCustomStatus,
  onClose,
  className = '',
  ...rest
}: UserAccountMenuProps) {
  const [submenu, setSubmenu] = useState(submenuInitiallyOpen);
  useEffect(() => setSubmenu(submenuInitiallyOpen), [submenuInitiallyOpen]);
  const { mounted: submenuMounted, visible: submenuVisible } =
    usePopoverTransition(submenu);

  const rootClass = [styles['user-account-menu'], className]
    .filter(Boolean)
    .join(' ');

  const pick = (s: UserAccountMenuPickableStatus) => () => {
    onPickStatus?.(s);
    onClose?.();
  };

  const statusRow = (s: UserAccountMenuPickableStatus) => (
    <MenuItem
      label={STATUS_LABELS[s]}
      leadingVisual={<StatusBadge status={s} size="small" />}
      trailingElement={status === s}
      onClick={pick(s)}
    />
  );

  return (
    <div className={rootClass} {...rest}>
      <PopoverMenu open={open} aria-label="Account menu">
        {/* A div, not PopoverMenuTitle (a <p>): the avatar is a div. */}
        <div className={styles['user-account-menu__title']}>
          <UserAvatar
            src={avatarSrc}
            alt={userName}
            size="40"
            status={status === 'online'}
          />
          <span className={styles['user-account-menu__identity']}>
            <span className={styles['user-account-menu__name']}>
              {userName}
            </span>
            <span className={styles['user-account-menu__username']}>
              @{username}
            </span>
          </span>
        </div>
        <PopoverMenuDivider />
        <PopoverMenuGroup>
          {customStatus ? (
            <div className={styles['user-account-menu__custom-status']}>
              <MenuItem
                label={
                  [customStatus.text, customStatusExpiry]
                    .filter(Boolean)
                    .join(' · ') || 'Custom status'
                }
                leadingVisual={
                  <span className={styles['user-account-menu__emoji']}>
                    {customStatus.emoji}
                  </span>
                }
                onClick={() => {
                  onCustomStatus?.();
                  onClose?.();
                }}
              />
              <span className={styles['user-account-menu__clear']}>
                <IconButton
                  aria-label="Clear custom status"
                  size="small"
                  padding="compact"
                  icon={<Icon glyph={<CloseCircleIcon />} />}
                  onClick={() => {
                    onClearCustomStatus?.();
                    onClose?.();
                  }}
                />
              </span>
            </div>
          ) : (
            <MenuItem
              label="Set a custom status"
              leadingVisual={<Icon glyph={<EmoticonHappyOutlineIcon />} />}
              onClick={() => {
                onCustomStatus?.();
                onClose?.();
              }}
            />
          )}
        </PopoverMenuGroup>
        <PopoverMenuDivider />
        <PopoverMenuGroup>
          {statusRow('online')}
          {statusRow('away')}
          <div
            className={styles['user-account-menu__dnd']}
            onMouseEnter={() => setSubmenu(true)}
            onMouseLeave={() => setSubmenu(false)}
          >
            <MenuItem
              label="Do Not Disturb"
              secondaryLabel={dndUntil}
              leadingVisual={
                <StatusBadge status="do-not-disturb" size="small" />
              }
              trailingElement
              trailingVisual={<Icon glyph={<ChevronRightIcon />} />}
              active={submenu}
              aria-haspopup="menu"
              aria-expanded={submenu}
              onClick={() => setSubmenu((v) => !v)}
            />
            {submenuMounted && (
              <div
                className={[
                  styles['user-account-menu__submenu'],
                  submenuVisible && styles['user-account-menu__submenu--open'],
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <PopoverMenu variant="child" aria-label="Do Not Disturb">
                  <PopoverMenuTitle
                    className={styles['user-account-menu__submenu-title']}
                  >
                    Disable notifications until:
                  </PopoverMenuTitle>
                  <PopoverMenuGroup>
                    {DND_DURATIONS.map((d) => (
                      <MenuItem
                        key={d}
                        label={d}
                        leadingElement={false}
                        onClick={() => {
                          onPickDnd?.(d);
                          onClose?.();
                        }}
                      />
                    ))}
                  </PopoverMenuGroup>
                  <PopoverMenuDivider />
                  <PopoverMenuGroup>
                    <MenuItem
                      label={scheduleLabel}
                      leadingElement={false}
                      secondaryLabel={scheduleOn ? 'On' : 'Off'}
                      secondaryLabelPosition="inline"
                      onClick={() => {
                        onOpenSchedule?.();
                        onClose?.();
                      }}
                    />
                  </PopoverMenuGroup>
                </PopoverMenu>
              </div>
            )}
          </div>
          {statusRow('offline')}
        </PopoverMenuGroup>
        <PopoverMenuDivider />
        <PopoverMenuGroup>
          <MenuItem
            label="Profile"
            leadingVisual={<Icon glyph={<AccountOutlineIcon />} />}
            onClick={() => {
              onProfile?.();
              onClose?.();
            }}
          />
        </PopoverMenuGroup>
        <PopoverMenuDivider />
        <PopoverMenuGroup>
          <MenuItem
            label="Log out"
            destructive
            leadingVisual={<Icon glyph={<ExitToAppIcon />} />}
            onClick={() => {
              onLogOut?.();
              onClose?.();
            }}
          />
        </PopoverMenuGroup>
      </PopoverMenu>
    </div>
  );
}
