import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ChevronRightIcon from '@mattermost/compass-icons/components/chevron-right';
import GlobeIcon from '@mattermost/compass-icons/components/globe';
import LockOutlineIcon from '@mattermost/compass-icons/components/lock-outline';
import SlashForwardIcon from '@mattermost/compass-icons/components/slash-forward';
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
 * rows. The scroll region owns the vertical padding, so only the 1px border is subtracted.
 */
const AUTOCOMPLETE_WIDTH = 480;
const AUTOCOMPLETE_MAX_HEIGHT = 'calc(304px - 2px)';

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

/** Figma "Leading Visual / Slash Command": a 32px tile (8px padding around a 16px glyph) with 6px above and below (one spacing step over the 4px in Figma), so the slot is 44px tall. */
function SlashCommandTile() {
  return (
    <span
      aria-hidden
      style={{
        display: 'flex',
        padding: 'var(--spacing-xs)',
        margin: 'var(--spacing-xxs) 0',
        borderRadius: 'var(--radius-s)',
        background: 'rgba(var(--center-channel-color-rgb), 0.08)',
      }}
    >
      <Icon glyph={<SlashForwardIcon />} />
    </span>
  );
}

/** Integration commands bring their own image instead of the "/" tile; same 32px footprint and 6px margins. */
const APP_ICON_SRC = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#E0622F"/><path d="M16 6l8 10-8 10-8-10z" fill="#fff"/></svg>',
)}`;

function SlashCommandAppIcon() {
  return (
    <img
      src={APP_ICON_SRC}
      alt=""
      style={{
        display: 'block',
        width: 32,
        height: 32,
        margin: 'var(--spacing-xxs) 0',
        borderRadius: 'var(--radius-pill)',
        objectFit: 'cover',
      }}
    />
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
            label="deploy [command]"
            secondaryLabel="Available commands: status, releases, rollbacks, expire_freeze, help, about"
            leadingVisual={<SlashCommandAppIcon />}
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
