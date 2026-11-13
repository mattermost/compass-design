import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import AccountMultipleOutlineIcon from '@mattermost/compass-icons/components/account-multiple-outline';
import SuggestionList from './SuggestionList';
import { useSuggestionList } from './useSuggestionList';
import type { SuggestionOption, SuggestionSection } from './useSuggestionList';
import Icon from '../Icon/Icon';
import UserAvatar from '../UserAvatar/UserAvatar';
import avatarArjun from '@/assets/avatars/Arjun Patel.png';
import avatarEmma from '@/assets/avatars/Emma Novak.png';
import avatarMarco from '@/assets/avatars/Marco Rinaldi.png';
import avatarSofia from '@/assets/avatars/Sofia Bauer.png';

const avatar = (
  src: string,
  name: string,
  status: 'online' | 'away' | 'do-not-disturb' | 'offline',
) => <UserAvatar size="24" src={src} alt="" name={name} status={status} />;

const MEMBERS: SuggestionOption[] = [
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
    value: 'marco',
    label: 'marco.rinaldi',
    secondaryLabel: 'Marco Rinaldi',
    leadingVisual: avatar(avatarMarco, 'Marco Rinaldi', 'do-not-disturb'),
  },
];

const GROUPS: SuggestionOption[] = [
  {
    value: 'here',
    label: 'here',
    secondaryLabel: 'Notify everyone online in the channel',
    leadingVisual: <Icon glyph={<AccountMultipleOutlineIcon />} />,
  },
];

const NOT_IN_CHANNEL: SuggestionOption[] = [
  {
    value: 'sofia',
    label: 'sofia.bauer',
    secondaryLabel: 'Sofia Bauer',
    leadingVisual: avatar(avatarSofia, 'Sofia Bauer', 'offline'),
    trailingLabel: 'Not in channel',
  },
];

const SECTIONS: SuggestionSection[] = [
  { key: 'members', heading: 'Channel members', options: MEMBERS },
  { key: 'groups', heading: 'Groups', options: GROUPS },
  { key: 'others', heading: 'Not in channel', options: NOT_IN_CHANNEL },
];

const meta = {
  title: 'Components/Messaging/Suggestion List',
  component: SuggestionList,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
  args: { options: MEMBERS, activeValue: 'emma' },
} satisfies Meta<typeof SuggestionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Grouped: Story = {
  name: 'Groups and "not in channel"',
  args: { options: undefined, sections: SECTIONS },
};

/** Type to filter. Arrow keys move, Enter or Tab accept, Escape closes; focus stays in the field. */
export const WithComposer: Story = {
  name: 'With a composer field',
  render: function WithComposer() {
    const [text, setText] = useState('@');
    const [open, setOpen] = useState(true);
    const query = text.startsWith('@') ? text.slice(1).toLowerCase() : null;
    const sections = SECTIONS.map((s) => ({
      ...s,
      options: s.options.filter((o) =>
        String(o.label)
          .toLowerCase()
          .includes(query ?? ''),
      ),
    })).filter((s) => s.options.length > 0);
    const suggestions = useSuggestionList({
      sections,
      open: open && query !== null,
      onClose: () => setOpen(false),
      onSelect: (o) => {
        setText(`@${o.label} `);
        setOpen(false);
      },
    });
    return (
      <div style={{ display: 'grid', gap: 8 }}>
        {open && query !== null && sections.length > 0 && (
          <SuggestionList {...suggestions.listProps} sections={sections} />
        )}
        <textarea
          aria-label="Message"
          rows={2}
          value={text}
          {...suggestions.inputProps}
          onChange={(e) => {
            setText(e.target.value);
            setOpen(true);
          }}
          onKeyDown={suggestions.onKeyDown}
          style={{ font: 'inherit', padding: 8 }}
        />
      </div>
    );
  },
};
