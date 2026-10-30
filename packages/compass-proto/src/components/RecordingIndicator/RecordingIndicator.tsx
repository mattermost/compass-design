import type { HTMLAttributes } from 'react';
import { Spinner } from '@mattermost/compass-ui/components/spinner';
import { Icon } from '@mattermost/compass-ui/components/icon';
import RecordCircleOutlineIcon from '@mattermost/compass-icons/components/record-circle-outline';
import RecordSquareOutlineIcon from '@mattermost/compass-icons/components/record-square-outline';
import styles from './RecordingIndicator.module.scss';

export type RecordingIndicatorState = 'initializing' | 'recording' | 'hover';

export interface RecordingIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  /** Current recording state. Default: Initializing. */
  state?: RecordingIndicatorState;
  /** Called when the pill is clicked (stop recording). */
  onStop?: () => void;
  /** Optional CSS class name. */
  className?: string;
}

/**
 * Active recording indicator pill shown during calls.
 * Displays 'REC' text with a spinner (initializing), record icon (recording),
 * or stop icon with tooltip (hover/click-to-stop).
 */
export default function RecordingIndicator({
  state = 'initializing',
  onStop,
  className = '',
  ...rest
}: RecordingIndicatorProps) {
  const rootClass = [
    styles['recording-indicator'],
    styles[`recording-indicator--${state.toLowerCase()}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClass} {...rest}>
      <button
        type="button"
        className={styles['recording-indicator__button']}
        onClick={onStop}
        aria-label={
          state === 'hover' ? 'Stop recording' : 'Recording in progress'
        }
      >
        <span className={styles['recording-indicator__icon']} aria-hidden>
          {state === 'initializing' && (
            <Spinner size="12" inverted aria-label="Initializing recording" />
          )}
          {state === 'recording' && (
            <Icon size="12" glyph={<RecordCircleOutlineIcon />} />
          )}
          {state === 'hover' && (
            <Icon size="12" glyph={<RecordSquareOutlineIcon />} />
          )}
        </span>
        <span className={styles['recording-indicator__label']}>REC</span>
      </button>

      {state === 'hover' && (
        <div className={styles['recording-indicator__tooltip']} role="tooltip">
          Click to Stop
        </div>
      )}
    </div>
  );
}
