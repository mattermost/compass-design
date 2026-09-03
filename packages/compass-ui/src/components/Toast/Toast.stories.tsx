import type { Meta, StoryObj } from '@storybook/react';
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
  args: {
    message: 'Link copied to clipboard.',
    type: 'general',
  },
};

export const ActionWithoutDismiss: Story = {
  args: {
    message: 'Failed to send message. Please try again.',
    type: 'danger',
    actionLabel: 'Retry',
    onAction: fn(),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 12,
      }}
    >
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
      <Toast message="Link copied to clipboard." type="general" />
      <Toast
        message="Failed to send message. Please try again."
        type="danger"
        actionLabel="Retry"
        onAction={fn()}
      />
    </div>
  ),
};
