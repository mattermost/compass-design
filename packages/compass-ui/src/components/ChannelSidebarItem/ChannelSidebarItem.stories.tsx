import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import avatarDanielle from '@/assets/avatars/Danielle Okoro.png';
import avatarLeonard from '@/assets/avatars/Leonard Riley.png';
import avatarMarco from '@/assets/avatars/Marco Rinaldi.png';
import ChannelSidebarItem from './ChannelSidebarItem';
import type {
  ChannelSidebarItemLeadingVisual,
  ChannelSidebarItemStatus,
} from './ChannelSidebarItem';

const sidebarSurface = {
  padding: 16,
  borderRadius: 8,
  background: 'var(--sidebar-header-bg)',
  width: 280,
} as const;

const labelStyle = {
  width: '100%',
  fontSize: 12,
  color: 'var(--sidebar-text)',
  marginBottom: 8,
} as const;

const meta = {
  title: 'Components/Navigation/Channel Sidebar Item',
  component: ChannelSidebarItem,
  tags: ['autodocs'],
  argTypes: {
    leadingVisual: {
      control: 'select',
      options: [
        'public',
        'private',
        'group-message',
        'direct-message',
        'drafts',
        'insights',
        'threads',
        'dial-pad',
      ] satisfies ChannelSidebarItemLeadingVisual[],
    },
    status: {
      control: 'select',
      options: ['read', 'unread', 'mention'] satisfies ChannelSidebarItemStatus[],
    },
  },
  decorators: [
    (Story) => (
      <div style={sidebarSurface}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChannelSidebarItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PublicChannel: Story = {
  args: {
    leadingVisual: 'public',
    name: 'Design',
    onClick: fn(),
  },
};

export const Unread: Story = {
  args: {
    leadingVisual: 'public',
    name: 'Unread channel',
    status: 'unread',
    onClick: fn(),
  },
};

export const DirectMessage: Story = {
  args: {
    leadingVisual: 'direct-message',
    name: 'Leonard Riley',
    avatarSrc: avatarLeonard,
    avatarAlt: 'Leonard Riley',
    showAvatarStatus: true,
    onClick: fn(),
  },
};

export const Active: Story = {
  args: {
    leadingVisual: 'public',
    name: 'Active channel',
    active: true,
    onClick: fn(),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <section>
        <span style={labelStyle}>Leading visuals</span>
        <div style={{ display: 'grid', gap: 2 }}>
          <ChannelSidebarItem leadingVisual="public" name="Design" onClick={fn()} />
          <ChannelSidebarItem
            leadingVisual="private"
            name="Engineering"
            onClick={fn()}
          />
          <ChannelSidebarItem
            leadingVisual="group-message"
            name="Design Team"
            memberCount={4}
            onClick={fn()}
          />
          <ChannelSidebarItem
            leadingVisual="direct-message"
            name="Leonard Riley"
            avatarSrc={avatarLeonard}
            avatarAlt="Leonard Riley"
            showAvatarStatus
            onClick={fn()}
          />
          <ChannelSidebarItem leadingVisual="threads" name="threads" onClick={fn()} />
          <ChannelSidebarItem leadingVisual="drafts" name="drafts" onClick={fn()} />
          <ChannelSidebarItem
            leadingVisual="insights"
            name="Insights"
            onClick={fn()}
          />
        </div>
      </section>
      <section>
        <span style={labelStyle}>Status</span>
        <div style={{ display: 'grid', gap: 2 }}>
          <ChannelSidebarItem
            leadingVisual="public"
            name="Read channel"
            status="read"
            onClick={fn()}
          />
          <ChannelSidebarItem
            leadingVisual="public"
            name="Unread channel"
            status="unread"
            onClick={fn()}
          />
          <ChannelSidebarItem
            leadingVisual="public"
            name="Mention channel"
            status="mention"
            mentionCount={3}
            onClick={fn()}
          />
        </div>
      </section>
      <section>
        <span style={labelStyle}>Active and muted</span>
        <div style={{ display: 'grid', gap: 2 }}>
          <ChannelSidebarItem
            leadingVisual="public"
            name="Active channel"
            active
            onClick={fn()}
          />
          <ChannelSidebarItem
            leadingVisual="public"
            name="Muted channel"
            muted
            onClick={fn()}
          />
          <ChannelSidebarItem
            leadingVisual="direct-message"
            name="Danielle Okoro"
            avatarSrc={avatarDanielle}
            avatarAlt="Danielle Okoro"
            muted
            onClick={fn()}
          />
        </div>
      </section>
      <section>
        <span style={labelStyle}>Shared, call, emoji</span>
        <div style={{ display: 'grid', gap: 2 }}>
          <ChannelSidebarItem
            leadingVisual="public"
            name="Shared channel"
            sharedChannel
            onClick={fn()}
          />
          <ChannelSidebarItem
            leadingVisual="private"
            name="Call active"
            callActive
            onClick={fn()}
          />
          <ChannelSidebarItem
            leadingVisual="direct-message"
            name="Marco Rinaldi"
            avatarSrc={avatarMarco}
            avatarAlt="Marco Rinaldi"
            customStatusEmoji="🏄"
            onClick={fn()}
          />
        </div>
      </section>
    </div>
  ),
};
