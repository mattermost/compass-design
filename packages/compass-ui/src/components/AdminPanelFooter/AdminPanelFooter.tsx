import type { HTMLAttributes, ReactNode } from 'react';
import { mergeClassNames } from '@/utils/props';
import styles from './AdminPanelFooter.module.scss';

export interface AdminPanelFooterProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  /**
   * Start-edge slot for panel actions — `Button`, `IconButton`, pagination
   * status, `PaginationDots`, or other controls. Prefer this slot for primary
   * action groups (primary button leftmost when used).
   */
  leftActions?: ReactNode;
  /**
   * End-edge slot for panel actions — secondary utilities, pagination
   * controls, or other trailing actions. When this is the only slot filled,
   * the group still aligns to the start edge.
   */
  rightActions?: ReactNode;
}

/**
 * Admin Panel Footer is the action rail at the bottom of an [`Admin
 * Panel`](/patterns/admin-panel). Compose it via the panel’s optional `footer` prop (the
 * panel still needs a header or a body). It provides start- and end-edge slots for `Button`,
 * `IconButton`, or pagination controls — layout and divider chrome only; the host owns
 * labels and handlers.
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

  const singleGroup = hasLeft !== hasRight;

  return (
    <div
      {...rest}
      className={mergeClassNames(
        styles['admin-panel-footer'],
        singleGroup && styles['admin-panel-footer--single'],
        className,
      )}
    >
      <div className={styles['admin-panel-footer__content']}>
        {hasLeft ? (
          <div className={styles['admin-panel-footer__left']}>
            {leftActions}
          </div>
        ) : null}
        {hasRight ? (
          <div className={styles['admin-panel-footer__right']}>
            {rightActions}
          </div>
        ) : null}
      </div>
    </div>
  );
}
