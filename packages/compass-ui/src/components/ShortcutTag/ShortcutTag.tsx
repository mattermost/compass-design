import styles from './ShortcutTag.module.scss';

export type ShortcutTagSize = 'small' | 'medium' | 'large';
export type ShortcutTagLocation = 'default' | 'tooltips';

export type ShortcutTagProps = {
  /** Key label (e.g. `⌘`, `Shift`, `K`). */
  label: string;
  size?: ShortcutTagSize;
  /** Default for menus and light surfaces; Tooltips for dark overlays. */
  location?: ShortcutTagLocation;
  className?: string;
};

const SIZE_CLASS: Record<ShortcutTagSize, string> = {
  small: styles['shortcut-tag__key--size-small'],
  medium: styles['shortcut-tag__key--size-medium'],
  large: styles['shortcut-tag__key--size-large'],
};

const LOCATION_CLASS: Record<ShortcutTagLocation, string> = {
  default: styles['shortcut-tag__key--location-default'],
  tooltips: styles['shortcut-tag__key--location-tooltips'],
};

/**
 * Keyboard shortcut key chip for menus, tooltips, and popovers.
 *
 * @see Figma Shortcut Tag (Source: xkm54Q9IQcyo3c0pGeNIMH)
 */
export default function ShortcutTag({
  label,
  size = 'small',
  location = 'default',
  className = '',
}: ShortcutTagProps) {
  const rootClass = [
    styles['shortcut-tag__key'],
    SIZE_CLASS[size],
    LOCATION_CLASS[location],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <kbd className={rootClass}>{label}</kbd>;
}

export type ShortcutTagGroupProps = {
  /** Individual key labels (e.g. `['Ctrl', 'K']`). */
  labels: string[];
  size?: ShortcutTagSize;
  location?: ShortcutTagLocation;
  className?: string;
};

/** Inline row of shortcut tags for prose and notice copy. */
export function ShortcutTagGroup({
  labels,
  size = 'small',
  location = 'default',
  className = '',
}: ShortcutTagGroupProps) {
  const groupClass = [styles['shortcut-tag-group'], className]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={groupClass}>
      {labels.map((label, index) => (
        <ShortcutTag
          key={`${label}-${index}`}
          label={label}
          size={size}
          location={location}
        />
      ))}
    </span>
  );
}
