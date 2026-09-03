import type { Meta, StoryObj } from '@storybook/react';
import AICopilotIllustration from '@/illustrations/ai-copilot-intro';
import SearchIllustration from '@/illustrations/search';
import Illustration from './Illustration';

const meta = {
  title: 'Components/Images and Icons/Illustration',
  component: Illustration,
  tags: ['autodocs'],
} satisfies Meta<typeof Illustration>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    'aria-label': 'AI Copilot intro',
    children: <AICopilotIllustration />,
  },
};

export const CustomSize: Story = {
  args: {
    'aria-label': 'Search',
    width: '200px',
    height: '120px',
    children: <SearchIllustration />,
  },
};
