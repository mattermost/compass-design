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
 * When the message body exceeds 100px the preview clips the content and reveals
 * a "Show more" toggle. Clicking it expands to full height; clicking again
 * collapses. Click is scoped to the button so card navigation isn't triggered.
 */
export const Truncated: Story = {
  args: {
    avatarSrc: avatarLeonard,
    authorName: 'Leonard Riley',
    timestamp: '10:43 AM',
    originalChannel: '~Engineering',
    onDismiss: fn(),
    messageText:
      'We shipped the new search indexing pipeline last night and initial numbers look really positive — p95 latency dropped from 420ms to 180ms on the staging cluster. ' +
      'The change also removed the synchronous re-index on every channel save, which was the main cause of the write spikes we kept seeing during peak hours. ' +
      'Full rollout is gated behind the feature flag until QA signs off, but the plan is to enable it for all workspaces by end of week. ' +
      'More details in the runbook linked below — let me know if you have questions before the review call.',
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
