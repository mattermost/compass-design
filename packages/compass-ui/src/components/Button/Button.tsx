import type { ButtonHTMLAttributes, ReactNode } from 'react';
import Icon from '@/components/Icon/Icon';
import type { IconSize } from '@/components/Icon/Icon';
import { toKebab } from '@/utils/string';
import styles from './Button.module.scss';

export type ButtonEmphasis =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'quaternary';

export type ButtonSize = 'x-small' | 'small' | 'medium' | 'large';

export type ButtonAppearance = 'default' | 'inverted';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** default | inverted (for use on dark backgrounds). Maps to Figma "Style". */
  appearance?: ButtonAppearance;
  /** Optional CSS class name. */
  className?: string;
  /** Button label. */
  children: React.ReactNode;
  /** When true, uses destructive (danger) styling. */
  destructive?: boolean;
  /** Visual emphasis. Default: primary. */
  emphasis?: ButtonEmphasis;
  /** Leading icon (e.g. <Icon glyph={<SomeIcon />} size="16" />). Icon size should match button size. */
  leadingIcon?: ReactNode;
  /** Size variant. Default: medium. */
  size?: ButtonSize;
  /** Trailing icon. */
  trailingIcon?: ReactNode;
}

const SIZE_ICON_MAP: Record<ButtonSize, IconSize> = {
  'x-small': '12',
  small: '16',
  medium: '16',
  large: '20',
};

/**
 * Buttons let people take actions or make decisions with a single tap or click — saving a
 * form, sending a message, confirming a dialog. Compass ships several button variants, each
 * with the same anatomy and rhythm so they feel like members of the same family.
 */
export default function Button({
  appearance = 'default',
  className = '',
  destructive = false,
  emphasis = 'primary',
  children,
  leadingIcon,
  size = 'medium',
  trailingIcon,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  const iconSize = SIZE_ICON_MAP[size];
  const emphasisClass = styles[`button--emphasis-${toKebab(emphasis)}`];
  const sizeClass = styles[`button--size-${toKebab(size)}`];
  const appearanceClass =
    appearance === 'inverted' ? styles['button--appearance-inverted'] : '';
  const destructiveClass = destructive ? styles['button--destructive'] : '';

  const rootClass = [
    styles.button,
    emphasisClass,
    sizeClass,
    appearanceClass,
    destructiveClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={rootClass} type={type} disabled={disabled} {...rest}>
      {leadingIcon != null ? (
        <span className={styles['button__icon-slot']} aria-hidden>
          {typeof leadingIcon === 'boolean' ? (
            <Icon size={iconSize} />
          ) : (
            leadingIcon
          )}
        </span>
      ) : null}
      <span className={styles['button__label']}>{children}</span>
      {trailingIcon != null ? (
        <span className={styles['button__icon-slot']} aria-hidden>
          {typeof trailingIcon === 'boolean' ? (
            <Icon size={iconSize} />
          ) : (
            trailingIcon
          )}
        </span>
      ) : null}
    </button>
  );
}
