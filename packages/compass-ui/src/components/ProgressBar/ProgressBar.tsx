import styles from './ProgressBar.module.scss';

export type ProgressBarSize = 'small' | 'large';

export interface ProgressBarProps {
  /** Progress value 0–100. Default: 0. */
  value?: number;
  /** Size variant. Default: Large. */
  size?: ProgressBarSize;
  /**
   * When true, fill color shifts from green→yellow→red based on percentage.
   * When false, uses the default brand blue. Default: false.
   */
  semanticColors?: boolean;
  /** Accessible label for the progress bar. */
  'aria-label'?: string;
  /** Optional CSS class name. */
  className?: string;
}

function getSemanticColorClass(value: number): string {
  if (value >= 90) return styles['progress-bar__fill--danger'];
  if (value >= 70) return styles['progress-bar__fill--warning'];
  return styles['progress-bar__fill--success'];
}

/**
 * Progress Bar shows determinate progress through a wait state — an upload finishing, a
 * quota filling, an import running. Use it when the duration or total is known; reach for
 * [Spinner](/components/spinner) when it isn't.
 */
export default function ProgressBar({
  value = 0,
  size = 'large',
  semanticColors = false,
  'aria-label': ariaLabel = 'Progress',
  className = '',
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const sizeClass =
    size === 'small'
      ? styles['progress-bar--size-small']
      : styles['progress-bar--size-large'];

  const fillColorClass = semanticColors
    ? getSemanticColorClass(clampedValue)
    : styles['progress-bar__fill--default'];

  return (
    <div
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
      className={[styles['progress-bar'], sizeClass, className]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className={[styles['progress-bar__fill'], fillColorClass]
          .filter(Boolean)
          .join(' ')}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}
