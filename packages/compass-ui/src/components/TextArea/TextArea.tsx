import type { TextareaHTMLAttributes, ReactNode, ChangeEvent } from 'react';
import { forwardRef, useId, useState, useCallback } from 'react';
import { toKebab } from '@/utils/string';
import styles from './TextArea.module.scss';

export type TextAreaSize = 'small' | 'medium' | 'large';

export interface TextAreaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'size'
> {
  /** Optional CSS class name. */
  className?: string;
  /** When true, shows invalid/error styling. */
  invalid?: boolean;
  /** Floating label content. When provided, label floats on focus or when value is non-empty. */
  label?: ReactNode;
  /** Max length for the textarea; used with showCharacterCount for counter. */
  maxLength?: number;
  /** When true with maxLength, shows "current / max" character count below textarea. */
  showCharacterCount?: boolean;
  /** Size variant. Default: Medium. */
  size?: TextAreaSize;
}

/**
 * Text Areas let people write long-form text that spans multiple lines — descriptions,
 * channel purposes, message drafts, admin notes. They share their visual rhythm with Text
 * Input but trade the single-line constraint for room to breathe.
 */
const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea(
    {
      className = '',
      size = 'medium',
      label,
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
      rows = 3,
      'aria-describedby': describedBy,
      ...rest
    },
    ref,
  ) {
    const generatedId = useId();
    const id = idProp ?? generatedId;

    const isControlled = valueProp !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState(
      defaultValue ?? '',
    );
    const value = isControlled ? (valueProp as string) : uncontrolledValue;
    const hasValue = value != null && value !== '';

    const [isFocused, setIsFocused] = useState(false);
    const labelFloated = isFocused || hasValue;

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLTextAreaElement>) => {
        setIsFocused(true);
        onFocus?.(e);
      },
      [onFocus],
    );
    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLTextAreaElement>) => {
        setIsFocused(false);
        onBlur?.(e);
      },
      [onBlur],
    );
    const handleChange = useCallback(
      (e: ChangeEvent<HTMLTextAreaElement>) => {
        if (!isControlled) setUncontrolledValue(e.target.value);
        onChange?.(e);
      },
      [isControlled, onChange],
    );

    const sizeClass = styles[`text-area--size-${toKebab(size)}`];
    const invalidClass = invalid ? styles['text-area--invalid'] : '';
    const labelFloatedClass =
      label != null && labelFloated ? styles['text-area--label-floated'] : '';

    const rootClass = [
      styles['text-area'],
      sizeClass,
      invalidClass,
      labelFloatedClass,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const currentLength = typeof value === 'string' ? value.length : 0;
    const counterId =
      showCharacterCount && maxLength != null ? `${id}-counter` : undefined;

    return (
      <div className={rootClass}>
        <div className={styles['text-area__wrapper']}>
          {label != null && (
            <label className={styles['text-area__label']} htmlFor={id}>
              {label}
            </label>
          )}
          <textarea
            ref={ref}
            id={id}
            className={styles['text-area__input']}
            value={isControlled ? valueProp : undefined}
            defaultValue={isControlled ? undefined : defaultValue}
            placeholder={placeholder}
            maxLength={maxLength}
            disabled={disabled}
            readOnly={readOnly}
            rows={rows}
            aria-invalid={invalid ? true : undefined}
            aria-describedby={
              [describedBy, counterId].filter(Boolean).join(' ') || undefined
            }
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...rest}
          />
        </div>
        {showCharacterCount && maxLength != null && (
          <div
            id={counterId}
            className={styles['text-area__counter']}
            aria-live="polite"
          >
            {currentLength} / {maxLength}
          </div>
        )}
      </div>
    );
  },
);

export default TextArea;
