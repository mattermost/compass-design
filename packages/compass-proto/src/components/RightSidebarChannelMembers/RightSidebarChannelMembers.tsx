import { useMemo, useState, type ReactNode } from 'react';
import AccountPlusOutlineIcon from '@mattermost/compass-icons/components/account-plus-outline';
import { Button } from '@mattermost/compass-ui/components/button';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { MenuItem } from '@mattermost/compass-ui/components/menu-item';
import { SearchInput } from '@mattermost/compass-ui/components/search-input';
import { Tag } from '@mattermost/compass-ui/components/tag';
import { UserAvatar } from '@mattermost/compass-ui/components/user-avatar';
import styles from './RightSidebarChannelMembers.module.scss';

export type RightSidebarChannelMember = {
  id: string;
  name: string;
  /** Handle or muted secondary text after the name (e.g. `@jordan`). */
  secondaryLabel?: string;
  avatarSrc?: string;
  /** Show online status on the avatar. */
  status?: boolean;
  /** Compact tag after the name (e.g. agent role “Monitoring”). */
  tag?: string;
  /** Replaces the default UserAvatar when set (e.g. geometric agent avatar). */
  leadingVisual?: ReactNode;
};

export type RightSidebarChannelMemberGroup = {
  id: string;
  title: string;
  members: RightSidebarChannelMember[];
};

export type RightSidebarChannelMembersProps = {
  /** Total members shown in the toolbar (defaults to flattened group count). */
  memberCount?: number;
  groups?: RightSidebarChannelMemberGroup[];
  searchPlaceholder?: string;
  onManage?: () => void;
  onAdd?: () => void;
  onMemberClick?: (member: RightSidebarChannelMember) => void;
  className?: string;
};

const DEFAULT_GROUPS: RightSidebarChannelMemberGroup[] = [
  {
    id: 'admins',
    title: 'Channel Admins',
    members: [
      {
        id: 'arlene',
        name: 'Arlene McCoy',
        secondaryLabel: '@Arlene.McCoy',
        status: true,
      },
      {
        id: 'robert',
        name: 'Robert Fox',
        secondaryLabel: '@Robert.Fox',
        status: true,
      },
    ],
  },
  {
    id: 'members',
    title: 'Channel Members',
    members: [
      {
        id: 'devon',
        name: 'Devon Lane',
        secondaryLabel: '@Devon.Lane',
        status: true,
      },
      {
        id: 'marvin',
        name: 'Marvin McKinney',
        secondaryLabel: '@Marvin.McKinney',
        status: true,
      },
      {
        id: 'darrell',
        name: 'Darrell Steward',
        secondaryLabel: '@Darrell.Steward',
        status: true,
      },
    ],
  },
];

function memberMatchesQuery(member: RightSidebarChannelMember, query: string) {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    member.name.toLowerCase().includes(q) ||
    (member.secondaryLabel?.toLowerCase().includes(q) ?? false) ||
    (member.tag?.toLowerCase().includes(q) ?? false)
  );
}

/**
 * Channel Members RHS body — count/actions, search, and grouped member rows.
 * Pair with `RightSidebar` + `RightSidebarHeader` (title “Members”).
 */
export default function RightSidebarChannelMembers({
  memberCount,
  groups = DEFAULT_GROUPS,
  searchPlaceholder = 'Search members',
  onManage,
  onAdd,
  onMemberClick,
  className = '',
}: RightSidebarChannelMembersProps) {
  const [query, setQuery] = useState('');

  const filteredGroups = useMemo(() => {
    return groups
      .map((group) => ({
        ...group,
        members: group.members.filter((member) =>
          memberMatchesQuery(member, query.trim()),
        ),
      }))
      .filter((group) => group.members.length > 0);
  }, [groups, query]);

  const totalCount =
    memberCount ??
    groups.reduce((sum, group) => sum + group.members.length, 0);

  const rootClass = [styles['right-sidebar-channel-members'], className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClass}>
      <div className={styles['right-sidebar-channel-members__toolbar']}>
        <p className={styles['right-sidebar-channel-members__count']}>
          {totalCount} {totalCount === 1 ? 'member' : 'members'}
        </p>
        <div className={styles['right-sidebar-channel-members__actions']}>
          <Button emphasis="tertiary" size="small" onClick={onManage}>
            Manage
          </Button>
          <Button
            emphasis="primary"
            size="small"
            leadingIcon={<Icon size="12" glyph={<AccountPlusOutlineIcon />} />}
            onClick={onAdd}
          >
            Add
          </Button>
        </div>
      </div>

      <div className={styles['right-sidebar-channel-members__search']}>
        <SearchInput
          size="medium"
          label={searchPlaceholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onClear={() => setQuery('')}
          aria-label={searchPlaceholder}
        />
      </div>

      <div className={styles['right-sidebar-channel-members__list']}>
        {filteredGroups.map((group) => (
          <section
            key={group.id}
            className={styles['right-sidebar-channel-members__group']}
            aria-label={group.title}
          >
            <h3 className={styles['right-sidebar-channel-members__group-title']}>
              {group.title}
            </h3>
            <ul className={styles['right-sidebar-channel-members__group-list']}>
              {group.members.map((member) => (
                <li key={member.id}>
                  <MenuItem
                    label={member.name}
                    secondaryLabel={member.secondaryLabel}
                    secondaryLabelPosition="inline"
                    leadingVisual={
                      member.leadingVisual ?? (
                        <UserAvatar
                          src={member.avatarSrc}
                          alt={member.name}
                          size="24"
                          status={member.status}
                        />
                      )
                    }
                    trailingElement={Boolean(member.tag)}
                    trailingVisual={
                      member.tag ? (
                        <Tag label={member.tag} size="x-small" />
                      ) : undefined
                    }
                    onClick={
                      onMemberClick
                        ? () => onMemberClick(member)
                        : undefined
                    }
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
