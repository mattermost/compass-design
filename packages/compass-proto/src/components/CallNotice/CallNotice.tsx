import type { HTMLAttributes } from 'react';
import { Icon } from '@mattermost/compass-ui/components/icon';
import HandRightOutlineIcon from '@mattermost/compass-icons/components/hand-right-outline';
import MicrophoneOffIcon from '@mattermost/compass-icons/components/microphone-off';
import CloseCircleIcon from '@mattermost/compass-icons/components/close-circle';
import styles from './CallNotice.module.scss';

export type CallNoticeSize = 'small' | 'medium' | 'large';
export type CallNoticeType = 'reaction' | 'hand-raise' | 'other';

export interface CallNoticeProps extends HTMLAttributes<HTMLDivElement> {
  /** Size variant. Default: Small. */
  size?: CallNoticeSize;
  /** Pill type. Default: Reaction. */
  type?: CallNoticeType;
  /** Emoji to display for Reaction type. Default: 😀 */
  emoji?: string;
  /** Participant name / label text. */
  label?: string;
  /** Notification message for 'other' type. */
  message?: string;
  /** Optional CSS class name. */
  className?: string;
}

/**
 * Call Notices surface lightweight, transient signals during a call — emoji reactions,
 * raised hands, and system notifications like "you've been muted." They float over the call
 * surface long enough to register and then disappear; they aren't meant to be durable UI.
 */
export default function CallNotice({
  size = 'small',
  type = 'reaction',
  emoji = '😀',
  label = 'Leonard R.',
  message = 'You have been muted by the host',
  className = '',
  ...rest
}: CallNoticeProps) {
  const rootClass = [
    styles['call-notice'],
    styles[`call-notice--size-${size.toLowerCase()}`],
    styles[
      `call-notice--type-${type === 'hand-raise' ? 'hand-raise' : type === 'other' ? 'other' : 'reaction'}`
    ],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClass} {...rest}>
      <div className={styles['call-notice__inner']}>
        {/* Reaction type: emoji + name */}
        {type === 'reaction' && (
          <>
            <span className={styles['call-notice__emoji']} aria-hidden>
              {emoji}
            </span>
            <span className={styles['call-notice__label']}>{label}</span>
          </>
        )}

        {/* Hand Raise: icon + name */}
        {type === 'hand-raise' && (
          <>
            <span className={styles['call-notice__leading-icon']} aria-hidden>
              <Icon size="12" glyph={<HandRightOutlineIcon />} />
            </span>
            <span className={styles['call-notice__label']}>
              {label} Raised Hand
            </span>
          </>
        )}

        {/* Other type: icon + message + decorative trailing icon */}
        {type === 'other' && (
          <>
            <span className={styles['call-notice__leading-icon']} aria-hidden>
              <Icon size="12" glyph={<MicrophoneOffIcon />} />
            </span>
            <span className={styles['call-notice__label']}>{message}</span>
            <span className={styles['call-notice__trailing-icon']} aria-hidden>
              <Icon size="12" glyph={<CloseCircleIcon />} />
            </span>
          </>
        )}
      </div>
    </div>
  );
}
