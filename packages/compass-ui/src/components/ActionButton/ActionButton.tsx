import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { IconSlotContext } from '@/components/Icon/Icon';
import styles from './ActionButton.module.scss';

export interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Pass `<Icon glyph={<SomeIcon />} />` — ActionButton provides the correct size (20) via context. */
  icon: ReactNode;
  /** Visible label. Accepts translated nodes (e.g. `<FormattedMessage/>`). */
  label: ReactNode;
  /** When set, this is a toggle; maps to `aria-pressed`. */
  active?: boolean;
  destructive?: boolean;
}

/**
 * Action Buttons surface a small set of high-frequency actions in a fixed context — a
 * profile popover, a channel info panel, a card. They sit close to the content they act on
 * and read as a row of equal-weight choices.
 */
const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  function ActionButton(
    {
      icon,
      label,
      active,
      destructive = false,
      className,
      type = 'button',
      ...htmlProps
    },
    ref,
  ) {
    const rootClass = [
      styles['action-button'],
      active ? styles['action-button--active'] : '',
      destructive ? styles['action-button--destructive'] : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={rootClass}
        type={type}
        aria-pressed={active === undefined ? undefined : active}
        {...htmlProps}
      >
        <span className={styles['action-button__icon']} aria-hidden>
          <IconSlotContext.Provider value={{ size: '20' }}>
            {icon}
          </IconSlotContext.Provider>
        </span>
        <span className={styles['action-button__label']}>{label}</span>
      </button>
    );
  },
);

ActionButton.displayName = 'ActionButton';

export default ActionButton;
