import { MessageActions } from '@mattermost/compass-ui/components/message-actions';
import styles from '@/styles/library-demo/components.module.scss';

export default function MessageActionsLibrary() {
  return (
    <>
      <div className={styles['components__button-block']}>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Center Channel
          </span>
          <MessageActions type="center-channel" />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>RHS</span>
          <MessageActions type="rhs" />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Search Results
          </span>
          <MessageActions type="search-results" />
        </div>
      </div>
    </>
  );
}
