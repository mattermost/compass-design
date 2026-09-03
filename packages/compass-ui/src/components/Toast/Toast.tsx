import type { ReactNode } from 'react';
import AlertCircleOutlineIcon from '@mattermost/compass-icons/components/alert-circle-outline';
import AlertOutlineIcon from '@mattermost/compass-icons/components/alert-outline';
import CheckIcon from '@mattermost/compass-icons/components/check';
import CloseIcon from '@mattermost/compass-icons/components/close';
import InformationOutlineIcon from '@mattermost/compass-icons/components/information-outline';
import Button from '@/components/Button/Button';
import Icon from '@/components/Icon/Icon';
import IconButton from '@/components/IconButton/IconButton';
import styles from './Toast.module.scss';

export type ToastType =
  | 'general'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger';

export interface ToastProps {
  className?: string;
  message: string;
  type?: ToastType;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}

const TYPE_ICONS: Record<ToastType, ReactNode> = {
  general: <AlertCircleOutlineIcon />,
  info: <InformationOutlineIcon />,
  success: <CheckIcon />,
  danger: <AlertOutlineIcon />,
  warning: <AlertCircleOutlineIcon />,
};

/**
 * Toasts notify the user that an action has completed or surface a brief message about a
 * system process. They sit on top of the workflow without interrupting it, don't require
 * user input to disappear, and auto-dismiss after a short duration.
 */
export default function Toast({
  className = '',
  message,
  type = 'general',
  actionLabel,
  onAction,
  onDismiss,
}: ToastProps) {
  const typeClass = styles[`toast--type-${type.toLowerCase()}`];
  const noDismissClass = onDismiss == null ? styles['toast--no-dismiss'] : '';
  const rootClass = [styles.toast, typeClass, noDismissClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClass} role="status" aria-live="polite">
      <div className={styles['toast__content']}>
        <span className={styles['toast__icon']} aria-hidden>
          <Icon glyph={TYPE_ICONS[type]} size="16" />
        </span>
        <span className={styles['toast__message']}>{message}</span>
        {actionLabel != null && (
          <Button
            appearance="default"
            emphasis="tertiary"
            size="x-small"
            className={styles['toast__action-btn--on-dark']}
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        )}
      </div>
      {onDismiss != null && (
        <IconButton
          aria-label="Dismiss"
          size="small"
          className={styles['toast__dismiss']}
          icon={<Icon glyph={<CloseIcon />} size="16" />}
          onClick={onDismiss}
        />
      )}
    </div>
  );
}
