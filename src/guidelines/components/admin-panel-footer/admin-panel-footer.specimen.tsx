import type { ReactNode } from 'react';
import ChevronLeftIcon from '@mattermost/compass-icons/components/chevron-left';
import ChevronRightIcon from '@mattermost/compass-icons/components/chevron-right';
import { AdminPanel } from '@mattermost/compass-ui/components/admin-panel';
import { AdminPanelFooter } from '@mattermost/compass-ui/components/admin-panel-footer';
import { Button } from '@mattermost/compass-ui/components/button';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { IconButton } from '@mattermost/compass-ui/components/icon-button';
import { PaginationDots } from '@mattermost/compass-ui/components/pagination-dots';
import styles from '@/styles/library-demo/components.module.scss';

const statusStyle = {
  margin: 0,
  fontFamily: 'var(--font-family-body)',
  fontSize: 'var(--font-size-75)',
  fontWeight: 'var(--font-weight-regular)' as const,
  lineHeight: 'var(--line-height-75)',
  color: 'rgba(var(--center-channel-color-rgb), 0.72)',
};

const bodyStyle = {
  margin: 0,
  color: 'rgba(var(--center-channel-color-rgb), 0.75)',
  fontSize: 'var(--font-size-100)',
};

function Example({ label, footer }: { label: string; footer: ReactNode }) {
  return (
    <div>
      <p className={styles['components__instance-label']}>{label}</p>
      <AdminPanel
        title="Section Title"
        subtitle="Section sub-title"
        footer={footer}
      >
        <p style={bodyStyle}>Panel body</p>
      </AdminPanel>
    </div>
  );
}

export default function AdminPanelFooterLibrary() {
  return (
    <div className={styles['components__button-block']}>
      <Example
        label="Primary actions"
        footer={
          <AdminPanelFooter
            leftActions={
              <>
                <Button type="button" size="medium" emphasis="primary">
                  Save
                </Button>
                <Button type="button" size="medium" emphasis="tertiary">
                  Cancel
                </Button>
              </>
            }
          />
        }
      />
      <Example
        label="Buttons both sides"
        footer={
          <AdminPanelFooter
            leftActions={
              <>
                <Button type="button" size="medium" emphasis="primary">
                  Save
                </Button>
                <Button type="button" size="medium" emphasis="tertiary">
                  Cancel
                </Button>
              </>
            }
            rightActions={
              <Button type="button" size="medium" emphasis="tertiary">
                Secondary
              </Button>
            }
          />
        }
      />
      <Example
        label="Pagination"
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
                  icon={<Icon glyph={<ChevronLeftIcon />} />}
                />
                <IconButton
                  type="button"
                  style="default"
                  size="medium"
                  aria-label="Next page"
                  icon={<Icon glyph={<ChevronRightIcon />} />}
                />
              </>
            }
          />
        }
      />
      <Example
        label="Pagination dots"
        footer={
          <AdminPanelFooter
            leftActions={
              <Button type="button" size="medium" emphasis="tertiary">
                Add filter
              </Button>
            }
            rightActions={<PaginationDots activePage={2} pages={5} />}
          />
        }
      />
    </div>
  );
}
