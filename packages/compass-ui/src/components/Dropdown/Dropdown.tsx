import type { ButtonHTMLAttributes, ReactNode } from 'react';
import Button from '@/components/Button/Button';
import { toKebab } from '@/utils/string';
import Icon from '@/components/Icon/Icon';
import ChevronDownIcon from '@mattermost/compass-icons/components/chevron-down';
import styles from './Dropdown.module.scss';

export type DropdownSize = 'x-small' | 'small' | 'medium' | 'large' | 'x-large';
export type DropdownAppearance = 'default' | 'inverted';
export type DropdownPadding = 'tight' | 'compact';

export interface DropdownProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'size'
> {
  /** Optional CSS class name. */
  className?: string;
  /** Label text shown in the trigger. */
  children: ReactNode;
  /** Optional leading icon. */
  leadingIcon?: ReactNode;
  /** Trigger inset. Tight is default; Compact adds more padding (Figma). Default: Tight. */
  padding?: DropdownPadding;
  /** Size variant. Default: Medium. */
  size?: DropdownSize;
  /** Light or dark background context. Default: Default. */
  appearance?: DropdownAppearance;
  /** When true, the dropdown is in an open/active state. */
  isOpen?: boolean;
}

/**
 * A Dropdown is a heading-weight trigger that opens a Popover Menu. It reads as a title —
 * semibold, with a chevron — and signals "this label is also a control."
 */
export default function Dropdown({
  className = '',
  children,
  leadingIcon,
  padding = 'tight',
  size = 'medium',
  appearance = 'default',
  isOpen = false,
  disabled,
  type = 'button',
  ...rest
}: DropdownProps) {
  const sizeClass = styles[`dropdown--size-${toKebab(size)}`];
  const paddingClass =
    padding === 'compact' ? styles['dropdown--padding-compact'] : '';
  const appearanceClass =
    appearance === 'inverted' ? styles['dropdown--appearance-inverted'] : '';
  const openClass = isOpen ? styles['dropdown--open'] : '';

  const rootClass = [
    styles.dropdown,
    sizeClass,
    paddingClass,
    appearanceClass,
    openClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Button
      className={rootClass}
      emphasis="quaternary"
      size="medium"
      type={type}
      disabled={disabled}
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      {...rest}
    >
      <span className={styles.dropdown__trigger}>
        <span className={styles.dropdown__content}>
          {leadingIcon != null && (
            <span className={styles.dropdown__leadingIcon} aria-hidden>
              {leadingIcon}
            </span>
          )}
          <span className={styles.dropdown__label}>{children}</span>
        </span>
        <span className={styles.dropdown__chevron} aria-hidden>
          <Icon size="12" glyph={<ChevronDownIcon />} />
        </span>
      </span>
    </Button>
  );
}
