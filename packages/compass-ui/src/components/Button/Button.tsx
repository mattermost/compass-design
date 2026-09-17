import React, { type ButtonHTMLAttributes, type ReactNode } from 'react';
import type { IconSize } from '@/components/Icon/Icon';
import Spinner from '@/components/Spinner/Spinner';
import type { SpinnerSize } from '@/components/Spinner/Spinner';
import { toKebab } from '@/utils/string';
import styles from './Button.module.scss';

export type ButtonEmphasis =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'quaternary'
  | 'link';

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
  /** Leading icon — pass `<Icon glyph={<YourIcon />} />`. Button injects the correct size. */
  leadingIcon?: ReactNode;
  /** When true, shows a Spinner in the leading slot and disables the button. */
  loading?: boolean;
  /** Size variant. Default: medium. */
  size?: ButtonSize;
  /** Trailing icon — pass `<Icon glyph={<YourIcon />} />`. Button injects the correct size. */
  trailingIcon?: ReactNode;
}

const SIZE_ICON_MAP: Record<ButtonSize, IconSize> = {
  'x-small': '12',
  small: '12',
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
  loading = false,
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

  const supportsIcons = emphasis !== 'link';
  const showLeadingSlot = loading || (supportsIcons && React.isValidElement(leadingIcon));

  return (
    <button className={rootClass} type={type} disabled={disabled || loading} {...rest}>
      {showLeadingSlot ? (
        <span className={styles['button__icon-slot']} aria-hidden>
          {loading
            ? <Spinner size={iconSize as SpinnerSize} inverted={appearance === 'inverted'} />
            : React.cloneElement(leadingIcon as React.ReactElement<{ size?: string }>, { size: iconSize })}
        </span>
      ) : null}
      <span className={styles['button__label']}>{children}</span>
      {supportsIcons && !loading && React.isValidElement(trailingIcon) ? (
        <span className={styles['button__icon-slot']} aria-hidden>
          {React.cloneElement(trailingIcon as React.ReactElement<{ size?: string }>, { size: iconSize })}
        </span>
      ) : null}
    </button>
  );
}
