import type { ReactNode } from 'react';
import ChevronLeftIcon from '@mattermost/compass-icons/components/chevron-left';
import ChevronRightIcon from '@mattermost/compass-icons/components/chevron-right';
import PlusIcon from '@mattermost/compass-icons/components/plus';
import RefreshIcon from '@mattermost/compass-icons/components/refresh';
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
  fontWeight: 'var(--font-weight-semibold)' as const,
  lineHeight: 'var(--line-height-75)',
  color: 'rgba(var(--center-channel-color-rgb), 0.72)',
};

function PanelShell({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className={styles['components__instance-label']}>{label}</p>
      <div
        style={{
          maxWidth: 920,
          width: '100%',
          border: '1px solid rgba(var(--center-channel-color-rgb), 0.16)',
          borderRadius: 'var(--radius-m)',
          overflow: 'hidden',
          background: 'var(--center-channel-bg)',
        }}
      >
        <div
          style={{
            padding: 'var(--spacing-xxl)',
            color: 'rgba(var(--center-channel-color-rgb), 0.75)',
            fontSize: 'var(--font-size-100)',
          }}
        >
          Panel body
        </div>
        {children}
      </div>
    </div>
  );
}

export default function AdminPanelFooterLibrary() {
  return (
    <div className={styles['components__button-block']}>
      <PanelShell label="Buttons both sides">
        <AdminPanelFooter
          leftActions={
            <Button type="button" size="medium" emphasis="tertiary">
              Secondary
            </Button>
          }
          rightActions={
            <>
              <Button type="button" size="medium" emphasis="tertiary">
                Cancel
              </Button>
              <Button type="button" size="medium" emphasis="primary">
                Save
              </Button>
            </>
          }
        />
      </PanelShell>
      <PanelShell label="Icon buttons">
        <AdminPanelFooter
          leftActions={
            <IconButton
              type="button"
              style="default"
              size="medium"
              aria-label="Add"
              icon={<Icon glyph={<PlusIcon />} />}
            />
          }
          rightActions={
            <>
              <IconButton
                type="button"
                style="default"
                size="medium"
                aria-label="Refresh"
                icon={<Icon glyph={<RefreshIcon />} />}
              />
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
      </PanelShell>
      <PanelShell label="Pagination">
        <AdminPanelFooter
          leftActions={<p style={statusStyle}>Showing 1–30 of 132</p>}
          rightActions={
            <>
              <Button type="button" size="small" emphasis="tertiary">
                Previous
              </Button>
              <Button type="button" size="small" emphasis="tertiary">
                Next
              </Button>
            </>
          }
        />
      </PanelShell>
      <PanelShell label="Pagination dots">
        <AdminPanelFooter
          leftActions={
            <Button type="button" size="medium" emphasis="tertiary">
              Add filter
            </Button>
          }
          rightActions={<PaginationDots activePage={2} pages={5} />}
        />
      </PanelShell>
      <PanelShell label="Right only">
        <AdminPanelFooter
          rightActions={
            <>
              <Button type="button" size="medium" emphasis="tertiary">
                Cancel
              </Button>
              <Button type="button" size="medium" emphasis="primary">
                Save
              </Button>
            </>
          }
        />
      </PanelShell>
    </div>
  );
}
