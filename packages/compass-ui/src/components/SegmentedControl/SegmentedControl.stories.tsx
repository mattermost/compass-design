import type { Meta, StoryObj } from '@storybook/react';
import { useState, type ReactNode } from 'react';
import { fn } from '@storybook/test';
import AccountOutlineIcon from '@mattermost/compass-icons/components/account-outline';
import CreationOutlineIcon from '@mattermost/compass-icons/components/creation-outline';
import FileTextOutlineIcon from '@mattermost/compass-icons/components/file-text-outline';
import MessageTextOutlineIcon from '@mattermost/compass-icons/components/message-text-outline';
import PoundIcon from '@mattermost/compass-icons/components/pound';
import Icon from '@/components/Icon/Icon';
import SegmentedControl from './SegmentedControl';
import type {
  SegmentedControlOption,
  SegmentedControlProps,
} from './SegmentedControl';

const SEARCH_ICONS: Record<string, ReactNode> = {
  channels: <Icon glyph={<PoundIcon />} />,
  messages: <Icon glyph={<MessageTextOutlineIcon />} />,
  files: <Icon glyph={<FileTextOutlineIcon />} />,
  people: <Icon glyph={<AccountOutlineIcon />} />,
  copilot: <Icon glyph={<CreationOutlineIcon />} />,
};

const SEARCH_MODES: SegmentedControlOption[] = [
  { key: 'channels', label: 'Channels' },
  { key: 'messages', label: 'Messages' },
  { key: 'files', label: 'Files' },
  { key: 'people', label: 'People' },
  { key: 'copilot', label: 'Copilot' },
];

const LABELS: SegmentedControlOption[] = [
  { key: 'day', label: 'Day' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
];

const meta = {
  title: 'Components/Forms and Input/Segmented Control',
  component: SegmentedControl,
  tags: ['autodocs'],
  argTypes: {
    role: { control: 'radio', options: ['tablist', 'radiogroup'] },
    size: { control: 'radio', options: ['small', 'medium'] },
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

function Stateful({
  withIcons = false,
  ...props
}: SegmentedControlProps & { withIcons?: boolean }) {
  const [value, setValue] = useState(props.value);
  const options = withIcons
    ? props.options.map((option) => ({
        ...option,
        icon: SEARCH_ICONS[option.key],
      }))
    : props.options;
  return (
    <SegmentedControl
      {...props}
      options={options}
      value={value}
      onChange={(key) => {
        setValue(key);
        props.onChange(key);
      }}
    />
  );
}

export const Default: Story = {
  args: {
    'aria-label': 'Search mode',
    options: SEARCH_MODES,
    value: 'messages',
    onChange: fn(),
  },
  render: (args) => <Stateful {...args} withIcons />,
};

export const LabelsOnly: Story = {
  args: {
    'aria-label': 'Calendar range',
    role: 'radiogroup',
    options: LABELS,
    value: 'week',
    onChange: fn(),
  },
  render: (args) => <Stateful {...args} />,
};

export const WithDisabledSegment: Story = {
  args: {
    'aria-label': 'Search mode',
    options: [
      { key: 'channels', label: 'Channels' },
      { key: 'messages', label: 'Messages' },
      {
        key: 'files',
        label: 'Files',
        disabled: true,
        title: 'Files search is unavailable',
      },
      { key: 'people', label: 'People' },
    ],
    value: 'channels',
    onChange: fn(),
  },
  render: (args) => <Stateful {...args} />,
};

export const Sizes: Story = {
  args: {
    'aria-label': 'Search mode',
    options: SEARCH_MODES,
    value: 'messages',
    onChange: fn(),
  },
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Stateful {...args} withIcons size="small" />
      <Stateful {...args} withIcons size="medium" />
    </div>
  ),
};

export const Static: Story = {
  args: {
    'aria-label': 'Calendar range',
    role: 'radiogroup',
    options: LABELS,
    value: 'week',
    onChange: fn(),
  },
};
