import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import avatarStaffTeam from '@/assets/avatars/Staff Team.png';
import TeamAvatar from './TeamAvatar';
import type { TeamAvatarSize } from './TeamAvatar';

const SIZES: TeamAvatarSize[] = ['24', '32', '40', '48', '56', '64'];

const sidebarSurface = {
  padding: 16,
  borderRadius: 8,
  background: 'var(--sidebar-header-bg)',
} as const;

const centerChannelSurface = {
  padding: 16,
  borderRadius: 8,
  background: 'var(--center-channel-bg)',
  border: '1px solid rgba(var(--center-channel-color-rgb), 0.16)',
} as const;

const labelStyle = {
  width: '100%',
  fontSize: 12,
  color: 'var(--sidebar-text)',
  marginBottom: 8,
} as const;

const meta = {
  title: 'Components/Images and Icons/Team Avatar',
  component: TeamAvatar,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: SIZES },
    state: { control: 'select', options: ['default', 'active'] },
    variant: { control: 'select', options: ['sidebar', 'menu'] },
  },
} satisfies Meta<typeof TeamAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: avatarStaffTeam,
    alt: 'Staff Team',
    size: '40',
  },
};

export const Active: Story = {
  args: {
    src: avatarStaffTeam,
    alt: 'Staff Team',
    size: '40',
    state: 'active',
  },
};

export const Fallback: Story = {
  args: {
    alt: 'Core Team',
    initials: 'Ac',
    size: '40',
  },
};

export const Menu: Story = {
  args: {
    src: avatarStaffTeam,
    alt: 'Staff Team',
    size: '24',
    variant: 'menu',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          padding: 16,
          borderRadius: 8,
          background: 'var(--center-channel-bg)',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export const WithBadge: Story = {
  args: {
    src: avatarStaffTeam,
    alt: 'Staff Team',
    size: '40',
    badge: 5,
  },
};

function Row({
  label,
  labelColor,
  children,
}: {
  label: string;
  labelColor?: string;
  children: ReactNode;
}) {
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <span style={{ ...labelStyle, color: labelColor ?? labelStyle.color }}>
        {label}
      </span>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          alignItems: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ ...sidebarSurface, display: 'grid', gap: 24 }}>
        <Row label="Default — Image">
          {SIZES.map((size) => (
            <TeamAvatar
              key={size}
              src={avatarStaffTeam}
              alt="Staff Team"
              size={size}
            />
          ))}
        </Row>
        <Row label="Active — Image">
          {SIZES.map((size) => (
            <TeamAvatar
              key={size}
              src={avatarStaffTeam}
              alt="Staff Team"
              size={size}
              state="active"
            />
          ))}
        </Row>
        <Row label="Default — Fallback">
          {SIZES.map((size) => (
            <TeamAvatar key={size} alt="Core Team" initials="Ac" size={size} />
          ))}
        </Row>
        <Row label="Active — Fallback">
          {SIZES.map((size) => (
            <TeamAvatar
              key={size}
              alt="Design Team"
              initials="Ac"
              size={size}
              state="active"
            />
          ))}
        </Row>
        <Row label="Badge">
          <TeamAvatar
            src={avatarStaffTeam}
            alt="Staff Team"
            size="32"
            badge={1}
          />
          <TeamAvatar
            src={avatarStaffTeam}
            alt="Staff Team"
            size="40"
            badge={5}
          />
          <TeamAvatar
            src={avatarStaffTeam}
            alt="Staff Team"
            size="56"
            badge={99}
          />
        </Row>
      </div>
      <div style={{ ...centerChannelSurface, display: 'grid', gap: 24 }}>
        <Row label="Menu — Image" labelColor="var(--center-channel-color)">
          {SIZES.map((size) => (
            <TeamAvatar
              key={size}
              src={avatarStaffTeam}
              alt="Staff Team"
              size={size}
              variant="menu"
            />
          ))}
        </Row>
        <Row label="Menu — Fallback" labelColor="var(--center-channel-color)">
          {SIZES.map((size) => (
            <TeamAvatar
              key={size}
              alt="Core Team"
              initials="Ac"
              size={size}
              variant="menu"
            />
          ))}
        </Row>
      </div>
    </div>
  ),
};
