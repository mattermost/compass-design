import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import avatarDanielle from '@/assets/avatars/Danielle Okoro.png';
import avatarEmma from '@/assets/avatars/Emma Novak.png';
import avatarLeonard from '@/assets/avatars/Leonard Riley.png';
import avatarMarco from '@/assets/avatars/Marco Rinaldi.png';
import avatarSofia from '@/assets/avatars/Sofia Bauer.png';
import MessageHeader from '@/components/MessageHeader/MessageHeader';
import UserAvatar from '@/components/UserAvatar/UserAvatar';
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
  decorators: [
    (Story, context) => (
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, maxWidth: 560 }}>
        <UserAvatar src={avatarEmma} name="Emma Novak" size="36" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 0 }}>
          <MessageHeader username="Emma Novak" timestamp="9:41 AM" />
          <p style={{ margin: 0, fontSize: 'var(--font-size-100)', lineHeight: 'var(--line-height-400)', color: 'var(--center-channel-color)' }}>
            This sprint we should prioritise the sidebar redesign — thoughts on timeline?
          </p>
          <Story {...context.args} />
        </div>
      </div>
    ),
  ],
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
  render: () => {
    const messageRow = (
      author: string,
      avatarSrc: string,
      text: string,
      footer: ReactNode,
    ) => (
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <UserAvatar src={avatarSrc} name={author} size="36" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 0 }}>
          <MessageHeader username={author} timestamp="9:41 AM" />
          <p style={{ margin: 0, fontSize: 'var(--font-size-100)', lineHeight: 'var(--line-height-400)', color: 'var(--center-channel-color)' }}>
            {text}
          </p>
          {footer}
        </div>
      </div>
    );

    return (
      <div style={{ display: 'grid', gap: 24, maxWidth: 560 }}>
        {messageRow(
          'Emma Novak',
          avatarEmma,
          'This sprint we should prioritise the sidebar redesign — thoughts on timeline?',
          <ThreadFooter replyCount={5} avatars={DEMO_AVATARS} />,
        )}
        {messageRow(
          'Leonard Riley',
          avatarLeonard,
          'Agreed. I can have the wireframes ready by end of week.',
          <ThreadFooter
            replyCount={2}
            avatars={DEMO_AVATARS.slice(3, 5)}
            following
            lastReplyTime="2 mins ago"
          />,
        )}
        {messageRow(
          'Danielle Okoro',
          avatarDanielle,
          'Can someone send over the latest design tokens?',
          <div style={{ display: 'grid', gap: 12 }}>
            <ThreadFooter replyCount={3} badge="unread" avatars={[DEMO_AVATARS[0]]} />
            <ThreadFooter replyCount={1} badge="mention" mentionCount={2} avatars={[DEMO_AVATARS[1]]} />
          </div>,
        )}
      </div>
    );
  },
};
