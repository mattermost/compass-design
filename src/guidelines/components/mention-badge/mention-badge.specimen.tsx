import { MentionBadge } from '@mattermost/compass-ui/components/mention-badge';
import styles from '@/styles/library-demo/components.module.scss';

export default function MentionBadgeLibrary() {
  return (
    <>
      <div className={styles['components__button-block']}>
        <div
          className={`${styles['components__button-row']} ${styles['components__button-row--inverted-bg']}`}
        >
          <span className={styles['components__instance-label']}>Sidebar</span>
          <MentionBadge count={1} location="sidebar" size="small" />
          <MentionBadge count={22} location="sidebar" size="small" />
          <MentionBadge count={100} location="sidebar" size="small" />
        </div>
        <div
          className={`${styles['components__button-row']} ${styles['components__button-row--inverted-bg']}`}
        >
          <span className={styles['components__instance-label']}>
            Sidebar Medium
          </span>
          <MentionBadge count={1} location="sidebar" size="medium" />
          <MentionBadge count={22} location="sidebar" size="medium" />
          <MentionBadge count={100} location="sidebar" size="medium" />
        </div>
        <div
          className={`${styles['components__button-row']} ${styles['components__button-row--inverted-bg']}`}
        >
          <span className={styles['components__instance-label']}>
            Sidebar Large
          </span>
          <MentionBadge count={1} location="sidebar" size="large" />
          <MentionBadge count={22} location="sidebar" size="large" />
          <MentionBadge count={100} location="sidebar" size="large" />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Menu Item
          </span>
          <MentionBadge count={1} location="menu-item" size="small" />
          <MentionBadge count={22} location="menu-item" size="medium" />
          <MentionBadge count={100} location="menu-item" size="large" />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Channel Small
          </span>
          <MentionBadge count={1} location="channel" size="small" />
          <MentionBadge count={22} location="channel" size="small" />
          <MentionBadge count={100} location="channel" size="small" />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Channel Medium
          </span>
          <MentionBadge count={1} location="channel" size="medium" />
          <MentionBadge count={22} location="channel" size="medium" />
          <MentionBadge count={100} location="channel" size="medium" />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Channel Large
          </span>
          <MentionBadge count={1} location="channel" size="large" />
          <MentionBadge count={22} location="channel" size="large" />
          <MentionBadge count={100} location="channel" size="large" />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Icon Button
          </span>
          <MentionBadge count={1} location="icon-button" size="small" />
          <MentionBadge count={22} location="icon-button" size="small" />
          <MentionBadge count={100} location="icon-button" size="small" />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Icon Button Medium
          </span>
          <MentionBadge count={1} location="icon-button" size="medium" />
          <MentionBadge count={22} location="icon-button" size="medium" />
          <MentionBadge count={100} location="icon-button" size="medium" />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Icon Button Large
          </span>
          <MentionBadge count={1} location="icon-button" size="large" />
          <MentionBadge count={22} location="icon-button" size="large" />
          <MentionBadge count={100} location="icon-button" size="large" />
        </div>
      </div>
    </>
  );
}
