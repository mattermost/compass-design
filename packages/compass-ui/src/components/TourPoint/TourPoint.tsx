import type { HTMLAttributes, ReactNode } from 'react';
import CloseIcon from '@mattermost/compass-icons/components/close';
import ChevronRightIcon from '@mattermost/compass-icons/components/chevron-right';
import Button from '@/components/Button/Button';
import Icon from '@/components/Icon/Icon';
import IconButton from '@/components/IconButton/IconButton';
import PaginationDots from '@/components/PaginationDots/PaginationDots';
import type { BuiltInButtonProps } from '@/utils/props';
import { mergeClassNames } from '@/utils/props';
import { toKebab } from '@/utils/string';
import styles from './TourPoint.module.scss';

export type TourPointPointerPosition =
  | 'top-center'
  | 'top-left'
  | 'top-right'
  | 'bottom-center'
  | 'bottom-left'
  | 'bottom-right'
  | 'left-center'
  | 'right-center';

export interface TourPointProgress {
  pages: number;
  activePage: number;
  onPageChange?: (page: number) => void;
  /** Accessible name for the step dots. Default: "Pages". */
  label?: string;
  /** Accessible name for each step dot. Default: `Page {page}`. */
  formatPageLabel?: (page: number) => string;
}

export interface TourPointPrimaryAction {
  /** Button label. Accepts translated nodes (e.g. `<FormattedMessage/>`). */
  label: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  /** Shows a spinner in the button and disables it. */
  loading?: boolean;
}

export interface TourPointProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title' | 'children'
> {
  /** Tour step heading. Accepts translated nodes (e.g. `<FormattedMessage/>`). */
  title: ReactNode;
  children: ReactNode;
  /** Optional image between body copy and footer (e.g. screenshot as an img). */
  media?: ReactNode;
  /** Where the pointer sits on the card edge; omit or `none` to hide the pointer. */
  pointerPosition?: TourPointPointerPosition | 'none';
  /**
   * Animated marker at the arrow tip (Figma Pulsing Dot). Only applies when a
   * pointer is shown. Default on; set false for reduced motion preference at the
   * callsite or a static tour step.
   */
  showPulsingDot?: boolean;
  onClose?: () => void;
  /** Accessible name for the close button. Default: "Close". */
  closeLabel?: string;
  /** Extra attributes for the close button (e.g. `data-testid`). */
  closeButtonProps?: BuiltInButtonProps;
  progress?: TourPointProgress;
  primaryAction?: TourPointPrimaryAction;
  className?: string;
}

export default function TourPoint({
  title,
  children,
  media,
  pointerPosition = 'top-center',
  showPulsingDot = true,
  onClose,
  closeLabel = 'Close',
  closeButtonProps,
  progress,
  primaryAction,
  className = '',
  ...rest
}: TourPointProps) {
  const showPointer = pointerPosition !== 'none';
  const pointerModifier =
    showPointer &&
    styles[
      `tour-point--pointer-${toKebab(pointerPosition as TourPointPointerPosition)}`
    ];

  const rootClass = [styles['tour-point'], pointerModifier, className]
    .filter(Boolean)
    .join(' ');

  const showFooter = progress != null || primaryAction != null;

  return (
    <div {...rest} className={rootClass}>
      {showPointer && (
        <span className={styles['tour-point__pointer']} aria-hidden>
          <span className={styles['tour-point__pointer-triangle']} />
          {showPulsingDot && (
            <span className={styles['tour-point__pointer-pulse']}>
              <span className={styles['tour-point__pointer-pulse-ring']} />
              <span
                className={[
                  styles['tour-point__pointer-pulse-ring'],
                  styles['tour-point__pointer-pulse-ring--delay'],
                ].join(' ')}
              />
              <span className={styles['tour-point__pointer-pulse-core']} />
            </span>
          )}
        </span>
      )}

      <div className={styles['tour-point__panel']}>
        <div className={styles['tour-point__header']}>
          <h2 className={styles['tour-point__title']}>{title}</h2>
          {onClose && (
            <IconButton
              {...closeButtonProps}
              className={mergeClassNames(
                styles['tour-point__close'],
                closeButtonProps?.className,
              )}
              aria-label={closeLabel}
              size="small"
              padding="compact"
              style="default"
              icon={<Icon size="16" glyph={<CloseIcon />} />}
              onClick={onClose}
            />
          )}
        </div>

        <div className={styles['tour-point__body']}>
          <div className={styles['tour-point__description']}>{children}</div>
          {media != null && (
            <div className={styles['tour-point__media']}>{media}</div>
          )}
        </div>

        {showFooter && (
          <div className={styles['tour-point__footer']}>
            {progress != null ? (
              <PaginationDots
                className={styles['tour-point__progress']}
                pages={progress.pages}
                activePage={progress.activePage}
                dotStyle="on-primary"
                onPageChange={progress.onPageChange}
                label={progress.label}
                formatPageLabel={progress.formatPageLabel}
              />
            ) : (
              <span
                className={styles['tour-point__footer-spacer']}
                aria-hidden
              />
            )}

            {primaryAction != null ? (
              <div className={styles['tour-point__next-wrap']}>
                <Button
                  emphasis="primary"
                  size="small"
                  trailingIcon={<Icon size="16" glyph={<ChevronRightIcon />} />}
                  disabled={primaryAction.disabled}
                  loading={primaryAction.loading}
                  onClick={primaryAction.onClick}
                >
                  {primaryAction.label}
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
