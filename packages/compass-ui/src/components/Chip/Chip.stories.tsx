import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { fn } from '@storybook/test';
import EmoticonHappyOutlineIcon from '@mattermost/compass-icons/components/emoticon-happy-outline';
import avatarLeonard from '@/assets/avatars/Leonard Riley.png';
import Chip from './Chip';
import ChipGroup from './ChipGroup';
import type { ChipProps, ChipSize } from './Chip';
import {
  ICON_NONE,
  iconSelectArgType,
  resolveStoryIcon,
} from '../../storybook/icons';

const SIZES: ChipSize[] = ['small', 'medium', 'medium-compact', 'large'];

type ChipStoryArgs = Omit<ChipProps, 'leadingIcon'> & {
  leadingIcon?: string;
};

const meta = {
  title: 'Components/Forms and Input/Chip',
  component: Chip,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: SIZES },
    leadingIcon: iconSelectArgType({
      optional: true,
      description:
        'Leading icon glyph. Chip wraps it in Icon at the size for the chip.',
    }),
  },
  args: {
    leadingIcon: ICON_NONE,
  },
  render: ({ leadingIcon, ...rest }) => (
    <Chip
      {...rest}
      leadingIcon={resolveStoryIcon(leadingIcon) as ReactNode}
    />
  ),
} satisfies Meta<ChipStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Label',
    size: 'medium',
    onRemove: fn(),
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
      {SIZES.map((size) => (
        <Chip key={size} size={size} onRemove={fn()}>
          Label
        </Chip>
      ))}
    </div>
  ),
};

export const WithLeadingIcon: Story = {
  args: {
    children: 'With icon',
    size: 'medium',
    leadingIcon: 'emoticon-happy-outline',
    onRemove: fn(),
  },
};

export const WithLeadingAvatar: Story = {
  args: {
    children: 'Leonard Riley',
    size: 'medium',
    leadingAvatar: { src: avatarLeonard, alt: 'Leonard Riley' },
    onRemove: fn(),
  },
};

export const Error: Story = {
  args: {
    children: 'Error',
    size: 'medium',
    error: true,
    onRemove: fn(),
  },
};

export const Colored: Story = {
  args: {
    children: 'Colored',
    size: 'medium',
    colored: true,
    onRemove: fn(),
  },
};

export const WithoutRemove: Story = {
  args: {
    children: 'Read only',
    size: 'medium',
  },
};

export const Removable: Story = {
  render: function RemovableChips() {
    const [chips, setChips] = useState(['design', 'engineering', 'releases']);
    return (
      <ChipGroup aria-label="Selected filters">
        {chips.map((label) => (
          <Chip
            key={label}
            size="medium"
            onRemove={() =>
              setChips((current) => current.filter((c) => c !== label))
            }
          >
            {label}
          </Chip>
        ))}
      </ChipGroup>
    );
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <Chip size="medium" onRemove={fn()}>
          Default
        </Chip>
        <Chip
          size="medium"
          leadingIcon={<EmoticonHappyOutlineIcon size={12} />}
          onRemove={fn()}
        >
          With icon
        </Chip>
        <Chip
          size="medium"
          leadingAvatar={{ src: avatarLeonard, alt: 'Leonard Riley' }}
          onRemove={fn()}
        >
          Leonard Riley
        </Chip>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <Chip size="medium" error onRemove={fn()}>
          Error
        </Chip>
        <Chip size="medium" colored onRemove={fn()}>
          Colored
        </Chip>
        <Chip size="medium">No remove</Chip>
      </div>
    </div>
  ),
};
