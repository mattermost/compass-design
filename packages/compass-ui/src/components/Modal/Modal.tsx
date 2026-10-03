import type {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
  RefObject,
} from 'react';
import { useEffect, useId, useRef } from 'react';
import { useModalFocus } from '@/hooks/useModalFocus';
import { usePopoverTransition } from '@/hooks/usePopoverTransition';
import Scrollbar from '@/components/Scrollbar/Scrollbar';
import ModalFooter from '@/components/ModalFooter/ModalFooter';
import type { ModalFooterType } from '@/components/ModalFooter/ModalFooter';
import ModalHeader from '@/components/ModalHeader/ModalHeader';
import type { ModalSubtitlePlacement } from '@/components/ModalHeader/ModalHeader';
import type { BuiltInButtonProps } from '@/utils/props';
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

export interface ModalProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title' | 'children' | 'style'
> {
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
  /** Accessible name for the back button. Default: "Go back". */
  backLabel?: string;
  /** Extra attributes for the back button (e.g. `data-testid`). */
  backButtonProps?: BuiltInButtonProps;
  /** Called when the × close button is clicked. */
  onClose?: () => void;
  /** Accessible name for the close button. Default: "Close". */
  closeLabel?: string;
  /** Extra attributes for the close button (e.g. `data-testid`). */
  closeButtonProps?: BuiltInButtonProps;
  /** Show divider between header and body. Default: true. */
  headerDivider?: boolean;
  /** Optional control before close (Button, search field, …). */
  headerAction?: ReactNode;
  /**
   * Full-width slot rendered below the title row and above the header divider.
   * Accepts any ReactNode — SearchInput, Tabs, a custom toolbar, etc.
   */
  headerSlot?: ReactNode;
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
  /**
   * Close on Escape via a document listener while mounted. Escapes already
   * handled by an inner widget (`defaultPrevented`) are ignored. Default: true.
   */
  closeOnEscape?: boolean;
  /**
   * Element to focus when the modal mounts (e.g. the first form field).
   * Default: the dialog root.
   */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /**
   * Controlled visibility with the Compass enter/exit transition (fade + rise,
   * reverse on close, `--duration-quick`); the modal unmounts after the exit,
   * and focus is restored then. Omit to keep the mount-controlled behavior
   * (always rendered, no transition). The host still owns the state.
   */
  open?: boolean;
  /** Called after the exit transition finishes and the modal unmounts (only when `open` is controlled). */
  onExited?: () => void;
}

interface ModalPanelState {
  active: boolean;
  transition: boolean;
  visible: boolean;
}

function ModalPanel({
  className = '',
  style,
  size = 'small',
  title,
  subtitle,
  subtitlePlacement = 'below',
  hideTitle = false,
  showBackButton = false,
  onBack,
  backLabel,
  backButtonProps,
  onClose,
  closeLabel,
  closeButtonProps,
  headerDivider = true,
  headerAction,
  headerSlot,
  bodyPadding = 'default',
  scrollable = true,
  children,
  footer,
  footerLeading,
  footerType = '2-actions',
  footerDivider = true,
  closeOnEscape = true,
  initialFocusRef,
  active,
  transition,
  visible,
  ...rest
}: ModalProps & ModalPanelState) {
  const rootRef = useRef<HTMLDivElement>(null);
  useModalFocus(rootRef, {
    initialFocusRef,
    closeOnEscape,
    onClose,
    active,
  });
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
      {...rest}
      ref={rootRef}
      tabIndex={-1}
      className={[
        styles.modal,
        sizeClass,
        transition && styles['modal--transition'],
        transition && visible && styles['modal--visible'],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
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
        backLabel={backLabel}
        backButtonProps={backButtonProps}
        onClose={onClose}
        closeLabel={closeLabel}
        closeButtonProps={closeButtonProps}
        divider={headerDivider}
        headerAction={headerAction}
        headerSlot={headerSlot}
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

/**
 * Modal dialog shell — composes ModalHeader, scrollable body, and ModalFooter.
 * Owns dialog-level focus and keyboard behavior: initial focus, Tab trap,
 * Escape, and focus restore on unmount. Host owns portal, overlay/backdrop,
 * scroll lock, stacking, and open state. Mount-controlled by default; pass
 * `open` for the enter/exit transition.
 */
export default function Modal({ open, onExited, ...props }: ModalProps) {
  const controlled = open !== undefined;
  const { mounted, visible } = usePopoverTransition(open ?? true);
  const wasMounted = useRef(mounted);
  const onExitedRef = useRef(onExited);
  onExitedRef.current = onExited;

  useEffect(() => {
    if (wasMounted.current && !mounted && controlled) {
      onExitedRef.current?.();
    }
    wasMounted.current = mounted;
  }, [mounted, controlled]);

  if (controlled && !mounted) return null;

  return (
    <ModalPanel
      {...props}
      active={open ?? true}
      transition={controlled}
      visible={visible}
    />
  );
}
