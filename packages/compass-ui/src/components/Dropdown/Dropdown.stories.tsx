import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import Dropdown from './Dropdown';
import Icon from '../Icon/Icon';
import IconButton from '../IconButton/IconButton';
import PlusIcon from '@mattermost/compass-icons/components/plus';
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
  leadingIcon?: string;
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <h3
        style={{
          margin: 0,
          fontSize: 12,
          fontWeight: 600,
          lineHeight: 1,
          color: 'var(--center-channel-color)',
        }}
      >
        {title}
      </h3>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          alignItems: 'center',
        }}
      >
        {children}
      </div>
    </section>
  );
}

const meta = {
  title: 'Components/Forms and Input/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: SIZES },
    padding: {
      control: 'select',
      options: ['tight', 'compact', 'default'] satisfies DropdownPadding[],
    },
    appearance: {
      control: 'select',
      options: ['default', 'inverted'] satisfies DropdownAppearance[],
    },
    leadingIcon: iconSelectArgType({ optional: true }),
  },
  args: {
    leadingIcon: ICON_NONE,
  },
  render: ({ leadingIcon: leadingIcon, ...rest }) => (
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
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        alignItems: 'center',
      }}
    >
      {SIZES.map((size) => (
        <Dropdown key={size} size={size}>
          {size}
        </Dropdown>
      ))}
    </div>
  ),
};

const PADDINGS: { padding: DropdownPadding; title: string }[] = [
  { padding: 'tight', title: 'Tight' },
  { padding: 'compact', title: 'Compact' },
  { padding: 'default', title: 'Default' },
];

export const Padding: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      {PADDINGS.map(({ padding, title }) => (
        <Section key={padding} title={title}>
          {SIZES.map((size) => (
            <Dropdown key={size} size={size} padding={padding}>
              {size}
            </Dropdown>
          ))}
        </Section>
      ))}
    </div>
  ),
};

export const WithLeadingIcon: Story = {
  args: {
    children: 'Workspace',
    leadingIcon: 'globe',
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
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        alignItems: 'center',
      }}
    >
      <Dropdown>Default</Dropdown>
      <Dropdown isOpen>Open</Dropdown>
      <Dropdown disabled>Disabled</Dropdown>
    </div>
  ),
};

/** Long labels end in an ellipsis and the trigger shrinks to the space its host gives it. */
export const LongLabel: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: 320,
        padding: 8,
        border: '1px dashed rgba(var(--center-channel-color-rgb), 0.16)',
        borderRadius: 8,
      }}
    >
      <div style={{ display: 'flex', flex: 1, minWidth: 0 }}>
        <Dropdown size="large">
          Quarterly planning notes for the whole platform team and extended
          stakeholders
        </Dropdown>
      </div>
      <IconButton aria-label="Add" icon={<Icon glyph={<PlusIcon />} />} />
    </div>
  ),
};
