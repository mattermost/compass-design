import type { Meta, StoryObj } from '@storybook/react';
import ChevronRightIcon from '@mattermost/compass-icons/components/chevron-right';
import Icon from '../Icon/Icon';
import MenuItem from '../MenuItem/MenuItem';
import PopoverMenu, {
  PopoverMenuDivider,
  PopoverMenuGroup,
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
