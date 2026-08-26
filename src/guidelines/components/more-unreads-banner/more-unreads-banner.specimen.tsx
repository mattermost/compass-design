import { MoreUnreadsBanner } from '@mattermost/compass-ui';
import styles from '@/styles/library-demo/components.module.scss';

export default function MoreUnreadsBannerLibrary() {
  return (
    <>
      <div className={styles['components__button-block']}>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Directions
          </span>
          <MoreUnreadsBanner direction="up" />
          <MoreUnreadsBanner direction="down" />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Sizes</span>
          <MoreUnreadsBanner size="small" />
          <MoreUnreadsBanner size="medium" />
          <MoreUnreadsBanner size="large" />
        </div>
      </div>
    </>
  );
}
