import { useId, useState, type ReactNode } from 'react';
import DraftsEmptyIllustration from '@mattermost/compass-ui/illustrations/drafts-empty';
import ScheduledEmptyIllustration from '@mattermost/compass-ui/illustrations/scheduled-empty';
import {
  DraftListItem,
  type DraftListItemProps,
} from '@mattermost/compass-ui/components/draft-list-item';
import { EmptyState } from '@mattermost/compass-ui/components/empty-state';
import { Tabs } from '@mattermost/compass-ui/components/tabs';
import styles from './DraftsPage.module.scss';

export type DraftsPageTab = 'drafts' | 'scheduled';

/** A row on the page: all `DraftListItem` props plus a stable `id`. */
export type DraftsPageItem = DraftListItemProps & { id: string };

export interface DraftsPageProps {
  /** Page title. Default: "Drafts & scheduled". */
  title?: ReactNode;
  /** Unsent drafts. */
  drafts: DraftsPageItem[];
  /** Scheduled posts, including ones that failed to send. */
  scheduled: DraftsPageItem[];
  /** Initially selected tab. Default: `drafts`. */
  defaultTab?: DraftsPageTab;
  /** Called when the tab changes. */
  onTabChange?: (tab: DraftsPageTab) => void;
  draftsTabLabel?: ReactNode;
  scheduledTabLabel?: ReactNode;
  draftsEmptyTitle?: ReactNode;
  draftsEmptyDescription?: ReactNode;
  scheduledEmptyTitle?: ReactNode;
  scheduledEmptyDescription?: ReactNode;
  className?: string;
}

/**
 * Drafts & scheduled page: a title, Drafts / Scheduled tabs with counts, a list of
 * `DraftListItem` rows, and an `EmptyState` with artwork when a tab has nothing in it.
 */
export default function DraftsPage({
  title = 'Drafts & scheduled',
  drafts,
  scheduled,
  defaultTab = 'drafts',
  onTabChange,
  draftsTabLabel = 'Drafts',
  scheduledTabLabel = 'Scheduled',
  draftsEmptyTitle = 'No drafts yet',
  draftsEmptyDescription = 'Messages you start but don’t send are saved here.',
  scheduledEmptyTitle = 'No scheduled messages',
  scheduledEmptyDescription = 'Messages you schedule to send later show up here.',
  className = '',
}: DraftsPageProps) {
  const [tab, setTab] = useState<DraftsPageTab>(defaultTab);
  const baseId = useId();
  const items = tab === 'drafts' ? drafts : scheduled;
  const rootClass = [styles['drafts-page'], className]
    .filter(Boolean)
    .join(' ');

  return (
    <section className={rootClass}>
      <header className={styles['drafts-page__header']}>
        <h1 className={styles['drafts-page__title']}>{title}</h1>
        <Tabs
          appearance="underlined"
          activeKey={tab}
          onChange={(key) => {
            setTab(key as DraftsPageTab);
            onTabChange?.(key as DraftsPageTab);
          }}
          tabs={[
            {
              key: 'drafts',
              label: draftsTabLabel,
              countBadge: drafts.length,
              id: `${baseId}-drafts-tab`,
              panelId: `${baseId}-panel`,
            },
            {
              key: 'scheduled',
              label: scheduledTabLabel,
              countBadge: scheduled.length,
              id: `${baseId}-scheduled-tab`,
              panelId: `${baseId}-panel`,
            },
          ]}
        />
      </header>
      <div
        className={styles['drafts-page__panel']}
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-${tab}-tab`}
      >
        {items.length === 0 ? (
          <EmptyState
            className={styles['drafts-page__empty']}
            illustration={{
              children:
                tab === 'drafts' ? (
                  <DraftsEmptyIllustration />
                ) : (
                  <ScheduledEmptyIllustration />
                ),
            }}
            title={tab === 'drafts' ? draftsEmptyTitle : scheduledEmptyTitle}
            description={
              tab === 'drafts'
                ? draftsEmptyDescription
                : scheduledEmptyDescription
            }
          />
        ) : (
          <div className={styles['drafts-page__list']}>
            {items.map(({ id, ...row }) => (
              <DraftListItem key={id} {...row} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
