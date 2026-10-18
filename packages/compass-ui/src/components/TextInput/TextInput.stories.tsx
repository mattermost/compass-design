import type { Meta, StoryObj } from '@storybook/react';
import { useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import EyeOffOutlineIcon from '@mattermost/compass-icons/components/eye-off-outline';
import EyeOutlineIcon from '@mattermost/compass-icons/components/eye-outline';
import GlobeIcon from '@mattermost/compass-icons/components/globe';
import Button from '../Button/Button';
import TextInput from './TextInput';
import type { TextInputProps, TextInputSize } from './TextInput';
import Icon from '../Icon/Icon';
import {
  ICON_NONE,
  iconSelectArgType,
  resolveStoryIcon,
} from '../../storybook/icons';

const SIZES: TextInputSize[] = ['small', 'medium', 'large'];
const MESSAGE_TONES = ['error', 'warning', 'info', 'success'] as const;

type TextInputStoryArgs = Omit<
  TextInputProps,
  'leadingIcon' | 'trailingIcon'
> & {
  leadingIcon?: string;
  trailingIcon?: string;
};

const meta = {
  title: 'Components/Forms and Input/Text Input',
  component: TextInput,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: SIZES },
    messageTone: { control: 'select', options: [...MESSAGE_TONES] },
    leadingIcon: iconSelectArgType({ optional: true }),
    trailingIcon: iconSelectArgType({ optional: true }),
  },
  args: {
    leadingIcon: ICON_NONE,
    trailingIcon: ICON_NONE,
  },
  render: ({
    leadingIcon: leadingIcon,
    trailingIcon: trailingIcon,
    ...rest
  }) => (
    <TextInput
      {...rest}
      leadingIcon={
        resolveStoryIcon(leadingIcon, { wrapSize: '16' }) as ReactNode
      }
      trailingIcon={
        resolveStoryIcon(trailingIcon, { wrapSize: '16' }) as ReactNode
      }
    />
  ),
} satisfies Meta<TextInputStoryArgs>;

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
          width: 144,
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

/** Transparent hit target so `trailingIcon` stays an Icon sized by Text Input. */
function TrailingIconButton({
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...rest}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        padding: 0,
        border: 0,
        background: 'transparent',
        cursor: 'pointer',
        color: 'inherit',
        ...((rest.style as object) ?? {}),
      }}
    >
      {children}
    </button>
  );
}

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
    size: 'medium',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Display name',
    placeholder: 'Enter display name...',
    size: 'medium',
  },
};

export const WithIcons: Story = {
  args: {
    label: 'Workspace',
    placeholder: 'Enter workspace...',
    leadingIcon: 'globe',
    trailingIcon: 'globe',
  },
};

export const WithMessage: Story = {
  args: {
    label: 'Email',
    defaultValue: 'not-an-email',
    message: 'Enter a valid email address.',
    messageTone: 'error',
  },
};

export const Clearable: Story = {
  args: {
    label: 'Filter',
    clearable: true,
    defaultValue: 'design',
  },
};

function PasswordExample(args: TextInputStoryArgs) {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState('secret-value');

  return (
    <TextInput
      {...args}
      label={args.label ?? 'Password'}
      type={visible ? 'text' : 'password'}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      leadingIcon={undefined}
      trailingIcon={
        <TrailingIconButton
          aria-label={visible ? 'Hide password' : 'Show password'}
          onClick={() => setVisible((v) => !v)}
        >
          <Icon glyph={visible ? <EyeOffOutlineIcon /> : <EyeOutlineIcon />} />
        </TrailingIconButton>
      }
    />
  );
}

/** In-field show/hide via `trailingIcon` — Icon sized by Text Input `size`. */
export const Password: Story = {
  args: {
    label: 'Password',
  },
  render: (args) => <PasswordExample {...args} />,
};

export const TrailingAction: Story = {
  args: {
    label: 'Invite code',
    defaultValue: 'abc-123',
    message: 'Copied to clipboard.',
    messageTone: 'success',
  },
  render: (args) => (
    <TextInput
      {...args}
      leadingIcon={undefined}
      trailingIcon={undefined}
      trailingAction={<Button emphasis="primary">Copy</Button>}
    />
  ),
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 20 }}>
      <Row label="Sizes">
        {SIZES.map((size) => (
          <TextInput key={size} size={size} placeholder={size} />
        ))}
      </Row>
      <Row label="Label">
        <TextInput label="Label" placeholder="Placeholder" />
        <TextInput placeholder="No label" />
        <TextInput label="With value" defaultValue="Some text" />
      </Row>
      <Row label="Leading / trailing icons">
        <TextInput
          label="Search"
          placeholder="Search..."
          leadingIcon={<Icon glyph={<GlobeIcon />} />}
        />
        <TextInput
          placeholder="Trailing only"
          trailingIcon={<Icon glyph={<GlobeIcon />} />}
        />
        <TextInput
          label="Both"
          placeholder="Leading and trailing"
          leadingIcon={<Icon glyph={<GlobeIcon />} />}
          trailingIcon={<Icon glyph={<GlobeIcon />} />}
        />
      </Row>
      <Row label="Invalid">
        <TextInput label="Error" invalid placeholder="Invalid state" />
        <TextInput label="Error with value" invalid defaultValue="Invalid" />
      </Row>
      <Row label="Character counter">
        <TextInput
          label="Description"
          placeholder="Enter text..."
          maxLength={100}
          showCharacterCount
        />
        <TextInput
          label="With value"
          defaultValue="Already filled"
          maxLength={50}
          showCharacterCount
        />
      </Row>
      <Row label="Disabled / read-only">
        <TextInput label="Disabled" disabled placeholder="Disabled" />
        <TextInput label="Read-only" readOnly defaultValue="Read only value" />
      </Row>
      <Row label="Field message">
        <TextInput label="Error" message="This field is required." />
        <TextInput
          label="Warning"
          message="This name is taken."
          messageTone="warning"
        />
        <TextInput
          label="Info"
          message="Use 8 or more characters."
          messageTone="info"
        />
        <TextInput
          label="Success"
          message="Looks good."
          messageTone="success"
        />
      </Row>
      <Row label="Invalid without message">
        <TextInput label="Error" invalid placeholder="Invalid state" />
      </Row>
      <Row label="Field message + character count">
        <TextInput
          label="Bio"
          message="Too long"
          defaultValue="Hello world"
          maxLength={20}
          showCharacterCount
        />
      </Row>
      <Row label="Clearable">
        <TextInput label="Filter" clearable defaultValue="design" />
      </Row>
      <Row label="Trailing icon (password)">
        {SIZES.map((size) => (
          <TextInput
            key={size}
            size={size}
            label="Password"
            type="password"
            defaultValue="secret-value"
            trailingIcon={<Icon glyph={<EyeOutlineIcon />} />}
          />
        ))}
      </Row>
      <Row label="Trailing action">
        <TextInput
          label="Invite code"
          defaultValue="abc-123"
          message="Copied to clipboard."
          messageTone="success"
          trailingAction={<Button emphasis="primary">Copy</Button>}
        />
      </Row>
    </div>
  ),
};
