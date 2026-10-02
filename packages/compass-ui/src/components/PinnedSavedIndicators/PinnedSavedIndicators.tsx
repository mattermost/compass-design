import type { ReactNode } from 'react';
import PinOutlineIcon from '@mattermost/compass-icons/components/pin-outline';
import BookmarkOutlineIcon from '@mattermost/compass-icons/components/bookmark-outline';
import Icon from '@/components/Icon/Icon';
import styles from './PinnedSavedIndicators.module.scss';

export interface PinnedSavedIndicatorsProps {
  /** Optional CSS class on the root. */
  className?: string;
  /** Accessible name for the row. Default: "Pinned and Saved". */
  'aria-label'?: string;
  /** Default: "Pinned". */
  pinnedLabel?: ReactNode;
  /** Default: "Saved". */
  savedLabel?: ReactNode;
}

/**
 * Pinned + Saved row shown above a message when applicable (Patterns — Message).
 */
export default function PinnedSavedIndicators({
  className = '',
  'aria-label': ariaLabel = 'Pinned and Saved',
  pinnedLabel = 'Pinned',
  savedLabel = 'Saved',
}: PinnedSavedIndicatorsProps) {
  const rootClass = [styles['pinned-saved-indicators'], className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClass} aria-label={ariaLabel}>
      <div className={styles['pinned-saved-indicators__icons']}>
        <Icon size="12" glyph={<PinOutlineIcon />} aria-hidden />
        <Icon size="12" glyph={<BookmarkOutlineIcon />} aria-hidden />
      </div>
      <div className={styles['pinned-saved-indicators__labels']}>
        <span className={styles['pinned-saved-indicators__label']}>
          {pinnedLabel}
        </span>
        <span className={styles['pinned-saved-indicators__sep']} aria-hidden>
          •
        </span>
        <span className={styles['pinned-saved-indicators__label']}>
          {savedLabel}
        </span>
      </div>
    </div>
  );
}
