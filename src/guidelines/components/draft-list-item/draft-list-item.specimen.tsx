import { DraftListItem } from '@mattermost/compass-ui/components/draft-list-item';
import styles from '@/styles/library-demo/components.module.scss';

const PREVIEW =
  'Here is the draft of the release notes for 10.4. Can someone double-check the migration section before I post it?';

export default function DraftListItemLibrary() {
  const noop = () => undefined;
  return (
    <div className={styles['components__button-block']}>
      <div className={styles['components__button-row']}>
        <span className={styles['components__instance-label']}>Draft</span>
        <DraftListItem
          destination="Town Square"
          previewText={PREVIEW}
          timestamp="Edited 5 mins ago"
          onClick={noop}
          onEdit={noop}
          onSend={noop}
          onDelete={noop}
        />
      </div>
      <div className={styles['components__button-row']}>
        <span className={styles['components__instance-label']}>
          Thread reply
        </span>
        <DraftListItem
          destination="Town Square"
          threadLabel="Thread"
          previewText={PREVIEW}
          timestamp="Edited yesterday"
          onClick={noop}
          onDelete={noop}
        />
      </div>
      <div className={styles['components__button-row']}>
        <span className={styles['components__instance-label']}>Scheduled</span>
        <DraftListItem
          status="scheduled"
          destination="Town Square"
          previewText={PREVIEW}
          timestamp="Send on Mon, Nov 16 at 9:00 AM"
          onClick={noop}
          onEdit={noop}
          onSend={noop}
          onDelete={noop}
        />
      </div>
      <div className={styles['components__button-row']}>
        <span className={styles['components__instance-label']}>Failed</span>
        <DraftListItem
          status="failed"
          destination="Town Square"
          previewText={PREVIEW}
          timestamp="Was due Mon, Nov 16 at 9:00 AM"
          errorMessage="This channel was archived before the message could send."
          onClick={noop}
          onEdit={noop}
          onDelete={noop}
        />
      </div>
    </div>
  );
}
