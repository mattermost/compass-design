import { FieldMessage } from '@mattermost/compass-ui/components/field-message';
import styles from '@/styles/library-demo/components.module.scss';

export default function FieldMessageLibrary() {
  return (
    <>
      <div className={styles['components__button-block']}>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Tones</span>
          <FieldMessage tone="error" message="This field is required." />
          <FieldMessage
            tone="warning"
            message="This channel name is already taken."
          />
          <FieldMessage
            tone="info"
            message="Use 8 or more characters with a mix of letters and numbers."
          />
          <FieldMessage tone="success" message="Invite link copied." />
        </div>
      </div>
    </>
  );
}
