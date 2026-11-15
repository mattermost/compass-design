import type { Meta, StoryObj } from '@storybook/react';
import TypingIndicator from './TypingIndicator';

const meta = {
  title: 'Components/Progress Indicators/Typing Indicator',
  component: TypingIndicator,
  tags: ['autodocs'],
} satisfies Meta<typeof TypingIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Alice is typing' },
};

export const DotsOnly: Story = {
  args: {},
};

export const MultipleTypers: Story = {
  args: { label: 'Alice and Bob are typing' },
};
