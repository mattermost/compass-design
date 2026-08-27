import { UnreadBadge } from '@mattermost/compass-ui';
import styles from '@/styles/library-demo/components.module.scss';

export default function UnreadBadgeLibrary() {
  return (
    <>
      <div className={styles['components__button-block']}>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Sizes</span>
          <UnreadBadge size="6" context="team-icon" />
          <UnreadBadge size="8" context="team-icon" />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Contexts</span>
          <UnreadBadge size="8" context="team-icon" />
          <UnreadBadge size="8" context="icon-button" />
        </div>
      </div>
    </>
  );
}
