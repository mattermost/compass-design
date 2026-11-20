import {
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import CloseIcon from '@mattermost/compass-icons/components/close';
import ChevronRightIcon from '@mattermost/compass-icons/components/chevron-right';
import Button from '@/components/Button/Button';
import Icon from '@/components/Icon/Icon';
import IconButton from '@/components/IconButton/IconButton';
import PaginationDots from '@/components/PaginationDots/PaginationDots';
import { usePopoverTransition } from '@/hooks/usePopoverTransition';
import type { BuiltInButtonProps } from '@/utils/props';
import { mergeClassNames } from '@/utils/props';
import { toKebab } from '@/utils/string';
import { useOnExited } from '@/utils/useOnExited';
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
   * callsite or a static tour step. When the card is closed, the open control
   * still shows the core dot; rings follow this prop.
   */
  showPulsingDot?: boolean;
  /**
   * Controlled panel visibility. When `false`, the pulsing dot stays mounted and
   * opens the card on click. Omit for uncontrolled (see `defaultOpen`).
   */
  open?: boolean;
  /**
   * Uncontrolled initial panel visibility. Default `true` (auto-show). Pass
   * `false` to start as a clickable pulsing dot.
   */
  defaultOpen?: boolean;
  /** Called when the panel opens or closes (controlled or uncontrolled). */
  onOpenChange?: (open: boolean) => void;
  /**
   * Called after the close (×) or Escape dismiss finishes its exit transition.
   * Hosts that unmount in this callback get the exit animation first. When the
   * host keeps the instance, the card collapses to the pulsing dot.
   */
  onClose?: () => void;
  /** Accessible name for the close button. Default: "Close". */
  closeLabel?: string;
  /** Extra attributes for the close button (e.g. `data-testid`). */
  closeButtonProps?: BuiltInButtonProps;
  /** Accessible name for the closed pulsing-dot control. Default: "Open tip". */
  openLabel?: string;
  /** Extra attributes for the closed pulsing-dot button (e.g. `data-testid`). */
  openButtonProps?: BuiltInButtonProps;
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
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  onClose,
  closeLabel = 'Close',
  closeButtonProps,
  openLabel = 'Open tip',
  openButtonProps,
  progress,
  primaryAction,
  className = '',
  onKeyDown,
  ...rest
}: TourPointProps) {
  const isControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = isControlled ? openProp! : uncontrolledOpen;

  const setOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const { mounted: panelMounted, visible } = usePopoverTransition(open);
  const pendingActionRef = useRef<(() => void) | undefined>(undefined);
  const pendingReopenRef = useRef(false);
  const restoreFocusRef = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useOnExited(panelMounted, () => {
    const action = pendingActionRef.current;
    const shouldReopen = pendingReopenRef.current;
    pendingActionRef.current = undefined;
    pendingReopenRef.current = false;
    action?.();
    // Primary "next" on an uncontrolled retained instance reopens the card for
    // the updated step. Close / Escape stay collapsed as the pulsing dot.
    if (shouldReopen && !isControlled) {
      restoreFocusRef.current = true;
      setOpen(true);
    }
  });

  useEffect(() => {
    if (!panelMounted || !restoreFocusRef.current) return;
    restoreFocusRef.current = false;
    const root = rootRef.current;
    if (!root) return;
    // Don't steal focus if the user or the dismiss callback already moved it.
    const active = document.activeElement;
    if (
      active instanceof HTMLElement &&
      active !== document.body &&
      active !== document.documentElement &&
      !root.contains(active)
    ) {
      return;
    }
    const primary = root.querySelector<HTMLElement>(
      `.${styles['tour-point__next-wrap']} button:not([disabled])`,
    );
    const focusable =
      primary ??
      root.querySelector<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
    focusable?.focus();
  }, [panelMounted]);

  const requestDismiss = (action?: () => void, reopen = false) => {
    if (!open) return;
    pendingActionRef.current = action;
    pendingReopenRef.current = reopen;
    setOpen(false);
  };

  const showPointer = pointerPosition !== 'none';
  const pointerModifier =
    showPointer &&
    styles[
      `tour-point--pointer-${toKebab(pointerPosition as TourPointPointerPosition)}`
    ];
  const closed = !panelMounted;

  const rootClass = [
    styles['tour-point'],
    pointerModifier,
    closed && styles['tour-point--closed'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const panelClass = [
    styles['tour-point__panel'],
    styles['tour-point__panel--transition'],
    visible && styles['tour-point__panel--visible'],
  ]
    .filter(Boolean)
    .join(' ');

  const showFooter = progress != null || primaryAction != null;

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || e.key !== 'Escape' || !onClose || !open) return;
    const target = e.target;
    if (!(target instanceof Node) || !e.currentTarget.contains(target)) return;
    e.preventDefault();
    requestDismiss(onClose, false);
  };

  const pulseRings = showPulsingDot ? (
    <>
      <span className={styles['tour-point__pointer-pulse-ring']} />
      <span
        className={[
          styles['tour-point__pointer-pulse-ring'],
          styles['tour-point__pointer-pulse-ring--delay'],
        ].join(' ')}
      />
    </>
  ) : null;

  if (closed) {
    return (
      <div {...rest} ref={rootRef} className={rootClass}>
        <button
          type="button"
          {...openButtonProps}
          className={mergeClassNames(
            styles['tour-point__open'],
            openButtonProps?.className,
          )}
          aria-label={openLabel}
          onClick={(e) => {
            openButtonProps?.onClick?.(e);
            setOpen(true);
          }}
        >
          <span className={styles['tour-point__pointer-pulse']} aria-hidden>
            {pulseRings}
            <span className={styles['tour-point__pointer-pulse-core']} />
          </span>
        </button>
      </div>
    );
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- Escape dismiss when focus is inside the card; not a modal (no role/trap)
    <div
      {...rest}
      ref={rootRef}
      className={rootClass}
      onKeyDown={handleKeyDown}
    >
      {showPointer && (
        <span className={styles['tour-point__pointer']} aria-hidden>
          <span className={styles['tour-point__pointer-triangle']} />
          {showPulsingDot && (
            <span className={styles['tour-point__pointer-pulse']}>
              {pulseRings}
              <span className={styles['tour-point__pointer-pulse-core']} />
            </span>
          )}
        </span>
      )}

      <div className={panelClass}>
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
              onClick={() => requestDismiss(onClose, false)}
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
                  onClick={() => requestDismiss(primaryAction.onClick, true)}
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
