import type { Meta, StoryObj } from '@storybook/react';
import ProgressBar from './ProgressBar';

const meta = {
  title: 'Components/Progress Indicators/Progress Bar',
  component: ProgressBar,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'large'] },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 60,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
    'aria-label': 'Reindexing',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export const Decorative: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ul
      style={{
        display: 'grid',
        gap: 12,
        width: 360,
        margin: 0,
        padding: 0,
        listStyle: 'none',
        color: 'var(--center-channel-color)',
      }}
    >
      {[
        { id: 'INC-102', minutes: 130 },
        { id: 'INC-087', minutes: 90 },
        { id: 'INC-091', minutes: 45 },
      ].map(({ id, minutes }) => (
        <li key={id} style={{ display: 'grid', gap: 4 }}>
          <span style={{ fontSize: 12 }}>
            {id}: {minutes} min
          </span>
          <ProgressBar decorative size="small" value={(minutes / 130) * 100} />
        </li>
      ))}
    </ul>
  ),
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 20, width: 360 }}>
      <div style={{ display: 'grid', gap: 8 }}>
        <span
          style={{
            fontSize: 12,
            color: 'var(--center-channel-color)',
          }}
        >
          Values
        </span>
        {[0, 35, 70, 100].map((value) => (
          <ProgressBar key={value} value={value} aria-label={`${value}%`} />
        ))}
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        <span
          style={{
            fontSize: 12,
            color: 'var(--center-channel-color)',
          }}
        >
          Sizes
        </span>
        <ProgressBar value={60} size="small" aria-label="Small 60%" />
        <ProgressBar value={60} size="large" aria-label="Large 60%" />
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        <span
          style={{
            fontSize: 12,
            color: 'var(--center-channel-color)',
          }}
        >
          Semantic colors
        </span>
        <ProgressBar value={30} semanticColors aria-label="30% success" />
        <ProgressBar value={75} semanticColors aria-label="75% warning" />
        <ProgressBar value={95} semanticColors aria-label="95% danger" />
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        <span
          style={{
            fontSize: 12,
            color: 'var(--center-channel-color)',
          }}
        >
          Indeterminate
        </span>
        <ProgressBar indeterminate size="small" aria-label="Reindexing" />
        <ProgressBar indeterminate aria-label="Reindexing" />
      </div>
    </div>
  ),
};
