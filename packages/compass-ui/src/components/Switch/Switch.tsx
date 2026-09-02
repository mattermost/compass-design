import type { InputHTMLAttributes } from 'react';
import { useId } from 'react';
import { useControllable } from '@/hooks/useControllable';
import { toKebab } from '@/utils/string';
import styles from './Switch.module.scss';

export type SwitchSize = 'small' | 'medium' | 'large';

export interface SwitchProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type'
> {
  /** Optional CSS class name. */
  className?: string;
  /** Size variant. Figma: Small (16px), Medium (20px), Large (24px). Default: Medium. */
  size?: SwitchSize;
  /** Primary label content. Rendered to the left of the switch. */
  children?: React.ReactNode;
  /** Optional secondary label (e.g. description) below the primary label. */
  secondaryLabel?: React.ReactNode;
  /** When true, primary label uses semi-bold (600) weight. Default: false. */
  semiBold?: boolean;
}

/**
 * A Switch is a real-world toggle: flip it, and the change happens. Use it for binary
 * settings that take effect immediately and don't need a separate "Save" step.
 */
export default function Switch({
  className = '',
  size = 'medium',
  children,
  secondaryLabel,
  semiBold = false,
  id: idProp,
  checked,
  defaultChecked,
  disabled,
  onChange,
  ...rest
}: SwitchProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const [resolvedChecked, handleChange] = useControllable(
    checked,
    defaultChecked,
    onChange,
  );

  const sizeClass = styles[`switch--size-${toKebab(size)}`];
  const semiBoldClass = semiBold ? styles['switch--semi-bold'] : '';
  const secondaryClass =
    secondaryLabel != null ? styles['switch--with-secondary'] : '';

  const rootClass = [
    styles.switch,
    sizeClass,
    semiBoldClass,
    secondaryClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <label className={rootClass} htmlFor={id}>
      {(children != null || secondaryLabel != null) && (
        <span className={styles['switch__labels']}>
          {children != null && (
            <span className={styles['switch__label']}>{children}</span>
          )}
          {secondaryLabel != null && (
            <span className={styles['switch__secondary-label']}>
              {secondaryLabel}
            </span>
          )}
        </span>
      )}
      <span className={styles['switch__track']}>
        <input
          id={id}
          type="checkbox"
          role="switch"
          className={styles['switch__input']}
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          aria-checked={resolvedChecked}
          onChange={handleChange}
          {...rest}
        />
        <span className={styles['switch__knob']} aria-hidden />
      </span>
    </label>
  );
}
