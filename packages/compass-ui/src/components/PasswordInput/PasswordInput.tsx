import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef, useCallback, useId, useRef, useState } from 'react';
import EyeOffOutlineIcon from '@mattermost/compass-icons/components/eye-off-outline';
import EyeOutlineIcon from '@mattermost/compass-icons/components/eye-outline';
import type { IconSize } from '@/components/Icon/Icon';
import Icon from '@/components/Icon/Icon';
import {
  hasFieldMessage,
  isFieldInvalid,
  mergeFieldDescribedBy,
} from '@/components/field/fieldDescribedBy';
import FieldMessage from '@/components/FieldMessage/FieldMessage';
import type { FieldMessageTone } from '@/components/FieldMessage/FieldMessage';
import type { BuiltInButtonProps } from '@/utils/props';
import { mergeClassNames } from '@/utils/props';
import { toKebab } from '@/utils/string';
import styles from './PasswordInput.module.scss';

export type PasswordInputSize = 'small' | 'medium' | 'large';

/** Matches Text Input / FieldClearButton trailing chrome per size. */
const ICON_SIZE_MAP: Record<PasswordInputSize, IconSize> = {
  small: '12',
  medium: '16',
  large: '16',
};

export interface PasswordInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type'
> {
  /** Optional CSS class name. */
  className?: string;
  /** When true, shows invalid/error styling. */
  invalid?: boolean;
  /** Floating label. Floats above the border when focused or filled. */
  label?: ReactNode;
  /** Size variant. Default: Medium. */
  size?: PasswordInputSize;
  /**
   * Field message under the field. Accepts translated nodes (e.g. `<FormattedMessage/>`).
   * Defaults to error tone (invalid chrome) when set without `messageTone`.
   */
  message?: ReactNode;
  /** Visual tone for `message`. Default: `error` when `message` is set. */
  messageTone?: FieldMessageTone;
  /**
   * Accessible name for the reveal toggle when the password is hidden.
   * Default: `"Show password"`.
   */
  showPasswordLabel?: string;
  /**
   * Accessible name for the reveal toggle when the password is visible.
   * Default: `"Hide password"`.
   */
  hidePasswordLabel?: string;
  /**
   * Whether to render the show/hide toggle. Default: `true`. Set `false` for
   * secrets that should stay masked with no reveal affordance (for example
   * System Console API keys). The input stays `type="password"`, and
   * `revealed` / `defaultRevealed` / `onRevealedChange` are ignored.
   */
  revealToggle?: boolean;
  /** Extra attributes for the reveal toggle (e.g. `data-testid`). */
  revealButtonProps?: BuiltInButtonProps;
  /**
   * Controlled reveal state. Omit for uncontrolled (use `defaultRevealed`).
   */
  revealed?: boolean;
  /** Uncontrolled initial reveal state. Default: `false`. */
  defaultRevealed?: boolean;
  /** Called when the reveal toggle changes visibility. */
  onRevealedChange?: (revealed: boolean) => void;
}

/**
 * Password Inputs are the dedicated field for secrets — login, signup, invite
 * passwords. They look like a text input with a built-in show/hide toggle so the
 * affordance is obvious, the same way Search Input always ships a magnifier.
 */
const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    {
      className = '',
      size = 'medium',
      label,
      invalid = false,
      message,
      messageTone,
      showPasswordLabel = 'Show password',
      hidePasswordLabel = 'Hide password',
      revealButtonProps,
      revealToggle = true,
      revealed: revealedProp,
      defaultRevealed = false,
      onRevealedChange,
      id: idProp,
      value: valueProp,
      defaultValue,
      placeholder,
      onFocus,
      onBlur,
      onChange,
      disabled,
      'aria-describedby': describedBy,
      ...rest
    },
    ref,
  ) {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const inputRef = useRef<HTMLInputElement | null>(null);

    const isValueControlled = valueProp !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState(
      defaultValue ?? '',
    );
    const value = isValueControlled ? (valueProp as string) : uncontrolledValue;
    const hasValue = value != null && value !== '';

    const isRevealControlled = revealedProp !== undefined;
    const [uncontrolledRevealed, setUncontrolledRevealed] =
      useState(defaultRevealed);
    const revealed = isRevealControlled ? revealedProp : uncontrolledRevealed;
    const visible = revealToggle && revealed && !disabled;

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
        if (!isValueControlled) setUncontrolledValue(e.target.value);
        onChange?.(e);
      },
      [isValueControlled, onChange],
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

    const toggleRevealed = useCallback(() => {
      const next = !revealed;
      if (!isRevealControlled) setUncontrolledRevealed(next);
      onRevealedChange?.(next);
    }, [isRevealControlled, onRevealedChange, revealed]);

    const {
      className: revealClassName,
      onClick: revealOnClick,
      onMouseDown: revealOnMouseDown,
      ...revealRest
    } = revealButtonProps ?? {};

    const showInvalid = isFieldInvalid(invalid, message, messageTone);
    const showMessage = hasFieldMessage(message);
    const sizeClass = styles[`password-input--size-${toKebab(size)}`];
    const invalidClass = showInvalid ? styles['password-input--invalid'] : '';
    const labelFloatedClass =
      label != null && labelFloated
        ? styles['password-input--label-floated']
        : '';
    const iconSize = ICON_SIZE_MAP[size];

    const rootClass = [
      styles['password-input'],
      sizeClass,
      invalidClass,
      labelFloatedClass,
      revealToggle ? styles['password-input--has-trailing-icon'] : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const messageId = showMessage ? `${id}-message` : undefined;
    const resolvedTone = messageTone ?? 'error';

    return (
      <div className={rootClass}>
        <div className={styles['password-input__wrapper']}>
          {label != null && (
            <label className={styles['password-input__label']} htmlFor={id}>
              {label}
            </label>
          )}
          <div className={styles['password-input__inner']}>
            <input
              ref={setInputRef}
              id={id}
              type={visible ? 'text' : 'password'}
              className={styles['password-input__input']}
              value={isValueControlled ? valueProp : undefined}
              defaultValue={isValueControlled ? undefined : defaultValue}
              placeholder={placeholder}
              disabled={disabled}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              aria-invalid={showInvalid ? true : undefined}
              aria-describedby={mergeFieldDescribedBy(
                describedBy,
                messageId,
                undefined,
              )}
              {...rest}
            />
            {revealToggle && (
              <span className={styles['password-input__trailing-icon']}>
                <button
                  {...revealRest}
                  type="button"
                  className={mergeClassNames(
                    styles['password-input__reveal'],
                    revealClassName,
                  )}
                  aria-label={visible ? hidePasswordLabel : showPasswordLabel}
                  disabled={disabled}
                  onClick={(e) => {
                    revealOnClick?.(e);
                    if (e.defaultPrevented) return;
                    toggleRevealed();
                  }}
                  onMouseDown={(e) => {
                    // Keep focus in the field when pressing the toggle.
                    e.preventDefault();
                    revealOnMouseDown?.(e);
                  }}
                >
                  <Icon
                    size={iconSize}
                    glyph={visible ? <EyeOffOutlineIcon /> : <EyeOutlineIcon />}
                  />
                </button>
              </span>
            )}
          </div>
        </div>
        {showMessage && (
          <FieldMessage id={messageId} message={message} tone={resolvedTone} />
        )}
      </div>
    );
  },
);

export default PasswordInput;
