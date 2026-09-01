import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import Dropdown from './Dropdown';
import type {
  DropdownAppearance,
  DropdownPadding,
  DropdownProps,
  DropdownSize,
} from './Dropdown';
import {
  ICON_NONE,
  iconSelectArgType,
  resolveStoryIcon,
} from '../../storybook/icons';

const SIZES: DropdownSize[] = [
  'x-small',
  'small',
  'medium',
  'large',
  'x-large',
];

type DropdownStoryArgs = Omit<DropdownProps, 'leadingIcon'> & {
  'leadingIcon'?: string;
};

const meta = {
  title: 'Components/Forms and Input/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: SIZES },
    padding: {
      control: 'select',
      options: ['tight', 'compact'] satisfies DropdownPadding[],
    },
    appearance: {
      control: 'select',
      options: ['default', 'inverted'] satisfies DropdownAppearance[],
    },
    'leadingIcon': iconSelectArgType({ optional: true }),
  },
  args: {
    'leadingIcon': ICON_NONE,
  },
  render: ({ 'leadingIcon': leadingIcon, ...rest }) => (
    <Dropdown
      {...rest}
      leadingIcon={
        resolveStoryIcon(leadingIcon, { wrapSize: '16' }) as ReactNode
      }
    />
  ),
} satisfies Meta<DropdownStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Label',
    size: 'medium',
  },
};

export const Sizes: Story = {
  render: () => (
    <div
      style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}
    >
      {SIZES.map((size) => (
        <Dropdown key={size} size={size}>
          {size}
        </Dropdown>
      ))}
    </div>
  ),
};

export const CompactPadding: Story = {
  args: {
    children: 'Compact',
    size: 'medium',
    padding: 'compact',
  },
};

export const WithLeadingIcon: Story = {
  args: {
    children: 'Workspace',
    'leadingIcon': 'globe',
    size: 'medium',
  },
};

export const Open: Story = {
  args: {
    children: 'Open',
    isOpen: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
};

export const Inverted: Story = {
  render: () => (
    <div
      style={{
        padding: 16,
        borderRadius: 8,
        background: 'var(--sidebar-header-bg)',
      }}
    >
      <Dropdown appearance="inverted">Inverted</Dropdown>
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div
      style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}
    >
      <Dropdown>Default</Dropdown>
      <Dropdown isOpen>Open</Dropdown>
      <Dropdown disabled>Disabled</Dropdown>
    </div>
  ),
};
