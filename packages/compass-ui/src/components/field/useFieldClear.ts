import type {
  ChangeEvent,
  KeyboardEvent,
  RefObject,
  SyntheticEvent,
} from 'react';
import { useCallback } from 'react';

type FieldElement = HTMLInputElement | HTMLTextAreaElement;

export interface UseFieldClearOptions<T extends FieldElement> {
  disabled?: boolean;
  hasValue: boolean;
  /** When false, clear is hidden and Escape does not clear. Default true. */
  clearEnabled?: boolean;
  isControlled: boolean;
  onClear?: () => void;
  onChange?: (e: ChangeEvent<T>) => void;
  onKeyDown?: (e: KeyboardEvent<T>) => void;
  inputRef: RefObject<T | null>;
  setUncontrolledValue: (value: string) => void;
}

/** Minimal ChangeEvent so host `preventDefault` / `nativeEvent` access won't throw. */
function createClearChangeEvent<T extends FieldElement>(
  input: T,
): ChangeEvent<T> {
  let defaultPrevented = false;
  let propagationStopped = false;
  const nativeEvent = new Event('change', { bubbles: true, cancelable: true });

  const event = {
    nativeEvent,
    type: 'change',
    target: input,
    currentTarget: input,
    bubbles: true,
    cancelable: true,
    defaultPrevented: false,
    eventPhase: 0,
    isTrusted: false,
    timeStamp: Date.now(),
    preventDefault() {
      defaultPrevented = true;
      this.defaultPrevented = true;
      nativeEvent.preventDefault?.();
    },
    isDefaultPrevented() {
      return defaultPrevented;
    },
    stopPropagation() {
      propagationStopped = true;
      nativeEvent.stopPropagation?.();
    },
    isPropagationStopped() {
      return propagationStopped;
    },
    persist() {},
  } as ChangeEvent<T> & SyntheticEvent<T, Event>;

  return event;
}

export function useFieldClear<T extends FieldElement>({
  disabled,
  hasValue,
  clearEnabled = true,
  isControlled,
  onClear,
  onChange,
  onKeyDown,
  inputRef,
  setUncontrolledValue,
}: UseFieldClearOptions<T>) {
  const showClearButton = Boolean(clearEnabled && hasValue && !disabled);

  const handleClear = useCallback(() => {
    if (disabled || !clearEnabled) return;

    if (onClear) {
      onClear();
      inputRef.current?.focus();
      return;
    }

    const input = inputRef.current;
    if (input == null) return;

    input.value = '';
    if (!isControlled) setUncontrolledValue('');

    onChange?.(createClearChangeEvent(input));
    input.focus();
  }, [
    clearEnabled,
    disabled,
    inputRef,
    isControlled,
    onChange,
    onClear,
    setUncontrolledValue,
  ]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<T>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented || disabled || !clearEnabled) return;
      if (e.key === 'Escape' && hasValue) {
        e.preventDefault();
        handleClear();
      }
    },
    [clearEnabled, disabled, handleClear, hasValue, onKeyDown],
  );

  return { showClearButton, handleClear, handleKeyDown };
}
