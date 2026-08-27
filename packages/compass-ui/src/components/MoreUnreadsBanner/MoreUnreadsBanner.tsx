import Icon from '@/components/Icon/Icon';
import ArrowUpIcon from '@mattermost/compass-icons/components/arrow-up';
import ArrowDownIcon from '@mattermost/compass-icons/components/arrow-down';
import styles from './MoreUnreadsBanner.module.scss';

export type MoreUnreadsBannerDirection = 'up' | 'down';
export type MoreUnreadsBannerSize = 'small' | 'medium' | 'large';

export interface MoreUnreadsBannerProps {
  /** Optional CSS class name. */
  className?: string;
  /** Arrow direction. Default: Up. */
  direction?: MoreUnreadsBannerDirection;
  /** Size variant. Default: Medium. */
  size?: MoreUnreadsBannerSize;
  /** Callback when the banner is clicked. */
  onClick?: () => void;
}

/**
 * The More Unreads Banner is the small pill that floats inside the channel sidebar to tell
 * the user there are unread channels above or below the current scroll position. One arrow,
 * one label — clicking it scrolls to the next unread.
 */
export default function MoreUnreadsBanner({
  className = '',
  direction = 'up',
  size = 'medium',
  onClick,
}: MoreUnreadsBannerProps) {
  const sizeClass = styles[`more-unreads-banner--size-${size.toLowerCase()}`];

  const rootClass = [styles['more-unreads-banner'], sizeClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={rootClass} type="button" onClick={onClick}>
      <span className={styles['more-unreads-banner__icon']} aria-hidden>
        {direction === 'up' ? (
          <Icon size="12" glyph={<ArrowUpIcon />} />
        ) : (
          <Icon size="12" glyph={<ArrowDownIcon />} />
        )}
      </span>
      <span className={styles['more-unreads-banner__label']}>More unreads</span>
    </button>
  );
}
