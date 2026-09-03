import { ReactionPill } from '@mattermost/compass-proto';
import styles from '@/styles/library-demo/components.module.scss';

export default function ReactionPillLibrary() {
  return (
    <>
      <div className={styles['components__button-block']}>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Types</span>
          <ReactionPill type="reaction" emoji="🎉" label="Leonard R." />
          <ReactionPill type="hand-raise" label="Danielle O." />
          <ReactionPill
            type="other"
            message="You have been muted by the host"
          />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Sizes</span>
          <ReactionPill
            type="reaction"
            emoji="👍"
            label="Marco R."
            size="small"
          />
          <ReactionPill
            type="reaction"
            emoji="👍"
            label="Marco R."
            size="medium"
          />
          <ReactionPill
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
