import type { Meta, StoryObj } from '@storybook/react';
import ReactionPill from './ReactionPill';
import type { ReactionPillSize, ReactionPillType } from './ReactionPill';

const SIZES: ReactionPillSize[] = ['small', 'medium', 'large'];
const TYPES: ReactionPillType[] = ['reaction', 'hand-raise', 'other'];

const meta = {
  title: 'Components/Calls/Reaction Pill',
  component: ReactionPill,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: SIZES },
    type: { control: 'select', options: TYPES },
  },
} satisfies Meta<typeof ReactionPill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Reaction: Story = {
  args: {
    type: 'reaction',
    emoji: '🎉',
    label: 'Leonard R.',
  },
};

export const HandRaise: Story = {
  args: {
    type: 'hand-raise',
    label: 'Danielle O.',
  },
};

export const Other: Story = {
  args: {
    type: 'other',
    message: 'You have been muted by the host',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
      {SIZES.map((size) => (
        <ReactionPill
          key={size}
          type="reaction"
          emoji="👍"
          label="Marco R."
          size={size}
        />
      ))}
    </div>
  ),
};

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
      <ReactionPill type="reaction" emoji="🎉" label="Leonard R." />
      <ReactionPill type="hand-raise" label="Danielle O." />
      <ReactionPill type="other" message="You have been muted by the host" />
    </div>
  ),
};
