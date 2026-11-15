import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { UnreadBadge } from '@mattermost/compass-ui/components/unread-badge';
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
  /** Styles the mention badge as urgent (e.g. an urgent-priority mention). */
  urgent?: boolean;
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
  urgent = false,
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
    showMentions || showUnread ? styles['product-rail-item--unread'] : '',
    urgent && showMentions ? styles['product-rail-item--urgent'] : '',
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
            {mentionBadge > 99 ? '99+' : mentionBadge}
          </span>
        )}
        {showUnread && (
          // Decorative: the item's accessible name already carries the unread status.
          <span className={styles['product-rail-item__unread-dot']} aria-hidden>
            <UnreadBadge />
          </span>
        )}
      </span>
      <span className={styles['product-rail-item__label']}>{label}</span>
      {/* A rich label gives the button its name from content, so the status is spoken from here. */}
      {name == null && suffix && (
        <span
          className={styles['product-rail-item__sr-only']}
        >{`, ${suffix}`}</span>
      )}
    </button>
  );
}
