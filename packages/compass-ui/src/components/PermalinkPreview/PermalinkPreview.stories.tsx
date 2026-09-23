import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import avatarLeonard from '@/assets/avatars/Leonard Riley.png';
import PermalinkPreview from './PermalinkPreview';

const meta = {
  title: 'Components/Cards and Previews/Permalink Preview',
  component: PermalinkPreview,
  tags: ['autodocs'],
} satisfies Meta<typeof PermalinkPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    avatarSrc: avatarLeonard,
    onDismiss: fn(),
  },
};

/**
 * Pass `children` to render rich content — such as an attachment card — in the
 * message body instead of the plain `messageText` string. The `messageText` prop
 * is ignored when `children` is present.
 */
export const WithRichChildren: Story = {
  args: {
    avatarSrc: avatarLeonard,
    authorName: 'Leonard Riley',
    timestamp: '10:43 AM',
    originalChannel: '~Desktop App',
    onDismiss: fn(),
    messageText: 'This text is replaced by the children slot.',
  },
  render: (args) => (
    <PermalinkPreview {...args}>
      <div
        style={{
          border: '1px solid rgba(var(--center-channel-color-rgb), 0.16)',
          borderRadius: 'var(--radius-s)',
          padding: 'var(--spacing-m) var(--spacing-l)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-xs)',
          width: '100%',
          background: 'rgba(var(--center-channel-color-rgb), 0.04)',
        }}
      >
        <p
          style={{
            margin: 0,
            fontWeight: 'var(--font-weight-semibold)',
            fontSize: 'var(--font-size-100)',
            color: 'var(--center-channel-color)',
          }}
        >
          Incident Report #4821
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'max-content 1fr',
            gap: 'var(--spacing-xxs) var(--spacing-m)',
            fontSize: 'var(--font-size-75)',
            color: 'rgba(var(--center-channel-color-rgb), 0.72)',
          }}
        >
          <span>Severity</span>
          <span>P1 — Critical</span>
          <span>Status</span>
          <span>Investigating</span>
          <span>Assignee</span>
          <span>@on-call-team</span>
        </div>
      </div>
    </PermalinkPreview>
  ),
};
