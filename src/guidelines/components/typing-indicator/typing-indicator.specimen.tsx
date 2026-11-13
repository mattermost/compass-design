import { TypingIndicator } from '@mattermost/compass-ui/components/typing-indicator';
import styles from '@/styles/library-demo/components.module.scss';

export default function TypingIndicatorLibrary() {
  return (
    <div className={styles['components__button-block']}>
      <div className={styles['components__button-row']}>
        <span className={styles['components__instance-label']}>With label</span>
        <TypingIndicator label="Alice is typing" />
        <TypingIndicator label="Alice and Bob are typing" />
      </div>
      <div className={styles['components__button-row']}>
        <span className={styles['components__instance-label']}>Dots only</span>
        <TypingIndicator />
      </div>
    </div>
  );
}
