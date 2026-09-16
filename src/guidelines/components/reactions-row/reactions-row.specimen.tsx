import { ReactionsRow } from '@mattermost/compass-ui/components/reactions-row';
import styles from '@/styles/library-demo/components.module.scss';

export default function ReactionsRowLibrary() {
  return (
    <>
      <div className={styles['components__button-block']}>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Default</span>
          <ReactionsRow />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            With add button
          </span>
          <ReactionsRow
            reactions={[
              { emoji: '👍', count: 5, byCurrentUser: true },
              { emoji: '🎉', count: 2 },
            ]}
            showAddReaction
          />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Acknowledge — unclicked
          </span>
          <ReactionsRow
            reactions={[]}
            acknowledged
            acknowledgeCount={0}
            currentUserAcknowledged={false}
          />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Acknowledge — clicked
          </span>
          <ReactionsRow
            reactions={[]}
            acknowledged
            acknowledgeCount={3}
            currentUserAcknowledged
          />
        </div>
      </div>
    </>
  );
}
