import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import GlobeIcon from '@mattermost/compass-icons/components/globe';
import InformationOutlineIcon from '@mattermost/compass-icons/components/information-outline';
import AdminPanelFooter from '@/components/AdminPanelFooter/AdminPanelFooter';
import Button from '@/components/Button/Button';
import Icon from '@/components/Icon/Icon';
import IconButton from '@/components/IconButton/IconButton';
import AdminPanel, { type AdminPanelExpandedState } from './AdminPanel';

const meta = {
  title: 'Patterns/Admin Console/Admin Panel',
  component: AdminPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Bordered System Console settings sheet. Provide a header (`title`), a body (`children`), or both. Footer is optional; footer-only is not allowed. Expand/collapse requires a header.',
      },
    },
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
  name: 'Header + body',
  args: {
    title: 'Section Title',
    subtitle: 'Section sub-title',
    children: 'Section content',
  },
};

export const TitleWithoutSubtitle: Story = {
  name: 'Title without subtitle',
  args: {
    title: 'Section Title',
    children: 'Section content',
  },
};

/** Header-only panel (no body) — used as a nav banner in System Console. */
export const HeaderOnly: Story = {
  name: 'Header only',
  args: {
    title: 'System Scheme',
    subtitle:
      'Manage the default permission scheme for all teams and channels.',
    showButton: true,
    buttonLabel: 'Edit Scheme',
    onButtonClick: fn(),
  },
};

/** Body-only panel (no header) — title omitted when children are provided. */
export const BodyOnly: Story = {
  name: 'Body only',
  args: {
    children: 'Section content without a panel header.',
  },
};

export const BodyWithFooter: Story = {
  name: 'Body + footer (no header)',
  args: {
    children: 'Section content with footer actions and no panel header.',
    footer: (
      <AdminPanelFooter
        leftActions={
          <>
            <Button
              type="button"
              size="medium"
              emphasis="primary"
              onClick={fn()}
            >
              Apply
            </Button>
            <Button
              type="button"
              size="medium"
              emphasis="tertiary"
              onClick={fn()}
            >
              Cancel
            </Button>
          </>
        }
      />
    ),
  },
};

export const FullHeaderExpanded: Story = {
  name: 'Full header, expandable',
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
    expandable: true,
    defaultExpandedState: 'expanded',
    children: 'Section content — body hides when collapsed and expandable.',
  },
};

export const ExpandableCollapsed: Story = {
  name: 'Expandable, collapsed',
  args: {
    title: 'Section Title',
    subtitle: 'Section sub-title',
    expandable: true,
    defaultExpandedState: 'collapsed',
    showSwitch: true,
    switchLabel: 'Off',
    children: 'Content appears after expand.',
  },
};

export const ControlledExpand: Story = {
  name: 'Controlled expand',
  render: function ControlledExpandStory() {
    const [expandedState, setExpandedState] =
      useState<AdminPanelExpandedState>('expanded');

    return (
      <AdminPanel
        title="Section Title"
        subtitle="Section sub-title"
        iconLeft
        leadingIcon={<Icon glyph={<GlobeIcon />} />}
        expandable
        expandedState={expandedState}
        onExpandedStateChange={setExpandedState}
        headerActions={
          <IconButton
            type="button"
            style="default"
            size="medium"
            aria-label="Help"
            icon={<Icon glyph={<InformationOutlineIcon />} />}
          />
        }
      >
        Controlled via parent state ({expandedState}).
      </AdminPanel>
    );
  },
};

export const WithFooter: Story = {
  name: 'Header + body + footer',
  args: {
    title: 'Section Title',
    subtitle: 'Section sub-title',
    children: 'Section content with footer actions.',
    footer: (
      <AdminPanelFooter
        leftActions={
          <>
            <Button
              type="button"
              size="medium"
              emphasis="primary"
              onClick={fn()}
            >
              Apply
            </Button>
            <Button
              type="button"
              size="medium"
              emphasis="tertiary"
              onClick={fn()}
            >
              Cancel
            </Button>
          </>
        }
      />
    ),
  },
};

export const AllVariants: Story = {
  name: 'All variants',
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
        expandable
        defaultExpandedState="expanded"
      >
        Section content — body hides when collapsed and expandable.
      </AdminPanel>
      <AdminPanel
        title="Section Title"
        subtitle="Section sub-title"
        expandable
        defaultExpandedState="collapsed"
        showSwitch
        switchLabel="Off"
      >
        Content appears after expand.
      </AdminPanel>
      <AdminPanel title="Section Title" subtitle="Section sub-title">
        Section content
      </AdminPanel>
      <AdminPanel title="Section Title">Section content</AdminPanel>
      <AdminPanel
        title="System Scheme"
        subtitle="Manage the default permission scheme for all teams and channels."
        showButton
        buttonLabel="Edit Scheme"
        onButtonClick={fn()}
      />
      <AdminPanel>Section content without a panel header.</AdminPanel>
      <AdminPanel
        footer={
          <AdminPanelFooter
            leftActions={
              <Button type="button" size="medium" emphasis="primary">
                Apply
              </Button>
            }
          />
        }
      >
        Body and footer without a header.
      </AdminPanel>
    </div>
  ),
};
