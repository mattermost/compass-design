import type {
  InputHTMLAttributes,
  ReactNode,
  ChangeEvent,
  RefCallback,
  KeyboardEvent,
} from 'react';
import { forwardRef, useId, useState, useCallback, useRef } from 'react';
import { IconSlotContext } from '@/components/Icon/Icon';
import FieldClearButton from '@/components/field/FieldClearButton';
import {
  isFieldInvalid,
  mergeFieldDescribedBy,
} from '@/components/field/fieldDescribedBy';
import { useFieldClear } from '@/components/field/useFieldClear';
import FieldMessage from '@/components/FieldMessage/FieldMessage';
import type { FieldMessageTone } from '@/components/FieldMessage/FieldMessage';
import type { BuiltInButtonProps } from '@/utils/props';
import { toKebab } from '@/utils/string';
import styles from './TextInput.module.scss';

export type TextInputSize = 'small' | 'medium' | 'large';

export interface TextInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  /** Optional CSS class name. */
  className?: string;
  /** When true, shows invalid/error styling. */
  invalid?: boolean;
  /** Floating label content. When provided, label floats on focus or when value is non-empty. */
  label?: ReactNode;
  /** Leading icon — pass `<Icon glyph={<SearchIcon />} />`; TextInput provides the correct size via context. */
  leadingIcon?: ReactNode;
  /** Max length for the input; used with showCharacterCount for counter. */
  maxLength?: number;
  /** When true with maxLength, shows "current / max" character count below input. */
  showCharacterCount?: boolean;
  /** Size variant. Figma: Small (32px), Medium (40px), Large (48px). Default: Medium. */
  size?: TextInputSize;
  /**
   * Trailing control inside the field — e.g. password show/hide (`IconButton`), or a
   * static glyph. Not used with `clearable` (those patterns don’t combine). Combobox
   * owns its own clear/chevron.
   */
  trailingIcon?: ReactNode;
  /**
   * Field message under the field. Accepts translated nodes (e.g. `<FormattedMessage/>`).
   * Defaults to error tone (invalid chrome) when set without `messageTone`.
   */
  message?: ReactNode;
  /** Visual tone for `message`. Default: `error` when `message` is set. */
  messageTone?: FieldMessageTone;
  /**
   * When true, shows a clear button while the field has a non-empty value and is not disabled.
   * Default: false.
   */
  clearable?: boolean;
  /** Called when the clear button is pressed. Omit to use built-in clearing. */
  onClear?: () => void;
  /** Accessible name for the clear button. Default: "Clear". */
  clearLabel?: string;
  /** Extra attributes for the clear button (e.g. `data-testid`). */
  clearButtonProps?: BuiltInButtonProps;
  /**
   * Rendered outside the border, beside the control (same height as the field). Use for
   * labeled actions like Copy (`Button`, primary by default). In-field controls such as
   * password show/hide go in `trailingIcon`. Message and counter stay as wide as the
   * field column, not under the action.
   */
  trailingAction?: ReactNode;
}

/**
 * Text Inputs let people enter and edit a single line of text — names, emails, search
 * queries, channel titles. They're the workhorse of every form and modal in Mattermost.
 */
const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput(
    {
      className = '',
      size = 'medium',
      label,
      leadingIcon,
      trailingIcon,
      invalid = false,
      maxLength,
      showCharacterCount = false,
      message,
      messageTone,
      clearable = false,
      onClear,
      clearLabel = 'Clear',
      clearButtonProps,
      trailingAction,
      id: idProp,
      value: valueProp,
      defaultValue,
      placeholder,
      onFocus,
      onBlur,
      onChange,
      onKeyDown,
      disabled,
      readOnly,
      'aria-describedby': describedBy,
      ...rest
    },
    ref,
  ) {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const inputRef = useRef<HTMLInputElement | null>(null);

    const setInputRef = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === 'function') {
          const cleanup = (ref as RefCallback<HTMLInputElement>)(node);
          return () => {
            inputRef.current = null;
            if (typeof cleanup === 'function') cleanup();
          };
        }
        if (ref) ref.current = node;
      },
      [ref],
    );

    const isControlled = valueProp !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState(
      defaultValue ?? '',
    );
    const value = isControlled ? (valueProp as string) : uncontrolledValue;
    const hasValue = value != null && value !== '';

    const [isFocused, setIsFocused] = useState(false);
    const labelFloated = isFocused || hasValue;

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        onFocus?.(e);
      },
      [onFocus],
    );
    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        onBlur?.(e);
      },
      [onBlur],
    );
    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) setUncontrolledValue(e.target.value);
        onChange?.(e);
      },
      [isControlled, onChange],
    );

    const { showClearButton, handleClear, handleKeyDown } = useFieldClear({
      disabled,
      hasValue,
      clearEnabled: clearable,
      isControlled,
      onClear,
      onChange: handleChange as (e: ChangeEvent<HTMLInputElement>) => void,
      onKeyDown: onKeyDown as
        | ((e: KeyboardEvent<HTMLInputElement>) => void)
        | undefined,
      inputRef,
      setUncontrolledValue: (v) => setUncontrolledValue(v),
    });

    const showInvalid = isFieldInvalid(invalid, message, messageTone);
    const sizeClass = styles[`text-input--size-${toKebab(size)}`];
    const invalidClass = showInvalid ? styles['text-input--invalid'] : '';
    const labelFloatedClass =
      label != null && labelFloated ? styles['text-input--label-floated'] : '';
    const hasLeadingClass =
      leadingIcon != null ? styles['text-input--has-leading-icon'] : '';
    const hasTrailingClass =
      trailingIcon != null || showClearButton
        ? styles['text-input--has-trailing-icon']
        : '';

    const rootClass = [
      styles['text-input'],
      sizeClass,
      invalidClass,
      labelFloatedClass,
      hasLeadingClass,
      hasTrailingClass,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const currentLength = typeof value === 'string' ? value.length : 0;
    const counterId =
      showCharacterCount && maxLength != null ? `${id}-counter` : undefined;
    const messageId = message != null ? `${id}-message` : undefined;
    const resolvedTone = messageTone ?? 'error';

    const fieldBody = (
      <>
        <div className={styles['text-input__wrapper']}>
          <label className={styles['text-input__inner']}>
            {label != null && (
              <span className={styles['text-input__label']}>{label}</span>
            )}
            {leadingIcon != null && (
              <span className={styles['text-input__leading-icon']}>
                <IconSlotContext.Provider value={{ size: '16' }}>
                  {leadingIcon}
                </IconSlotContext.Provider>
              </span>
            )}
            <input
              ref={setInputRef}
              id={id}
              className={styles['text-input__input']}
              value={isControlled ? valueProp : undefined}
              defaultValue={isControlled ? undefined : defaultValue}
              placeholder={placeholder}
              maxLength={maxLength}
              disabled={disabled}
              readOnly={readOnly}
              aria-invalid={showInvalid ? true : undefined}
              aria-describedby={mergeFieldDescribedBy(
                describedBy,
                messageId,
                counterId,
              )}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              {...rest}
            />
            {trailingIcon != null && (
              <span className={styles['text-input__trailing-icon']}>
                <IconSlotContext.Provider value={{ size: '16' }}>
                  {trailingIcon}
                </IconSlotContext.Provider>
              </span>
            )}
            {showClearButton && (
              <span className={styles['text-input__trailing-icon']}>
                <FieldClearButton
                  size={size}
                  clearLabel={clearLabel}
                  clearButtonProps={clearButtonProps}
                  onClick={handleClear}
                />
              </span>
            )}
          </label>
        </div>
        {(message != null || (showCharacterCount && maxLength != null)) && (
          <div className={styles['text-input__footer']}>
            {message != null && (
              <FieldMessage
                id={messageId}
                className={styles['text-input__footer-message']}
                message={message}
                tone={resolvedTone}
              />
            )}
            {showCharacterCount && maxLength != null && (
              <div
                id={counterId}
                className={styles['text-input__counter']}
                aria-live="polite"
              >
                {currentLength} / {maxLength}
              </div>
            )}
          </div>
        )}
      </>
    );

    return (
      <div className={rootClass}>
        {trailingAction != null ? (
          <div className={styles['text-input__row']}>
            <div className={styles['text-input__field']}>{fieldBody}</div>
            <div className={styles['text-input__trailing-action']}>
              {trailingAction}
            </div>
          </div>
        ) : (
          fieldBody
        )}
      </div>
    );
  },
);

export default TextInput;
