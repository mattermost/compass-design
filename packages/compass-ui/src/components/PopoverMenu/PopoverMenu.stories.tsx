import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ChevronRightIcon from '@mattermost/compass-icons/components/chevron-right';
import GlobeIcon from '@mattermost/compass-icons/components/globe';
import LockOutlineIcon from '@mattermost/compass-icons/components/lock-outline';
import avatarEmma from '@/assets/avatars/Emma Novak.png';
import Emoji from '../Emoji/Emoji';
import Icon from '../Icon/Icon';
import MenuItem from '../MenuItem/MenuItem';
import UserAvatar from '../UserAvatar/UserAvatar';
import PopoverMenu, {
  PopoverMenuDivider,
  PopoverMenuGroup,
  PopoverMenuGroupTitle,
  PopoverMenuScroll,
  PopoverMenuTitle,
} from './PopoverMenu';

const meta = {
  title: 'Patterns/Popover Menu',
  component: PopoverMenu,
  tags: ['autodocs'],
} satisfies Meta<typeof PopoverMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
  render: () => (
    <PopoverMenu>
      <PopoverMenuTitle>Actions</PopoverMenuTitle>
      <PopoverMenuGroup>
        <MenuItem label="Mute channel" />
        <MenuItem label="Favorite" />
      </PopoverMenuGroup>
      <PopoverMenuDivider />
      <PopoverMenuGroup>
        <MenuItem label="Copy link" />
        <MenuItem label="Open in new window" />
      </PopoverMenuGroup>
    </PopoverMenu>
  ),
};

export const ChildMenu: Story = {
  name: 'Child menu',
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
      <PopoverMenu>
        <MenuItem
          label="Channel settings"
          trailingElement
          trailingVisual={<Icon glyph={<ChevronRightIcon />} />}
        />
      </PopoverMenu>
      <PopoverMenu variant="child">
        <MenuItem label="Rename channel" />
        <MenuItem label="Convert to private" />
      </PopoverMenu>
    </div>
  ),
};

export const OpenTransition: Story = {
  name: 'Open transition',
  render: function Render() {
    const [open, setOpen] = useState(true);
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          alignItems: 'flex-start',
        }}
      >
        <button type="button" onClick={() => setOpen((v) => !v)}>
          {open ? 'Close' : 'Open'}
        </button>
        <PopoverMenu open={open}>
          <MenuItem label="Mute channel" />
          <MenuItem label="Favorite" />
        </PopoverMenu>
      </div>
    );
  },
};

/**
 * Autocomplete popovers are 480px wide and at most 304px tall. They are plain popover menus: the
 * host positions them above the message box and moves `active` as the user arrows through the
 * rows. The scroll region leaves room for the menu's 8px vertical padding and 1px border.
 */
const AUTOCOMPLETE_WIDTH = 480;
const AUTOCOMPLETE_MAX_HEIGHT = 'calc(304px - 18px)';

export const UserAutocomplete: Story = {
  name: 'User autocomplete',
  render: () => (
    <PopoverMenu style={{ width: AUTOCOMPLETE_WIDTH }} aria-label="Users">
      <PopoverMenuScroll maxHeight={AUTOCOMPLETE_MAX_HEIGHT}>
        <PopoverMenuGroup>
          <PopoverMenuGroupTitle>Channel members</PopoverMenuGroupTitle>
          <MenuItem
            active
            label="@emma"
            secondaryLabel="Emma Novak"
            secondaryLabelPosition="inline"
            leadingVisual={
              <UserAvatar src={avatarEmma} alt="Emma Novak" size="24" status />
            }
          />
          <MenuItem
            label="@emily"
            secondaryLabel="Emily Chen"
            secondaryLabelPosition="inline"
            leadingVisual={
              <UserAvatar alt="Emily Chen" name="Emily Chen" size="24" />
            }
          />
        </PopoverMenuGroup>
        <PopoverMenuDivider />
        <PopoverMenuGroup>
          <PopoverMenuGroupTitle>Other members</PopoverMenuGroupTitle>
          <MenuItem
            label="@emil"
            secondaryLabel="Emil Jansen"
            secondaryLabelPosition="inline"
            leadingVisual={
              <UserAvatar alt="Emil Jansen" name="Emil Jansen" size="24" />
            }
          />
        </PopoverMenuGroup>
      </PopoverMenuScroll>
    </PopoverMenu>
  ),
};

/** The command tile is larger than a row icon: 40px, so the row grows and the label stays centered on it. */
function SlashCommandTile() {
  return (
    <span
      aria-hidden
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: 'var(--radius-s)',
        background: 'rgba(var(--center-channel-color-rgb), 0.08)',
        color: 'rgba(var(--center-channel-color-rgb), 0.72)',
        fontSize: 'var(--font-size-400)',
        lineHeight: 1,
      }}
    >
      /
    </span>
  );
}

export const SlashCommandAutocomplete: Story = {
  name: 'Slash command autocomplete',
  render: () => (
    <PopoverMenu style={{ width: AUTOCOMPLETE_WIDTH }} aria-label="Commands">
      <PopoverMenuScroll maxHeight={AUTOCOMPLETE_MAX_HEIGHT}>
        <PopoverMenuGroup>
          <PopoverMenuGroupTitle>Commands</PopoverMenuGroupTitle>
          <MenuItem
            active
            label="agenda [command]"
            secondaryLabel="Available commands: list, queue, setting, help"
            leadingVisual={<SlashCommandTile />}
          />
          <MenuItem
            label="away"
            secondaryLabel="Set your status to away"
            leadingVisual={<SlashCommandTile />}
          />
          <MenuItem
            label="call [subcommand]"
            secondaryLabel="Start or join a call in the current channel"
            leadingVisual={<SlashCommandTile />}
          />
          <MenuItem
            label="code"
            secondaryLabel="Display text as a code block"
            leadingVisual={<SlashCommandTile />}
          />
        </PopoverMenuGroup>
      </PopoverMenuScroll>
    </PopoverMenu>
  ),
};

export const ChannelLinkAutocomplete: Story = {
  name: 'Channel link autocomplete',
  render: () => (
    <PopoverMenu style={{ width: AUTOCOMPLETE_WIDTH }} aria-label="Channels">
      <PopoverMenuScroll maxHeight={AUTOCOMPLETE_MAX_HEIGHT}>
        <PopoverMenuGroup>
          <PopoverMenuGroupTitle>Public channels</PopoverMenuGroupTitle>
          <MenuItem
            active
            label="Design"
            secondaryLabel="~design"
            secondaryLabelPosition="inline"
            leadingVisual={<Icon glyph={<GlobeIcon />} />}
          />
          <MenuItem
            label="Design Systems"
            secondaryLabel="~design-systems"
            secondaryLabelPosition="inline"
            leadingVisual={<Icon glyph={<GlobeIcon />} />}
          />
        </PopoverMenuGroup>
        <PopoverMenuDivider />
        <PopoverMenuGroup>
          <PopoverMenuGroupTitle>Private channels</PopoverMenuGroupTitle>
          <MenuItem
            label="Design Leads"
            secondaryLabel="~design-leads"
            secondaryLabelPosition="inline"
            leadingVisual={<Icon glyph={<LockOutlineIcon />} />}
          />
        </PopoverMenuGroup>
      </PopoverMenuScroll>
    </PopoverMenu>
  ),
};

export const EmojiAutocomplete: Story = {
  name: 'Emoji autocomplete',
  render: () => (
    <PopoverMenu style={{ width: AUTOCOMPLETE_WIDTH }} aria-label="Emoji">
      <PopoverMenuScroll maxHeight={AUTOCOMPLETE_MAX_HEIGHT}>
        <PopoverMenuGroup>
          <MenuItem
            active
            label=":smile:"
            leadingVisual={<Emoji emoji="😄" size="16" />}
          />
          <MenuItem
            label=":smiley:"
            leadingVisual={<Emoji emoji="😃" size="16" />}
          />
          <MenuItem
            label=":smirk:"
            leadingVisual={<Emoji emoji="😏" size="16" />}
          />
          <MenuItem
            label=":smile_cat:"
            leadingVisual={<Emoji emoji="😸" size="16" />}
          />
        </PopoverMenuGroup>
      </PopoverMenuScroll>
    </PopoverMenu>
  ),
};

const MEMBERS = [
  'Aiko Tan',
  'Arjun Patel',
  'Danielle Okoro',
  'Darius Cole',
  'David Liang',
  'Emma Novak',
  'Ethan Brooks',
  'Isabella Cruz',
  'Leila Haddad',
  'Leonard Riley',
  'Lukas Meyer',
  'Marco Rinaldi',
];

/** A long result list scrolls inside the 304px popover. */
export const AutocompleteScrolling: Story = {
  name: 'Autocomplete scrolling',
  render: () => (
    <PopoverMenu style={{ width: AUTOCOMPLETE_WIDTH }} aria-label="Users">
      <PopoverMenuScroll maxHeight={AUTOCOMPLETE_MAX_HEIGHT}>
        <PopoverMenuGroup>
          {MEMBERS.map((name, i) => (
            <MenuItem
              key={name}
              active={i === 0}
              label={`@${name.split(' ')[0].toLowerCase()}`}
              secondaryLabel={name}
              secondaryLabelPosition="inline"
              leadingVisual={<UserAvatar alt={name} name={name} size="24" />}
            />
          ))}
        </PopoverMenuGroup>
      </PopoverMenuScroll>
    </PopoverMenu>
  ),
};
