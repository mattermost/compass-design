import type { HTMLAttributes, ReactNode } from 'react';
import AlertCircleOutlineIcon from '@mattermost/compass-icons/components/alert-circle-outline';
import AlertOutlineIcon from '@mattermost/compass-icons/components/alert-outline';
import CheckIcon from '@mattermost/compass-icons/components/check';
import Icon from '@/components/Icon/Icon';
import { toKebab } from '@/utils/string';
import styles from './FieldMessage.module.scss';

export type FieldMessageTone = 'error' | 'warning' | 'info' | 'success';

export interface FieldMessageProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional CSS class name. */
  className?: string;
  /** The message. Accepts translated nodes (e.g. `<FormattedMessage/>`). */
  message: ReactNode;
  /** Visual tone. Default: `error`. Info has no icon. */
  tone?: FieldMessageTone;
}

const TONE_ICONS: Partial<Record<FieldMessageTone, ReactNode>> = {
  error: <AlertCircleOutlineIcon />,
  warning: <AlertOutlineIcon />,
  success: <CheckIcon />,
};

/**
 * Field Message is the inline status line under a form field — validation errors, warnings,
 * hints, or success. Error, warning, and success pair a tone glyph with the copy; info is
 * text-only at muted center-channel color.
 */
export default function FieldMessage({
  className = '',
  message,
  tone = 'error',
  ...rest
}: FieldMessageProps) {
  const toneClass = styles[`field-message--tone-${toKebab(tone)}`];
  const rootClass = [styles['field-message'], toneClass, className]
    .filter(Boolean)
    .join(' ');

  const isAlert = tone === 'error' || tone === 'warning';
  const glyph = TONE_ICONS[tone];

  return (
    <div {...rest} className={rootClass} role={isAlert ? 'alert' : rest.role}>
      {glyph != null && (
        <span className={styles['field-message__icon']} aria-hidden>
          <Icon size="12" glyph={glyph} />
        </span>
      )}
      <span className={styles['field-message__text']}>{message}</span>
    </div>
  );
}
