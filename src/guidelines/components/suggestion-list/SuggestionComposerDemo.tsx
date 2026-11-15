import { useCallback, useRef, type ReactNode } from 'react';
import AccountMultipleOutlineIcon from '@mattermost/compass-icons/components/account-multiple-outline';
import GlobeIcon from '@mattermost/compass-icons/components/globe';
import LockOutlineIcon from '@mattermost/compass-icons/components/lock-outline';
import {
  AnchoredPopup,
  MessageInput,
  getTextareaCharRect,
} from '@mattermost/compass-proto';
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
  {
    text: string;
    /** The character that opened the list; the popup sits at its position. */
    trigger: string;
    active: string;
    sections: SuggestionSection[];
  }
> = {
  mention: {
    trigger: '@',
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
    trigger: '~',
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
    trigger: '/',
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
    trigger: ':',
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

/** Popup width: the list's 480px max, less the viewport margins. */
const POPUP_WIDTH = 'min(480px, calc(100vw - 16px))';

/**
 * A suggestion list open above the proto Message Input, as it sits in a
 * channel. The list portals to the body and floats on top of the page,
 * positioned horizontally at the trigger character (`@`, `~`, `:` or `/`) that
 * opened it, overlapping the input box's top edge by 4px (`AnchoredPopup` with
 * `getTextareaCharRect`), so the demo
 * reserves empty space above the input for it. Static: the typed text and
 * highlighted row are fixed to show the state, and the field is not wired to
 * the list.
 */
export default function SuggestionComposerDemo({
  kind,
  children,
}: {
  kind: SuggestionDemoKind;
  children?: ReactNode;
}) {
  const demo = DEMOS[kind];
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  // Horizontally at the trigger character, vertically against the input box
  // (not the text line, which sits inside the box's border and padding).
  const getAnchorRect = useCallback(() => {
    const textarea = inputRef.current;
    const box = boxRef.current?.getBoundingClientRect();
    if (!textarea || !box) return null;
    const char = getTextareaCharRect(
      textarea,
      demo.text.lastIndexOf(demo.trigger),
    );
    // At least 4px in from the input's left edge.
    return {
      left: Math.max(char.left, box.left + 4),
      top: box.top,
      bottom: box.bottom,
      width: 0,
    };
  }, [demo]);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        // Room for the floating list above the input.
        minHeight: 360,
        width: '100%',
      }}
    >
      <div ref={boxRef}>
        <MessageInput
          inputRef={inputRef}
          value={demo.text}
          onChange={() => {}}
          placeholder="Message #ux-design…"
        />
      </div>
      <AnchoredPopup
        getAnchorRect={getAnchorRect}
        // Always above the input, never flipping to fit.
        flip={false}
        // Overlaps the input's top edge by 4px.
        gap={-4}
        style={{ width: POPUP_WIDTH }}
        data-testid={`suggestions-${kind}`}
      >
        <SuggestionList
          sections={demo.sections}
          activeValue={demo.active}
          listboxLabel="Suggestions"
        />
      </AnchoredPopup>
      {children}
    </div>
  );
}
