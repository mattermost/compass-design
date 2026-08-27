import { toKebab } from '@/utils/string';
import styles from './UnreadBadge.module.scss';

export type UnreadBadgeSize = '6' | '8';

export type UnreadBadgeContext = 'team-icon' | 'icon-button';

export interface UnreadBadgeProps {
  /** Dot size in px. Default: 8. */
  size?: UnreadBadgeSize;
  /** Display context affects dot colour. Default: Team Icon (same fill as MentionBadge). */
  context?: UnreadBadgeContext;
  /** Optional CSS class name. */
  className?: string;
  /** Accessible label. Default: "unread". */
  'aria-label'?: string;
}

/**
 * The Unread Badge is a small dot that signals "something's new here" without specifying how
 * much. Reach for it when the count would be noisy, distracting, or simply isn't useful — a
 * Team has unread channels, an icon button has a new state, a tab has activity behind it.
 */
export default function UnreadBadge({
  'aria-label': ariaLabel = 'unread',
  className = '',
  context = 'team-icon',
  size = '8',
}: UnreadBadgeProps) {
  const sizeClass = styles[`unread-badge--size-${size}`];
  const contextClass = styles[`unread-badge--context-${toKebab(context)}`];
  const rootClass = [styles['unread-badge'], sizeClass, contextClass, className]
    .filter(Boolean)
    .join(' ');

  return <span className={rootClass} role="status" aria-label={ariaLabel} />;
}
