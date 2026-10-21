import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import avatarArjun from '@/assets/avatars/Arjun Patel.png';
import avatarDanielle from '@/assets/avatars/Danielle Okoro.png';
import avatarEmma from '@/assets/avatars/Emma Novak.png';
import avatarLeonard from '@/assets/avatars/Leonard Riley.png';
import avatarMarco from '@/assets/avatars/Marco Rinaldi.png';
import avatarSofia from '@/assets/avatars/Sofia Bauer.png';
import avatarStaffTeam from '@/assets/avatars/Staff Team.png';
import MenuItem from './MenuItem';
import type { MenuItemProps } from './MenuItem';
import UserAvatar from '../UserAvatar/UserAvatar';
import type {
  UserAvatarFallbackColor,
  UserAvatarSize,
} from '../UserAvatar/UserAvatar';
import TeamAvatar from '../TeamAvatar/TeamAvatar';
import type { TeamAvatarSize } from '../TeamAvatar/TeamAvatar';
import {
  ICON_DEFAULT,
  ICON_NONE,
  iconSelectArgType,
  resolveStoryIcon,
} from '../../storybook/icons';

const menuDemoStyle = {
  display: 'grid',
  gap: 2,
  width: 280,
  padding: 4,
  borderRadius: 8,
  background: 'var(--center-channel-bg)',
  border: '1px solid rgba(var(--center-channel-color-rgb), 0.08)',
} as const;

type LeadingVisualKind = 'icon' | 'user-avatar' | 'team-avatar';

/** Menu-sized avatars. 24px fills the same slot as a 16px icon. */
const USER_AVATAR_SIZES = [
  '16',
  '20',
  '24',
  '28',
  '32',
] as const satisfies readonly UserAvatarSize[];
const TEAM_AVATAR_SIZES = [
  '24',
  '28',
  '32',
  '40',
] as const satisfies readonly TeamAvatarSize[];

const USER_AVATAR_IMAGES = {
  none: undefined,
  'leonard-riley': avatarLeonard,
  'emma-novak': avatarEmma,
  'arjun-patel': avatarArjun,
  'sofia-bauer': avatarSofia,
  'marco-rinaldi': avatarMarco,
  'danielle-okoro': avatarDanielle,
} as const;

type UserAvatarImage = keyof typeof USER_AVATAR_IMAGES;
type TeamAvatarImage = 'none' | 'staff-team';
type UserAvatarFallbackChoice = 'auto' | UserAvatarFallbackColor;

const USER_AVATAR_IMAGE_LABELS: Record<UserAvatarImage, string> = {
  none: 'None (initials)',
  'leonard-riley': 'Leonard Riley',
  'emma-novak': 'Emma Novak',
  'arjun-patel': 'Arjun Patel',
  'sofia-bauer': 'Sofia Bauer',
  'marco-rinaldi': 'Marco Rinaldi',
  'danielle-okoro': 'Danielle Okoro',
};

const FALLBACK_COLORS: UserAvatarFallbackChoice[] = [
  'auto',
  'red',
  'purple',
  'neutral',
  'blue',
  'cyan',
  'yellow',
  'green',
  'orange',
];

type MenuItemStoryArgs = Omit<
  MenuItemProps,
  'leadingVisual' | 'trailingVisual'
> & {
  leadingVisualKind: LeadingVisualKind;
  /** Icon glyph when `leadingVisualKind` is `icon`. */
  leadingVisual?: string;
  trailingVisual?: string;
  userAvatarName: string;
  userAvatarImage: UserAvatarImage;
  userAvatarSize: (typeof USER_AVATAR_SIZES)[number];
  userAvatarStatus: boolean;
  userAvatarFallbackColor: UserAvatarFallbackChoice;
  teamAvatarName: string;
  teamAvatarInitials: string;
  teamAvatarImage: TeamAvatarImage;
  teamAvatarSize: (typeof TEAM_AVATAR_SIZES)[number];
};

const storyControl = (category: string) => ({
  table: { category },
});

const whenKind = (kind: LeadingVisualKind) => ({
  arg: 'leadingVisualKind' as const,
  eq: kind,
});

function resolveLeadingVisual({
  leadingVisualKind,
  leadingVisual,
  userAvatarName,
  userAvatarImage,
  userAvatarSize,
  userAvatarStatus,
  userAvatarFallbackColor,
  teamAvatarName,
  teamAvatarInitials,
  teamAvatarImage,
  teamAvatarSize,
}: MenuItemStoryArgs): ReactNode {
  if (leadingVisualKind === 'user-avatar') {
    const name = userAvatarName.trim() || 'User';
    return (
      <UserAvatar
        alt={name}
        name={name}
        src={USER_AVATAR_IMAGES[userAvatarImage]}
        size={userAvatarSize}
        status={userAvatarStatus}
        fallbackColor={
          userAvatarFallbackColor === 'auto'
            ? undefined
            : userAvatarFallbackColor
        }
      />
    );
  }

  if (leadingVisualKind === 'team-avatar') {
    const name = teamAvatarName.trim() || 'Team';
    return (
      <TeamAvatar
        alt={name}
        initials={teamAvatarInitials.trim() || name.slice(0, 2)}
        src={teamAvatarImage === 'none' ? undefined : avatarStaffTeam}
        size={teamAvatarSize}
        variant="menu"
      />
    );
  }

  if (leadingVisual === ICON_DEFAULT) return undefined;
  return resolveStoryIcon(leadingVisual, { wrapSize: '16' }) as ReactNode;
}

const STORY_ARG_KEYS = [
  'leadingVisualKind',
  'leadingVisual',
  'trailingVisual',
  'userAvatarName',
  'userAvatarImage',
  'userAvatarSize',
  'userAvatarStatus',
  'userAvatarFallbackColor',
  'teamAvatarName',
  'teamAvatarInitials',
  'teamAvatarImage',
  'teamAvatarSize',
] as const satisfies readonly (keyof MenuItemStoryArgs)[];

function menuItemPropsFromArgs(
  args: MenuItemStoryArgs,
): Omit<MenuItemProps, 'leadingVisual' | 'trailingVisual'> {
  const props: Record<string, unknown> = { ...args };
  for (const key of STORY_ARG_KEYS) delete props[key];
  return props as Omit<MenuItemProps, 'leadingVisual' | 'trailingVisual'>;
}

// `ReactNode` props make Storybook infer an object control, whose JSON isn't a valid React child.
const textControl = (description: string) => ({
  control: 'text' as const,
  description,
});

const meta = {
  title: 'Components/Navigation/Menu Item',
  component: MenuItem,
  tags: ['autodocs'],
  argTypes: {
    label: textControl('Primary label.'),
    secondaryLabel: textControl('Optional secondary label.'),
    secondaryLabelPosition: {
      control: 'inline-radio',
      options: ['below', 'inline'],
    },
    tagLabel: textControl('Text of the tag. Turn on `tag` to show it.'),
    customStatusEmoji: textControl('Emoji shown after the label.'),
    mentionCount: { control: 'number' },
    // Inherited button attributes: Storybook infers an object control for these, which breaks the story.
    className: { table: { disable: true } },
    type: { table: { disable: true } },
    leadingVisualKind: {
      name: 'Type',
      control: {
        type: 'inline-radio',
        labels: {
          icon: 'Icon',
          'user-avatar': 'User avatar',
          'team-avatar': 'Team avatar',
        },
      },
      options: ['icon', 'user-avatar', 'team-avatar'],
      description:
        'What the leading slot shows. Avatar controls below build the element passed as leadingVisual.',
      ...storyControl('Leading visual'),
    },
    leadingVisual: {
      ...iconSelectArgType({
        includeDefault: true,
        description:
          'Leading icon glyph. Default uses the built-in emoticon placeholder. Turn off leadingElement to hide the slot.',
      }),
      if: whenKind('icon'),
    },
    userAvatarName: {
      name: 'Name',
      ...textControl(
        'Display name. Drives alt text, initials, and the fallback colour.',
      ),
      if: whenKind('user-avatar'),
      ...storyControl('User avatar'),
    },
    userAvatarImage: {
      name: 'Image',
      control: { type: 'select', labels: USER_AVATAR_IMAGE_LABELS },
      options: Object.keys(USER_AVATAR_IMAGES),
      description: 'Portrait. None renders initials from the name.',
      if: whenKind('user-avatar'),
      ...storyControl('User avatar'),
    },
    userAvatarSize: {
      name: 'Size',
      control: 'inline-radio',
      options: USER_AVATAR_SIZES,
      description:
        '24 matches the icon slot, so the label stays aligned. Larger sizes grow the row.',
      if: whenKind('user-avatar'),
      ...storyControl('User avatar'),
    },
    userAvatarStatus: {
      name: 'Status',
      control: 'boolean',
      description: 'Online status badge on the avatar.',
      if: whenKind('user-avatar'),
      ...storyControl('User avatar'),
    },
    userAvatarFallbackColor: {
      name: 'Fallback colour',
      control: 'select',
      options: FALLBACK_COLORS,
      description:
        'Auto hashes a colour from the name. Used when Image is None.',
      if: whenKind('user-avatar'),
      ...storyControl('User avatar'),
    },
    teamAvatarName: {
      name: 'Name',
      ...textControl('Accessible name for the team avatar.'),
      if: whenKind('team-avatar'),
      ...storyControl('Team avatar'),
    },
    teamAvatarInitials: {
      name: 'Initials',
      ...textControl('Shown when Image is None.'),
      if: whenKind('team-avatar'),
      ...storyControl('Team avatar'),
    },
    teamAvatarImage: {
      name: 'Image',
      control: {
        type: 'inline-radio',
        labels: { none: 'None (initials)', 'staff-team': 'Staff Team' },
      },
      options: ['none', 'staff-team'],
      if: whenKind('team-avatar'),
      ...storyControl('Team avatar'),
    },
    teamAvatarSize: {
      name: 'Size',
      control: 'inline-radio',
      options: TEAM_AVATAR_SIZES,
      description:
        '24 matches the icon slot, so the label stays aligned. Larger sizes grow the row.',
      if: whenKind('team-avatar'),
      ...storyControl('Team avatar'),
    },
    trailingVisual: iconSelectArgType({
      optional: true,
      description:
        'Trailing icon glyph. None uses the built-in check. Turn on trailingElement to show the slot.',
    }),
  },
  args: {
    leadingVisualKind: 'icon',
    leadingVisual: ICON_DEFAULT,
    trailingVisual: ICON_NONE,
    userAvatarName: 'Leonard Riley',
    userAvatarImage: 'leonard-riley',
    userAvatarSize: '24',
    userAvatarStatus: false,
    userAvatarFallbackColor: 'auto',
    teamAvatarName: 'Staff Team',
    teamAvatarInitials: 'St',
    teamAvatarImage: 'staff-team',
    teamAvatarSize: '24',
  },
  render: (args) => (
    <MenuItem
      {...menuItemPropsFromArgs(args)}
      leadingVisual={resolveLeadingVisual(args)}
      trailingVisual={
        resolveStoryIcon(args.trailingVisual, { wrapSize: '16' }) as ReactNode
      }
    />
  ),
} satisfies Meta<MenuItemStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Menu Item',
  },
};

export const WithTrailingCheck: Story = {
  args: {
    label: 'With trailing check',
    trailingElement: true,
  },
};

export const SecondaryLabelBelow: Story = {
  args: {
    label: 'Menu Item',
    secondaryLabel: 'Descriptive text below',
  },
};

export const SecondaryLabelInline: Story = {
  args: {
    label: 'Menu Item',
    secondaryLabel: 'Inline text',
    secondaryLabelPosition: 'inline',
  },
};

export const WithTag: Story = {
  args: {
    label: 'New feature',
    tag: true,
  },
};

export const LeadingUserAvatar: Story = {
  args: {
    label: 'Leonard Riley',
    secondaryLabel: '@leonard',
    secondaryLabelPosition: 'inline',
    leadingVisualKind: 'user-avatar',
  },
};

export const LeadingTeamAvatar: Story = {
  args: {
    label: 'Staff Team',
    leadingVisualKind: 'team-avatar',
  },
};

export const Destructive: Story = {
  args: {
    label: 'Delete item',
    destructive: true,
  },
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <section>
        <h3
          style={{
            marginBottom: 12,
            fontSize: 12,
            color: 'var(--center-channel-color)',
          }}
        >
          Default
        </h3>
        <div style={menuDemoStyle}>
          <MenuItem label="Menu Item" />
          <MenuItem label="With trailing check" trailingElement />
          <MenuItem label="No leading visual" leadingElement={false} />
          <MenuItem
            label="Leonard Riley"
            leadingVisual={
              <UserAvatar src={avatarLeonard} alt="Leonard Riley" size="24" />
            }
          />
          <MenuItem
            label="Staff Team"
            leadingVisual={
              <TeamAvatar
                src={avatarStaffTeam}
                alt="Staff Team"
                size="24"
                initials="St"
              />
            }
          />
        </div>
      </section>
      <section>
        <h3
          style={{
            marginBottom: 12,
            fontSize: 12,
            color: 'var(--center-channel-color)',
          }}
        >
          Secondary label
        </h3>
        <div style={menuDemoStyle}>
          <MenuItem label="Menu Item" secondaryLabel="Descriptive text below" />
          <MenuItem
            label="Menu Item"
            secondaryLabel="Inline text"
            secondaryLabelPosition="inline"
          />
        </div>
      </section>
      <section>
        <h3
          style={{
            marginBottom: 12,
            fontSize: 12,
            color: 'var(--center-channel-color)',
          }}
        >
          Team avatar
        </h3>
        <div style={menuDemoStyle}>
          <MenuItem
            label="Staff Team"
            leadingVisual={
              <TeamAvatar
                src={avatarStaffTeam}
                alt="Staff Team"
                size="24"
                variant="menu"
              />
            }
          />
          <MenuItem
            label="Core Team"
            leadingVisual={
              <TeamAvatar
                initials="Co"
                alt="Core Team"
                size="24"
                variant="menu"
              />
            }
          />
        </div>
      </section>
      <section>
        <h3
          style={{
            marginBottom: 12,
            fontSize: 12,
            color: 'var(--center-channel-color)',
          }}
        >
          User avatar
        </h3>
        <div style={menuDemoStyle}>
          <MenuItem
            label="Emma Novak"
            secondaryLabel="@emma"
            secondaryLabelPosition="inline"
            leadingVisual={
              <UserAvatar src={avatarEmma} alt="Emma Novak" size="24" />
            }
          />
        </div>
      </section>
      <section>
        <h3
          style={{
            marginBottom: 12,
            fontSize: 12,
            color: 'var(--center-channel-color)',
          }}
        >
          Badges and tag
        </h3>
        <div style={menuDemoStyle}>
          <MenuItem label="New feature" tag />
          <MenuItem label="Mentions" mentionCount={3} />
          <MenuItem label="Custom status" customStatusEmoji="🏄" />
        </div>
      </section>
      <section>
        <h3
          style={{
            marginBottom: 12,
            fontSize: 12,
            color: 'var(--center-channel-color)',
          }}
        >
          Destructive
        </h3>
        <div style={menuDemoStyle}>
          <MenuItem label="Delete item" destructive />
          <MenuItem label="Delete item" destructive trailingElement />
        </div>
      </section>
      <section>
        <h3
          style={{
            marginBottom: 12,
            fontSize: 12,
            color: 'var(--center-channel-color)',
          }}
        >
          Disabled
        </h3>
        <div style={menuDemoStyle}>
          <MenuItem label="Menu Item" disabled />
          <MenuItem label="With badge" disabled mentionCount={2} />
          <MenuItem label="Destructive" destructive disabled />
        </div>
      </section>
    </div>
  ),
};
