import type { MouseEvent, ReactNode } from 'react';
import DockLeftIcon from '@mattermost/compass-icons/components/dock-left';
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
}

export interface ProductRailTeamButtonProps {
  teams: ProductRailTeam[];
  activeTeamId?: string;
  /** Opens the menu. Receives the click event so the host can anchor to `currentTarget`. */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Reflects whether the host's menu is open. */
  open?: boolean;
  /** Accessible name of the button. Default: "Switch teams". */
  buttonLabel?: string;
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
        aria-label={buttonLabel}
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
            initials={current.initials}
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
  className?: string;
}

/**
 * Menu of the user's teams, opened from `ProductRailTeamButton`. Visual chrome
 * only: the host positions it and handles open/close.
 */
export function ProductRailTeamMenu({
  teams,
  activeTeamId,
  onSelectTeam,
  onShowTeamSidebar,
  showTeamSidebarLabel = 'Show team sidebar',
  menuLabel = 'Teams',
  className = '',
}: ProductRailTeamMenuProps) {
  return (
    <PopoverMenu
      aria-label={menuLabel}
      className={[styles['product-rail-team-menu'], className]
        .filter(Boolean)
        .join(' ')}
    >
      <PopoverMenuGroup>
        {teams.map((team) => {
          const active = team.id === activeTeamId;
          const mentions = active ? 0 : (team.mentions ?? 0);
          return (
            <MenuItem
              key={team.id}
              label={team.name}
              leadingVisual={
                <TeamAvatar
                  src={team.src}
                  alt=""
                  initials={team.initials}
                  size="32"
                  variant="menu"
                />
              }
              trailingElement={active || (mentions === 0 && !!team.unread)}
              // Omitted for the current team, which gets MenuItem's default check.
              trailingVisual={
                !active && mentions === 0 && team.unread ? (
                  <span className={styles['product-rail-team-menu__dot']} />
                ) : undefined
              }
              mentionCount={mentions > 0 ? mentions : undefined}
              onClick={() => onSelectTeam?.(team.id)}
            />
          );
        })}
      </PopoverMenuGroup>
      {onShowTeamSidebar && (
        <>
          <PopoverMenuDivider />
          <PopoverMenuGroup>
            <MenuItem
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
