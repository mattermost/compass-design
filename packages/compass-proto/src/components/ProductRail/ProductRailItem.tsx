import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './ProductRail.module.scss';

export interface ProductRailItemProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  icon: ReactNode;
  /** Visible label under the icon. */
  label: ReactNode;
  /** Plain-text name for assistive tech; defaults to `label` when it is a string. */
  ariaLabel?: string;
  selected?: boolean;
  /** Mention count badge. */
  mentionBadge?: number;
  /** Unread dot badge. Hidden when `mentionBadge` is set. */
  unreadBadge?: boolean;
  /** Suffix appended to the accessible name for a mention count, e.g. "3 mentions". */
  mentionsLabel?: (count: number) => string;
  /** Suffix appended to the accessible name when unread. */
  unreadLabel?: string;
}

const defaultMentionsLabel = (n: number) =>
  `${n} ${n === 1 ? 'mention' : 'mentions'}`;

/** A single tile of the `ProductRail`. */
export default function ProductRailItem({
  icon,
  label,
  ariaLabel,
  selected = false,
  mentionBadge,
  unreadBadge = false,
  mentionsLabel = defaultMentionsLabel,
  unreadLabel = 'unread',
  className = '',
  type = 'button',
  ...rest
}: ProductRailItemProps) {
  const showMentions = mentionBadge != null && mentionBadge > 0;
  const showUnread = unreadBadge && !showMentions;
  const name = ariaLabel ?? (typeof label === 'string' ? label : undefined);
  const suffix = showMentions
    ? mentionsLabel(mentionBadge)
    : showUnread
      ? unreadLabel
      : '';
  const computedAriaLabel =
    name != null ? (suffix ? `${name}, ${suffix}` : name) : undefined;

  const rootClass = [
    styles['product-rail-item'],
    selected ? styles['product-rail-item--selected'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      aria-label={computedAriaLabel}
      aria-current={selected ? 'page' : undefined}
      {...rest}
      type={type}
      className={rootClass}
    >
      <span className={styles['product-rail-item__icon']}>
        {icon}
        {showMentions && (
          <span
            className={styles['product-rail-item__mention-badge']}
            aria-hidden
          >
            {mentionBadge}
          </span>
        )}
        {showUnread && (
          <span
            className={styles['product-rail-item__unread-badge']}
            aria-hidden
          />
        )}
      </span>
      <span className={styles['product-rail-item__label']}>{label}</span>
    </button>
  );
}
