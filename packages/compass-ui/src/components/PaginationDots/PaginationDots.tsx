import styles from './PaginationDots.module.scss';

export type PaginationDotsOrientation = 'horizontal' | 'vertical';
export type PaginationDotsStyle = 'default' | 'inverted' | 'on-primary';

export interface PaginationDotsProps {
  /** Total number of pages/steps. */
  pages: number;
  /** Currently active page (1-indexed). */
  activePage: number;
  /** Layout orientation. Default: Horizontal. */
  orientation?: PaginationDotsOrientation;
  /** Color style. Default: Default. */
  dotStyle?: PaginationDotsStyle;
  /** Called when a dot is clicked. Receives the 1-indexed page number. */
  onPageChange?: (page: number) => void;
  /** Optional CSS class name. */
  className?: string;
}

/**
 * Pagination Dots indicate progress through a fixed sequence of steps — most often a
 * multi-step onboarding flow or a swipeable carousel. One dot per step, the active one
 * filled, the rest quiet.
 */
export default function PaginationDots({
  pages,
  activePage,
  orientation = 'horizontal',
  dotStyle = 'default',
  onPageChange,
  className = '',
}: PaginationDotsProps) {
  const isVertical = orientation === 'vertical';
  const isInverted = dotStyle === 'inverted';
  const isOnPrimary = dotStyle === 'on-primary';

  const orientationClass = isVertical
    ? styles['pagination-dots--vertical']
    : styles['pagination-dots--horizontal'];
  const styleClass = isInverted
    ? styles['pagination-dots--inverted']
    : isOnPrimary
      ? styles['pagination-dots--on-primary']
      : '';

  return (
    <div
      className={[
        styles['pagination-dots'],
        orientationClass,
        styleClass,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="tablist"
      aria-label="Pages"
    >
      {Array.from({ length: pages }, (_, i) => {
        const page = i + 1;
        const isActive = page === activePage;
        const dotClass = [
          styles['pagination-dots__dot'],
          isActive ? styles['pagination-dots__dot--active'] : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <button
            key={page}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`Page ${page}`}
            className={styles['pagination-dots__item']}
            onClick={() => onPageChange?.(page)}
          >
            <span className={dotClass} />
          </button>
        );
      })}
    </div>
  );
}
