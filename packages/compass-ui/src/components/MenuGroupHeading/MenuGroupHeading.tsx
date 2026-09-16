import type { HTMLAttributes } from 'react';
import styles from './MenuGroupHeading.module.scss';

export interface MenuGroupHeadingProps extends HTMLAttributes<HTMLDivElement> {
  /** The section label text. Rendered in all-caps. */
  label: string;
}

/**
 * Menu Group Heading is an optional all-caps label that titles a grouped
 * section of Menu Items inside a dropdown or context menu.
 */
export default function MenuGroupHeading({
  label,
  className = '',
  ...rest
}: MenuGroupHeadingProps) {
  return (
    <div
      className={[styles['menu-group-heading'], className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      <span className={styles['menu-group-heading__label']}>{label}</span>
    </div>
  );
}
