import type { ChangeEvent, KeyboardEvent, RefObject } from 'react';
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

    onChange?.({
      target: input,
      currentTarget: input,
    } as ChangeEvent<T>);

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
