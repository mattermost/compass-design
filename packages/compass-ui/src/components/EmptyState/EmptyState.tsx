import type { HTMLAttributes, ReactNode } from 'react';
import Button from '@/components/Button/Button';
import type { ButtonProps } from '@/components/Button/Button';
import Illustration from '@/components/Illustration/Illustration';
import type { IllustrationProps } from '@/components/Illustration/Illustration';
import Scrollbar from '@/components/Scrollbar/Scrollbar';
import styles from './EmptyState.module.scss';

export type EmptyStateTitleLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type EmptyStateDescriptionElement = 'p' | 'div';

export interface EmptyStateProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title' | 'children' | 'onScroll'
> {
  /** Illustration props (children = the SVG component). Rendered above the title. */
  illustration?: IllustrationProps;
  /** Main heading. Accepts translated nodes (e.g. `<FormattedMessage/>`). */
  title: ReactNode;
  /**
   * Heading level of the title (`1`–`6`). Default `2`. Pick the level that fits the heading
   * outline of the surface the empty state sits in, e.g. `3` inside a modal body.
   */
  titleLevel?: EmptyStateTitleLevel;
  /** Body description. Supports ReactNode for inline formatting. */
  description?: ReactNode;
  /**
   * Element that wraps the description. Default `'p'`. Use `'div'` when the description
   * contains block content (paragraphs, lists), which isn't valid inside a `<p>`.
   */
  descriptionAs?: EmptyStateDescriptionElement;
  /** Button props (children = label). Rendered below the description. */
  action?: ButtonProps;
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
  titleLevel = 2,
  description,
  descriptionAs: Description = 'p',
  action,
  className = '',
  ...rest
}: EmptyStateProps) {
  const Title = `h${titleLevel}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
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
          <Title className={styles['empty-state__title']}>{title}</Title>
          {description != null && (
            <Description className={styles['empty-state__description']}>
              {description}
            </Description>
          )}
        </div>
        {action != null && (
          <div className={styles['empty-state__action']}>
            <Button {...action} />
          </div>
        )}
      </div>
    </Scrollbar>
  );
}
