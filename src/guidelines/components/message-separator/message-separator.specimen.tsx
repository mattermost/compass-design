import { MessageSeparator } from '@mattermost/compass-ui';
import styles from '@/styles/library-demo/components.module.scss';

export default function MessageSeparatorLibrary() {
  return (
    <>
      <div className={styles['components__button-block']}>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Date</span>
          <MessageSeparator type="date" label="Today" />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            New Messages
          </span>
          <MessageSeparator type="new-messages" showAiSummary />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Reply Count
          </span>
          <MessageSeparator type="reply-count" label="6 replies" />
        </div>
      </div>
    </>
  );
}
