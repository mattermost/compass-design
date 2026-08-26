import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './ActionButton.module.scss';

export interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
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
  active = false,
  destructive = false,
  className,
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
    <button className={rootClass} aria-pressed={active} {...htmlProps}>
      <span className={styles['action-button__icon']}>{icon}</span>
      <span className={styles['action-button__label']}>{label}</span>
    </button>
  );
}
