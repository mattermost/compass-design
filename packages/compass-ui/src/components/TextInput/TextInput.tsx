import type {
  InputHTMLAttributes,
  ReactNode,
  ChangeEvent,
  RefCallback,
} from 'react';
import { forwardRef, useId, useState, useCallback, useRef } from 'react';
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
  /** Leading icon (e.g. <Icon glyph={<SearchIcon />} size="16" />). */
  leadingIcon?: ReactNode;
  /** Max length for the input; used with showCharacterCount for counter. */
  maxLength?: number;
  /** When true with maxLength, shows "current / max" character count below input. */
  showCharacterCount?: boolean;
  /** Size variant. Figma: Small (32px), Medium (40px), Large (48px). Default: Medium. */
  size?: TextInputSize;
  /** Trailing icon. */
  trailingIcon?: ReactNode;
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
      id: idProp,
      value: valueProp,
      defaultValue,
      placeholder,
      onFocus,
      onBlur,
      onChange,
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

    const sizeClass = styles[`text-input--size-${toKebab(size)}`];
    const invalidClass = invalid ? styles['text-input--invalid'] : '';
    const labelFloatedClass =
      label != null && labelFloated ? styles['text-input--label-floated'] : '';
    const hasLeadingClass =
      leadingIcon != null ? styles['text-input--has-leading-icon'] : '';
    const hasTrailingClass =
      trailingIcon != null ? styles['text-input--has-trailing-icon'] : '';

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

    return (
      <div className={rootClass}>
        <div className={styles['text-input__wrapper']}>
          <label className={styles['text-input__inner']}>
            {label != null && (
              <span className={styles['text-input__label']}>{label}</span>
            )}
            {leadingIcon != null && (
              <span className={styles['text-input__leading-icon']}>
                {leadingIcon}
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
              aria-invalid={invalid ? true : undefined}
              aria-describedby={
                [describedBy, counterId].filter(Boolean).join(' ') || undefined
              }
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              {...rest}
            />
            {trailingIcon != null && (
              <span className={styles['text-input__trailing-icon']}>
                {trailingIcon}
              </span>
            )}
          </label>
        </div>
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
    );
  },
);

export default TextInput;
