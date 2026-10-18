import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import MagnifyIcon from '@mattermost/compass-icons/components/magnify';
import Button from '../Button/Button';
import PasswordInput from '../PasswordInput/PasswordInput';
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
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'url', 'tel', 'search', 'number'],
      description:
        'Native input type. For passwords with show/hide, prefer PasswordInput.',
      table: { category: 'HTML', type: { summary: 'string' } },
    },
    messageTone: { control: 'select', options: [...MESSAGE_TONES] },
    leadingIcon: iconSelectArgType({ optional: true }),
    trailingIcon: iconSelectArgType({ optional: true }),
  },
  args: {
    type: 'text',
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

export const WithLeadingIcon: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search...',
    leadingIcon: 'magnify',
  },
};

export const ClearableAndPassword: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 360 }}>
      <TextInput label="Filter" clearable defaultValue="design" />
      <PasswordInput label="Password" defaultValue="secret-value" />
    </div>
  ),
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
      <Row label="Leading icon">
        <TextInput
          label="Search"
          placeholder="Search..."
          leadingIcon={<Icon glyph={<MagnifyIcon />} />}
        />
      </Row>
      <Row label="Trailing (clear / password)">
        <TextInput label="Filter" clearable defaultValue="design" />
        <PasswordInput label="Password" defaultValue="secret-value" />
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
