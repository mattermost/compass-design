import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { IconSlotContext } from '@/components/Icon/Icon';
import styles from './ActionButton.module.scss';

export interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Pass `<Icon glyph={<SomeIcon />} />` — ActionButton provides the correct size (20) via context. */
  icon: ReactNode;
  label: string;
  /** When set, this is a toggle; maps to `aria-pressed`. */
  active?: boolean;
  destructive?: boolean;
}

/**
 * Action Buttons surface a small set of high-frequency actions in a fixed context — a
 * profile popover, a channel info panel, a card. They sit close to the content they act on
 * and read as a row of equal-weight choices.
 */
export default function ActionButton({
  icon,
  label,
  active,
  destructive = false,
  className,
  type = 'button',
  ...htmlProps
}: ActionButtonProps) {
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
}
