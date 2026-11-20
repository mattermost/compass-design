import {
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import CloseIcon from '@mattermost/compass-icons/components/close';
import ChevronLeftIcon from '@mattermost/compass-icons/components/chevron-left';
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
  /** Total steps in the series. Dots render only when `pages > 1`. */
  pages: number;
  /** Current step (1-indexed), matching `PaginationDots`. */
  activePage: number;
  /** Called with the 1-indexed page when a step dot is activated. */
  onPageChange?: (page: number) => void;
  /** Accessible name for the step dots. Default: "Pages". */
  label?: string;
  /** Accessible name for each step dot. Default: `Page {page}`. */
  formatPageLabel?: (page: number) => string;
}

export interface TourPointAction {
  /** Button label. Accepts translated nodes (e.g. `<FormattedMessage/>`). */
  label: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  /** Shows a spinner in the button and disables it. */
  loading?: boolean;
}

/** @see TourPointAction */
export type TourPointPrimaryAction = TourPointAction;

export interface TourPointProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title' | 'children'
> {
  /** Tour step heading. Accepts translated nodes (e.g. `<FormattedMessage/>`). */
  title: ReactNode;
  children: ReactNode;
  /** Optional image between body copy and footer (e.g. screenshot as an img). */
  media?: ReactNode;
  /**
   * Where the pointer sits on the card edge; omit or `none` to hide the pointer.
   * The root’s `(0,0)` is the pointer tip — position the host anchor there so the
   * pulsing tip stays fixed when the card opens or collapses.
   */
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
   * In controlled mode, the host must set `open` to `false` in `onOpenChange`.
   * `onClose` and `primaryAction.onClick` run only after the exit transition;
   * they do not run while the host keeps `open` set to `true`.
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
  /**
   * Primary footer action (`Next`, or `Done` on the last step of a series).
   * Runs after the exit transition; uncontrolled retained hosts reopen afterward.
   */
  primaryAction?: TourPointAction;
  /**
   * Optional previous-step action for a series (`Previous`). Same exit-then-callback
   * timing as `primaryAction`. Omit on the first step.
   */
  secondaryAction?: TourPointAction;
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
  secondaryAction,
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
  // Only restore panel focus after an explicit open (dot click / retained next).
  // Default-open mount does not steal focus (matches pre-PR TourPoint).
  const restoreFocusRef = useRef(false);
  const restoreFocusToDotRef = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Cancel a queued dismiss if the host reopens before the exit finishes.
  useEffect(() => {
    if (!open) return;
    pendingActionRef.current = undefined;
    pendingReopenRef.current = false;
  }, [open]);

  useOnExited(panelMounted, () => {
    const action = pendingActionRef.current;
    const shouldReopen = pendingReopenRef.current;
    pendingActionRef.current = undefined;
    pendingReopenRef.current = false;
    action?.();
    // Next / Previous intend to land on the (updated) tip. Restore panel focus
    // once it is mounted again — controlled hosts reopen via the action /
    // onOpenChange; uncontrolled retained hosts reopen here.
    if (shouldReopen) {
      restoreFocusRef.current = true;
      if (!isControlled) setOpen(true);
    } else {
      restoreFocusToDotRef.current = true;
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

  useEffect(() => {
    if (panelMounted || !restoreFocusToDotRef.current) return;
    restoreFocusToDotRef.current = false;
    const root = rootRef.current;
    if (!root) return;
    const active = document.activeElement;
    if (
      active instanceof HTMLElement &&
      active !== document.body &&
      active !== document.documentElement &&
      !root.contains(active)
    ) {
      return;
    }
    root.querySelector<HTMLElement>(`.${styles['tour-point__open']}`)?.focus();
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

  const surfaceClass = [
    styles['tour-point__surface'],
    styles['tour-point__surface--transition'],
    visible && styles['tour-point__surface--visible'],
  ]
    .filter(Boolean)
    .join(' ');

  const showFooter =
    progress != null || primaryAction != null || secondaryAction != null;

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

  // Tip pulse stays on the root origin (outside the scaling surface) so open /
  // close motion never drags the pulsing tip toward the panel.
  const tipPulse =
    showPulsingDot && (closed || showPointer) ? (
      <span className={styles['tour-point__tip-pulse']} aria-hidden>
        {pulseRings}
        <span className={styles['tour-point__pointer-pulse-core']} />
      </span>
    ) : null;

  if (closed) {
    return (
      <div {...rest} ref={rootRef} className={rootClass}>
        {tipPulse}
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
            restoreFocusRef.current = true;
            setOpen(true);
          }}
        />
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
      {tipPulse}
      <div className={surfaceClass}>
        {showPointer && (
          <span className={styles['tour-point__pointer']} aria-hidden>
            <span className={styles['tour-point__pointer-triangle']} />
          </span>
        )}

        <div className={styles['tour-point__anchor']}>
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
                  onClick={() => requestDismiss(onClose, false)}
                />
              )}
            </div>

            <div className={styles['tour-point__body']}>
              <div className={styles['tour-point__description']}>
                {children}
              </div>
              {media != null && (
                <div className={styles['tour-point__media']}>{media}</div>
              )}
            </div>

            {showFooter && (
              <div className={styles['tour-point__footer']}>
                {progress != null && progress.pages > 1 ? (
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

                {secondaryAction != null || primaryAction != null ? (
                  <div className={styles['tour-point__actions']}>
                    {secondaryAction != null ? (
                      <div className={styles['tour-point__prev-wrap']}>
                        <Button
                          emphasis="tertiary"
                          size="small"
                          leadingIcon={
                            <Icon size="16" glyph={<ChevronLeftIcon />} />
                          }
                          disabled={secondaryAction.disabled}
                          loading={secondaryAction.loading}
                          onClick={
                            secondaryAction.onClick
                              ? () =>
                                  requestDismiss(secondaryAction.onClick, true)
                              : undefined
                          }
                        >
                          {secondaryAction.label}
                        </Button>
                      </div>
                    ) : null}
                    {primaryAction != null ? (
                      <div className={styles['tour-point__next-wrap']}>
                        <Button
                          emphasis="primary"
                          size="small"
                          trailingIcon={
                            <Icon size="16" glyph={<ChevronRightIcon />} />
                          }
                          disabled={primaryAction.disabled}
                          loading={primaryAction.loading}
                          onClick={
                            primaryAction.onClick
                              ? () =>
                                  requestDismiss(primaryAction.onClick, true)
                              : undefined
                          }
                        >
                          {primaryAction.label}
                        </Button>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
