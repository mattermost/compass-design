import type { HTMLAttributes, ReactNode } from 'react';
import { Icon } from '@mattermost/compass-ui/components/icon';
import HandRightOutlineIcon from '@mattermost/compass-icons/components/hand-right-outline';
import MicrophoneOffIcon from '@mattermost/compass-icons/components/microphone-off';
import AlertOutlineIcon from '@mattermost/compass-icons/components/alert-outline';
import AlertCircleOutlineIcon from '@mattermost/compass-icons/components/alert-circle-outline';
import CloseCircleIcon from '@mattermost/compass-icons/components/close-circle';
import styles from './CallNotice.module.scss';

export type CallNoticeSize = 'small' | 'medium' | 'large';
export type CallNoticeType = 'reaction' | 'hand-raise' | 'other';
export type CallNoticeAppearance = 'default' | 'center-channel';
export type CallNoticeTone = 'default' | 'warning' | 'error';

export interface CallNoticeProps extends HTMLAttributes<HTMLDivElement> {
  /** Size variant. Default: Small. */
  size?: CallNoticeSize;
  /** Pill type. Default: Reaction. */
  type?: CallNoticeType;
  /**
   * Surface the notice sits on. Named `appearance` to match Compass UI
   * (`Button`, `Dropdown`: `'default' | 'inverted'`).
   * - `default`: dark indigo pill (`--calls-bg`) for dark call surfaces
   *   (stage, popout, mobile call screen).
   * - `center-channel`: light pill (`--center-channel-bg`) with a border for
   *   light surfaces such as the call widget. Works with every `type` and
   *   `size`; `hand-raise` keeps its indigo text and icon.
   * Default: `default`.
   */
  appearance?: CallNoticeAppearance;
  /**
   * Severity of a system notice, matching the `warning` / `error` alert types in
   * mattermost-plugin-calls. Only applies to `type="other"`; `reaction` and
   * `hand-raise` are participant signals, not alerts, and ignore it.
   * - `default`: neutral pill styled by `appearance`.
   * - `warning`: solid warning fill (same as Toast `type="warning"`) with light text.
   * - `error`: solid error fill (same as Toast `type="danger"`) with light text.
   * Warning and error are solid fills and look the same on either `appearance`.
   * Default: `default`.
   */
  tone?: CallNoticeTone;
  /**
   * Leading icon for `type="other"`. Defaults to a muted-microphone icon, an
   * alert icon for `tone="warning"`, and an alert-circle icon for `tone="error"`.
   * Pass a compass-icons glyph (it is wrapped in a 12px `Icon`).
   */
  icon?: ReactNode;
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
  appearance = 'default',
  tone = 'default',
  icon,
  emoji = '😀',
  label = 'Leonard R.',
  message = 'You have been muted by the host',
  className = '',
  ...rest
}: CallNoticeProps) {
  const toneClass =
    type === 'other' && tone !== 'default'
      ? styles[`call-notice--tone-${tone}`]
      : '';
  const defaultOtherIcon =
    tone === 'warning' ? (
      <AlertOutlineIcon />
    ) : tone === 'error' ? (
      <AlertCircleOutlineIcon />
    ) : (
      <MicrophoneOffIcon />
    );

  const rootClass = [
    styles['call-notice'],
    styles[`call-notice--size-${size.toLowerCase()}`],
    styles[
      `call-notice--type-${type === 'hand-raise' ? 'hand-raise' : type === 'other' ? 'other' : 'reaction'}`
    ],
    appearance === 'center-channel' &&
      styles['call-notice--appearance-center-channel'],
    toneClass,
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
              <Icon size="12" glyph={icon ?? defaultOtherIcon} />
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
