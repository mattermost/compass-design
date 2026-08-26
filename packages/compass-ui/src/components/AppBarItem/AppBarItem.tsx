import type { ReactNode } from 'react';
import styles from './AppBarItem.module.scss';

export type AppBarItemState = 'default' | 'selected';

export interface AppBarItemProps {
  /** Icon element (image or SVG) representing the app. */
  icon: ReactNode;
  /** Accessible label for the app item. */
  label: string;
  /** Interaction state. Default: Default. */
  state?: AppBarItemState;
  /** When true, shows a mention count badge. */
  mentionBadge?: number;
  /** When true, shows an unread dot badge. */
  unreadBadge?: boolean;
  /** Click handler. */
  onClick?: () => void;
  /** Optional CSS class name. */
  className?: string;
}

/**
 * The App Bar Item is a circular icon that anchors a third-party app or plugin in the
 * right-side App Bar. Each item is a single tap-target with optional selection styling and
 * notification badges.
 */
export default function AppBarItem({
  icon,
  label,
  state = 'default',
  mentionBadge,
  unreadBadge = false,
  onClick,
  className = '',
}: AppBarItemProps) {
  const isSelected = state === 'selected';

  const rootClass = [
    styles['app-bar-item'],
    isSelected ? styles['app-bar-item--selected'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={rootClass}
      aria-label={label}
      aria-pressed={isSelected}
      onClick={onClick}
    >
      <span className={styles['app-bar-item__icon']}>{icon}</span>

      {mentionBadge != null && mentionBadge > 0 && (
        <span
          className={styles['app-bar-item__mention-badge']}
          aria-label={`${mentionBadge} mentions`}
        >
          {mentionBadge}
        </span>
      )}

      {unreadBadge && mentionBadge == null && (
        <span
          className={styles['app-bar-item__unread-badge']}
          aria-label="unread"
        />
      )}
    </button>
  );
}
