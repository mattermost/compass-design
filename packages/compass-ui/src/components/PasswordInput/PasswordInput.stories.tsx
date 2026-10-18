import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import PasswordInput from './PasswordInput';
import type { PasswordInputSize } from './PasswordInput';

const SIZES: PasswordInputSize[] = ['small', 'medium', 'large'];
const MESSAGE_TONES = ['error', 'warning', 'info', 'success'] as const;

const meta = {
  title: 'Components/Forms and Input/Password Input',
  component: PasswordInput,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: SIZES },
    messageTone: { control: 'select', options: [...MESSAGE_TONES] },
  },
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        alignItems: 'flex-start',
      }}
    >
      <span
        style={{
          width: 112,
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
    label: 'Password',
    defaultValue: 'secret-value',
    size: 'medium',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
  },
};

export const Revealed: Story = {
  args: {
    label: 'Password',
    defaultValue: 'secret-value',
    defaultRevealed: true,
  },
};

export const WithMessage: Story = {
  args: {
    label: 'Password',
    message: 'Use 8 or more characters.',
    messageTone: 'info',
  },
};

export const Invalid: Story = {
  args: {
    label: 'Password',
    defaultValue: 'wrong',
    message: 'Password is incorrect.',
    invalid: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Password',
    defaultValue: 'secret-value',
    disabled: true,
  },
};

/** Parent owns show/hide via `revealed` + `onRevealedChange` (default stories keep it internal). */
export const ParentOwnsShowHide: Story = {
  name: 'Parent owns show/hide',
  parameters: { controls: { disable: true } },
  render: function ParentOwnsShowHideRender() {
    const [revealed, setRevealed] = useState(false);
    const [value, setValue] = useState('secret-value');
    return (
      <div style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 13,
            color: 'var(--center-channel-color)',
          }}
        >
          <input
            type="checkbox"
            checked={revealed}
            onChange={(e) => setRevealed(e.target.checked)}
          />
          Show password (set by the parent)
        </label>
        <PasswordInput
          label="Password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          revealed={revealed}
          onRevealedChange={setRevealed}
        />
        <p
          style={{
            margin: 0,
            fontSize: 12,
            color: 'rgba(var(--center-channel-color-rgb), 0.64)',
          }}
        >
          The checkbox and the eye toggle stay in sync because the parent holds
          `revealed`. Most screens can skip this and let the field manage
          show/hide on its own.
        </p>
      </div>
    );
  },
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 20, maxWidth: 360 }}>
      <Row label="Sizes">
        {SIZES.map((size) => (
          <PasswordInput
            key={size}
            size={size}
            label={size}
            defaultValue="secret-value"
          />
        ))}
      </Row>
      <Row label="Message">
        <PasswordInput
          label="Password"
          message="Use 8 or more characters."
          messageTone="info"
        />
      </Row>
      <Row label="Invalid">
        <PasswordInput
          label="Password"
          defaultValue="wrong"
          message="Password is incorrect."
          invalid
        />
      </Row>
      <Row label="Disabled">
        <PasswordInput label="Password" defaultValue="secret-value" disabled />
      </Row>
    </div>
  ),
};
