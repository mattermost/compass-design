import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import DraftListItem from './DraftListItem';
import type { DraftListItemStatus } from './DraftListItem';

const STATUSES: DraftListItemStatus[] = ['draft', 'scheduled', 'failed'];

const meta = {
  title: 'Components/Messaging/Draft List Item',
  component: DraftListItem,
  tags: ['autodocs'],
  argTypes: {
    status: { control: 'radio', options: STATUSES },
  },
  args: {
    destination: 'Town Square',
    previewText:
      'Here is the draft of the release notes for 10.4. Can someone double-check the migration section before I post it to the whole channel?',
    timestamp: 'Edited 5 mins ago',
    onClick: fn(),
    onEdit: fn(),
    onSend: fn(),
    onDelete: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 640 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DraftListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Draft: Story = {};

export const Scheduled: Story = {
  args: { status: 'scheduled', timestamp: 'Send on Mon, Nov 16 at 9:00 AM' },
};

export const Failed: Story = {
  args: {
    status: 'failed',
    timestamp: 'Was due Mon, Nov 16 at 9:00 AM',
    errorMessage: 'This channel was archived before the message could send.',
  },
};

export const ThreadReply: Story = {
  args: { threadLabel: 'Thread' },
};
