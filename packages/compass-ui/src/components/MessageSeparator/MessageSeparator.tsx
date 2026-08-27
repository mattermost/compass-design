import type { HTMLAttributes } from 'react';
import Icon from '@/components/Icon/Icon';
import CreationOutlineIcon from '@mattermost/compass-icons/components/creation-outline';
import styles from './MessageSeparator.module.scss';

export type MessageSeparatorType = 'date' | 'new-messages' | 'reply-count';

export interface MessageSeparatorProps extends HTMLAttributes<HTMLDivElement> {
  /** Separator variant. Default: Date. */
  type?: MessageSeparatorType;
  /** Label text. Defaults: 'Today' / 'new-messages' / '4 replies'. */
  label?: string;
  /** Show AI summarize button (New Messages type only). Default: false. */
  showAiSummary?: boolean;
  /** Called when Summarize button is clicked. */
  onSummarize?: () => void;
  /** Optional CSS class name. */
  className?: string;
}

const DEFAULT_LABELS: Record<MessageSeparatorType, string> = {
  date: 'Today',
  'new-messages': 'new-messages',
  'reply-count': '4 replies',
};

/**
 * Message Separators sit between messages in the stream to group them — by day, by reply
 * count, or to mark the boundary between read and unread. They help readers orient
 * themselves when scrolling back through history or returning to a busy channel.
 */
export default function MessageSeparator({
  type = 'date',
  label,
  showAiSummary = false,
  onSummarize,
  className = '',
  ...rest
}: MessageSeparatorProps) {
  const displayLabel = label ?? DEFAULT_LABELS[type];

  const rootClass = [
    styles['message-separator'],
    styles[
      `message-separator--${type === 'new-messages' ? 'new' : type === 'reply-count' ? 'reply' : 'date'}`
    ],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const labelBlock = (
    <div className={styles['message-separator__label']}>
      <span className={styles['message-separator__text']}>
        {displayLabel}
      </span>

      {type === 'new-messages' && showAiSummary && (
        <button
          type="button"
          className={styles['message-separator__summarize']}
          onClick={onSummarize}
          aria-label="Summarize new messages with AI"
        >
          <span
            className={styles['message-separator__summarize-icon']}
            aria-hidden
          >
            <Icon size="12" glyph={<CreationOutlineIcon />} />
          </span>
          Summarize
        </button>
      )}
    </div>
  );

  return (
    <div className={rootClass} role="separator" {...rest}>
      {type === 'reply-count' ? (
        <>
          <div className={styles['message-separator__reply-gutter']} aria-hidden>
            <div className={styles['message-separator__reply-line-start']} />
          </div>
          {labelBlock}
          <div className={styles['message-separator__line']} aria-hidden />
        </>
      ) : (
        <>
          <div className={styles['message-separator__line']} aria-hidden />
          {labelBlock}
          <div className={styles['message-separator__line']} aria-hidden />
        </>
      )}
    </div>
  );
}
