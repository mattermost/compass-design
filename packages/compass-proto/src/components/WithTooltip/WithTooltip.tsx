import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type ReactElement,
} from 'react';
import { createPortal } from 'react-dom';
import { Tooltip } from '@mattermost/compass-ui/components/tooltip';
import type {
  TooltipArrow,
  TooltipShortcutKey,
} from '@mattermost/compass-ui/components/tooltip';
import styles from './WithTooltip.module.scss';

/** Matches Tooltip guidelines: show after 400ms of hover. */
const SHOW_DELAY_MS = 400;
/** Lets the pointer reach a portaled tooltip without the trigger mouseleave hiding it. */
const HIDE_GRACE_MS = 100;

export type WithTooltipPlacement = 'top' | 'right' | 'bottom' | 'left';

export interface WithTooltipProps {
  /** Tooltip label. Also used as `aria-label` on the child when it has none. */
  label: string;
  /** Optional hint line under the label. */
  hint?: string;
  /** Optional shortcut chips. */
  shortcutKeys?: TooltipShortcutKey[];
  /** Where the tooltip sits relative to the trigger. Default: `top`. */
  placement?: WithTooltipPlacement;
  /** Trigger control — typically an `IconButton`. */
  children: ReactElement;
}

const ARROW_FOR_PLACEMENT: Record<WithTooltipPlacement, TooltipArrow> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

function anchorStyle(
  rect: DOMRect,
  placement: WithTooltipPlacement,
): CSSProperties {
  const midX = rect.left + rect.width / 2;
  const midY = rect.top + rect.height / 2;
  switch (placement) {
    case 'top':
      return { top: rect.top, left: midX };
    case 'bottom':
      return { top: rect.bottom, left: midX };
    case 'left':
      return { top: midY, left: rect.left };
    case 'right':
      return { top: midY, left: rect.right };
  }
}

/**
 * Prototype host for Compass `Tooltip` chrome — hover delay, portal, and
 * placement. Use around Icon Buttons in proto and docs. Do not add this
 * behavior to published `IconButton` or `Tooltip`.
 */
export default function WithTooltip({
  label,
  hint,
  shortcutKeys,
  placement = 'top',
  children,
}: WithTooltipProps) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const showTimerRef = useRef<number>(0);
  const hideTimerRef = useRef<number>(0);
  const [open, setOpen] = useState(false);
  const [style, setStyle] = useState<CSSProperties>({});

  const clearTimers = useCallback(() => {
    window.clearTimeout(showTimerRef.current);
    window.clearTimeout(hideTimerRef.current);
  }, []);

  const measure = useCallback(() => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setStyle(anchorStyle(rect, placement));
  }, [placement]);

  const show = useCallback(() => {
    measure();
    setOpen(true);
  }, [measure]);

  const hide = useCallback(() => {
    clearTimers();
    setOpen(false);
  }, [clearTimers]);

  const scheduleShow = useCallback(() => {
    window.clearTimeout(hideTimerRef.current);
    window.clearTimeout(showTimerRef.current);
    showTimerRef.current = window.setTimeout(show, SHOW_DELAY_MS);
  }, [show]);

  const scheduleHide = useCallback(() => {
    window.clearTimeout(showTimerRef.current);
    window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => setOpen(false), HIDE_GRACE_MS);
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    measure();
  }, [open, measure]);

  useEffect(() => {
    if (!open) return undefined;
    const onReposition = () => measure();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') hide();
    };
    window.addEventListener('scroll', onReposition, true);
    window.addEventListener('resize', onReposition);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('scroll', onReposition, true);
      window.removeEventListener('resize', onReposition);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, measure, hide]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const handleBlur = (event: FocusEvent<HTMLSpanElement>) => {
    if (wrapRef.current?.contains(event.relatedTarget)) return;
    hide();
  };

  const child = isValidElement<{ 'aria-label'?: string }>(children)
    ? cloneElement(children, {
        'aria-label': children.props['aria-label'] ?? label,
      })
    : children;

  const surfaceClass = [
    styles['with-tooltip__surface'],
    styles[`with-tooltip__surface--${placement}`],
  ].join(' ');

  return (
    <span
      ref={wrapRef}
      className={styles['with-tooltip']}
      onPointerEnter={scheduleShow}
      onPointerLeave={scheduleHide}
      onFocus={scheduleShow}
      onBlur={handleBlur}
      onClick={hide}
    >
      {child}
      {open &&
        createPortal(
          <div
            className={surfaceClass}
            style={style}
            aria-hidden
            onPointerEnter={scheduleShow}
            onPointerLeave={hide}
          >
            <Tooltip
              label={label}
              hint={hint}
              shortcutKeys={shortcutKeys}
              arrow={ARROW_FOR_PLACEMENT[placement]}
            />
          </div>,
          document.body,
        )}
    </span>
  );
}
