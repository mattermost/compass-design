import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';
import DockLeftIcon from '@mattermost/compass-icons/components/dock-left';
import CheckIcon from '@mattermost/compass-icons/components/check';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { MenuItem } from '@mattermost/compass-ui/components/menu-item';
import {
  PopoverMenu,
  PopoverMenuDivider,
  PopoverMenuGroup,
} from '@mattermost/compass-ui/components/popover-menu';
import { TeamAvatar } from '@mattermost/compass-ui/components/team-avatar';
import WithTooltip from '../WithTooltip/WithTooltip';
import styles from './ProductRailTeamMenu.module.scss';

export interface ProductRailTeam {
  id: string;
  name: string;
  /** Team image. */
  src?: string;
  /** Initials shown when there is no image. */
  initials?: string;
  /** Unread, non-mention activity. */
  unread?: boolean;
  /** Unread mention count. */
  mentions?: number;
  /** Styles the mention count as urgent. */
  urgent?: boolean;
}

/** Initials fallback: the name without spaces, first two characters. */
const initialsOf = (team: ProductRailTeam) =>
  team.initials ?? team.name.replace(/\s/g, '').substring(0, 2);

export interface ProductRailTeamButtonProps {
  teams: ProductRailTeam[];
  activeTeamId?: string;
  /** Opens the menu. Receives the click event so the host can anchor to `currentTarget`. */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Reflects whether the host's menu is open. */
  open?: boolean;
  /** Accessible name of the button, followed by the current team. Default: "Switch teams". */
  buttonLabel?: string;
  /** Appended to the name when another team has unread activity. Default: "other teams have unread messages". */
  otherTeamsUnreadLabel?: string;
  className?: string;
}

/**
 * Current-team button for the top of the `ProductRail`, used in place of the
 * Team Sidebar. The current team sits on cards that peek out below it to hint
 * at the others, with a dot when another team has unread activity. The host
 * owns the menu: open `ProductRailTeamMenu` from `onClick`.
 */
export function ProductRailTeamButton({
  teams,
  activeTeamId,
  onClick,
  open = false,
  buttonLabel = 'Switch teams',
  otherTeamsUnreadLabel = 'other teams have unread messages',
  className = '',
}: ProductRailTeamButtonProps) {
  const current = teams.find((t) => t.id === activeTeamId) ?? teams[0];
  if (!current) return null;
  const otherUnread = teams.some(
    (t) => t.id !== current.id && (t.unread || (t.mentions ?? 0) > 0),
  );

  return (
    <WithTooltip label={current.name} placement="right">
      <button
        type="button"
        className={[styles['product-rail-team-button'], className]
          .filter(Boolean)
          .join(' ')}
        aria-label={`${buttonLabel}, ${current.name}${otherUnread ? `, ${otherTeamsUnreadLabel}` : ''}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={onClick}
      >
        <span className={styles['product-rail-team-button__stack']}>
          {teams.length > 2 && (
            <span
              className={`${styles['product-rail-team-button__card']} ${styles['product-rail-team-button__card--back']}`}
            />
          )}
          {teams.length > 1 && (
            <span className={styles['product-rail-team-button__card']} />
          )}
          <TeamAvatar
            className={styles['product-rail-team-button__avatar']}
            src={current.src}
            alt=""
            initials={initialsOf(current)}
            size="40"
            state="default"
          />
          {otherUnread && (
            <span className={styles['product-rail-team-button__dot']} />
          )}
        </span>
      </button>
    </WithTooltip>
  );
}

export interface ProductRailTeamMenuProps {
  teams: ProductRailTeam[];
  activeTeamId?: string;
  onSelectTeam?: (id: string) => void;
  /** When set, adds a "Show team sidebar" row that calls this. */
  onShowTeamSidebar?: () => void;
  /** Label for the "Show team sidebar" row. */
  showTeamSidebarLabel?: ReactNode;
  /** Accessible name of the menu. Default: "Teams". */
  menuLabel?: string;
  /** Spoken after a team name when it has unread activity. Default: "unread". */
  unreadLabel?: string;
  /**
   * Controlled visibility with the Compass popover transition (scale + fade in,
   * reverse on close); the menu unmounts after the exit. Omit to always render.
   */
  open?: boolean;
  /** Called after the exit transition finishes and the menu unmounts. */
  onExited?: () => void;
  /**
   * Called when the user presses Escape inside the menu (unless an inner handler already
   * prevented it). The host owns open state, so close the menu here and return focus to the
   * trigger.
   */
  onClose?: () => void;
  className?: string;
}

const ITEM_SELECTOR = '[role^="menuitem"]';

/** Arrow keys, Home and End move focus between rows; Escape asks the host to close. */
function handleMenuKeyDown(
  event: KeyboardEvent<HTMLDivElement>,
  onClose?: () => void,
) {
  if (event.defaultPrevented) return;
  if (event.key === 'Escape') {
    if (onClose) {
      event.preventDefault();
      onClose();
    }
    return;
  }
  const items = Array.from(
    event.currentTarget.querySelectorAll<HTMLElement>(ITEM_SELECTOR),
  );
  if (items.length === 0) return;
  const current = items.indexOf(document.activeElement as HTMLElement);
  let next: number | null = null;
  if (event.key === 'ArrowDown') next = (current + 1) % items.length;
  else if (event.key === 'ArrowUp')
    next = (current <= 0 ? items.length : current) - 1;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = items.length - 1;
  if (next == null) return;
  event.preventDefault();
  items[next].focus();
}

/**
 * Menu of the user's teams, opened from `ProductRailTeamButton`. Visual chrome
 * only: the host positions it and owns `open`. Keep it mounted until
 * `onExited` so the close animation can play.
 */
export function ProductRailTeamMenu({
  teams,
  activeTeamId,
  onSelectTeam,
  onShowTeamSidebar,
  showTeamSidebarLabel = 'Show team sidebar',
  menuLabel = 'Teams',
  unreadLabel = 'unread',
  open,
  onExited,
  onClose,
  className = '',
}: ProductRailTeamMenuProps) {
  // When the host opens the menu, focus lands on the current team (or the first row).
  const focusIndex = Math.max(
    0,
    teams.findIndex((t) => t.id === activeTeamId),
  );
  return (
    <PopoverMenu
      role="menu"
      open={open}
      onExited={onExited}
      onKeyDown={(event) => handleMenuKeyDown(event, onClose)}
      aria-label={menuLabel}
      className={[styles['product-rail-team-menu'], className]
        .filter(Boolean)
        .join(' ')}
    >
      <PopoverMenuGroup>
        {teams.map((team, index) => {
          const active = team.id === activeTeamId;
          const mentions = active ? 0 : (team.mentions ?? 0);
          return (
            <button
              key={team.id}
              // eslint-disable-next-line jsx-a11y/no-autofocus -- moves focus into the menu the host just opened
              autoFocus={open === true && index === focusIndex}
              type="button"
              role="menuitemradio"
              aria-checked={active}
              className={styles['product-rail-team-menu__row']}
              onClick={() => onSelectTeam?.(team.id)}
            >
              <TeamAvatar
                src={team.src}
                alt=""
                initials={initialsOf(team)}
                size="32"
                variant="menu"
              />
              <span className={styles['product-rail-team-menu__label']}>
                {team.name}
              </span>
              {!active && mentions === 0 && team.unread && (
                <span className={styles['product-rail-team-menu__sr-only']}>
                  {`, ${unreadLabel}`}
                </span>
              )}
              {active ? (
                <Icon glyph={<CheckIcon />} size="16" />
              ) : mentions > 0 ? (
                <span
                  className={[
                    styles['product-rail-team-menu__badge'],
                    team.urgent
                      ? styles['product-rail-team-menu__badge--urgent']
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {mentions > 99 ? '99+' : mentions}
                </span>
              ) : team.unread ? (
                <span className={styles['product-rail-team-menu__dot']} />
              ) : null}
            </button>
          );
        })}
      </PopoverMenuGroup>
      {onShowTeamSidebar && (
        <>
          <PopoverMenuDivider />
          <PopoverMenuGroup>
            <MenuItem
              role="menuitem"
              label={showTeamSidebarLabel}
              leadingVisual={<Icon glyph={<DockLeftIcon />} size="16" />}
              onClick={onShowTeamSidebar}
            />
          </PopoverMenuGroup>
        </>
      )}
    </PopoverMenu>
  );
}
