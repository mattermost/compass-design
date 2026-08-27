import type { Meta, StoryObj } from '@storybook/react';
import Tooltip from './Tooltip';
import type { TooltipArrow } from './Tooltip';

const ARROWS: TooltipArrow[] = ['top', 'right', 'bottom', 'left'];

const meta = {
  title: 'Components/Feedback and Notices/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    arrow: { control: 'select', options: ARROWS },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Tooltip label',
    arrow: 'right',
  },
};

export const WithShortcut: Story = {
  args: {
    label: 'Bold',
    arrow: 'bottom',
    shortcutKeys: [{ label: 'Cmd' }, { label: 'B' }],
  },
};

export const WithHint: Story = {
  args: {
    label: 'Open quick switcher',
    arrow: 'right',
    hint: 'Jump to any channel or direct message',
    shortcutKeys: [{ label: 'Cmd' }, { label: 'K' }],
  },
};

export const AllArrows: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 24,
        alignItems: 'center',
      }}
    >
      {ARROWS.map((arrow) => (
        <Tooltip key={arrow} label={`${arrow} arrow`} arrow={arrow} />
      ))}
    </div>
  ),
};
