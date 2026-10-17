import type { Meta, StoryObj } from '@storybook/react';

import FieldMessage from './FieldMessage';
import type { FieldMessageTone } from './FieldMessage';
import TextInput from '../TextInput/TextInput';

const TONES: FieldMessageTone[] = ['error', 'warning', 'info', 'success'];

const meta = {
  title: 'Components/Feedback and Notices/Field Message',
  component: FieldMessage,
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'select', options: TONES },
  },
} satisfies Meta<typeof FieldMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: 'This field is required.',
    tone: 'error',
  },
};

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
      <FieldMessage tone="error" message="Enter a valid email address." />
      <FieldMessage
        tone="warning"
        message="This channel name is already taken."
      />
      <FieldMessage
        tone="info"
        message="Use 8 or more characters with a mix of letters and numbers."
      />
      <FieldMessage tone="success" message="Invite link copied." />
    </div>
  ),
};

/** Prefer `message` / `messageTone` on the field when the line belongs to an input. */
export const PreferFieldProps: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <TextInput
        label="Email"
        defaultValue="not-an-email"
        message="Enter a valid email address."
      />
    </div>
  ),
};
