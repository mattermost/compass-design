import type { HTMLAttributes, ReactNode } from 'react';
import AlertCircleOutlineIcon from '@mattermost/compass-icons/components/alert-circle-outline';
import AlertOutlineIcon from '@mattermost/compass-icons/components/alert-outline';
import CheckIcon from '@mattermost/compass-icons/components/check';
import InformationOutlineIcon from '@mattermost/compass-icons/components/information-outline';
import Icon from '@/components/Icon/Icon';
import { toKebab } from '@/utils/string';
import styles from './FieldMessage.module.scss';

export type FieldMessageTone = 'error' | 'warning' | 'info' | 'success';

export interface FieldMessageProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional CSS class name. */
  className?: string;
  /** The message. Accepts translated nodes (e.g. `<FormattedMessage/>`). */
  message: ReactNode;
  /** Visual tone. Default: `error`. */
  tone?: FieldMessageTone;
}

const TONE_ICONS: Record<FieldMessageTone, ReactNode> = {
  error: <AlertCircleOutlineIcon />,
  warning: <AlertOutlineIcon />,
  info: <InformationOutlineIcon />,
  success: <CheckIcon />,
};

/**
 * Field Message is the inline status line under a form field — validation errors,
 * warnings, hints, or success. It pairs a tone glyph with a short explanation.
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

  return (
    <div {...rest} className={rootClass} role={isAlert ? 'alert' : rest.role}>
      <span className={styles['field-message__icon']} aria-hidden>
        <Icon size="12" glyph={TONE_ICONS[tone]} />
      </span>
      <span className={styles['field-message__text']}>{message}</span>
    </div>
  );
}
