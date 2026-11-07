import MessageTextOutlineIcon from '@mattermost/compass-icons/components/message-text-outline';
import CircleMultipleOutlineIcon from '@mattermost/compass-icons/components/circle-multiple-outline';
import PhoneInTalkIcon from '@mattermost/compass-icons/components/phone-in-talk';
import Emoji from '@/components/Emoji/Emoji';
import Icon from '@/components/Icon/Icon';
import TeamAvatar from '@/components/TeamAvatar/TeamAvatar';
import UserAvatar from '@/components/UserAvatar/UserAvatar';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import avatarDanielle from '@/assets/avatars/Danielle Okoro.png';
import avatarLeonard from '@/assets/avatars/Leonard Riley.png';
import avatarMarco from '@/assets/avatars/Marco Rinaldi.png';
import avatarStaffTeam from '@/assets/avatars/Staff Team.png';
import sampleImage from '@/assets/images/sample-image.jpg';
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
      options: [
        'read',
        'unread',
        'mention',
      ] satisfies ChannelSidebarItemStatus[],
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
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <section>
        <span style={labelStyle}>Leading visuals</span>
        <div style={{ display: 'grid', gap: 2 }}>
          <ChannelSidebarItem
            leadingVisual="public"
            name="Design"
            onClick={fn()}
          />
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
          <ChannelSidebarItem
            leadingVisual="threads"
            name="Threads"
            onClick={fn()}
          />
          <ChannelSidebarItem
            leadingVisual="drafts"
            name="Drafts"
            onClick={fn()}
          />
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
            trailingVisual={<Icon glyph={<PhoneInTalkIcon />} />}
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

const dot = (color: string, size = 8) => (
  <span
    style={{
      display: 'inline-block',
      width: size,
      height: size,
      borderRadius: '50%',
      background: color,
    }}
  />
);

const callPill = (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3px 5.5px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--color-green-600)',
      color: 'var(--color-neutral-0)',
    }}
  >
    <Icon glyph={<PhoneInTalkIcon />} />
  </span>
);

/**
 * `leadingVisual` accepts any node and `trailingVisual` adds a trailing slot.
 * Custom visuals sit in the same 24px icon column as the built-in icons, so
 * labels stay aligned, and `status` styling still applies.
 */
export const CustomVisuals: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <section>
        <div style={labelStyle}>Built-in (string) vs custom icon node</div>
        <ChannelSidebarItem name="Town Square" leadingVisual="public" />
        <ChannelSidebarItem
          name="Agent chat"
          leadingVisual={<Icon glyph={<MessageTextOutlineIcon />} />}
          onClick={fn()}
        />
      </section>
      <section>
        <div style={labelStyle}>Custom avatar (20px) in the leading slot</div>
        <ChannelSidebarItem
          name="Danielle Okoro"
          leadingVisual={
            <UserAvatar src={avatarDanielle} alt="" size="20" status />
          }
          onClick={fn()}
        />
      </section>
      <section>
        <div style={labelStyle}>Team avatar (24px) in the leading slot</div>
        <ChannelSidebarItem
          name="Staff Team"
          leadingVisual={<TeamAvatar src={avatarStaffTeam} alt="" size="24" />}
          onClick={fn()}
        />
        <ChannelSidebarItem
          name="Staff Team announcements"
          status="unread"
          leadingVisual={<TeamAvatar src={avatarStaffTeam} alt="" size="24" />}
          onClick={fn()}
        />
      </section>
      <section>
        <div style={labelStyle}>Custom image (20px rounded square)</div>
        <ChannelSidebarItem
          name="Design reviews"
          leadingVisual={
            <img
              src={sampleImage}
              alt=""
              width={20}
              height={20}
              style={{
                display: 'block',
                objectFit: 'cover',
                borderRadius: 'var(--radius-s)',
              }}
            />
          }
          onClick={fn()}
        />
        <ChannelSidebarItem
          name="Design reviews (unread)"
          status="unread"
          leadingVisual={
            <img
              src={sampleImage}
              alt=""
              width={20}
              height={20}
              style={{
                display: 'block',
                objectFit: 'cover',
                borderRadius: 'var(--radius-s)',
              }}
            />
          }
          onClick={fn()}
        />
      </section>
      <section>
        <div style={labelStyle}>Emoji in the leading slot</div>
        <ChannelSidebarItem
          name="Launch week"
          leadingVisual={<Emoji emoji="🚀" size="16" />}
          onClick={fn()}
        />
        <ChannelSidebarItem
          name="Celebrations"
          status="unread"
          leadingVisual={<Emoji emoji="🎉" size="16" />}
          onClick={fn()}
        />
        <ChannelSidebarItem
          name="Surf club"
          status="mention"
          mentionCount={2}
          leadingVisual={<Emoji emoji="🏄" size="16" />}
          onClick={fn()}
        />
        <ChannelSidebarItem
          name="Coffee chat"
          active
          leadingVisual={<Emoji emoji="☕" size="16" />}
          onClick={fn()}
        />
        <ChannelSidebarItem
          name="Book club"
          muted
          leadingVisual={<Emoji emoji="📚" size="16" />}
          onClick={fn()}
        />
      </section>
      <section>
        <div style={labelStyle}>Call icon and call icon in a green pill</div>
        <ChannelSidebarItem
          name="Design sync"
          leadingVisual="public"
          trailingVisual={<Icon glyph={<PhoneInTalkIcon />} />}
          onClick={fn()}
        />
        <ChannelSidebarItem
          name="Design sync"
          leadingVisual="public"
          trailingVisual={callPill}
          onClick={fn()}
        />
      </section>
      <section>
        <div style={labelStyle}>Custom indicator + trailing visual</div>
        <ChannelSidebarItem
          name="Release planning"
          status="unread"
          leadingVisual={dot('var(--sidebar-text-active-border)', 10)}
          trailingVisual={<Icon glyph={<CircleMultipleOutlineIcon />} />}
          onClick={fn()}
        />
        <ChannelSidebarItem
          name="Incident review"
          status="mention"
          mentionCount={3}
          active
          leadingVisual={<Icon glyph={<MessageTextOutlineIcon />} />}
          trailingVisual={dot('var(--sidebar-text-active-border)')}
          onClick={fn()}
        />
        <ChannelSidebarItem
          name="Muted agent"
          muted
          leadingVisual={<Icon glyph={<MessageTextOutlineIcon />} />}
          trailingVisual={dot('var(--sidebar-text)')}
        />
      </section>
    </div>
  ),
};
