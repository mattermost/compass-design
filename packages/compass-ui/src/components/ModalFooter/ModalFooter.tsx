import type { ReactNode } from 'react';
import styles from './ModalFooter.module.scss';

/**
 * Figma Modal Footer Type (kebab-case).
 * - `2-actions` / `1-action` — children end-aligned
 * - `2-actions-separated` — space-between (first child start, rest end… or use `leading`)
 * - `pagination` / `stepped-progress` — `leading` on the left, `children` on the right
 * - `spacer-small` / `spacer-large` — empty padding only
 */
export type ModalFooterType =
  | '2-actions'
  | '2-actions-separated'
  | '1-action'
  | 'pagination'
  | 'stepped-progress'
  | 'spacer-small'
  | 'spacer-large';

export interface ModalFooterProps {
  className?: string;
  /** Layout variant. Figma: Type. Default: `2-actions`. */
  type?: ModalFooterType;
  /** Top border. Figma: Divider = On. Default: true (ignored for spacers). */
  divider?: boolean;
  /** Left slot — pagination status text, PaginationDots, etc. */
  leading?: ReactNode;
  /** Action buttons (or empty for spacers). */
  children?: ReactNode;
}

/**
 * Modal Footer chrome — padding, optional divider, and layout for actions /
 * pagination / stepped progress / spacers. Pass Buttons (or other controls) as
 * children; host owns labels and handlers.
 *
 * @see https://www.figma.com/design/qdm5tKododENqnTvjLovDT/Patterns---Modals?node-id=797-8156
 */
export default function ModalFooter({
  className = '',
  type = '2-actions',
  divider = true,
  leading,
  children,
}: ModalFooterProps) {
  const isSpacer = type === 'spacer-small' || type === 'spacer-large';
  const showDivider = divider && !isSpacer;
  const typeClass = styles[`modal-footer--type-${type}`];

  return (
    <div
      className={[
        styles['modal-footer'],
        typeClass,
        showDivider && styles['modal-footer--divider'],
        !showDivider && !isSpacer && styles['modal-footer--no-divider'],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {!isSpacer && (
        <div className={styles['modal-footer__content']}>
          {leading != null && (
            <div className={styles['modal-footer__leading']}>{leading}</div>
          )}
          {children != null && (
            <div className={styles['modal-footer__actions']}>{children}</div>
          )}
        </div>
      )}
    </div>
  );
}
