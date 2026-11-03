import type { HTMLAttributes, ReactNode } from 'react';
import Button from '@/components/Button/Button';
import type { ButtonProps } from '@/components/Button/Button';
import Illustration from '@/components/Illustration/Illustration';
import type { IllustrationProps } from '@/components/Illustration/Illustration';
import Scrollbar from '@/components/Scrollbar/Scrollbar';
import styles from './EmptyState.module.scss';

export interface EmptyStateProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title' | 'children' | 'onScroll'
> {
  /** Illustration props (children = the SVG component). Rendered above the title. */
  illustration?: IllustrationProps;
  /** Main heading. Accepts translated nodes (e.g. `<FormattedMessage/>`). */
  title: ReactNode;
  /** Body description. Supports ReactNode for inline formatting. */
  description?: ReactNode;
  /** Button props (children = label). Rendered below the description. */
  action?: ButtonProps;
  /**
   * Custom node for the action area, for controls `action` can't describe: a menu trigger,
   * a split button, or a permission-gated control. Rendered below the description, after
   * `action` when both are set. Prefer `action` for a single plain button.
   */
  actionSlot?: ReactNode;
  /** Optional CSS class name. */
  className?: string;
}

/**
 * Empty State fills a view that has no content yet — no saved messages, no mentions, no
 * search results, no files. It pairs an illustration with a short explanation and, when
 * there's something the user can do next, a single action.
 */
export default function EmptyState({
  illustration,
  title,
  description,
  action,
  actionSlot,
  className = '',
  ...rest
}: EmptyStateProps) {
  return (
    <Scrollbar
      {...rest}
      className={[styles['empty-state'], className].filter(Boolean).join(' ')}
    >
      <div className={styles['empty-state__container']}>
        {illustration != null && (
          <div className={styles['empty-state__illustration']}>
            <Illustration {...illustration} />
          </div>
        )}
        <div className={styles['empty-state__titles']}>
          <h2 className={styles['empty-state__title']}>{title}</h2>
          {description != null && (
            <p className={styles['empty-state__description']}>{description}</p>
          )}
        </div>
        {(action != null || actionSlot != null) && (
          <div className={styles['empty-state__action']}>
            {action != null && <Button {...action} />}
            {actionSlot}
          </div>
        )}
      </div>
    </Scrollbar>
  );
}
