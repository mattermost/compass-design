import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { fn } from '@storybook/test';
import Toast from './Toast';
import type { ToastType } from './Toast';

const TYPES: ToastType[] = [
  'general',
  'info',
  'success',
  'warning',
  'danger',
];

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 12,
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: 12,
          fontWeight: 600,
          lineHeight: 1,
          color: 'var(--center-channel-color)',
        }}
      >
        {title}
      </h3>
      {children}
    </section>
  );
}

const meta = {
  title: 'Components/Feedback and Notices/Toast',
  component: Toast,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: TYPES },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const General: Story = {
  args: {
    message: 'Link copied to clipboard.',
    type: 'general',
    onDismiss: fn(),
  },
};

export const Success: Story = {
  args: {
    message: 'Message saved successfully.',
    type: 'success',
    onDismiss: fn(),
  },
};

export const WithAction: Story = {
  args: {
    message: 'Failed to send message. Please try again.',
    type: 'danger',
    actionLabel: 'Retry',
    onAction: fn(),
    onDismiss: fn(),
  },
};

export const Warning: Story = {
  args: {
    message: 'Your session will expire in 5 minutes.',
    type: 'warning',
    onDismiss: fn(),
  },
};

export const Info: Story = {
  args: {
    message: 'New update available. Refresh to apply.',
    type: 'info',
    actionLabel: 'Refresh',
    onAction: fn(),
    onDismiss: fn(),
  },
};

export const WithoutDismiss: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 12,
      }}
    >
      <Toast message="Link copied to clipboard." type="general" />
      <Toast message="Message saved successfully." type="success" />
      <Toast
        message="Failed to send message. Please try again."
        type="danger"
        actionLabel="Retry"
        onAction={fn()}
      />
      <Toast
        message="Your session will expire in 5 minutes."
        type="warning"
      />
      <Toast
        message="New update available. Refresh to apply."
        type="info"
        actionLabel="Refresh"
        onAction={fn()}
      />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 24,
      }}
    >
      <Section title="Types">
        <Toast
          message="Link copied to clipboard."
          type="general"
          onDismiss={fn()}
        />
        <Toast
          message="Message saved successfully."
          type="success"
          onDismiss={fn()}
        />
        <Toast
          message="Failed to send message. Please try again."
          type="danger"
          actionLabel="Retry"
          onAction={fn()}
          onDismiss={fn()}
        />
        <Toast
          message="Your session will expire in 5 minutes."
          type="warning"
          onDismiss={fn()}
        />
        <Toast
          message="New update available. Refresh to apply."
          type="info"
          actionLabel="Refresh"
          onAction={fn()}
          onDismiss={fn()}
        />
      </Section>
      <Section title="Without dismiss">
        <Toast message="Link copied to clipboard." type="general" />
        <Toast message="Message saved successfully." type="success" />
        <Toast
          message="Failed to send message. Please try again."
          type="danger"
          actionLabel="Retry"
          onAction={fn()}
        />
        <Toast
          message="Your session will expire in 5 minutes."
          type="warning"
        />
        <Toast
          message="New update available. Refresh to apply."
          type="info"
          actionLabel="Refresh"
          onAction={fn()}
        />
      </Section>
    </div>
  ),
};
