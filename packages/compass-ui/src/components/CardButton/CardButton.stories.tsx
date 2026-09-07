import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import GlobeIcon from '@mattermost/compass-icons/components/globe';
import LockIcon from '@mattermost/compass-icons/components/lock';
import Icon from '@/components/Icon/Icon';
import CardButton from './CardButton';
import CardButtonGroup from './CardButtonGroup';

const meta = {
  title: 'Components/Forms and Input/Card Button',
  component: CardButton,
  tags: ['autodocs'],
  argTypes: {
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof CardButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Private agent',
    description: 'Only invited members',
    icon: <Icon glyph={<LockIcon />} size="24" />,
    selected: false,
    onClick: fn(),
  },
};

export const Selected: Story = {
  args: {
    title: 'Private agent',
    description: 'Only invited members',
    icon: <Icon glyph={<LockIcon />} size="24" />,
    selected: true,
    onClick: fn(),
  },
};

export const Group: Story = {
  render: function GroupStory() {
    const [value, setValue] = useState<'private' | 'public'>('private');

    return (
      <CardButtonGroup aria-label="Agent visibility" style={{ maxWidth: 576 }}>
        <CardButton
          role="radio"
          title="Private agent"
          description="Only invited members"
          icon={<Icon glyph={<LockIcon />} size="24" />}
          selected={value === 'private'}
          onClick={() => setValue('private')}
        />
        <CardButton
          role="radio"
          title="Public agent"
          description="Any member can use"
          icon={<Icon glyph={<GlobeIcon />} size="24" />}
          selected={value === 'public'}
          onClick={() => setValue('public')}
        />
      </CardButtonGroup>
    );
  },
};

export const Disabled: Story = {
  args: {
    title: 'Public agent',
    description: 'Any member can use',
    icon: <Icon glyph={<GlobeIcon />} size="24" />,
    disabled: true,
    onClick: fn(),
  },
};
