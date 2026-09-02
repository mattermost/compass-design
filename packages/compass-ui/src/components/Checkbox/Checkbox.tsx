import type { InputHTMLAttributes } from 'react';
import { useRef, useEffect, useId } from 'react';
import { useControllable } from '@/hooks/useControllable';
import Icon from '@/components/Icon/Icon';
import type { IconSize } from '@/components/Icon/Icon';
import type { ElementType } from 'react';
import CheckIcon from '@mattermost/compass-icons/components/check';
import MinusIcon from '@mattermost/compass-icons/components/minus';
import { toKebab } from '@/utils/string';
import styles from './Checkbox.module.scss';

export type CheckboxSize = 'small' | 'medium' | 'large';

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type'
> {
  /** Optional CSS class name. */
  className?: string;
  /** When true, shows indeterminate (minus) state. Syncs to native input.indeterminate. */
  indeterminate?: boolean;
  /** Size variant. Figma: Small (12px), Medium (16px), Large (20px). Default: Medium. */
  size?: CheckboxSize;
  /** When true, uses error/destructive styling (red fill when checked). */
  invalid?: boolean;
  /** Label content. Rendered next to the checkbox. */
  children?: React.ReactNode;
}

/** Icon size from design system scale for each checkbox size (fits inside box). */
const CHECKBOX_ICON_SIZE: Record<CheckboxSize, IconSize> = {
  small: '10',
  medium: '12',
  large: '16',
};

/** Compass icon component per checked/indeterminate state. */
const ICON_COMPONENT: Record<'check' | 'minus', ElementType> = {
  check: CheckIcon,
  minus: MinusIcon,
};

/**
 * A Checkbox lets people pick any number of options from a set, or toggle a single setting
 * on or off. Each box represents one independent choice — pick none, some, or all.
 */
export default function Checkbox({
  className = '',
  indeterminate = false,
  size = 'medium',
  invalid = false,
  children,
  id: idProp,
  checked,
  defaultChecked,
  disabled,
  onChange,
  ...rest
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const [resolvedChecked, handleChange] = useControllable(
    checked,
    defaultChecked,
    onChange,
  );

  const showingIcon = indeterminate
    ? 'minus'
    : resolvedChecked
      ? 'check'
      : null;

  useEffect(() => {
    const input = inputRef.current;
    if (input) input.indeterminate = indeterminate;
  }, [indeterminate]);

  const sizeClass = styles[`checkbox--size-${toKebab(size)}`];
  const invalidClass = invalid ? styles['checkbox--invalid'] : '';
  const indeterminateClass = indeterminate
    ? styles['checkbox--indeterminate']
    : '';

  const rootClass = [
    styles.checkbox,
    sizeClass,
    invalidClass,
    indeterminateClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const iconSize = CHECKBOX_ICON_SIZE[size];

  return (
    <label className={rootClass} htmlFor={id}>
      <input
        ref={inputRef}
        id={id}
        type="checkbox"
        className={styles['checkbox__input']}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        aria-invalid={invalid ? true : undefined}
        onChange={handleChange}
        {...rest}
        {...(indeterminate ? { 'aria-checked': 'mixed' as const } : {})}
      />
      <span className={styles['checkbox__box']}>
        {showingIcon !== null &&
          (() => {
            const IconComponent = ICON_COMPONENT[showingIcon];
            return (
              <span key={showingIcon} className={styles['checkbox__icon']}>
                <Icon glyph={<IconComponent />} size={iconSize} />
              </span>
            );
          })()}
      </span>
      {children != null && (
        <span className={styles['checkbox__label']}>{children}</span>
      )}
    </label>
  );
}
