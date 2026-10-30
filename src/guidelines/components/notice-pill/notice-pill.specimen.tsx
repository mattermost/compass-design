import { NoticePill } from '@mattermost/compass-proto';
import styles from '@/styles/library-demo/components.module.scss';

export default function NoticePillLibrary() {
  return (
    <>
      <div className={styles['components__button-block']}>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Types</span>
          <NoticePill type="reaction" emoji="🎉" label="Leonard R." />
          <NoticePill type="hand-raise" label="Danielle O." />
          <NoticePill type="other" message="You have been muted by the host" />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Sizes</span>
          <NoticePill
            type="reaction"
            emoji="👍"
            label="Marco R."
            size="small"
          />
          <NoticePill
            type="reaction"
            emoji="👍"
            label="Marco R."
            size="medium"
          />
          <NoticePill
            type="reaction"
            emoji="👍"
            label="Marco R."
            size="large"
          />
        </div>
      </div>
    </>
  );
}
