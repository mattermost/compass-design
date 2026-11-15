import { useEffect, useId, useRef } from 'react';
import type {
  HTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
  ReactNode,
  RefObject,
} from 'react';
import CloseIcon from '@mattermost/compass-icons/components/close';
import Icon from '@/components/Icon/Icon';
import IconButton from '@/components/IconButton/IconButton';
import { usePopoverTransition } from '@/hooks/usePopoverTransition';
import type { BuiltInButtonProps } from '@/utils/props';
import { mergeClassNames } from '@/utils/props';
import { toKebab } from '@/utils/string';
import { useOnExited } from '@/utils/useOnExited';
import styles from './Popover.module.scss';

export type PopoverSize = 'small' | 'medium' | 'large';

export interface PopoverProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title'
> {
  /**
   * Optional heading. Names the surface (`aria-labelledby`). Without a
   * `title`, pass `aria-label` or `aria-labelledby` so the dialog has a name.
   * Accepts translated nodes (e.g. `<FormattedMessage/>`).
   */
  title?: ReactNode;
  /** Width. `small` 240px, `medium` 320px, `large` 400px. Default: `medium`. */
  size?: PopoverSize;
  /** Body content — a filter panel, quick-edit form, help card, … */
  children: ReactNode;
  /** Optional footer, typically Buttons. Rendered below the body. */
  footer?: ReactNode;
  /** Shows a close button in the header when provided. Also what Escape calls. */
  onClose?: () => void;
  /** Accessible name for the close button. Default: "Close". */
  closeLabel?: string;
  /** Extra attributes for the close button (e.g. `data-testid`). */
  closeButtonProps?: BuiltInButtonProps;
  /**
   * Controlled visibility with the Compass popover transition (scale + fade in,
   * reverse on close); the popover unmounts after the exit, and focus is
   * restored when `open` turns false. Omit to always render without transition. The host owns the
   * state, the anchor, positioning, the portal and outside-click dismissal.
   */
  open?: boolean;
  /** Called after the exit transition finishes and the popover unmounts (only when `open` is controlled). */
  onExited?: () => void;
  /**
   * Call `onClose` on Escape pressed inside the popover. Skipped when an inner
   * widget already handled it (`defaultPrevented`); a handled Escape calls
   * `preventDefault()`. Default: true.
   */
  closeOnEscape?: boolean;
  /**
   * Move focus into the popover on mount and return it to the previously
   * focused element when it closes (only if focus is still inside or has
   * fallen to the page). Set false when the host owns focus. Not a focus trap:
   * the popover is non-modal. Default: true.
   */
  manageFocus?: boolean;
  /** Element to focus on mount (e.g. the first field). Default: the popover root. */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** Extra class on the root. */
  className?: string;
}

/**
 * General content surface for a small panel anchored to a trigger. Chrome only —
 * border, fill, elevation, header, footer and the open/close transition. The
 * host owns the anchor, positioning, portal, stacking and outside-click; the
 * popover owns the non-modal dialog semantics (`role="dialog"`, name, initial
 * focus, Escape, focus restore). Use {@link PopoverMenu} for `MenuItem` lists
 * and {@link PopoverNotice} for short dismissable messages.
 */
export default function Popover({
  title,
  size = 'medium',
  children,
  footer,
  onClose,
  closeLabel = 'Close',
  closeButtonProps,
  open,
  onExited,
  closeOnEscape = true,
  manageFocus = true,
  initialFocusRef,
  className,
  onKeyDown,
  ...rest
}: PopoverProps) {
  const transitioned = open !== undefined;
  const { mounted, visible } = usePopoverTransition(open ?? true);
  useOnExited(mounted, onExited, transitioned);

  const rootRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const manageFocusRef = useRef(manageFocus);
  manageFocusRef.current = manageFocus;
  const initialFocusRefRef = useRef(initialFocusRef);
  initialFocusRefRef.current = initialFocusRef;

  const shown = !transitioned || mounted;
  // Follows `open` (not `mounted`) so reopening during the exit refocuses.
  const active = !transitioned || open === true;
  useEffect(() => {
    if (!active || !manageFocusRef.current) return;
    const previous = document.activeElement as HTMLElement | null;
    const root = rootRef.current;
    const target = initialFocusRefRef.current?.current;
    if (target && root?.contains(target)) target.focus();
    if (!target || document.activeElement !== target) root?.focus();
    return () => {
      const active = document.activeElement;
      const focusLost = !active || active === document.body;
      if (
        (focusLost || root?.contains(active)) &&
        previous?.isConnected &&
        typeof previous.focus === 'function'
      ) {
        previous.focus();
      }
    };
  }, [active]);

  if (!shown) return null;

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    if (event.key !== 'Escape' || event.defaultPrevented) return;
    if (!closeOnEscape || !onClose) return;
    event.preventDefault();
    onClose();
  }

  const hasHeader = title != null || onClose != null;
  const rootClass = mergeClassNames(
    styles['popover'],
    styles[`popover--size-${toKebab(size)}`],
    transitioned && styles['popover--transition'],
    transitioned && visible && styles['popover--visible'],
    className,
  );

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- WAI-ARIA dialog pattern: Escape closes the popover
    <div
      role="dialog"
      aria-labelledby={title != null ? titleId : undefined}
      tabIndex={-1}
      {...rest}
      ref={rootRef}
      className={rootClass}
      onKeyDown={handleKeyDown}
    >
      {hasHeader && (
        <div className={styles['popover__header']}>
          {title != null && (
            <span id={titleId} className={styles['popover__title']}>
              {title}
            </span>
          )}
          {onClose && (
            <IconButton
              {...closeButtonProps}
              className={mergeClassNames(
                styles['popover__close'],
                closeButtonProps?.className,
              )}
              aria-label={closeLabel}
              size="small"
              icon={<Icon glyph={<CloseIcon />} />}
              onClick={onClose}
            />
          )}
        </div>
      )}
      <div className={styles['popover__body']}>{children}</div>
      {footer != null && (
        <div className={styles['popover__footer']}>{footer}</div>
      )}
    </div>
  );
}
