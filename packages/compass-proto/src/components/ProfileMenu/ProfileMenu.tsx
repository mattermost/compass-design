import { useEffect, useState } from 'react';
import type { HTMLAttributes } from 'react';
import AccountOutlineIcon from '@mattermost/compass-icons/components/account-outline';
import ChevronRightIcon from '@mattermost/compass-icons/components/chevron-right';
import EmoticonHappyOutlineIcon from '@mattermost/compass-icons/components/emoticon-happy-outline';
import ExitToAppIcon from '@mattermost/compass-icons/components/exit-to-app';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { MenuItem } from '@mattermost/compass-ui/components/menu-item';
import {
  PopoverMenu,
  PopoverMenuDivider,
  PopoverMenuGroup,
  PopoverMenuTitle,
} from '@mattermost/compass-ui/components/popover-menu';
import { StatusBadge } from '@mattermost/compass-ui/components/status-badge';
import { UserAvatar } from '@mattermost/compass-ui/components/user-avatar';
import styles from './ProfileMenu.module.scss';

export type ProfileMenuStatus =
  | 'online'
  | 'away'
  | 'do-not-disturb'
  | 'offline';

/** Statuses a person can pick directly (Do Not Disturb has its own submenu). */
export type ProfileMenuPickableStatus = Exclude<
  ProfileMenuStatus,
  'do-not-disturb'
>;

export interface ProfileMenuProps extends Omit<
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
  status?: ProfileMenuStatus;
  /** Secondary label on Do Not Disturb, e.g. "until Monday 9:00 AM". */
  dndUntil?: string;
  /** Shows "On" / "Off" next to Notification Schedule in the DND submenu. */
  scheduleOn?: boolean;
  /** Open the Do Not Disturb submenu on first render. */
  submenuInitiallyOpen?: boolean;
  onPickStatus?: (status: ProfileMenuPickableStatus) => void;
  /** Called with the chosen Do Not Disturb duration label, e.g. "1 hour". */
  onPickDnd?: (duration: string) => void;
  onOpenSchedule?: () => void;
  onProfile?: () => void;
  onLogOut?: () => void;
  onCustomStatus?: () => void;
  /** Called after any item that should dismiss the menu is chosen. */
  onClose?: () => void;
}

const STATUS_LABELS: Record<ProfileMenuPickableStatus, string> = {
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
export default function ProfileMenu({
  open,
  userName = 'Leonard Riley',
  username = 'leonard.riley',
  avatarSrc,
  status = 'online',
  dndUntil,
  scheduleOn = false,
  submenuInitiallyOpen = false,
  onPickStatus,
  onPickDnd,
  onOpenSchedule,
  onProfile,
  onLogOut,
  onCustomStatus,
  onClose,
  className = '',
  ...rest
}: ProfileMenuProps) {
  const [submenu, setSubmenu] = useState(submenuInitiallyOpen);
  useEffect(() => setSubmenu(submenuInitiallyOpen), [submenuInitiallyOpen]);

  const rootClass = [styles['profile-menu'], className]
    .filter(Boolean)
    .join(' ');

  const pick = (s: ProfileMenuPickableStatus) => () => {
    onPickStatus?.(s);
    onClose?.();
  };

  const statusRow = (s: ProfileMenuPickableStatus) => (
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
        <PopoverMenuTitle className={styles['profile-menu__title']}>
          <UserAvatar
            src={avatarSrc}
            alt={userName}
            size="40"
            status={status === 'online'}
          />
          <span className={styles['profile-menu__identity']}>
            <span className={styles['profile-menu__name']}>{userName}</span>
            <span className={styles['profile-menu__username']}>
              @{username}
            </span>
          </span>
        </PopoverMenuTitle>
        <PopoverMenuDivider />
        <PopoverMenuGroup>
          <MenuItem
            label="Set a custom status"
            leadingVisual={<Icon glyph={<EmoticonHappyOutlineIcon />} />}
            onClick={() => {
              onCustomStatus?.();
              onClose?.();
            }}
          />
        </PopoverMenuGroup>
        <PopoverMenuDivider />
        <PopoverMenuGroup>
          {statusRow('online')}
          {statusRow('away')}
          <div
            className={styles['profile-menu__dnd']}
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
            {submenu && (
              <div className={styles['profile-menu__submenu']}>
                <PopoverMenu aria-label="Do Not Disturb">
                  <PopoverMenuTitle>
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
                      label="Notification Schedule"
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
