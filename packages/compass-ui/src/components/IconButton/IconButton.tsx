import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { toKebab } from '@/utils/string';
import styles from './IconButton.module.scss';

export type IconButtonSize = 'x-small' | 'small' | 'medium' | 'large';

/** Figma "Style": Default (light context) | Inverted (dark context). */
export type IconButtonStyle = 'default' | 'inverted';

export type IconButtonPadding = 'default' | 'compact';

export interface IconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'style'
> {
  /** When true, forces the subtler pressed/active visual (lighter than toggled). */
  active?: boolean;
  /** Optional CSS class name. */
  className?: string;
  /** Numeric count shown inline after the icon. Figma: Count. */
  count?: number;
  /** When true, uses destructive (danger) styling. Figma: Destructive. */
  destructive?: boolean;
  /** Icon to show. Size the glyph via SVG_SIZE_MAP: e.g. `<Icon glyph={<GlobeIcon size={SVG_SIZE_MAP['16']} />} size="16" />`. */
  icon: ReactNode;
  /** Padding variant. Figma: Padding = Default | Compact. */
  padding?: IconButtonPadding;
  /** When true, uses full border radius (pill). Figma: Rounded = On. */
  rounded?: boolean;
  /** Size variant. Figma: Size. Default: Medium. */
  size?: IconButtonSize;
  /** Default | Inverted. Figma: Style (for light vs dark backgrounds). */
  style?: IconButtonStyle;
  /** When true, shows toggled/selected state. Figma: Toggled = On. When omitted, the control is not a toggle. */
  toggled?: boolean;
  /** When true, shows a small unread dot over the icon. Figma: Unread Badge. */
  unreadBadge?: boolean;
}

/** Icon size (px) per IconButton size. Use with Icon: size="12" | "16" | "20" | "24". */
export const ICON_BUTTON_ICON_SIZES: Record<
  IconButtonSize,
  '12' | '16' | '20' | '24'
> = {
  'x-small': '12',
  small: '16',
  medium: '20',
  large: '24',
};

/**
 * Icon Buttons are compact, label-free actions for tight surfaces — channel headers, message
 * hover actions, modal dismissals, toolbar slots. They lean on the icon to communicate
 * intent, so every Icon Button must pair with a tooltip or `aria-label` that makes the
 * action explicit.
 */
export default function IconButton({
  active = false,
  className = '',
  count,
  destructive = false,
  icon,
  padding = 'default',
  rounded = false,
  size = 'medium',
  style = 'default',
  toggled,
  unreadBadge = false,
  disabled,
  type = 'button',
  'aria-label': ariaLabel,
  ...rest
}: IconButtonProps) {
  const sizeClass = styles[`icon-button--size-${toKebab(size)}`];
  const paddingClass =
    padding === 'compact' ? styles['icon-button--padding-compact'] : '';
  const styleClass =
    style === 'inverted' ? styles['icon-button--style-inverted'] : '';
  const destructiveClass = destructive
    ? styles['icon-button--destructive']
    : '';
  const roundedClass = rounded ? styles['icon-button--rounded'] : '';
  const toggledClass = toggled ? styles['icon-button--toggled'] : '';
  const activeClass = active ? styles['icon-button--active'] : '';
  const hasCount = count !== undefined;
  const hasCountClass = hasCount ? styles['icon-button--has-count'] : '';

  const rootClass = [
    styles['icon-button'],
    sizeClass,
    paddingClass,
    styleClass,
    destructiveClass,
    roundedClass,
    toggledClass,
    activeClass,
    hasCountClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={rootClass}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={toggled === undefined ? undefined : toggled}
      data-active={active ? 'true' : undefined}
      {...rest}
    >
      <span className={styles['icon-button__icon-slot']} aria-hidden>
        {icon}
        {unreadBadge && (
          <span className={styles['icon-button__unread-badge']} />
        )}
      </span>
      {hasCount && (
        <span className={styles['icon-button__count']}>{count}</span>
      )}
    </button>
  );
}
