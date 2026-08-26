import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import GlobeIcon from '@mattermost/compass-icons/components/globe';
import Tag from './Tag';
import type { TagCasing, TagProps, TagSize, TagType } from './Tag';
import {
  ICON_NONE,
  iconSelectArgType,
  resolveStoryIcon,
} from '../../storybook/icons';

const TYPES: TagType[] = [
  'default',
  'info',
  'info-dim',
  'danger',
  'success',
  'warning',
];
const SIZES: TagSize[] = ['x-small', 'small'];
const CASINGS: TagCasing[] = ['title-case', 'all-caps'];

type TagStoryArgs = Omit<TagProps, 'leadingIcon'> & {
  leadingIcon?: string;
};

const meta = {
  title: 'Components/Status Indicators/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    casing: { control: 'select', options: CASINGS },
    size: { control: 'select', options: SIZES },
    type: { control: 'select', options: TYPES },
    leadingIcon: iconSelectArgType({ optional: true }),
  },
  args: {
    leadingIcon: ICON_NONE,
  },
  render: ({ leadingIcon, size = 'x-small', ...rest }) => (
    <Tag
      {...rest}
      size={size}
      leadingIcon={
        resolveStoryIcon(leadingIcon, {
          glyphSize: size === 'small' ? 12 : 10,
        }) as ReactNode
      }
    />
  ),
} satisfies Meta<TagStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

function Row({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        alignItems: 'center',
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
    label: 'default',
    type: 'default',
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Professional',
    casing: 'all-caps',
    leadingIcon: 'globe',
    type: 'default',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      {SIZES.map((size) => (
        <Row key={size} label={`Types / ${size}`}>
          {TYPES.map((type) => (
            <Tag key={type} label={type} type={type} size={size} />
          ))}
        </Row>
      ))}
      <Row label="All caps">
        {TYPES.map((type) => (
          <Tag key={type} label="Tag" type={type} casing="all-caps" />
        ))}
      </Row>
      <Row label="With icon">
        <Tag
          label="Professional"
          casing="all-caps"
          leadingIcon={<GlobeIcon size={10} />}
          type="default"
        />
        <Tag
          label="info"
          leadingIcon={<GlobeIcon size={10} />}
          type="info"
        />
        <Tag
          label="success"
          leadingIcon={<GlobeIcon size={12} />}
          size="small"
          type="success"
        />
      </Row>
    </div>
  ),
};
