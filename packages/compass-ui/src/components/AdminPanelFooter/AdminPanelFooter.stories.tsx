import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import ChevronLeftIcon from '@mattermost/compass-icons/components/chevron-left';
import ChevronRightIcon from '@mattermost/compass-icons/components/chevron-right';
import PlusIcon from '@mattermost/compass-icons/components/plus';
import RefreshIcon from '@mattermost/compass-icons/components/refresh';
import Button from '@/components/Button/Button';
import Icon from '@/components/Icon/Icon';
import IconButton from '@/components/IconButton/IconButton';
import PaginationDots from '@/components/PaginationDots/PaginationDots';
import AdminPanelFooter from './AdminPanelFooter';

const panelChrome = {
  maxWidth: 920,
  width: '100%',
  border: '1px solid rgba(var(--center-channel-color-rgb), 0.16)',
  borderRadius: 'var(--radius-m)',
  overflow: 'hidden',
  background: 'var(--center-channel-bg)',
} as const;

const meta = {
  title: 'Components/Admin Console/Admin Panel Footer',
  component: AdminPanelFooter,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={panelChrome}>
        <div
          style={{
            padding: 'var(--spacing-xxl)',
            color: 'rgba(var(--center-channel-color-rgb), 0.75)',
            fontSize: 'var(--font-size-100)',
          }}
        >
          Panel body
        </div>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AdminPanelFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

const statusStyle = {
  margin: 0,
  fontFamily: 'var(--font-family-body)',
  fontSize: 'var(--font-size-75)',
  fontWeight: 'var(--font-weight-semibold)',
  lineHeight: 'var(--line-height-75)',
  color: 'rgba(var(--center-channel-color-rgb), 0.72)',
} as const;

export const ButtonsBothSides: Story = {
  args: {
    leftActions: (
      <Button type="button" size="medium" emphasis="tertiary" onClick={fn()}>
        Secondary
      </Button>
    ),
    rightActions: (
      <>
        <Button type="button" size="medium" emphasis="tertiary" onClick={fn()}>
          Cancel
        </Button>
        <Button type="button" size="medium" emphasis="primary" onClick={fn()}>
          Save
        </Button>
      </>
    ),
  },
};

export const IconButtons: Story = {
  args: {
    leftActions: (
      <IconButton
        type="button"
        style="default"
        size="medium"
        aria-label="Add"
        onClick={fn()}
        icon={<Icon glyph={<PlusIcon />} />}
      />
    ),
    rightActions: (
      <>
        <IconButton
          type="button"
          style="default"
          size="medium"
          aria-label="Refresh"
          onClick={fn()}
          icon={<Icon glyph={<RefreshIcon />} />}
        />
        <IconButton
          type="button"
          style="default"
          size="medium"
          aria-label="Previous page"
          onClick={fn()}
          icon={<Icon glyph={<ChevronLeftIcon />} />}
        />
        <IconButton
          type="button"
          style="default"
          size="medium"
          aria-label="Next page"
          onClick={fn()}
          icon={<Icon glyph={<ChevronRightIcon />} />}
        />
      </>
    ),
  },
};

export const Pagination: Story = {
  args: {
    leftActions: <p style={statusStyle}>Showing 1–30 of 132</p>,
    rightActions: (
      <>
        <Button type="button" size="small" emphasis="tertiary" onClick={fn()}>
          Previous
        </Button>
        <Button type="button" size="small" emphasis="tertiary" onClick={fn()}>
          Next
        </Button>
      </>
    ),
  },
};

export const PaginationDotsEnd: Story = {
  args: {
    leftActions: (
      <Button type="button" size="medium" emphasis="tertiary" onClick={fn()}>
        Add filter
      </Button>
    ),
    rightActions: (
      <PaginationDots activePage={2} pages={5} onPageChange={fn()} />
    ),
  },
};

export const RightOnly: Story = {
  args: {
    rightActions: (
      <>
        <Button type="button" size="medium" emphasis="tertiary" onClick={fn()}>
          Cancel
        </Button>
        <Button type="button" size="medium" emphasis="primary" onClick={fn()}>
          Save
        </Button>
      </>
    ),
  },
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  decorators: [],
  render: () => (
    <div style={{ display: 'grid', gap: 24, maxWidth: 920 }}>
      {(
        [
          ['Buttons both sides', ButtonsBothSides.args],
          ['Icon buttons', IconButtons.args],
          ['Pagination', Pagination.args],
          ['Pagination dots', PaginationDotsEnd.args],
          ['Right only', RightOnly.args],
        ] as const
      ).map(([label, args]) => (
        <div key={label} style={panelChrome}>
          <div
            style={{
              padding: 'var(--spacing-xxl)',
              color: 'rgba(var(--center-channel-color-rgb), 0.75)',
              fontSize: 'var(--font-size-100)',
            }}
          >
            {label}
          </div>
          <AdminPanelFooter {...args} />
        </div>
      ))}
    </div>
  ),
};
