import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import GlobeIcon from '@mattermost/compass-icons/components/globe';
import InformationOutlineIcon from '@mattermost/compass-icons/components/information-outline';
import AdminPanel from '@/components/AdminPanel/AdminPanel';
import Icon from '@/components/Icon/Icon';
import IconButton from '@/components/IconButton/IconButton';
import type { AdminPanelExpandedState } from './AdminPanelHeader';

const meta = {
  title: 'Components/Admin Console/Admin Panel Header',
  component: AdminPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 920, width: '100%' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AdminPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Section Title',
    subtitle: 'Section sub-title',
  },
};

export const TitleOnly: Story = {
  args: {
    title: 'Section Title',
  },
};

export const FullHeader: Story = {
  args: {
    title: 'Section Title',
    subtitle: 'Section sub-title',
    iconLeft: true,
    showEnterpriseLabel: true,
    showBeta: true,
    showSwitch: true,
    switchLabel: 'Off',
    showButton: true,
    buttonLabel: 'Button',
    onButtonClick: fn(),
  },
};

export const ExpandableCollapsed: Story = {
  args: {
    title: 'Section Title',
    subtitle: 'Section sub-title',
    expandable: true,
    defaultExpandedState: 'collapsed',
    showSwitch: true,
    switchLabel: 'Off',
  },
};

export const ExpandableExpanded: Story = {
  args: {
    title: 'Section Title',
    subtitle: 'Section sub-title',
    expandable: true,
    defaultExpandedState: 'expanded',
    showSwitch: true,
    switchLabel: 'Off',
  },
};

export const ControlledExpand: Story = {
  render: function ControlledExpandStory() {
    const [expanded, setExpanded] =
      useState<AdminPanelExpandedState>('expanded');

    return (
      <AdminPanel
        title="Section Title"
        subtitle="Section sub-title"
        iconLeft
        leadingIcon={<Icon glyph={<GlobeIcon />} />}
        expandable
        expandedState={expanded}
        onExpandedStateChange={setExpanded}
        headerActions={
          <IconButton
            type="button"
            style="default"
            size="medium"
            aria-label="Help"
            icon={<Icon glyph={<InformationOutlineIcon />} />}
          />
        }
      />
    );
  },
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 24, maxWidth: 920 }}>
      <AdminPanel
        title="Section Title"
        subtitle="Section sub-title"
        iconLeft
        showEnterpriseLabel
        showBeta
        showSwitch
        switchLabel="Off"
        showButton
        buttonLabel="Button"
      />
      <AdminPanel
        title="Section Title"
        subtitle="Section sub-title"
        expandable
        defaultExpandedState="collapsed"
        showSwitch
        switchLabel="Off"
      />
      <AdminPanel title="Section Title" subtitle="Section sub-title" />
      <AdminPanel title="Section Title" />
    </div>
  ),
};
