import avatarLeonard from '@/assets/avatars/Leonard Riley.png';
import { PermalinkPreview } from '@mattermost/compass-ui/components/permalink-preview';
import styles from '@/styles/library-demo/components.module.scss';

const attachmentCard = (
  <div
    style={{
      border: '1px solid rgba(var(--center-channel-color-rgb), 0.16)',
      borderRadius: 'var(--radius-s)',
      padding: 'var(--spacing-m) var(--spacing-l)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-xs)',
      width: '100%',
      background: 'rgba(var(--center-channel-color-rgb), 0.04)',
    }}
  >
    <p
      style={{
        margin: 0,
        fontWeight: 'var(--font-weight-semibold)',
        fontSize: 'var(--font-size-100)',
        color: 'var(--center-channel-color)',
      }}
    >
      Incident Report #4821
    </p>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'max-content 1fr',
        gap: 'var(--spacing-xxs) var(--spacing-m)',
        fontSize: 'var(--font-size-75)',
        color: 'rgba(var(--center-channel-color-rgb), 0.72)',
      }}
    >
      <span>Severity</span>
      <span>P1 — Critical</span>
      <span>Status</span>
      <span>Investigating</span>
      <span>Assignee</span>
      <span>@on-call-team</span>
    </div>
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
            {attachmentCard}
          </PermalinkPreview>
        </div>
      </div>
    </>
  );
}
