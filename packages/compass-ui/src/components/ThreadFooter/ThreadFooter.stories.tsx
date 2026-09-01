import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import avatarDanielle from '@/assets/avatars/Danielle Okoro.png';
import avatarEmma from '@/assets/avatars/Emma Novak.png';
import avatarLeonard from '@/assets/avatars/Leonard Riley.png';
import avatarMarco from '@/assets/avatars/Marco Rinaldi.png';
import avatarSofia from '@/assets/avatars/Sofia Bauer.png';
import ThreadFooter from './ThreadFooter';
import type { ThreadFooterBadge } from './ThreadFooter';

const DEMO_AVATARS = [
  { key: 'leonard', src: avatarLeonard, name: 'Leonard Riley' },
  { key: 'danielle', src: avatarDanielle, name: 'Danielle Okoro' },
  { key: 'marco', src: avatarMarco, name: 'Marco Rinaldi' },
  { key: 'emma', src: avatarEmma, name: 'Emma Novak' },
  { key: 'sofia', src: avatarSofia, name: 'Sofia Bauer' },
];

const BADGES: ThreadFooterBadge[] = ['none', 'unread', 'mention'];

const meta = {
  title: 'Components/Messaging/Thread Footer',
  component: ThreadFooter,
  tags: ['autodocs'],
  argTypes: {
    badge: { control: 'select', options: BADGES },
    mentionCount: { control: 'number' },
    replyCount: { control: 'number' },
    following: { control: 'boolean' },
    hovered: { control: 'boolean' },
  },
  args: {
    onReply: fn(),
    onFollowToggle: fn(),
  },
} satisfies Meta<typeof ThreadFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    replyCount: 5,
    avatars: DEMO_AVATARS,
  },
};

export const Following: Story = {
  args: {
    replyCount: 2,
    avatars: DEMO_AVATARS.slice(3, 5),
    following: true,
    lastReplyTime: '2 mins ago',
  },
};

export const Unread: Story = {
  args: {
    replyCount: 3,
    badge: 'unread',
    avatars: [DEMO_AVATARS[0]],
  },
};

export const Mention: Story = {
  args: {
    replyCount: 1,
    badge: 'mention',
    mentionCount: 2,
    avatars: [DEMO_AVATARS[1]],
  },
};

export const ReplyHovered: Story = {
  args: {
    replyCount: 3,
    avatars: DEMO_AVATARS.slice(0, 3),
    hovered: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24, maxWidth: 560 }}>
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
        <ThreadFooter replyCount={5} avatars={DEMO_AVATARS} />
      </section>
      <section>
        <h3
          style={{
            marginBottom: 12,
            fontSize: 12,
            color: 'var(--center-channel-color)',
          }}
        >
          Following
        </h3>
        <ThreadFooter
          replyCount={2}
          avatars={DEMO_AVATARS.slice(3, 5)}
          following
          lastReplyTime="2 mins ago"
        />
      </section>
      <section>
        <h3
          style={{
            marginBottom: 12,
            fontSize: 12,
            color: 'var(--center-channel-color)',
          }}
        >
          Badges
        </h3>
        <div style={{ display: 'grid', gap: 12 }}>
          <ThreadFooter
            replyCount={3}
            badge="unread"
            avatars={[DEMO_AVATARS[0]]}
          />
          <ThreadFooter
            replyCount={1}
            badge="mention"
            mentionCount={2}
            avatars={[DEMO_AVATARS[1]]}
          />
        </div>
      </section>
    </div>
  ),
};
