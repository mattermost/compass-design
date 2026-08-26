import { toKebab } from '@/utils/string';
import styles from './MentionBadge.module.scss';

/** Figma Mention Badge location context — controls color scheme. */
export type MentionBadgeLocation =
  | 'sidebar'
  | 'menu-item'
  | 'icon-button'
  | 'channel';

/** Figma Mention Badge size. */
export type MentionBadgeSize = 'small' | 'medium' | 'large';

export interface MentionBadgeProps {
  /** Optional CSS class name. */
  className?: string;
  /** Mention count. Displays as-is up to 99; shows "99+" above that. */
  count: number;
  /** Color context. Figma: Location. Default: Sidebar. */
  location?: MentionBadgeLocation;
  /** Size variant. Figma: Size. Default: Small. */
  size?: MentionBadgeSize;
}

/**
 * Mention Badges show a numerical count of pending mentions. They appear next to channel
 * names in the sidebar, on app-bar icons, inline in menu items, and on center-channel lists
 * such as thread rows — small, high-contrast pills that pull the eye without dominating the
 * row.
 */
export default function MentionBadge({
  className = '',
  count,
  location = 'sidebar',
  size = 'small',
}: MentionBadgeProps) {
  const displayText = count > 99 ? '99+' : String(count);
  const digitCount = displayText.length; // 1, 2, or 3 (for "99+")

  const rootClass = [
    styles['mention-badge'],
    styles[`mention-badge--size-${toKebab(size)}`],
    styles[`mention-badge--digits-${digitCount}`],
    location !== 'sidebar'
      ? styles[`mention-badge--location-${toKebab(location)}`]
      : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={rootClass}
      aria-label={`${count} mention${count === 1 ? '' : 's'}`}
    >
      {displayText}
    </span>
  );
}
