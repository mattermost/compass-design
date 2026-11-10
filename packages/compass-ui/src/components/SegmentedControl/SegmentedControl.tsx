import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import type { IconSize } from '@/components/Icon/Icon';
import { IconSlotContext } from '@/components/Icon/Icon';
import { mergeClassNames, type BuiltInButtonProps } from '@/utils/props';
import { toKebab } from '@/utils/string';
import styles from './SegmentedControl.module.scss';

/** `tablist` switches views. `radiogroup` is a short exclusive form choice. */
export type SegmentedControlRole = 'tablist' | 'radiogroup';

/**
 * `small` matches a small Button (12px label, 12px icon). `medium` matches a
 * medium Button (14px label, 16px icon).
 */
export type SegmentedControlSize = 'small' | 'medium';

const SIZE_ICON_MAP: Record<SegmentedControlSize, IconSize> = {
  small: '12',
  medium: '16',
};

export interface SegmentedControlOption {
  /**
   * Stable id for this segment. Used as the React key and the `onChange`
   * argument, so it is a string rather than translated text.
   */
  key: string;
  /** Segment label. Accepts translated nodes (e.g. `<FormattedMessage/>`). */
  label: ReactNode;
  /**
   * Optional leading icon. Pass `<Icon glyph={<SomeIcon />} />`;
   * SegmentedControl provides the size via context (12px at `small`, 16px at
   * `medium`), matching Button. No `size` prop is needed on the Icon.
   */
  icon?: ReactNode;
  /** Optional id for this segment (pair with `panelId` for `aria-controls`). */
  id?: string;
  /**
   * Optional id of the host panel this segment controls. Applied as
   * `aria-controls` when `role` is `tablist`. The host owns the panel.
   */
  panelId?: string;
  /** When true, the segment can't be selected and arrow keys skip it. */
  disabled?: boolean;
  /** Native tooltip text, e.g. to explain why the segment is disabled. */
  title?: string;
  /**
   * Extra attributes for this segment's `<button>` (e.g. `data-testid`).
   * Segment semantics (`role`, `aria-selected` / `aria-checked`, `tabIndex`,
   * `type`) take precedence. `className` is merged. `onClick`, `onKeyDown`,
   * and `onMouseDown` run first; `preventDefault()` skips selection.
   */
  buttonProps?: BuiltInButtonProps;
}

export interface SegmentedControlProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'role'
> {
  /** Segments, in order. One is selected. */
  options: SegmentedControlOption[];
  /** Key of the selected segment. */
  value: string;
  /** Called with the segment key when the selection changes. */
  onChange: (key: string) => void;
  /**
   * Semantics. `tablist` (default) switches views: arrow keys move focus, and
   * Enter, Space, or a click selects. The host owns the panel. `radiogroup`
   * is a short exclusive form choice: arrow keys move the selection. Pass
   * `aria-label` or `aria-labelledby` so the group has a name.
   */
  role?: SegmentedControlRole;
  /**
   * Size of the label and leading icon, matching Button. `small` (default)
   * is 12px text with a 12px icon. `medium` is 14px text with a 16px icon.
   */
  size?: SegmentedControlSize;
  /** Optional CSS class name. */
  className?: string;
}

function stepIndex(index: number, delta: number, count: number) {
  if (index < 0) return delta < 0 ? count - 1 : 0;
  return (index + delta + count) % count;
}

function arrowDelta(key: string, isRadio: boolean) {
  if (key === 'ArrowRight' || (isRadio && key === 'ArrowDown')) return 1;
  if (key === 'ArrowLeft' || (isRadio && key === 'ArrowUp')) return -1;
  return 0;
}

interface IndicatorBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

function readBox(node: HTMLElement | null | undefined): IndicatorBox | null {
  if (!node || node.offsetWidth === 0) return null;
  return {
    x: node.offsetLeft,
    y: node.offsetTop,
    width: node.offsetWidth,
    height: node.offsetHeight,
  };
}

function sameBox(a: IndicatorBox | null, b: IndicatorBox | null) {
  return (
    a === b ||
    (a != null &&
      b != null &&
      a.x === b.x &&
      a.y === b.y &&
      a.width === b.width &&
      a.height === b.height)
  );
}

/**
 * Segmented controls let people pick one option from a short, exclusive set shown as one
 * compact control — search modes in a header, a filter on a list, or a form choice that
 * doesn't need a radio mark. One segment is selected; choosing another replaces it.
 */
export default function SegmentedControl({
  options,
  value,
  onChange,
  role = 'tablist',
  size = 'small',
  className,
  onBlur,
  ...rest
}: SegmentedControlProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const segmentRefs = useRef(new Map<string, HTMLButtonElement>());
  const [focusedKey, setFocusedKey] = useState(value);
  const [indicator, setIndicator] = useState<IndicatorBox | null>(null);
  // The first placement is instant. Motion turns on after paint so the
  // surface doesn't slide in from the corner on mount.
  const [indicatorReady, setIndicatorReady] = useState(false);
  const isRadio = role === 'radiogroup';
  const itemRole = isRadio ? 'radio' : 'tab';

  useLayoutEffect(() => {
    const publish = () => {
      const next = readBox(segmentRefs.current.get(value));
      setIndicator((current) => (sameBox(current, next) ? current : next));
    };
    publish();

    const track = trackRef.current;
    if (typeof ResizeObserver === 'undefined' || !track) return;
    const observer = new ResizeObserver(publish);
    observer.observe(track);
    for (const node of segmentRefs.current.values()) {
      observer.observe(node);
    }
    return () => observer.disconnect();
  }, [value, options, size]);

  useEffect(() => {
    setIndicatorReady(true);
  }, []);

  useEffect(() => {
    setFocusedKey(value);
  }, [value]);

  const iconSize = SIZE_ICON_MAP[size];
  const enabledKeys = options
    .filter((option) => !option.disabled)
    .map((option) => option.key);
  const focusKey = enabledKeys.includes(focusedKey)
    ? focusedKey
    : enabledKeys.includes(value)
      ? value
      : enabledKeys[0];

  const moveFocus = (key: string, select: boolean) => {
    setFocusedKey(key);
    segmentRefs.current.get(key)?.focus();
    if (select) onChange(key);
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    onBlur?.(event);
    // Manual tabs keep the last focused segment as the tab stop. Once focus
    // leaves the group, put it back on the selected segment so the next visit
    // lands on the choice, not a segment the user only passed through.
    if (event.defaultPrevented || isRadio) return;
    const track = event.currentTarget;
    queueMicrotask(() => {
      if (!track.isConnected) return;
      const active = document.activeElement;
      if (active instanceof Node && track.contains(active)) return;
      const tabStop = enabledKeys.includes(value) ? value : enabledKeys[0];
      if (tabStop) setFocusedKey(tabStop);
    });
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    key: string,
  ) => {
    // Alt, Ctrl, and Meta belong to the browser (Back, scroll-to-ends).
    // Shift still moves within the group.
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const count = enabledKeys.length;
    if (count === 0) return;
    const index = enabledKeys.indexOf(key);
    const delta = arrowDelta(event.key, isRadio);

    if (delta !== 0) {
      event.preventDefault();
      const next = enabledKeys[stepIndex(index, delta, count)];
      moveFocus(next, isRadio && next !== key);
      return;
    }

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      const next =
        event.key === 'Home' ? enabledKeys[0] : enabledKeys[count - 1];
      moveFocus(next, isRadio && next !== key);
      return;
    }

    if ((event.key === 'Enter' || event.key === ' ') && index >= 0) {
      event.preventDefault();
      setFocusedKey(key);
      onChange(key);
    }
  };

  return (
    <div
      {...rest}
      ref={trackRef}
      role={role}
      aria-orientation="horizontal"
      onBlur={handleBlur}
      className={mergeClassNames(
        styles['segmented-control'],
        styles[`segmented-control--size-${toKebab(size)}`],
        className,
      )}
    >
      <span
        className={mergeClassNames(
          styles['segmented-control__indicator'],
          indicatorReady && styles['segmented-control__indicator--ready'],
          !indicator && styles['segmented-control__indicator--unpositioned'],
        )}
        style={
          indicator
            ? {
                transform: `translate(${indicator.x}px, ${indicator.y}px)`,
                width: indicator.width,
                height: indicator.height,
              }
            : undefined
        }
        aria-hidden
      />
      {options.map((option) => {
        const isSelected = option.key === value;
        const isDisabled = option.disabled === true;

        return (
          <button
            {...option.buttonProps}
            key={option.key}
            ref={(node) => {
              if (node) segmentRefs.current.set(option.key, node);
              else segmentRefs.current.delete(option.key);
            }}
            id={option.id ?? option.buttonProps?.id}
            type="button"
            role={itemRole}
            tabIndex={focusKey === option.key ? 0 : -1}
            aria-selected={isRadio ? undefined : isSelected}
            aria-checked={isRadio ? isSelected : undefined}
            aria-controls={
              !isRadio && option.panelId ? option.panelId : undefined
            }
            aria-disabled={isDisabled || undefined}
            disabled={undefined}
            title={option.title ?? option.buttonProps?.title}
            className={mergeClassNames(
              styles['segmented-control__segment'],
              isSelected && styles['segmented-control__segment--active'],
              isDisabled && styles['segmented-control__segment--disabled'],
              option.buttonProps?.className,
            )}
            onMouseDown={(event) => {
              option.buttonProps?.onMouseDown?.(event);
              if (isDisabled) event.preventDefault();
            }}
            onClick={(event) => {
              option.buttonProps?.onClick?.(event);
              if (event.defaultPrevented || isDisabled) return;
              setFocusedKey(option.key);
              onChange(option.key);
            }}
            onKeyDown={(event) => {
              option.buttonProps?.onKeyDown?.(event);
              if (event.defaultPrevented) return;
              handleKeyDown(event, option.key);
            }}
          >
            {option.icon != null && (
              <span className={styles['segmented-control__icon']}>
                <IconSlotContext.Provider value={{ size: iconSize }}>
                  {option.icon}
                </IconSlotContext.Provider>
              </span>
            )}
            <span className={styles['segmented-control__label']}>
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
