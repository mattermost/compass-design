import type { ReactNode } from 'react';
import styles from './Illustration.module.scss';

export interface IllustrationProps {
  /**
   * SVG component from `@mattermost/compass-ui/illustrations/<name>`
   * (e.g. `<SearchIllustration />`). Takes precedence over `children`.
   */
  glyph?: ReactNode;
  /**
   * SVG component from `@mattermost/compass-ui/illustrations/<name>`.
   * Prefer `glyph` when both are available; either may be used.
   */
  children?: ReactNode;
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
 * Illustration is the wrapper for brand SVG artwork shipped from
 * `@mattermost/compass-ui/illustrations/<name>`. It enforces a consistent size box, contains
 * the SVG, and exposes an accessible label so screen readers can describe the artwork (or
 * skip it when it's purely decorative).
 */
export default function Illustration({
  glyph,
  children,
  className = '',
  width,
  height,
  'aria-label': ariaLabel,
}: IllustrationProps) {
  const rootClass = [styles.illustration, className].filter(Boolean).join(' ');
  const hasLabel = ariaLabel !== undefined && ariaLabel !== '';
  const content = glyph ?? children;

  return (
    <span
      className={rootClass}
      style={{ width, height }}
      role={hasLabel ? 'img' : undefined}
      aria-label={hasLabel ? ariaLabel : undefined}
      aria-hidden={!hasLabel}
    >
      {content}
    </span>
  );
}
