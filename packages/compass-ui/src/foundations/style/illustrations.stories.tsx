import type { Meta, StoryObj } from '@storybook/react';
import { IllustrationsGridContent } from '@/guidelines/foundations/illustrations/illustrations.specimen';

const meta = {
  title: 'Foundations/Style/Illustrations',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Brand SVG artwork shipped from @mattermost/compass-ui/illustrations.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Library: Story = {
  render: () => <IllustrationsGridContent />,
};
