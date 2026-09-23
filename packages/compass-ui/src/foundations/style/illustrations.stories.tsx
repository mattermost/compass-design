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
          'Brand SVG artwork shipped from `@mattermost/compass-ui/illustrations/<name>`. For sizing, accessibility, and Controls to swap artwork, see the [Illustration](?path=/docs/components-images-and-icons-illustration--docs) component.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Library: Story = {
  render: () => <IllustrationsGridContent />,
};
