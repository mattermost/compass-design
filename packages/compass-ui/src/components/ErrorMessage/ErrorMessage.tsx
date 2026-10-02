import type { HTMLAttributes, ReactNode } from 'react';
import Icon from '@/components/Icon/Icon';
import AlertCircleOutlineIcon from '@mattermost/compass-icons/components/alert-circle-outline';
import styles from './ErrorMessage.module.scss';

export interface ErrorMessageProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional CSS class name. */
  className?: string;
  /** The error message. Accepts translated nodes (e.g. `<FormattedMessage/>`). */
  message: ReactNode;
}

/**
 * Error Message is the inline red error line that appears below a form input when validation
 * fails. It pairs an alert glyph with a short, human-readable explanation so the user can
 * fix the field and move on.
 */
export default function ErrorMessage({
  className = '',
  message,
  ...rest
}: ErrorMessageProps) {
  const rootClass = [styles['error-message'], className]
    .filter(Boolean)
    .join(' ');

  return (
    <div {...rest} className={rootClass} role="alert">
      <span className={styles['error-message__icon']} aria-hidden>
        <Icon size="12" glyph={<AlertCircleOutlineIcon />} />
      </span>
      <span className={styles['error-message__text']}>{message}</span>
    </div>
  );
}
