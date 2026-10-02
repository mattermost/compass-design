import type { HTMLAttributes, ReactNode } from 'react';
import AlertCircleOutlineIcon from '@mattermost/compass-icons/components/alert-circle-outline';
import AlertOutlineIcon from '@mattermost/compass-icons/components/alert-outline';
import CheckIcon from '@mattermost/compass-icons/components/check';
import CloseIcon from '@mattermost/compass-icons/components/close';
import InformationOutlineIcon from '@mattermost/compass-icons/components/information-outline';
import Button from '@/components/Button/Button';
import Icon from '@/components/Icon/Icon';
import { IconSlotContext } from '@/components/Icon/Icon';
import IconButton from '@/components/IconButton/IconButton';
import type { BuiltInButtonProps } from '@/utils/props';
import { mergeClassNames } from '@/utils/props';
import styles from './Toast.module.scss';

export type ToastType = 'general' | 'info' | 'success' | 'warning' | 'danger';

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  /** Toast message. Accepts translated nodes (e.g. `<FormattedMessage/>`). */
  message: ReactNode;
  type?: ToastType;
  /** Optional icon override — pass `<Icon glyph={<SomeIcon />} />`; replaces the default type icon. Toast provides the correct size via context. */
  icon?: ReactNode;
  actionLabel?: ReactNode;
  onAction?: () => void;
  onDismiss?: () => void;
  /** Accessible name for the dismiss button. Default: "Dismiss". */
  dismissLabel?: string;
  /** Extra attributes for the dismiss button (e.g. `data-testid`). */
  dismissButtonProps?: BuiltInButtonProps;
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
  icon,
  actionLabel,
  onAction,
  onDismiss,
  dismissLabel = 'Dismiss',
  dismissButtonProps,
  ...rest
}: ToastProps) {
  const typeClass = styles[`toast--type-${type.toLowerCase()}`];
  const noDismissClass = onDismiss == null ? styles['toast--no-dismiss'] : '';
  const rootClass = [styles.toast, typeClass, noDismissClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div {...rest} className={rootClass} role="status" aria-live="polite">
      <div className={styles['toast__content']}>
        <span className={styles['toast__icon']} aria-hidden>
          <IconSlotContext.Provider value={{ size: '16' }}>
            {icon ?? <Icon glyph={TYPE_ICONS[type]} />}
          </IconSlotContext.Provider>
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
          {...dismissButtonProps}
          aria-label={dismissLabel}
          size="small"
          className={mergeClassNames(
            styles['toast__dismiss'],
            dismissButtonProps?.className,
          )}
          icon={<Icon glyph={<CloseIcon />} size="16" />}
          onClick={onDismiss}
        />
      )}
    </div>
  );
}
