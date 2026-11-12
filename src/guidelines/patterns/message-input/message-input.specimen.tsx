import { MessageInput } from '@mattermost/compass-proto';
import { Button } from '@mattermost/compass-ui/components/button';
import styles from '@/styles/library-demo/patterns.module.scss';

const SUGGESTIONS = [
  'Summarize this channel',
  'Draft a status update',
  'Find action items',
];

export default function MessageInputLibrary() {
  return (
    <div className={styles['patterns__message-input-demo']}>
      <p className={styles['patterns__variant-label']}>Default</p>
      <MessageInput placeholder="Message #ux-design…" />
      <p className={styles['patterns__variant-label']}>
        Narrow (right sidebar)
      </p>
      <div className={styles['patterns__message-input-narrow']}>
        <MessageInput placeholder="Message #ux-design…" width="narrow" />
      </div>
      <p className={styles['patterns__variant-label']}>
        With priority indicator
      </p>
      <MessageInput placeholder="Message #ux-design…" showPriorityIndicator />
      <p className={styles['patterns__variant-label']}>With attachments</p>
      <MessageInput placeholder="Message #ux-design…" showAttachments />
      <p className={styles['patterns__variant-label']}>
        With priority + attachments
      </p>
      <MessageInput
        placeholder="Message #ux-design…"
        showPriorityIndicator
        showAttachments
      />
      <p className={styles['patterns__variant-label']}>With suggestions</p>
      <MessageInput
        placeholder="Message #ux-design…"
        suggestions={
          <div className={styles['patterns__message-input-suggestions']}>
            {SUGGESTIONS.map((suggestion) => (
              <Button key={suggestion} emphasis="tertiary" size="small">
                {suggestion}
              </Button>
            ))}
          </div>
        }
      />
    </div>
  );
}
