import type { HTMLAttributes } from 'react';
import styles from './ProgressBar.module.scss';

export type ProgressBarSize = 'small' | 'large';

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Progress value 0–100. Default: 0. */
  value?: number;
  /** Size variant. Default: Large. */
  size?: ProgressBarSize;
  /**
   * When true, fill color shifts from green→yellow→red based on percentage.
   * When false, uses the default brand blue. Default: false.
   */
  semanticColors?: boolean;
  /**
   * When true, shows an animated bar for work with an unknown total and omits
   * `aria-valuenow`. `value` and `semanticColors` are ignored. Default: false.
   */
  indeterminate?: boolean;
  /**
   * When true, the bar is purely visual: it renders `aria-hidden="true"` and omits
   * `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and
   * `aria-label`. Use it for bars that don't report progress toward a goal (e.g.
   * rows in a bar chart) and put the accessible text on the surrounding element.
   * Default: false.
   */
  decorative?: boolean;
  /** Accessible label for the progress bar. Ignored when `decorative`. Default: "Progress". */
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
  indeterminate = false,
  decorative = false,
  'aria-label': ariaLabel = 'Progress',
  className = '',
  ...rest
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const sizeClass =
    size === 'small'
      ? styles['progress-bar--size-small']
      : styles['progress-bar--size-large'];

  const fillColorClass =
    semanticColors && !indeterminate
      ? getSemanticColorClass(clampedValue)
      : styles['progress-bar__fill--default'];

  return (
    <div
      {...rest}
      {...(decorative
        ? { 'aria-hidden': true }
        : {
            role: 'progressbar',
            'aria-valuenow': indeterminate ? undefined : clampedValue,
            'aria-valuemin': 0,
            'aria-valuemax': 100,
            'aria-label': ariaLabel,
          })}
      className={[
        styles['progress-bar'],
        sizeClass,
        indeterminate ? styles['progress-bar--indeterminate'] : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className={[styles['progress-bar__fill'], fillColorClass]
          .filter(Boolean)
          .join(' ')}
        style={indeterminate ? undefined : { width: `${clampedValue}%` }}
      />
    </div>
  );
}
