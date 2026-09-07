import type { HTMLAttributes, ReactNode } from 'react';
import styles from './CardButtonGroup.module.scss';

export interface CardButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

/**
 * Lays out Card Buttons in a horizontal row (Figma Card Button Group).
 * Defaults to `role="radiogroup"` — set child cards to `role="radio"`.
 */
export default function CardButtonGroup({
  children,
  className = '',
  role = 'radiogroup',
  ...rest
}: CardButtonGroupProps) {
  return (
    <div
      role={role}
      className={[styles['card-button-group'], className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </div>
  );
}
