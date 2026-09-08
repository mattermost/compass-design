import {
  useLayoutEffect,
  useRef,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import styles from './CardButtonGroup.module.scss';

export interface CardButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

function radiosIn(group: ParentNode): HTMLButtonElement[] {
  return [...group.querySelectorAll<HTMLButtonElement>('[role="radio"]')];
}

function enabledRadiosIn(group: ParentNode): HTMLButtonElement[] {
  return radiosIn(group).filter((radio) => !radio.disabled);
}

function syncRadioTabStops(group: HTMLElement, preferred?: HTMLButtonElement) {
  const radios = radiosIn(group);
  if (radios.length === 0) return;

  const enabled = enabledRadiosIn(group);
  const checked =
    enabled.find((radio) => radio.getAttribute('aria-checked') === 'true') ??
    radios.find((radio) => radio.getAttribute('aria-checked') === 'true');
  const tabStop =
    preferred && radios.includes(preferred) && !preferred.disabled
      ? preferred
      : (checked ?? enabled[0] ?? radios[0]);

  radios.forEach((radio) => {
    radio.tabIndex = radio === tabStop ? 0 : -1;
  });
}

/**
 * Lays out Card Buttons in a horizontal row (Figma Card Button Group).
 * Defaults to `role="radiogroup"` — set child cards to `role="radio"`.
 * When children use `role="radio"`, applies the ARIA radio keyboard model
 * (roving tabindex + arrow selection with wrapping).
 */
export default function CardButtonGroup({
  children,
  className = '',
  role = 'radiogroup',
  onKeyDown,
  onFocus,
  ...rest
}: CardButtonGroupProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const group = ref.current;
    if (group == null) return;
    syncRadioTabStops(group);
  }, [children]);

  const handleFocus = (e: FocusEvent<HTMLDivElement>) => {
    onFocus?.(e);
    const group = e.currentTarget;
    if (radiosIn(group).length === 0) return;
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const radio = target.closest<HTMLButtonElement>('[role="radio"]');
    if (radio == null || !group.contains(radio)) return;
    syncRadioTabStops(group, radio);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;

    const group = ref.current;
    if (group == null) return;
    const radios = enabledRadiosIn(group);
    if (radios.length === 0) return;

    const active = document.activeElement;
    if (!(active instanceof HTMLElement) || !group.contains(active)) return;
    const radio = active.closest<HTMLButtonElement>('[role="radio"]');
    const index = radios.findIndex((r) => r === radio);
    if (index < 0) return;

    const selectRadio = (next: HTMLButtonElement) => {
      e.preventDefault();
      syncRadioTabStops(group, next);
      next.focus({ focusVisible: true } as FocusOptions);
      if (next.getAttribute('aria-checked') !== 'true') {
        next.click();
      }
    };

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        selectRadio(radios[(index + 1) % radios.length]);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        selectRadio(radios[(index - 1 + radios.length) % radios.length]);
        break;
      case 'Home':
        selectRadio(radios[0]);
        break;
      case 'End':
        selectRadio(radios[radios.length - 1]);
        break;
      default:
        break;
    }
  };

  return (
    <div
      role={role}
      className={[styles['card-button-group'], className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
      ref={ref}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
    >
      {children}
    </div>
  );
}
