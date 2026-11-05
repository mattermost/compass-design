import {
  createContext,
  useLayoutEffect,
  useRef,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import styles from './ChipGroup.module.scss';

export const ChipGroupContext = createContext(false);

export interface ChipGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** When true, chips are not a tab stop. */
  disabled?: boolean;
}

function chipsIn(toolbar: ParentNode): HTMLElement[] {
  return [...toolbar.querySelectorAll<HTMLElement>('[data-chip]')];
}

/** True for a disabled chip (native `disabled` or `aria-disabled`). */
export function isChipDisabled(el: HTMLElement): boolean {
  return (
    (el instanceof HTMLButtonElement && el.disabled) ||
    el.getAttribute('aria-disabled') === 'true'
  );
}

/** Roving tabindex + focus for a chip inside a ChipGroup. */
export function activateChip(el: HTMLElement) {
  const toolbar = el.closest('[role="toolbar"]');
  if (toolbar) {
    chipsIn(toolbar).forEach((chip) => {
      chip.tabIndex = chip === el ? 0 : -1;
    });
  }
  el.focus({ focusVisible: true } as FocusOptions);
}

/**
 * Toolbar for a set of Chips. Tab lands on the active chip; Left/Right move
 * between chips; Delete, Backspace, Enter, and Space remove the focused chip.
 * The × is mouse-only.
 */
export default function ChipGroup({
  children,
  className = '',
  disabled = false,
  onKeyDown,
  onFocus,
  ...rest
}: ChipGroupProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const toolbar = ref.current;
    if (toolbar == null) return;

    const syncTabStop = () => {
      const all = chipsIn(toolbar);
      all.filter(isChipDisabled).forEach((chip) => {
        chip.tabIndex = -1;
      });
      const chips = all.filter((chip) => !isChipDisabled(chip));
      if (chips.length === 0) return;
      if (disabled) {
        chips.forEach((chip) => {
          chip.tabIndex = -1;
        });
        return;
      }
      const focused = chips.find((chip) => chip === document.activeElement);
      if (focused != null) {
        chips.forEach((chip) => {
          chip.tabIndex = chip === focused ? 0 : -1;
        });
        return;
      }
      if (!chips.some((chip) => chip.tabIndex === 0)) {
        chips[0].tabIndex = 0;
        chips.slice(1).forEach((chip) => {
          chip.tabIndex = -1;
        });
      }
    };

    syncTabStop();

    // A chip can toggle `disabled` / `aria-disabled` on its own (a wrapper with
    // local state) without re-rendering the group, so watch for it.
    if (typeof MutationObserver === 'undefined') return;
    const observer = new MutationObserver(syncTabStop);
    observer.observe(toolbar, {
      subtree: true,
      attributes: true,
      attributeFilter: ['disabled', 'aria-disabled'],
    });
    return () => observer.disconnect();
  }, [children, disabled]);

  const handleFocus = (e: FocusEvent<HTMLDivElement>) => {
    onFocus?.(e);
    if (disabled) return;
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const chip = target.closest<HTMLElement>('[data-chip]');
    const toolbar = e.currentTarget;
    if (chip == null || !toolbar.contains(chip) || isChipDisabled(chip)) return;
    chipsIn(toolbar).forEach((c) => {
      c.tabIndex = c === chip ? 0 : -1;
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || disabled) return;

    const toolbar = ref.current;
    if (toolbar == null) return;
    const chips = chipsIn(toolbar).filter((c) => !isChipDisabled(c));
    if (chips.length === 0) return;

    const active = document.activeElement;
    if (!(active instanceof HTMLElement) || !toolbar.contains(active)) return;
    const chip = active.closest<HTMLElement>('[data-chip]');
    const index = chips.findIndex((c) => c === chip);
    if (index < 0) return;

    const moveTo = (nextIndex: number) => {
      const next = chips[Math.max(0, Math.min(chips.length - 1, nextIndex))];
      if (next == null) return;
      e.preventDefault();
      activateChip(next);
    };

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        moveTo(index + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        moveTo(index - 1);
        break;
      case 'Home':
        moveTo(0);
        break;
      case 'End':
        moveTo(chips.length - 1);
        break;
      case 'Delete':
      case 'Backspace':
      case 'Enter':
      case ' ': {
        const btn =
          chip?.querySelector<HTMLButtonElement>('[data-chip-remove]');
        if (btn != null && !btn.disabled) {
          e.preventDefault();
          btn.click();
        }
        break;
      }
      default:
        break;
    }
  };

  const rootClass = [styles['chip-group'], className].filter(Boolean).join(' ');

  return (
    <ChipGroupContext.Provider value={true}>
      <div
        {...rest}
        ref={ref}
        className={rootClass}
        role="toolbar"
        aria-orientation="horizontal"
        aria-disabled={disabled || undefined}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
      >
        {children}
      </div>
    </ChipGroupContext.Provider>
  );
}
