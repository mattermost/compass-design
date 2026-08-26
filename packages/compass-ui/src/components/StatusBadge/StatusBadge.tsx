import type { ElementType } from 'react';
import CheckCircleIcon from '@mattermost/compass-icons/components/check-circle';
import CircleOutlineIcon from '@mattermost/compass-icons/components/circle-outline';
import ClockIcon from '@mattermost/compass-icons/components/clock';
import MinusCircleIcon from '@mattermost/compass-icons/components/minus-circle';
import { toKebab } from '@/utils/string';
import styles from './StatusBadge.module.scss';

/** Figma Status Badge size. */
export type StatusBadgeSize =
  | 'xx-small'
  | 'x-small'
  | 'small'
  | 'medium'
  | 'large';

/** Figma Status Badge status variant. */
export type StatusBadgeStatus =
  | 'online'
  | 'away'
  | 'do-not-disturb'
  | 'offline';

export interface StatusBadgeProps {
  /** Optional CSS class name. */
  className?: string;
  /** Size variant. Figma: Size. Default: X-Small. */
  size?: StatusBadgeSize;
  /** Status variant. Figma: Status. Default: Online. */
  status?: StatusBadgeStatus;
}

/** Compass icon size in px per StatusBadge size — Figma. */
const BADGE_ICON_SIZE_PX: Record<StatusBadgeSize, number> = {
  'xx-small': 10,
  'x-small': 12,
  small: 16,
  medium: 20,
  large: 32,
};

/** Compass icon component per status variant. */
const GLYPH_COMPONENT: Record<StatusBadgeStatus, ElementType> = {
  online: CheckCircleIcon,
  away: ClockIcon,
  'do-not-disturb': MinusCircleIcon,
  offline: CircleOutlineIcon,
};

/**
 * Status badge (Online, Away, Do Not Disturb, Offline).
 * Matches Figma Status Badge v2.0.1. Uses Icon + @mattermost/compass-icons.
 *
 * @see Figma Status Badge (Node ID: 702:1875)
 */
export default function StatusBadge({
  className = '',
  size = 'x-small',
  status = 'online',
}: StatusBadgeProps) {
  const sizeClass = styles[`status-badge--size-${toKebab(size)}`];
  const statusClass = styles[`status-badge--status-${toKebab(status)}`];
  const rootClass = [styles['status-badge'], sizeClass, statusClass, className]
    .filter(Boolean)
    .join(' ');

  const iconSizePx = BADGE_ICON_SIZE_PX[size];
  const GlyphIcon = GLYPH_COMPONENT[status];

  return (
    <span className={rootClass} role="img" aria-label={status}>
      <span className={styles['status-badge__glyph']}>
        <GlyphIcon size={iconSizePx} />
      </span>
    </span>
  );
}
