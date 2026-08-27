import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import StatusBadge from './StatusBadge';
import type { StatusBadgeSize, StatusBadgeStatus } from './StatusBadge';

const SIZES: StatusBadgeSize[] = [
  'xx-small',
  'x-small',
  'small',
  'medium',
  'large',
];
const STATUSES: StatusBadgeStatus[] = [
  'online',
  'away',
  'do-not-disturb',
  'offline',
];

const meta = {
  title: 'Components/Status Indicators/Status Badge',
  component: StatusBadge,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: SIZES },
    status: { control: 'select', options: STATUSES },
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

function Row({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        alignItems: 'center',
      }}
    >
      <span
        style={{
          width: 116,
          fontSize: 12,
          color: 'var(--center-channel-color)',
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

export const Default: Story = {
  args: {
    size: 'x-small',
    status: 'online',
  },
};

export const DoNotDisturb: Story = {
  args: {
    size: 'small',
    status: 'do-not-disturb',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Row label="Status">
        {STATUSES.map((status) => (
          <StatusBadge key={status} status={status} />
        ))}
      </Row>
      <Row label="Sizes">
        {SIZES.map((size) => (
          <StatusBadge key={size} size={size} status="online" />
        ))}
      </Row>
    </div>
  ),
};
