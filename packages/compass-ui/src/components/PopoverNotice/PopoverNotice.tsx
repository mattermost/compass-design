import type { HTMLAttributes, ReactNode } from 'react';
import CloseIcon from '@mattermost/compass-icons/components/close';
import InformationOutlineIcon from '@mattermost/compass-icons/components/information-outline';
import CheckCircleOutlineIcon from '@mattermost/compass-icons/components/check-circle-outline';
import AlertCircleOutlineIcon from '@mattermost/compass-icons/components/alert-circle-outline';
import AlertOutlineIcon from '@mattermost/compass-icons/components/alert-outline';
import Button from '@/components/Button/Button';
import Checkbox from '@/components/Checkbox/Checkbox';
import IconButton from '@/components/IconButton/IconButton';
import Icon from '@/components/Icon/Icon';
import { IconSlotContext } from '@/components/Icon/Icon';
import type { BuiltInButtonProps } from '@/utils/props';
import { mergeClassNames } from '@/utils/props';
import styles from './PopoverNotice.module.scss';

export type PopoverNoticeVariant = 'info' | 'success' | 'warning' | 'danger';

export interface PopoverNoticeAction {
  /** Button label. Accepts translated nodes (e.g. `<FormattedMessage/>`). */
  label: ReactNode;
  onClick?: () => void;
  emphasis?: 'primary' | 'tertiary';
  disabled?: boolean;
  /** Shows a spinner in the button and disables it. */
  loading?: boolean;
}

export interface PopoverNoticeProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title' | 'children'
> {
  /** Popover title. Accepts translated nodes (e.g. `<FormattedMessage/>`). */
  title: ReactNode;
  /** Body content. */
  children: ReactNode;
  /**
   * Semantic variant — sets the icon and its color automatically.
   * Ignored if `icon` is also provided.
   */
  variant?: PopoverNoticeVariant;
  /** Optional icon shown to the left of the title. Overrides the variant icon. Pass `<Icon glyph={<SomeIcon />} />` — PopoverNotice provides the correct size via context. */
  icon?: ReactNode;
  /** Action buttons rendered below the body. */
  actions?: PopoverNoticeAction[];
  /** When true, shows a "Don't show this again" checkbox. */
  showCheckbox?: boolean;
  /** Checkbox label override. Accepts translated nodes. Default: "Don't show this confirmation again". */
  checkboxLabel?: ReactNode;
  /** Callback when close button is clicked. */
  onClose?: () => void;
  /** Accessible name for the close button. Default: "Close". */
  closeLabel?: string;
  /** Extra attributes for the close button (e.g. `data-testid`). */
  closeButtonProps?: BuiltInButtonProps;
  /** Optional CSS class name. */
  className?: string;
}

const VARIANT_ICONS: Record<PopoverNoticeVariant, ReactNode> = {
  info: <Icon size="20" glyph={<InformationOutlineIcon />} />,
  success: <Icon size="20" glyph={<CheckCircleOutlineIcon />} />,
  warning: <Icon size="20" glyph={<AlertCircleOutlineIcon />} />,
  danger: <Icon size="20" glyph={<AlertOutlineIcon />} />,
};

const VARIANT_ICON_CLASS: Record<PopoverNoticeVariant, string> = {
  info: styles['popover-notice__icon--info'],
  success: styles['popover-notice__icon--success'],
  warning: styles['popover-notice__icon--warning'],
  danger: styles['popover-notice__icon--danger'],
};

/**
 * Popover Notice is a small overlay card that surfaces a transient message — a tip, a
 * confirmation, a warning — without taking over the screen. Think of it as a [Section
 * Notice](/components/section-notice) that floats: shorter, dismissable, and gone in five
 * seconds unless the user engages.
 */
export default function PopoverNotice({
  title,
  children,
  variant,
  icon,
  actions,
  showCheckbox = false,
  checkboxLabel = "Don't show this confirmation again",
  onClose,
  closeLabel = 'Close',
  closeButtonProps,
  className = '',
  ...rest
}: PopoverNoticeProps) {
  const resolvedIcon = icon ?? (variant ? VARIANT_ICONS[variant] : null);
  const iconColorClass = !icon && variant ? VARIANT_ICON_CLASS[variant] : '';

  const rootClass = [
    styles['popover-notice'],
    resolvedIcon == null ? styles['popover-notice--no-icon'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div {...rest} className={rootClass}>
      <div className={styles['popover-notice__content']}>
        {resolvedIcon != null && (
          <div
            className={[styles['popover-notice__icon'], iconColorClass]
              .filter(Boolean)
              .join(' ')}
            aria-hidden
          >
            <IconSlotContext.Provider value={{ size: '20' }}>
              {resolvedIcon}
            </IconSlotContext.Provider>
          </div>
        )}

        <div className={styles['popover-notice__body']}>
          <div className={styles['popover-notice__title-row']}>
            <span className={styles['popover-notice__title']}>{title}</span>
          </div>

          <div className={styles['popover-notice__description']}>
            {children}
          </div>

          {actions && actions.length > 0 && (
            <div className={styles['popover-notice__actions']}>
              {actions.map((action, i) => (
                <Button
                  key={i}
                  emphasis={action.emphasis ?? 'primary'}
                  size="small"
                  disabled={action.disabled}
                  loading={action.loading}
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}

          {showCheckbox && <Checkbox size="medium">{checkboxLabel}</Checkbox>}
        </div>
      </div>

      {onClose && (
        <IconButton
          {...closeButtonProps}
          className={mergeClassNames(
            styles['popover-notice__close'],
            closeButtonProps?.className,
          )}
          aria-label={closeLabel}
          size="small"
          icon={<Icon size="16" glyph={<CloseIcon />} />}
          onClick={onClose}
        />
      )}
    </div>
  );
}
