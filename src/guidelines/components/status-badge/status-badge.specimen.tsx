import { StatusBadge } from '@mattermost/compass-ui';
import styles from '@/styles/library-demo/components.module.scss';

export default function StatusBadgeLibrary() {
  return (
    <>
      <p
        className={styles['components__subheading']}
        style={{ marginBottom: 'var(--spacing-m)' }}
      >
        Figma Status Badge v2.0.1 — standalone; also used on UserAvatar when
        status is on.
      </p>
      <div className={styles['components__button-block']}>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Status</span>
          <StatusBadge status="online" />
          <StatusBadge status="away" />
          <StatusBadge status="do-not-disturb" />
          <StatusBadge status="offline" />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Sizes</span>
          <StatusBadge size="xx-small" status="online" />
          <StatusBadge size="x-small" status="online" />
          <StatusBadge size="small" status="online" />
          <StatusBadge size="medium" status="online" />
          <StatusBadge size="large" status="online" />
        </div>
      </div>
    </>
  );
}
