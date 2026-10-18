import type {
  ChangeEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  ReactNode,
} from 'react';
import { forwardRef, useId, useState, useCallback, useRef } from 'react';
import { toKebab } from '@/utils/string';
import type { IconSize } from '@/components/Icon/Icon';
import Icon from '@/components/Icon/Icon';
import MagnifyIcon from '@mattermost/compass-icons/components/magnify';
import FieldClearButton from '@/components/field/FieldClearButton';
import {
  isFieldInvalid,
  mergeFieldDescribedBy,
} from '@/components/field/fieldDescribedBy';
import { useFieldClear } from '@/components/field/useFieldClear';
import FieldMessage from '@/components/FieldMessage/FieldMessage';
import type { FieldMessageTone } from '@/components/FieldMessage/FieldMessage';
import type { BuiltInButtonProps } from '@/utils/props';
import styles from './SearchInput.module.scss';

export type SearchInputSize = 'small' | 'medium' | 'large';

const ICON_SIZE_MAP: Record<SearchInputSize, IconSize> = {
  small: '12',
  medium: '16',
  large: '20',
};

export interface SearchInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type'
> {
  /** Optional CSS class name. */
  className?: string;
  /** When true, shows invalid/error styling. */
  invalid?: boolean;
  /** Floating label (placeholder-style). Floats above border when filled. */
  label?: ReactNode;
  /** Size variant. Default: Medium. */
  size?: SearchInputSize;
  /**
   * Field message under the field. Accepts translated nodes (e.g. `<FormattedMessage/>`).
   * Defaults to error tone (invalid chrome) when set without `messageTone`.
   */
  message?: ReactNode;
  /** Visual tone for `message`. Default: `error` when `message` is set. */
  messageTone?: FieldMessageTone;
  /** Called when the clear button is pressed. Omit to use built-in clearing. */
  onClear?: () => void;
  /** Accessible name for the clear button. Default: "Clear search". */
  clearLabel?: string;
  /** Extra attributes for the clear button (e.g. `data-testid`). */
  clearButtonProps?: BuiltInButtonProps;
}

/**
 * Search Inputs are the entry point to filtering or finding content — global search, channel
 * switcher, member picker, file finder. They look like a text input with a leading magnifier
 * so the affordance is obvious before the user reads a single word.
 */
const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    {
      className = '',
      size = 'medium',
      label,
      invalid = false,
      message,
      messageTone,
      onClear,
      clearLabel = 'Clear search',
      clearButtonProps,
      id: idProp,
      value: valueProp,
      defaultValue,
      placeholder,
      onFocus,
      onBlur,
      onChange,
      disabled,
      onKeyDown,
      'aria-describedby': describedBy,
      ...rest
    },
    ref,
  ) {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const inputRef = useRef<HTMLInputElement | null>(null);

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

    const setInputRef = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    const { showClearButton, handleClear, handleKeyDown } = useFieldClear({
      disabled,
      hasValue,
      clearEnabled: true,
      isControlled,
      onClear,
      onChange: handleChange,
      onKeyDown: onKeyDown as
        | ((e: KeyboardEvent<HTMLInputElement>) => void)
        | undefined,
      inputRef,
      setUncontrolledValue: (v) => setUncontrolledValue(v),
    });

    const showInvalid = isFieldInvalid(invalid, message, messageTone);
    const sizeClass = styles[`search-input--size-${toKebab(size)}`];
    const invalidClass = showInvalid ? styles['search-input--invalid'] : '';
    const labelFloatedClass =
      label != null && labelFloated
        ? styles['search-input--label-floated']
        : '';
    const hasLeadingClass = styles['search-input--has-leading-icon'];
    const hasTrailingClass = showClearButton
      ? styles['search-input--has-trailing-icon']
      : '';
    const iconSize = ICON_SIZE_MAP[size];

    const rootClass = [
      styles['search-input'],
      sizeClass,
      invalidClass,
      labelFloatedClass,
      hasLeadingClass,
      hasTrailingClass,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const messageId = message != null ? `${id}-message` : undefined;
    const resolvedTone = messageTone ?? 'error';

    return (
      <div className={rootClass}>
        <div className={styles['search-input__wrapper']}>
          {label != null && (
            <label className={styles['search-input__label']} htmlFor={id}>
              {label}
            </label>
          )}
          <div className={styles['search-input__inner']}>
            <span className={styles['search-input__leading-icon']} aria-hidden>
              <Icon size={iconSize} glyph={<MagnifyIcon />} />
            </span>
            <input
              ref={setInputRef}
              id={id}
              type="search"
              className={styles['search-input__input']}
              value={isControlled ? valueProp : undefined}
              defaultValue={isControlled ? undefined : defaultValue}
              placeholder={placeholder}
              disabled={disabled}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              aria-invalid={showInvalid ? true : undefined}
              aria-describedby={mergeFieldDescribedBy(
                describedBy,
                messageId,
                undefined,
              )}
              {...rest}
            />
            {showClearButton && (
              <span className={styles['search-input__trailing-icon']}>
                <FieldClearButton
                  size={size}
                  clearLabel={clearLabel}
                  clearButtonProps={clearButtonProps}
                  onClick={handleClear}
                  tabIndex={clearButtonProps?.tabIndex ?? -1}
                />
              </span>
            )}
          </div>
        </div>
        {message != null && (
          <FieldMessage id={messageId} message={message} tone={resolvedTone} />
        )}
      </div>
    );
  },
);

export default SearchInput;
