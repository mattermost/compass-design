import GlobeIcon from '@mattermost/compass-icons/components/globe';
import SlashForwardBoxOutlineIcon from '@mattermost/compass-icons/components/slash-forward-box-outline';
import {
  MessageInput,
  MessageInputWithSuggestions,
  type MessageInputWithSuggestionsProps,
} from '@mattermost/compass-proto';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { UserAvatar } from '@mattermost/compass-ui/components/user-avatar';
import { Button } from '@mattermost/compass-ui/components/button';
import styles from '@/styles/library-demo/patterns.module.scss';

const SUGGESTIONS = [
  'Summarize this channel',
  'Draft a status update',
  'Find action items',
];

const MEMBERS = [
  ['alex', 'Alex Kim'],
  ['alina', 'Alina Rossi'],
  ['alvaro', 'Álvaro Gil'],
  ['bea', 'Bea Lindholm'],
];
const CHANNELS = [
  ['design', 'Design'],
  ['developers', 'Developers'],
  ['town-square', 'Town Square'],
];
const EMOJI = ['rocket', 'rose', 'raised_hands', 'tada'];
const COMMANDS = [
  ['away', 'Set your status to away'],
  ['archive', 'Archive the current channel'],
  ['announce', 'Post an announcement'],
];

const match = (q: string, value: string) => value.startsWith(q.toLowerCase());

/** Rows per trigger. A real host would query the server; `@` fakes a pending search. */
const SOURCES: MessageInputWithSuggestionsProps['sources'] = {
  '@': (q) => [
    {
      key: 'members',
      heading: 'Channel members',
      options: MEMBERS.filter(([u]) => match(q, u)).map(([u, name]) => ({
        value: u,
        label: u,
        secondaryLabel: name,
        leadingVisual: <UserAvatar size="24" name={name} alt="" />,
      })),
    },
  ],
  '~': (q) => [
    {
      key: 'channels',
      options: CHANNELS.filter(([c]) => match(q, c)).map(([c, name]) => ({
        value: c,
        label: name,
        secondaryLabel: `~${c}`,
        leadingVisual: <Icon glyph={<GlobeIcon />} />,
      })),
    },
  ],
  ':': (q) => [
    {
      key: 'emoji',
      options: EMOJI.filter((e) => match(q, e)).map((e) => ({
        value: e,
        label: `:${e}:`,
      })),
    },
  ],
  '/': (q) => [
    {
      key: 'commands',
      options: COMMANDS.filter(([c]) => match(q, c)).map(([c, hint]) => ({
        value: c,
        label: `/${c}`,
        secondaryLabel: hint,
        leadingVisual: <Icon glyph={<SlashForwardBoxOutlineIcon />} />,
      })),
    },
  ],
};

/**
 * Live autocomplete: `@` people, `~` channels, `:` emoji (two characters), `/`
 * commands (at the start). Arrow keys move, Enter or Tab insert, Escape closes.
 */
function AutocompleteDemo() {
  return (
    <MessageInputWithSuggestions
      placeholder="Type @al, ~de, :ro or /a…"
      sources={SOURCES}
      onSend={() => {}}
    />
  );
}

export default function MessageInputLibrary() {
  return (
    <div className={styles['patterns__message-input-demo']}>
      <p className={styles['patterns__variant-label']}>Default</p>
      <MessageInput placeholder="Message #ux-design…" />
      <p className={styles['patterns__variant-label']}>
        Narrow (right sidebar)
      </p>
      <div className={styles['patterns__message-input-narrow']}>
        <MessageInput placeholder="Message #ux-design…" width="narrow" />
      </div>
      <p className={styles['patterns__variant-label']}>
        With priority indicator
      </p>
      <MessageInput placeholder="Message #ux-design…" showPriorityIndicator />
      <p className={styles['patterns__variant-label']}>With attachments</p>
      <MessageInput placeholder="Message #ux-design…" showAttachments />
      <p className={styles['patterns__variant-label']}>
        With priority + attachments
      </p>
      <MessageInput
        placeholder="Message #ux-design…"
        showPriorityIndicator
        showAttachments
      />
      <p className={styles['patterns__variant-label']}>With suggestions</p>
      <MessageInput
        placeholder="Message #ux-design…"
        suggestions={
          <div className={styles['patterns__message-input-suggestions']}>
            {SUGGESTIONS.map((suggestion) => (
              <Button key={suggestion} emphasis="tertiary" size="small">
                {suggestion}
              </Button>
            ))}
          </div>
        }
      />
      <p className={styles['patterns__variant-label']}>
        With autocomplete (type @al, ~de, :ro or /a)
      </p>
      <AutocompleteDemo />
    </div>
  );
}
