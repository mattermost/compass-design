import type { ReactNode } from 'react';
import styles from './Illustration.module.scss';

export interface IllustrationProps {
  /** SVG component from an illustration import (e.g. from `@/assets/illustrations/name.svg?react`). */
  children: ReactNode;
  /** Optional CSS class name. */
  className?: string;
  /** Optional inline width (e.g. "100%", "320px"). */
  width?: string;
  /** Optional inline height. */
  height?: string;
  /** Accessible label; set to empty string for decorative only. */
  'aria-label'?: string;
}

/**
 * Illustration is the wrapper for any of the brand SVG artworks shipped under
 * `@/assets/illustrations/`. It enforces a consistent size box, contains the SVG, and
 * exposes an accessible label so screen readers can describe the artwork (or skip it when
 * it's purely decorative).
 */
export default function Illustration({
  children,
  className = '',
  width,
  height,
  'aria-label': ariaLabel,
}: IllustrationProps) {
  const rootClass = [styles.illustration, className].filter(Boolean).join(' ');
  const hasLabel = ariaLabel !== undefined && ariaLabel !== '';

  return (
    <span
      className={rootClass}
      style={{ width, height }}
      role={hasLabel ? 'img' : undefined}
      aria-label={hasLabel ? ariaLabel : undefined}
      aria-hidden={!hasLabel}
    >
      {children}
    </span>
  );
}
