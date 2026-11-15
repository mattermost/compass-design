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
  'x-large',
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

/** Set `--status-badge-bg` and `--status-badge-offline-color` on the surface. */
export const OnColoredSurface: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 16,
        alignItems: 'center',
        padding: 16,
        background: 'var(--sidebar-bg)',
        ['--status-badge-bg' as string]: 'var(--sidebar-bg)',
        ['--status-badge-offline-color' as string]:
          'rgba(var(--sidebar-text-rgb), 0.32)',
      }}
    >
      {STATUSES.map((status) => (
        <StatusBadge key={status} status={status} />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'end' }}
    >
      {SIZES.map((size) => (
        <div
          key={size}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            color: 'var(--center-channel-color)',
            fontSize: 12,
          }}
        >
          <StatusBadge size={size} status="online" />
          <span>{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
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
