import type { ReactNode } from 'react';
import styles from './Tag.module.scss';

export type TagType =
  | 'default'
  | 'info'
  | 'info-dim'
  | 'danger'
  | 'success'
  | 'warning';

export type TagSize = 'small' | 'x-small';
export type TagCasing = 'title-case' | 'all-caps';

export type TagProps = {
  /** Tag label text. */
  label: string;
  /** Semantic colour type. Default: Default. */
  type?: TagType;
  /** Size variant. Default: X-Small. */
  size?: TagSize;
  /** Text casing. Default: Title Case. */
  casing?: TagCasing;
  /** Optional leading icon node. */
  leadingIcon?: ReactNode;
  /** Merged onto the root after variant classes (e.g. layout overrides in a parent row). */
  className?: string;
};

const TYPE_CLASS: Record<TagType, string> = {
  default: styles['tag--type-default'],
  info: styles['tag--type-info'],
  'info-dim': styles['tag--type-info-dim'],
  danger: styles['tag--type-danger'],
  success: styles['tag--type-success'],
  warning: styles['tag--type-warning'],
};

/**
 * Tags are compact pills that mark something — a role (_BOT_, _GUEST_), a tier
 * (_PROFESSIONAL_), a status (_NEW_, _BETA_), or a category. They're scannable signal: a way
 * to surface a small piece of metadata without spending a sentence on it.
 */
export default function Tag({
  label,
  type = 'default',
  size = 'x-small',
  casing = 'title-case',
  leadingIcon,
  className = '',
}: TagProps) {
  const classes = [
    styles.tag,
    TYPE_CLASS[type],
    size === 'small'
      ? styles['tag--size-small']
      : styles['tag--size-x-small'],
    casing === 'all-caps' ? styles['tag--casing-all-caps'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes}>
      {leadingIcon && (
        <span className={styles['tag__icon']} aria-hidden>
          {leadingIcon}
        </span>
      )}
      <span className={styles['tag__label']}>{label}</span>
    </span>
  );
}
