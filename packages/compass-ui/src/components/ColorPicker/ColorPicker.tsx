import type { HTMLAttributes, ReactNode } from 'react';
import { forwardRef, useId, useState } from 'react';
import CheckIcon from '@mattermost/compass-icons/components/check';
import Icon from '@/components/Icon/Icon';
import TextInput from '@/components/TextInput/TextInput';
import { mergeClassNames } from '@/utils/props';
import { toKebab } from '@/utils/string';
import { contrastingTone, normalizeHex } from './colorUtils';
import { COLOR_PICKER_DEFAULT_COLORS } from './palette';
import type { ColorPickerOption } from './palette';
import styles from './ColorPicker.module.scss';

export type { ColorPickerOption } from './palette';
export { COLOR_PICKER_DEFAULT_COLORS } from './palette';

export type ColorPickerSize = 'small' | 'medium' | 'large';

export interface ColorPickerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  /** Swatches to offer. Default: {@link COLOR_PICKER_DEFAULT_COLORS}. */
  colors?: ColorPickerOption[];
  /** Selected hex color (controlled). May be a custom color that is not in `colors`. */
  value?: string;
  /** Initial hex color when uncontrolled. */
  defaultValue?: string;
  /** Called with the normalized hex color (`#RRGGBB`, or the option's own `value`). */
  onChange?: (value: string) => void;
  /** Swatch size. Default: `medium`. */
  size?: ColorPickerSize;
  /** Disables every swatch and the hex input. */
  disabled?: boolean;
  /** Shows a hex input after the swatches for colors outside the palette. Default: false. */
  showHexInput?: boolean;
  /** Label of the hex input. Default: "Hex color". */
  hexInputLabel?: ReactNode;
  /** Message under the hex input for an invalid value. */
  invalidHexMessage?: ReactNode;
  /** Name for the radios' form field. Default: generated. */
  name?: string;
  className?: string;
}

function sameColor(a: string | undefined, b: string): boolean {
  if (a == null) return false;
  const na = normalizeHex(a);
  return na != null && na === normalizeHex(b);
}

/**
 * A ColorPicker lets someone choose one color from a short, fixed palette, with an optional
 * hex field for a color outside it. Use it where a person labels or themes something: a
 * channel label color, a board option color, an accent.
 */
const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(
  function ColorPicker(
    {
      colors = COLOR_PICKER_DEFAULT_COLORS,
      value,
      defaultValue,
      onChange,
      size = 'medium',
      disabled = false,
      showHexInput = false,
      hexInputLabel = 'Hex color',
      invalidHexMessage = 'Enter a valid hex color, like #1C58D9',
      name: nameProp,
      className,
      ...rest
    },
    ref,
  ) {
    const generatedName = useId();
    const name = nameProp ?? generatedName;
    const isControlled = value !== undefined;
    const [inner, setInner] = useState(defaultValue);
    const current = isControlled ? value : inner;
    /** Hex field text while editing; `null` mirrors the current value. */
    const [draft, setDraft] = useState<string | null>(null);
    const [hexError, setHexError] = useState(false);

    const commit = (next: string) => {
      if (!isControlled) setInner(next);
      onChange?.(next);
    };

    const normalizedCurrent = current != null ? normalizeHex(current) : null;
    const hexText = draft ?? normalizedCurrent ?? current ?? '';

    return (
      <div
        {...rest}
        ref={ref}
        role="radiogroup"
        aria-disabled={disabled || undefined}
        className={mergeClassNames(
          styles['color-picker'],
          styles[`color-picker--size-${toKebab(size)}`],
          className,
        )}
      >
        <div className={styles['color-picker__swatches']}>
          {colors.map((option) => {
            const checked = sameColor(current, option.value);
            const hex = normalizeHex(option.value) ?? option.value;
            return (
              <label
                key={option.value}
                className={mergeClassNames(
                  styles['color-picker__swatch'],
                  styles[
                    `color-picker__swatch--tone-${contrastingTone(option.value)}`
                  ],
                )}
                style={{ '--color-picker-swatch': hex } as React.CSSProperties}
                title={option.label}
              >
                <input
                  type="radio"
                  className={styles['color-picker__input']}
                  name={name}
                  value={option.value}
                  checked={checked}
                  disabled={disabled || option.disabled}
                  aria-label={option.label}
                  onChange={() => {
                    setDraft(null);
                    setHexError(false);
                    commit(option.value);
                  }}
                />
                <span className={styles['color-picker__chip']} aria-hidden>
                  {checked && (
                    <Icon
                      glyph={<CheckIcon />}
                      size="16"
                      className={styles['color-picker__check']}
                    />
                  )}
                </span>
              </label>
            );
          })}
        </div>
        {showHexInput && (
          <div className={styles['color-picker__hex']}>
            <TextInput
              label={hexInputLabel}
              value={hexText}
              disabled={disabled}
              maxLength={7}
              spellCheck={false}
              autoComplete="off"
              invalid={hexError}
              message={hexError ? invalidHexMessage : undefined}
              onChange={(e) => {
                const text = e.target.value;
                setDraft(text);
                setHexError(false);
                // 6 digits commit as typed; 3-digit shorthand waits for blur so
                // it doesn't expand under a user still typing a 6-digit color.
                if (/^#?[0-9a-f]{6}$/i.test(text.trim())) {
                  commit(normalizeHex(text)!);
                }
              }}
              onBlur={() => {
                if (draft == null) return;
                const normalized = normalizeHex(draft);
                if (draft.trim() === '') {
                  setDraft(null);
                } else if (normalized) {
                  if (!sameColor(current, normalized)) commit(normalized);
                  setDraft(null);
                } else {
                  setHexError(true);
                }
              }}
            />
          </div>
        )}
      </div>
    );
  },
);

ColorPicker.displayName = 'ColorPicker';

export default ColorPicker;
