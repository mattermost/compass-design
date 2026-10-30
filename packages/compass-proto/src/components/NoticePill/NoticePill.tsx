import type { HTMLAttributes } from 'react';
import { Icon } from '@mattermost/compass-ui/components/icon';
import HandRightOutlineIcon from '@mattermost/compass-icons/components/hand-right-outline';
import MicrophoneOffIcon from '@mattermost/compass-icons/components/microphone-off';
import CloseCircleIcon from '@mattermost/compass-icons/components/close-circle';
import styles from './NoticePill.module.scss';

export type NoticePillSize = 'small' | 'medium' | 'large';
export type NoticePillType = 'reaction' | 'hand-raise' | 'other';

export interface NoticePillProps extends HTMLAttributes<HTMLDivElement> {
  /** Size variant. Default: Small. */
  size?: NoticePillSize;
  /** Pill type. Default: Reaction. */
  type?: NoticePillType;
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
 * Notice Pills surface lightweight, transient signals during a call — emoji reactions,
 * raised hands, and system notifications like "you've been muted." They float over the call
 * surface long enough to register and then disappear; they aren't meant to be durable UI.
 */
export default function NoticePill({
  size = 'small',
  type = 'reaction',
  emoji = '😀',
  label = 'Leonard R.',
  message = 'You have been muted by the host',
  className = '',
  ...rest
}: NoticePillProps) {
  const rootClass = [
    styles['notice-pill'],
    styles[`notice-pill--size-${size.toLowerCase()}`],
    styles[
      `notice-pill--type-${type === 'hand-raise' ? 'hand-raise' : type === 'other' ? 'other' : 'reaction'}`
    ],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClass} {...rest}>
      <div className={styles['notice-pill__inner']}>
        {/* Reaction type: emoji + name */}
        {type === 'reaction' && (
          <>
            <span className={styles['notice-pill__emoji']} aria-hidden>
              {emoji}
            </span>
            <span className={styles['notice-pill__label']}>{label}</span>
          </>
        )}

        {/* Hand Raise: icon + name */}
        {type === 'hand-raise' && (
          <>
            <span className={styles['notice-pill__leading-icon']} aria-hidden>
              <Icon size="12" glyph={<HandRightOutlineIcon />} />
            </span>
            <span className={styles['notice-pill__label']}>
              {label} Raised Hand
            </span>
          </>
        )}

        {/* Other type: icon + message + dismiss */}
        {type === 'other' && (
          <>
            <span className={styles['notice-pill__leading-icon']} aria-hidden>
              <Icon size="12" glyph={<MicrophoneOffIcon />} />
            </span>
            <span className={styles['notice-pill__label']}>{message}</span>
            <span className={styles['notice-pill__trailing-icon']} aria-hidden>
              <Icon size="12" glyph={<CloseCircleIcon />} />
            </span>
          </>
        )}
      </div>
    </div>
  );
}
