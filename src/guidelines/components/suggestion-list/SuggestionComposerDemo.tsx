import type { ReactNode } from 'react';
import AccountMultipleOutlineIcon from '@mattermost/compass-icons/components/account-multiple-outline';
import GlobeIcon from '@mattermost/compass-icons/components/globe';
import LockOutlineIcon from '@mattermost/compass-icons/components/lock-outline';
import { MessageInput } from '@mattermost/compass-proto';
import { Emoji } from '@mattermost/compass-ui/components/emoji';
import { Icon } from '@mattermost/compass-ui/components/icon';
import {
  SuggestionList,
  type SuggestionSection,
} from '@mattermost/compass-ui/components/suggestion-list';
import { UserAvatar } from '@mattermost/compass-ui/components/user-avatar';
import avatarArjun from '@/assets/avatars/Arjun Patel.png';
import avatarEmma from '@/assets/avatars/Emma Novak.png';
import avatarSofia from '@/assets/avatars/Sofia Bauer.png';

export type SuggestionDemoKind = 'mention' | 'channel' | 'command' | 'emoji';

const avatar = (
  src: string,
  name: string,
  status: 'online' | 'away' | 'offline',
) => <UserAvatar size="24" src={src} alt="" name={name} status={status} />;

const DEMOS: Record<
  SuggestionDemoKind,
  { text: string; active: string; sections: SuggestionSection[] }
> = {
  mention: {
    text: 'Thanks @e',
    active: 'emma',
    sections: [
      {
        key: 'members',
        heading: 'Channel members',
        options: [
          {
            value: 'emma',
            label: 'emma.novak',
            secondaryLabel: 'Emma Novak',
            leadingVisual: avatar(avatarEmma, 'Emma Novak', 'online'),
          },
          {
            value: 'arjun',
            label: 'arjun.patel',
            secondaryLabel: 'Arjun Patel',
            leadingVisual: avatar(avatarArjun, 'Arjun Patel', 'away'),
          },
          {
            value: 'everyone',
            label: 'everyone',
            secondaryLabel: 'Notify everyone in the channel',
            leadingVisual: <Icon glyph={<AccountMultipleOutlineIcon />} />,
          },
        ],
      },
      {
        key: 'others',
        heading: 'Not in channel',
        options: [
          {
            value: 'sofia',
            label: 'sofia.bauer',
            secondaryLabel: 'Sofia Bauer',
            leadingVisual: avatar(avatarSofia, 'Sofia Bauer', 'offline'),
            trailingLabel: 'Not in channel',
          },
        ],
      },
    ],
  },
  channel: {
    text: 'Moved to ~de',
    active: 'design',
    sections: [
      {
        key: 'public',
        heading: 'Public channels',
        options: [
          {
            value: 'design',
            label: 'Design',
            secondaryLabel: '~design',
            leadingVisual: <Icon glyph={<GlobeIcon />} />,
          },
          {
            value: 'dev',
            label: 'Developers',
            secondaryLabel: '~developers',
            leadingVisual: <Icon glyph={<GlobeIcon />} />,
          },
        ],
      },
      {
        key: 'private',
        heading: 'Private channels',
        options: [
          {
            value: 'design-leads',
            label: 'Design leads',
            secondaryLabel: '~design-leads',
            leadingVisual: <Icon glyph={<LockOutlineIcon />} />,
          },
        ],
      },
    ],
  },
  command: {
    text: '/a',
    active: 'away',
    sections: [
      {
        key: 'commands',
        options: [
          {
            value: 'away',
            label: '/away',
            secondaryLabel: 'Set your status to away',
          },
          {
            value: 'archive',
            label: '/archive',
            secondaryLabel: 'Archive the current channel',
          },
          {
            value: 'announce',
            label: '/announce',
            secondaryLabel: 'Post an announcement to the channel',
          },
        ],
      },
    ],
  },
  emoji: {
    text: 'Ship it :ro',
    active: 'rocket',
    sections: [
      {
        key: 'emoji',
        options: [
          {
            value: 'rocket',
            label: ':rocket:',
            leadingVisual: <Emoji emoji="🚀" size="20" />,
          },
          {
            value: 'robot',
            label: ':robot_face:',
            leadingVisual: <Emoji emoji="🤖" size="20" />,
          },
          {
            value: 'rose',
            label: ':rose:',
            leadingVisual: <Emoji emoji="🌹" size="20" />,
          },
        ],
      },
    ],
  },
};

/**
 * A suggestion list open above the proto Message Input, as it sits in a
 * channel. Static: the typed text and highlighted row are fixed so the
 * specimen shows the state, and the field is not wired to the list.
 */
export default function SuggestionComposerDemo({
  kind,
  children,
}: {
  kind: SuggestionDemoKind;
  children?: ReactNode;
}) {
  const demo = DEMOS[kind];
  return (
    <div style={{ display: 'grid', gap: 'var(--spacing-xs)', width: '100%' }}>
      <SuggestionList
        sections={demo.sections}
        activeValue={demo.active}
        listboxLabel="Suggestions"
      />
      <MessageInput
        value={demo.text}
        onChange={() => {}}
        placeholder="Message #ux-design…"
      />
      {children}
    </div>
  );
}
