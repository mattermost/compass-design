import type { HTMLAttributes, ReactNode } from 'react';
import { mergeClassNames } from '@/utils/props';
import styles from './AdminPanelFooter.module.scss';

export interface AdminPanelFooterProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  /**
   * Start-edge slot for panel actions — `Button`, `IconButton`, pagination
   * status, `PaginationDots`, or other controls.
   */
  leftActions?: ReactNode;
  /**
   * End-edge slot for panel actions — `Button`, `IconButton`, pagination
   * controls, or other actions.
   */
  rightActions?: ReactNode;
}

/**
 * Admin Panel Footer is the action rail at the bottom of an
 * [`Admin Panel`](/patterns/admin-panel). Hosts compose start- and end-edge
 * slots with `Button`, `IconButton`, or pagination controls — the footer owns
 * layout and divider chrome only.
 */
export default function AdminPanelFooter({
  leftActions,
  rightActions,
  className,
  ...rest
}: AdminPanelFooterProps) {
  const hasLeft = leftActions != null;
  const hasRight = rightActions != null;

  if (!hasLeft && !hasRight) {
    return null;
  }

  return (
    <div
      {...rest}
      className={mergeClassNames(styles['admin-panel-footer'], className)}
    >
      <div className={styles['admin-panel-footer__content']}>
        {hasLeft ? (
          <div className={styles['admin-panel-footer__left']}>{leftActions}</div>
        ) : (
          <div className={styles['admin-panel-footer__spacer']} aria-hidden />
        )}
        {hasRight ? (
          <div className={styles['admin-panel-footer__right']}>
            {rightActions}
          </div>
        ) : null}
      </div>
    </div>
  );
}
