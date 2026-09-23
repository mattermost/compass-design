import avatarLeonard from '@/assets/avatars/Leonard Riley.png';
import { PermalinkPreview } from '@mattermost/compass-ui/components/permalink-preview';
import styles from '@/styles/library-demo/components.module.scss';

const richContent = (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-xs)',
    }}
  >
    <p
      style={{
        margin: 0,
        fontWeight: 'var(--font-weight-semibold)',
        fontSize: 'var(--font-size-200)',
        color: 'var(--center-channel-color)',
      }}
    >
      Release notes for v9.11
    </p>
    <p
      style={{
        margin: 0,
        fontSize: 'var(--font-size-100)',
        color: 'rgba(var(--center-channel-color-rgb), 0.72)',
      }}
    >
      Highlights include improved search performance, a refreshed sidebar, and
      several accessibility fixes across the desktop and mobile clients.
      The release also ships a new onboarding checklist for first-time users,
      expanded keyboard shortcut coverage, and a set of API changes detailed
      in the migration guide. Performance benchmarks show a 30% reduction in
      time-to-interactive on slow networks compared to v9.10.
    </p>
  </div>
);

export default function PermalinkPreviewLibrary() {
  return (
    <>
      <div className={styles['components__button-block']}>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Default</span>
          <PermalinkPreview
            avatarSrc={avatarLeonard}
            onDismiss={() => {}}
          />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Rich content (children slot)
          </span>
          <PermalinkPreview
            avatarSrc={avatarLeonard}
            authorName="Leonard Riley"
            timestamp="10:43 AM"
            originalChannel="~Incidents"
            onDismiss={() => {}}
          >
            {richContent}
          </PermalinkPreview>
        </div>
      </div>
    </>
  );
}
