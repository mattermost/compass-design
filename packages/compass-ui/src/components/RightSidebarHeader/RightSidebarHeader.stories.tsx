import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import FilterVariantIcon from '@mattermost/compass-icons/components/filter-variant';
import Button from '../Button/Button';
import Icon from '../Icon/Icon';
import RightSidebarHeader from './RightSidebarHeader';
import type { RightSidebarHeaderProps } from './RightSidebarHeader';
import {
  ICON_NONE,
  iconSelectArgType,
  resolveStoryIcon,
} from '../../storybook/icons';

type RightSidebarHeaderStoryArgs = Omit<
  RightSidebarHeaderProps,
  'leadingIcon'
> & {
  leadingIcon?: string;
};

const meta = {
  title: 'Components/Navigation/Right Sidebar Header',
  component: RightSidebarHeader,
  tags: ['autodocs'],
  args: {
    title: 'Thread',
    secondaryTitle: 'UX Design',
    onClose: () => {},
    leadingIcon: ICON_NONE,
  },
  argTypes: {
    leadingIcon: iconSelectArgType({ optional: true }),
    tagType: {
      control: 'select',
      options: ['default', 'info', 'info-dim', 'danger', 'success', 'warning'],
    },
  },
  render: ({ leadingIcon, ...rest }) => (
    <RightSidebarHeader
      {...rest}
      leadingIcon={
        resolveStoryIcon(leadingIcon, { wrapSize: '20' }) as ReactNode
      }
    />
  ),
  decorators: [
    (Story) => (
      <div style={{ width: 400, background: 'var(--center-channel-bg)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<RightSidebarHeaderStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SecondaryTitleButton: Story = {
  args: { onSecondaryTitleClick: () => {} },
};

export const WithBack: Story = {
  args: {
    title: 'Edit Profile',
    secondaryTitle: 'Account Settings',
    onBack: () => {},
  },
};

export const WithTag: Story = {
  args: { title: 'Apps', secondaryTitle: undefined, tag: 'BETA' },
};

export const InlineAction: Story = {
  args: { actionLabel: 'Follow', onActionClick: () => {} },
};

export const InlineActionActive: Story = {
  args: { actionLabel: 'Following', actionActive: true, onClose: undefined },
};

export const WindowControls: Story = {
  args: { onExpand: () => {}, onPopout: () => {} },
};

export const CustomActions: Story = {
  args: {
    title: 'Recent mentions',
    secondaryTitle: undefined,
    onExpand: () => {},
    onPopout: () => {},
    actions: (
      <Button
        emphasis="tertiary"
        size="small"
        compact
        leadingIcon={<Icon glyph={<FilterVariantIcon />} />}
      >
        Filters
      </Button>
    ),
  },
};
