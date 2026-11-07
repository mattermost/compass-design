import { useState } from 'react';
import MessageTextOutlineIcon from '@mattermost/compass-icons/components/message-text-outline';
import CircleMultipleOutlineIcon from '@mattermost/compass-icons/components/circle-multiple-outline';
import PhoneInTalkIcon from '@mattermost/compass-icons/components/phone-in-talk';
import MessageOutlineIcon from '@mattermost/compass-icons/components/message-outline';
import PlusIcon from '@mattermost/compass-icons/components/plus';
import DotsVerticalIcon from '@mattermost/compass-icons/components/dots-vertical';
import Emoji from '@/components/Emoji/Emoji';
import Icon from '@/components/Icon/Icon';
import IconButton from '@/components/IconButton/IconButton';
import UserAvatar from '@/components/UserAvatar/UserAvatar';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import avatarDanielle from '@/assets/avatars/Danielle Okoro.png';
import avatarLeonard from '@/assets/avatars/Leonard Riley.png';
import avatarMarco from '@/assets/avatars/Marco Rinaldi.png';
import avatarMatty from '@/assets/avatars/Matty.png';
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
            trailingVisual={<Icon glyph={<PhoneInTalkIcon />} size="12" />}
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
    <Icon glyph={<PhoneInTalkIcon />} size="12" />
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
          trailingVisual={<Icon glyph={<PhoneInTalkIcon />} size="12" />}
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

type AgentChatState = 'idle' | 'generating' | 'unread';

interface AgentChat {
  id: string;
  title: string;
  state: AgentChatState;
}

interface Agent {
  id: string;
  name: string;
  avatar: string;
  chats: AgentChat[];
}

const AGENTS: Agent[] = [
  {
    id: 'research',
    name: 'Research agent',
    avatar: avatarMatty,
    chats: [
      { id: 'r1', title: 'Compare vector databases', state: 'generating' },
      { id: 'r2', title: 'Summarize the Q3 survey', state: 'unread' },
      { id: 'r3', title: 'Competitor pricing notes', state: 'idle' },
    ],
  },
  {
    id: 'docs',
    name: 'Docs agent',
    avatar: avatarMatty,
    chats: [
      { id: 'd1', title: 'Rewrite the onboarding guide', state: 'idle' },
      { id: 'd2', title: 'API reference gaps', state: 'idle' },
    ],
  },
];

const waveDotStyle = {
  width: 3,
  height: 3,
  borderRadius: '50%',
  background: 'currentColor',
  animation: 'agents-wave 1s ease-in-out infinite',
} as const;

/** The chat's leading visual: a chat icon, a responding wave, or an unread dot. */
function chatVisual(state: AgentChatState) {
  if (state === 'generating') {
    return (
      <span
        style={{ display: 'inline-flex', gap: 2, alignItems: 'center' }}
        aria-hidden
      >
        <style>{`
          @keyframes agents-wave { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
          @media (prefers-reduced-motion: reduce) { [data-agents-wave] { animation: none !important; } }
        `}</style>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            data-agents-wave
            style={{ ...waveDotStyle, animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </span>
    );
  }
  if (state === 'unread') return dot('var(--mention-bg)', 8);
  return <Icon glyph={<MessageOutlineIcon />} size="12" />;
}

function AgentsSidebarExample() {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [activeChat, setActiveChat] = useState<string | null>('r3');
  const [activeAgent, setActiveAgent] = useState<string | null>('research');
  const [menuFor, setMenuFor] = useState<string | null>(null);

  return (
    <>
      {/* Collapse animates the grid row 0fr <-> 1fr and stays mounted; the
          list leaves the tab order and accessibility tree once it closes. */}
      <style>{`
        .agents-collapse { display: grid; grid-template-rows: 1fr; visibility: visible; transition: grid-template-rows var(--duration-moderate) var(--ease-transition), visibility 0s linear 0s; }
        .agents-collapse[data-collapsed] { grid-template-rows: 0fr; visibility: hidden; transition: grid-template-rows var(--duration-moderate) var(--ease-transition), visibility 0s linear var(--duration-moderate); }
        .agents-collapse > div { min-height: 0; overflow: hidden; }
        @media (prefers-reduced-motion: reduce) { .agents-collapse, .agents-collapse[data-collapsed] { transition: none; } }
      `}</style>
      {AGENTS.map((agent) => {
        const isCollapsed = Boolean(collapsed[agent.id]);
        const listId = `agent-chats-${agent.id}`;
        return (
          <div key={agent.id}>
            <ChannelSidebarItem
              name={agent.name}
              leadingVisual="direct-message"
              avatarSrc={agent.avatar}
              avatarAlt=""
              active={activeAgent === agent.id && (!activeChat || isCollapsed)}
              onClick={() => {
                setActiveAgent(agent.id);
                setActiveChat(null);
                setCollapsed((prev) => ({ ...prev, [agent.id]: false }));
              }}
              expanded={!isCollapsed}
              onExpandedChange={(next) =>
                setCollapsed((prev) => ({ ...prev, [agent.id]: !next }))
              }
              controlsId={listId}
              toggleLabel={`${agent.name} chats`}
              actionsReveal="always"
              actions={
                <IconButton
                  size="x-small"
                  style="inverted"
                  icon={<Icon glyph={<PlusIcon />} />}
                  aria-label={`New chat with ${agent.name}`}
                  onClick={fn()}
                />
              }
            />
            <div
              className="agents-collapse"
              data-collapsed={isCollapsed || undefined}
            >
              <div>
                <ul
                  id={listId}
                  aria-label={`${agent.name} chats`}
                  style={{ margin: 0, padding: 0, listStyle: 'none' }}
                >
                  {agent.chats.map((chat) => (
                    <li key={chat.id}>
                      <ChannelSidebarItem
                        name={chat.title}
                        leadingVisual={chatVisual(chat.state)}
                        status={chat.state === 'unread' ? 'unread' : 'read'}
                        active={activeChat === chat.id}
                        onClick={() => {
                          setActiveAgent(agent.id);
                          setActiveChat(chat.id);
                        }}
                        actionsOpen={menuFor === chat.id}
                        actions={
                          <IconButton
                            size="x-small"
                            style="inverted"
                            icon={<Icon glyph={<DotsVerticalIcon />} />}
                            aria-label={`Actions for ${chat.title}`}
                            aria-expanded={menuFor === chat.id}
                            onClick={() =>
                              setMenuFor((cur) =>
                                cur === chat.id ? null : chat.id,
                              )
                            }
                          />
                        }
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

/**
 * The Agents plugin sidebar, built without overlays: a collapsible parent row
 * (`expanded` chevron in the left gutter, a "new chat" button via `actions`
 * with `actionsReveal="always"`) and child chat rows (a custom
 * `leadingVisual` for the chat icon, responding wave or unread dot, and an
 * actions menu button via `actions`, kept revealed with `actionsOpen` while
 * its menu is open). Hover or focus a row to see the chevron and menu button;
 * the chevron and the + stay clickable. The list and its collapse are the
 * host's.
 */
export const AgentsSidebar: Story = {
  parameters: { controls: { disable: true } },
  render: () => <AgentsSidebarExample />,
};
