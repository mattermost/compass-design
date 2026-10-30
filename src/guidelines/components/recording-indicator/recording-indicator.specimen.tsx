import { RecordingIndicator } from '@mattermost/compass-proto';
import styles from '@/styles/library-demo/components.module.scss';

export default function RecordingIndicatorLibrary() {
  return (
    <>
      <div
        className={`${styles['components__button-block']} ${styles['components__button-block--calls-bg']}`}
      >
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>States</span>
          <RecordingIndicator state="initializing" />
          <RecordingIndicator state="recording" />
          <RecordingIndicator state="hover" onStop={() => {}} />
        </div>
      </div>
    </>
  );
}
