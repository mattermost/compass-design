import type { ButtonHTMLAttributes } from 'react';
import { toKebab } from '@/utils/string';
import Emoji from '@/components/Emoji/Emoji';
import type { EmojiSize } from '@/components/Emoji/Emoji';
import styles from './EmojiButton.module.scss';

export type EmojiButtonSize = 'x-small' | 'small' | 'medium' | 'large';

/** Emoji size (px string) per EmojiButton size. Use when you need to override the emoji independently. */
export const EMOJI_BUTTON_EMOJI_SIZES: Record<EmojiButtonSize, EmojiSize> = {
  'x-small': '12',
  small: '20',
  medium: '24',
  large: '28',
};

export type EmojiButtonPadding = 'default' | 'compact';

export interface EmojiButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Optional CSS class name. */
  className?: string;
  /** Emoji character(s) to display (e.g. "👍", "🎉"). */
  emoji: string;
  /** Size variant. Default: small. */
  size?: EmojiButtonSize;
  /** Reduces padding within each size tier, matching IconButton compact. Default: default. */
  padding?: EmojiButtonPadding;
  /** When true, forces the subtler pressed/active visual. */
  active?: boolean;
  /** When true, shows toggled/selected state. */
  toggled?: boolean;
  /** When true, uses full border radius (pill). */
  rounded?: boolean;
}

/**
 * EmojiButton is a compact, label-free button that renders an emoji as its visual — the
 * emoji-picker counterpart to IconButton. Use it for emoji selection grids, skin-tone
 * selectors, and any surface where an emoji character is the primary affordance.
 *
 * Every EmojiButton must pair with an `aria-label` that names the action or the emoji it
 * represents.
 */
export default function EmojiButton({
  className = '',
  emoji,
  size = 'small',
  padding = 'default',
  active = false,
  toggled,
  rounded = false,
  type = 'button',
  ...rest
}: EmojiButtonProps) {
  const sizeClass = styles[`emoji-button--size-${toKebab(size)}`];
  const paddingClass = padding === 'compact' ? styles['emoji-button--padding-compact'] : '';
  const activeClass = active ? styles['emoji-button--active'] : '';
  const toggledClass = toggled ? styles['emoji-button--toggled'] : '';
  const roundedClass = rounded ? styles['emoji-button--rounded'] : '';

  const rootClass = [
    styles['emoji-button'],
    sizeClass,
    paddingClass,
    activeClass,
    toggledClass,
    roundedClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={rootClass} {...rest}>
      <span className={styles['emoji-button__emoji']}>
        <Emoji emoji={emoji} size={EMOJI_BUTTON_EMOJI_SIZES[size]} />
      </span>
    </button>
  );
}
