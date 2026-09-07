import type { ButtonHTMLAttributes, ReactNode } from 'react';
import CheckCircleIcon from '@mattermost/compass-icons/components/check-circle';
import Icon from '@/components/Icon/Icon';
import styles from './CardButton.module.scss';

export interface CardButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'title'> {
  /** Leading icon (typically `<Icon glyph={…} size="24" />`). */
  icon: ReactNode;
  /** Primary label. */
  title: ReactNode;
  /** Secondary line under the title. */
  description?: ReactNode;
  /** Selected / checked appearance with trailing check. Default: false. */
  selected?: boolean;
  className?: string;
}

/**
 * Card Buttons present a mutually exclusive (or single) choice as a compact
 * card: leading icon, title, optional description, and a check when selected.
 * Pair with `CardButtonGroup` for side-by-side radiogroups (visibility,
 * access mode, etc.).
 */
export default function CardButton({
  icon,
  title,
  description,
  selected = false,
  className = '',
  type = 'button',
  role,
  disabled,
  ...rest
}: CardButtonProps) {
  const isRadio = role === 'radio';
  const rootClass = [
    styles['card-button'],
    selected && styles['card-button--selected'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      role={role}
      disabled={disabled}
      className={rootClass}
      aria-checked={isRadio ? selected : undefined}
      aria-pressed={!isRadio ? selected : undefined}
      {...rest}
    >
      <span className={styles['card-button__icon']} aria-hidden>
        {icon}
      </span>
      <span className={styles['card-button__text']}>
        <span className={styles['card-button__title']}>{title}</span>
        {description != null && (
          <span className={styles['card-button__description']}>
            {description}
          </span>
        )}
      </span>
      {selected ? (
        <span className={styles['card-button__check']} aria-hidden>
          <Icon glyph={<CheckCircleIcon />} size="20" />
        </span>
      ) : null}
    </button>
  );
}
