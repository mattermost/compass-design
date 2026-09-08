import type { CSSProperties, ReactNode } from 'react';
import { useId } from 'react';
import Scrollbar from '@/components/Scrollbar/Scrollbar';
import ModalFooter from '@/components/ModalFooter/ModalFooter';
import type { ModalFooterType } from '@/components/ModalFooter/ModalFooter';
import ModalHeader from '@/components/ModalHeader/ModalHeader';
import type { ModalSubtitlePlacement } from '@/components/ModalHeader/ModalHeader';
import { toKebab } from '@/utils/string';
import styles from './Modal.module.scss';

export type ModalSize = 'small' | 'medium' | 'large';

/**
 * Body inset. `menu` is for MenuItem lists — 8px vertical / 16px horizontal so
 * row labels align with the 32px header/footer margins. `none` removes inset
 * for host-owned full-bleed layouts (e.g. settings sidebars).
 */
export type ModalBodyPadding = 'default' | 'menu' | 'none';

export type { ModalFooterType, ModalSubtitlePlacement };

export interface ModalProps {
  /** Extra class on the dialog root (size + chrome classes still apply). */
  className?: string;
  /** Inline style on the dialog root — prefer `className` for layout overrides. */
  style?: CSSProperties;
  /** Width variant. Figma: Size — Small 600px, Medium 704px, Large 832px. */
  size?: ModalSize;
  /** Modal heading text. Required for a11y; use `hideTitle` for close-only chrome. */
  title: ReactNode;
  /** Optional secondary line — placement via `subtitlePlacement`. */
  subtitle?: ReactNode;
  /**
   * Where the subtitle sits. Figma Modal Header: Below | Beside.
   * Default: `below`.
   */
  subtitlePlacement?: ModalSubtitlePlacement;
  /** Visually hide the title (close-only header); title remains for `aria-labelledby`. */
  hideTitle?: boolean;
  /** When true, shows a back-arrow button before the title. */
  showBackButton?: boolean;
  /** Called when the back button is clicked. */
  onBack?: () => void;
  /** Called when the × close button is clicked. */
  onClose?: () => void;
  /** Show divider between header and body. Default: true. */
  headerDivider?: boolean;
  /** Optional control before close (Button, search field, …). */
  headerAction?: ReactNode;
  /**
   * Body inset. Default is 32px horizontal / 28px vertical. Use `menu` for
   * MenuItem lists. Use `none` when the host owns padding.
   */
  bodyPadding?: ModalBodyPadding;
  /**
   * When true (default), wraps body content in Scrollbar. Set false when the
   * host manages scroll inside panes.
   */
  scrollable?: boolean;
  /** Body content. */
  children: ReactNode;
  /** Footer slot — typically Buttons. Wrapped in `ModalFooter`. */
  footer?: ReactNode;
  /** Left footer slot (pagination status, PaginationDots, …). */
  footerLeading?: ReactNode;
  /** Footer layout. Figma Modal Footer Type. Default: `2-actions`. */
  footerType?: ModalFooterType;
  /** Show divider between body and footer. Default: true. */
  footerDivider?: boolean;
}

/**
 * Modal dialog shell — composes ModalHeader, scrollable body, and ModalFooter.
 * Host owns portal, overlay, focus trap, and open/close.
 */
export default function Modal({
  className = '',
  style,
  size = 'small',
  title,
  subtitle,
  subtitlePlacement = 'below',
  hideTitle = false,
  showBackButton = false,
  onBack,
  onClose,
  headerDivider = true,
  headerAction,
  bodyPadding = 'default',
  scrollable = true,
  children,
  footer,
  footerLeading,
  footerType = '2-actions',
  footerDivider = true,
}: ModalProps) {
  const titleId = useId();
  const sizeClass = styles[`modal--size-${toKebab(size)}`];
  const bodyInnerClass = [
    styles['modal__body-inner'],
    bodyPadding === 'menu' && styles['modal__body-inner--menu'],
    bodyPadding === 'none' && styles['modal__body-inner--none'],
  ]
    .filter(Boolean)
    .join(' ');

  const bodyInner = <div className={bodyInnerClass}>{children}</div>;
  const showFooter =
    footer != null ||
    footerLeading != null ||
    footerType === 'spacer-small' ||
    footerType === 'spacer-large';

  return (
    <div
      className={[styles.modal, sizeClass, className].filter(Boolean).join(' ')}
      style={style}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <ModalHeader
        title={title}
        titleId={titleId}
        subtitle={subtitle}
        subtitlePlacement={subtitlePlacement}
        hideTitle={hideTitle}
        showBackButton={showBackButton}
        onBack={onBack}
        onClose={onClose}
        divider={headerDivider}
        headerAction={headerAction}
      />

      <div className={styles['modal__body']}>
        {scrollable ? <Scrollbar>{bodyInner}</Scrollbar> : bodyInner}
      </div>

      {showFooter && (
        <ModalFooter
          type={footerType}
          divider={footerDivider}
          leading={footerLeading}
        >
          {footer}
        </ModalFooter>
      )}
    </div>
  );
}
