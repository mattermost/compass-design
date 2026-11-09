import { useEffect, useState } from 'react';
import type { HTMLAttributes } from 'react';
import AccountOutlineIcon from '@mattermost/compass-icons/components/account-outline';
import ChevronRightIcon from '@mattermost/compass-icons/components/chevron-right';
import CloseCircleIcon from '@mattermost/compass-icons/components/close-circle';
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
  /** Label for the schedule row in the Do Not Disturb submenu. */
  scheduleLabel?: string;
  /** Summary under the schedule row, e.g. "Weekdays, 8:00 AM – 8:00 PM". */
  scheduleSummary?: string;
  /** Open the Do Not Disturb submenu on first render. */
  submenuInitiallyOpen?: boolean;
  onPickStatus?: (status: UserAccountMenuPickableStatus) => void;
  /** Called with the chosen Do Not Disturb duration label, e.g. "1 hour". */
  onPickDnd?: (duration: string) => void;
  onOpenSchedule?: () => void;
  onProfile?: () => void;
  onLogOut?: () => void;
  onCustomStatus?: () => void;
  /** Replaces "Set a custom status" while a status is set. */
  customStatus?: { emoji: string; text: string };
  /** Clears `customStatus`. The menu stays open. */
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
  scheduleLabel = 'Working hours',
  scheduleSummary,
  submenuInitiallyOpen = false,
  onPickStatus,
  onPickDnd,
  onOpenSchedule,
  onProfile,
  onLogOut,
  onCustomStatus,
  customStatus,
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
      <PopoverMenu
        open={open}
        aria-label="Account menu"
        className={styles['user-account-menu__surface']}
      >
        <PopoverMenuTitle className={styles['user-account-menu__title']}>
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
        </PopoverMenuTitle>
        <PopoverMenuDivider />
        <PopoverMenuGroup>
          {customStatus ? (
            <MenuItem
              label={customStatus.text}
              aria-label={`Clear custom status, ${customStatus.text}`}
              leadingVisual={
                <span
                  className={styles['user-account-menu__status-emoji']}
                  aria-hidden
                >
                  {customStatus.emoji}
                </span>
              }
              trailingElement
              trailingVisual={<Icon glyph={<CloseCircleIcon />} />}
              onClick={() => onClearCustomStatus?.()}
            />
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
                      secondaryLabel={scheduleSummary}
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
