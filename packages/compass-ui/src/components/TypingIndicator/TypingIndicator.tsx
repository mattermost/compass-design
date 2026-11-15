import type { HTMLAttributes, ReactNode } from 'react';
import { mergeClassNames } from '@/utils/props';
import styles from './TypingIndicator.module.scss';

export interface TypingIndicatorProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  'children'
> {
  /**
   * Visible text next to the dots, e.g. "Alice is typing". Pass translated
   * content; Compass does not compose the sentence. When omitted, only the dots
   * are drawn and `typingLabel` is announced instead.
   */
  label?: ReactNode;
  /**
   * Screen-reader text used when no `label` is passed. Default: "Typing".
   */
  typingLabel?: ReactNode;
}

/**
 * A Typing Indicator tells people in a conversation that someone is composing a message. It
 * is quiet, lightweight, and disappears as soon as the message sends or the person stops
 * typing.
 */
export default function TypingIndicator({
  label,
  typingLabel = 'Typing',
  className,
  ...rest
}: TypingIndicatorProps) {
  return (
    <span
      role="status"
      {...rest}
      className={mergeClassNames(styles['typing-indicator'], className)}
    >
      <span className={styles['typing-indicator__dots']} aria-hidden="true">
        <span className={styles['typing-indicator__dot']} />
        <span className={styles['typing-indicator__dot']} />
        <span className={styles['typing-indicator__dot']} />
      </span>
      {label != null ? (
        <span className={styles['typing-indicator__label']}>{label}</span>
      ) : (
        <span className={styles['typing-indicator__hint']}>{typingLabel}</span>
      )}
    </span>
  );
}
