import type {
  ChangeEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  ReactNode,
} from 'react';
import {
  forwardRef,
  useId,
  useState,
  useCallback,
  useRef,
} from 'react';
import { toKebab } from '@/utils/string';
import type { IconSize } from '@/components/Icon/Icon';
import Icon from '@/components/Icon/Icon';
import MagnifyIcon from '@mattermost/compass-icons/components/magnify';
import CloseCircleIcon from '@mattermost/compass-icons/components/close-circle';
import styles from './SearchInput.module.scss';

export type SearchInputSize = 'small' | 'medium' | 'large';

const ICON_SIZE_MAP: Record<SearchInputSize, IconSize> = {
  small: '12',
  medium: '16',
  large: '20',
};

const CLEAR_ICON_SIZE_MAP: Record<SearchInputSize, IconSize> = {
  small: '12',
  medium: '16',
  large: '16',
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
  /** Called when the clear button is pressed. Omit to use built-in clearing. */
  onClear?: () => void;
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
      onClear,
      id: idProp,
      value: valueProp,
      defaultValue,
      placeholder,
      onFocus,
      onBlur,
      onChange,
      disabled,
      onKeyDown,
      ...rest
    },
    ref,
  ) {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const inputRef = useRef<HTMLInputElement>(null);

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

    const handleClear = useCallback(() => {
      if (disabled) return;

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
      } as ChangeEvent<HTMLInputElement>);

      input.focus();
    }, [disabled, isControlled, onChange, onClear]);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(e);
        if (e.defaultPrevented || disabled) return;
        if (e.key === 'Escape' && hasValue) {
          e.preventDefault();
          handleClear();
        }
      },
      [disabled, handleClear, hasValue, onKeyDown],
    );

    const showClearButton = hasValue && !disabled;

    const sizeClass = styles[`search-input--size-${toKebab(size)}`];
    const invalidClass = invalid ? styles['search-input--invalid'] : '';
    const labelFloatedClass =
      label != null && labelFloated ? styles['search-input--label-floated'] : '';
    const hasLeadingClass = styles['search-input--has-leading-icon'];
    const hasTrailingClass = showClearButton
      ? styles['search-input--has-trailing-icon']
      : '';
    const iconSize = ICON_SIZE_MAP[size];
    const clearIconSize = CLEAR_ICON_SIZE_MAP[size];

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
              aria-invalid={invalid ? true : undefined}
              {...rest}
            />
            {showClearButton && (
              <span className={styles['search-input__trailing-icon']}>
                <button
                  type="button"
                  className={styles['search-input__clear-button']}
                  onClick={handleClear}
                  aria-label="Clear search"
                  tabIndex={-1}
                >
                  <Icon size={clearIconSize} glyph={<CloseCircleIcon />} />
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    );
  },
);

export default SearchInput;
