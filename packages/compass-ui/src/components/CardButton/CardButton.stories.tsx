import { useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import GlobeIcon from '@mattermost/compass-icons/components/globe';
import LockOutlineIcon from '@mattermost/compass-icons/components/lock-outline';
import Icon from '@/components/Icon/Icon';
import CardButton from './CardButton';
import type { CardButtonProps } from './CardButton';
import CardButtonGroup from './CardButtonGroup';
import { iconSelectArgType, resolveStoryIcon } from '../../storybook/icons';

type CardButtonStoryArgs = Omit<CardButtonProps, 'icon'> & {
  icon: string;
};

const meta = {
  title: 'Components/Forms and Input/Card Button',
  component: CardButton,
  tags: ['autodocs'],
  argTypes: {
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    icon: iconSelectArgType({
      description: 'Leading icon glyph from @mattermost/compass-icons.',
    }),
  },
  render: ({ icon, ...rest }) => (
    <CardButton
      {...rest}
      icon={resolveStoryIcon(icon, { wrapSize: '24' }) as ReactNode}
    />
  ),
} satisfies Meta<CardButtonStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Private agent',
    description: 'Only invited members',
    icon: 'lock-outline',
    selected: false,
    onClick: fn(),
  },
};

export const Selected: Story = {
  args: {
    title: 'Private agent',
    description: 'Only invited members',
    icon: 'lock-outline',
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
          icon={<Icon glyph={<LockOutlineIcon />} />}
          selected={value === 'private'}
          onClick={() => setValue('private')}
        />
        <CardButton
          role="radio"
          title="Public agent"
          description="Any member can use"
          icon={<Icon glyph={<GlobeIcon />} />}
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
    icon: 'globe',
    disabled: true,
    onClick: fn(),
  },
};
