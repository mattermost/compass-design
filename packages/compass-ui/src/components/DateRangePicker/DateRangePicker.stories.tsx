import type { Meta, StoryObj } from '@storybook/react';
import DateRangePicker from './DateRangePicker';

const meta = {
  title: 'Components/Forms and Input/Date Range Picker',
  component: DateRangePicker,
  tags: ['autodocs'],
  argTypes: {
    mode: { control: 'select', options: ['date', 'range'] },
  },
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleDate: Story = {
  args: {
    mode: 'date',
  },
};

/** Floating label inside the field; it also names the trigger for assistive technology. */
export const WithFloatingLabel: Story = {
  args: {
    mode: 'date',
    label: 'Effective date',
    required: true,
  },
};

export const DateRange: Story = {
  args: {
    mode: 'range',
  },
};

export const PlacementNearBottom: Story = {
  render: () => (
    <div
      style={{
        minHeight: '120vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 24,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: 340 }}>
        <DateRangePicker mode="date" />
      </div>
    </div>
  ),
};

export const InsideOverflowClip: Story = {
  render: () => (
    <div
      style={{
        height: 120,
        overflow: 'hidden',
        border: '1px solid rgba(var(--center-channel-color-rgb), 0.16)',
        borderRadius: 8,
        padding: 16,
        maxWidth: 380,
      }}
    >
      <p
        style={{
          margin: '0 0 12px',
          fontSize: 12,
          color: 'var(--center-channel-color)',
        }}
      >
        Overflow hidden — calendar portals out and stays visible.
      </p>
      <DateRangePicker mode="date" />
    </div>
  ),
};

/** `clearable` adds a clear button once a date is set; it calls `onChange('')`. */
export const Clearable: Story = {
  args: {
    mode: 'date',
    clearable: true,
    value: '2031-03-15',
  },
};
