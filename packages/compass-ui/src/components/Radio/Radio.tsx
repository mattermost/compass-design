import type { InputHTMLAttributes } from 'react';
import { useId } from 'react';
import { useControllable } from '@/hooks/useControllable';
import { toKebab } from '@/utils/string';
import styles from './Radio.module.scss';

export type RadioSize = 'small' | 'medium' | 'large';

export interface RadioProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type'
> {
  /** Optional CSS class name. */
  className?: string;
  /** Size variant. Figma: Small (12px), Medium (16px), Large (20px). Default: Medium. */
  size?: RadioSize;
  /** When true, uses error/destructive styling (red when checked). */
  invalid?: boolean;
  /** Label content. Rendered next to the radio. */
  children?: React.ReactNode;
}

/**
 * Radios let people pick exactly one option from a small, mutually exclusive set — a
 * workspace plan, a notification cadence, a default theme. Use a Radio when the choices are
 * few enough to show at once and the user benefits from seeing every option side-by-side.
 */
export default function Radio({
  className = '',
  size = 'medium',
  invalid = false,
  children,
  id: idProp,
  checked,
  defaultChecked,
  disabled,
  onChange,
  name,
  value,
  ...rest
}: RadioProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const [, handleChange] = useControllable(checked, defaultChecked, onChange);

  const sizeClass = styles[`radio--size-${toKebab(size)}`];
  const invalidClass = invalid ? styles['radio--invalid'] : '';

  const rootClass = [styles.radio, sizeClass, invalidClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <label className={rootClass} htmlFor={id}>
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        className={styles['radio__input']}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        aria-invalid={invalid ? true : undefined}
        onChange={handleChange}
        {...rest}
      />
      <span className={styles['radio__circle']}>
        <span className={styles['radio__dot']} aria-hidden />
      </span>
      {children != null && (
        <span className={styles['radio__label']}>{children}</span>
      )}
    </label>
  );
}
