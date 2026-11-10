import type { HTMLAttributes, ReactElement } from 'react';
import BellOutlineIcon from '@mattermost/compass-icons/components/bell-outline';
import DockLeftIcon from '@mattermost/compass-icons/components/dock-left';
import EyeOutlineIcon from '@mattermost/compass-icons/components/eye-outline';
import PhoneInTalkIcon from '@mattermost/compass-icons/components/phone-in-talk';
import TuneIcon from '@mattermost/compass-icons/components/tune';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { MenuGroupHeading } from '@mattermost/compass-ui/components/menu-group-heading';
import { MenuItem } from '@mattermost/compass-ui/components/menu-item';
import { PopoverMenuDivider } from '@mattermost/compass-ui/components/popover-menu';
import styles from './SettingsSidebar.module.scss';

export interface SettingsSidebarTab {
  id: string;
  label: string;
  /** Compass icon element, e.g. `<BellOutlineIcon />`. Rendered at 16px. */
  glyph: ReactElement;
}

export interface SettingsSidebarGroup {
  /** Optional uppercase heading; a divider is drawn before every group after the first. */
  heading?: string;
  tabs: SettingsSidebarTab[];
}

/** Core tabs plus the plugin group, as in the Mattermost Settings modal. */
export const defaultSettingsSidebarGroups: SettingsSidebarGroup[] = [
  {
    tabs: [
      {
        id: 'notifications',
        label: 'Notifications',
        glyph: <BellOutlineIcon />,
      },
      { id: 'display', label: 'Display', glyph: <EyeOutlineIcon /> },
      { id: 'sidebar', label: 'Sidebar', glyph: <DockLeftIcon /> },
      { id: 'advanced', label: 'Advanced', glyph: <TuneIcon /> },
    ],
  },
  {
    heading: 'PLUGIN PREFERENCES',
    tabs: [{ id: 'calls', label: 'Calls', glyph: <PhoneInTalkIcon /> }],
  },
];

export interface SettingsSidebarProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'children' | 'onSelect'
> {
  /** Tab groups. Default: Notifications / Display / Sidebar / Advanced + Calls plugin group. */
  groups?: SettingsSidebarGroup[];
  /** Id of the selected tab. Default: first tab. */
  activeId?: string;
  /** Called when a tab is chosen. Omit for inert chrome (tabs still render). */
  onSelect?: (id: string) => void;
}

/** 232px settings navigation column (Figma "Settings Sidebar Menu"). */
export default function SettingsSidebar({
  groups = defaultSettingsSidebarGroups,
  activeId = groups[0]?.tabs[0]?.id,
  onSelect,
  className,
  'aria-label': ariaLabel = 'Settings sections',
  ...rest
}: SettingsSidebarProps) {
  const renderTab = (tab: SettingsSidebarTab) => {
    const active = tab.id === activeId;
    return (
      <MenuItem
        key={tab.id}
        label={tab.label}
        leadingVisual={<Icon glyph={tab.glyph} size="16" />}
        active={active}
        onClick={onSelect ? () => onSelect(tab.id) : undefined}
        className={[
          styles['settings-sidebar__item'],
          active && styles['settings-sidebar__item--active'],
        ]
          .filter(Boolean)
          .join(' ')}
        aria-current={active ? 'page' : undefined}
      />
    );
  };

  return (
    <nav
      {...rest}
      className={[styles['settings-sidebar'], className]
        .filter(Boolean)
        .join(' ')}
      aria-label={ariaLabel}
    >
      {groups.map((group, i) => (
        <div
          key={group.heading ?? i}
          className={styles['settings-sidebar__section']}
        >
          {i > 0 && <PopoverMenuDivider />}
          {group.heading && <MenuGroupHeading label={group.heading} />}
          <div className={styles['settings-sidebar__group']}>
            {group.tabs.map(renderTab)}
          </div>
        </div>
      ))}
    </nav>
  );
}
