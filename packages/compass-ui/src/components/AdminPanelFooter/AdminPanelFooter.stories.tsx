import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import ChevronLeftIcon from '@mattermost/compass-icons/components/chevron-left';
import ChevronRightIcon from '@mattermost/compass-icons/components/chevron-right';
import AdminPanel from '@/components/AdminPanel/AdminPanel';
import Button from '@/components/Button/Button';
import Icon from '@/components/Icon/Icon';
import IconButton from '@/components/IconButton/IconButton';
import PaginationDots from '@/components/PaginationDots/PaginationDots';
import AdminPanelFooter from './AdminPanelFooter';

const meta = {
  title: 'Components/Admin Console/Admin Panel Footer',
  component: AdminPanelFooter,
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

const bodyStyle = {
  margin: 0,
  color: 'rgba(var(--center-channel-color-rgb), 0.75)',
  fontSize: 'var(--font-size-100)',
} as const;

function PanelWithFooter({
  footer,
}: {
  footer: ReactNode;
}) {
  return (
    <AdminPanel
      title="Section Title"
      subtitle="Section sub-title"
      footer={footer}
    >
      <p style={bodyStyle}>Panel body</p>
    </AdminPanel>
  );
}

export const PrimaryActions: Story = {
  render: () => (
    <PanelWithFooter
      footer={
        <AdminPanelFooter
          leftActions={
            <>
              <Button
                type="button"
                size="medium"
                emphasis="primary"
                onClick={fn()}
              >
                Save
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
      }
    />
  ),
};

export const ButtonsBothSides: Story = {
  render: () => (
    <PanelWithFooter
      footer={
        <AdminPanelFooter
          leftActions={
            <>
              <Button
                type="button"
                size="medium"
                emphasis="primary"
                onClick={fn()}
              >
                Save
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
          rightActions={
            <Button
              type="button"
              size="medium"
              emphasis="tertiary"
              onClick={fn()}
            >
              Secondary
            </Button>
          }
        />
      }
    />
  ),
};

export const Pagination: Story = {
  render: () => (
    <PanelWithFooter
      footer={
        <AdminPanelFooter
          leftActions={<p style={statusStyle}>Showing 1–30 of 132</p>}
          rightActions={
            <>
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
          }
        />
      }
    />
  ),
};

export const PaginationDotsEnd: Story = {
  render: () => (
    <PanelWithFooter
      footer={
        <AdminPanelFooter
          leftActions={
            <Button
              type="button"
              size="medium"
              emphasis="tertiary"
              onClick={fn()}
            >
              Add filter
            </Button>
          }
          rightActions={
            <PaginationDots activePage={2} pages={5} onPageChange={fn()} />
          }
        />
      }
    />
  ),
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 24, maxWidth: 920 }}>
      <AdminPanel
        title="Primary actions"
        subtitle="Section sub-title"
        footer={
          <AdminPanelFooter
            leftActions={
              <>
                <Button
                  type="button"
                  size="medium"
                  emphasis="primary"
                  onClick={fn()}
                >
                  Save
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
        }
      >
        <p style={bodyStyle}>Panel body</p>
      </AdminPanel>
      <AdminPanel
        title="Buttons both sides"
        subtitle="Section sub-title"
        footer={
          <AdminPanelFooter
            leftActions={
              <>
                <Button
                  type="button"
                  size="medium"
                  emphasis="primary"
                  onClick={fn()}
                >
                  Save
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
            rightActions={
              <Button
                type="button"
                size="medium"
                emphasis="tertiary"
                onClick={fn()}
              >
                Secondary
              </Button>
            }
          />
        }
      >
        <p style={bodyStyle}>Panel body</p>
      </AdminPanel>
      <AdminPanel
        title="Pagination"
        subtitle="Section sub-title"
        footer={
          <AdminPanelFooter
            leftActions={<p style={statusStyle}>Showing 1–30 of 132</p>}
            rightActions={
              <>
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
            }
          />
        }
      >
        <p style={bodyStyle}>Panel body</p>
      </AdminPanel>
      <AdminPanel
        title="Pagination dots"
        subtitle="Section sub-title"
        footer={
          <AdminPanelFooter
            leftActions={
              <Button
                type="button"
                size="medium"
                emphasis="tertiary"
                onClick={fn()}
              >
                Add filter
              </Button>
            }
            rightActions={
              <PaginationDots activePage={2} pages={5} onPageChange={fn()} />
            }
          />
        }
      >
        <p style={bodyStyle}>Panel body</p>
      </AdminPanel>
    </div>
  ),
};
