import type { ReactNode } from 'react';
import { ShortcutTagGroup } from '@/components/ShortcutTag/ShortcutTag';
import styles from './Tooltip.module.scss';

export type TooltipArrow = 'top' | 'right' | 'bottom' | 'left';

export interface TooltipShortcutKey {
  label: string;
}

export interface TooltipProps {
  /** Tooltip label text. */
  label: string;
  /** Arrow direction. Default: Right. */
  arrow?: TooltipArrow;
  /** Optional hint text shown below label. */
  hint?: string;
  /** Optional keyboard shortcut keys shown below label. */
  shortcutKeys?: TooltipShortcutKey[];
  /** Optional leading icon node. */
  icon?: ReactNode;
  /** Optional CSS class name. */
  className?: string;
}

/**
 * Tooltips surface short, supporting text on hover. Reach for a tooltip when the affordance
 * behind it isn't fully self-explanatory — an Icon Button, a truncated label, a keyboard
 * shortcut. Don't reach for one when the label is already on screen.
 */
export default function Tooltip({
  label,
  arrow = 'right',
  hint,
  shortcutKeys,
  icon,
  className = '',
}: TooltipProps) {
  const arrowClass = styles[`tooltip--arrow-${arrow.toLowerCase()}`] ?? '';

  const rootClass = [styles.tooltip, arrowClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClass}>
      <div className={styles['tooltip__container']}>
        <div className={styles['tooltip__content']}>
          {icon != null && (
            <span className={styles['tooltip__icon']} aria-hidden>
              {icon}
            </span>
          )}
          <span className={styles['tooltip__label']}>{label}</span>
        </div>

        {shortcutKeys && shortcutKeys.length > 0 && (
          <div className={styles['tooltip__shortcuts']}>
            <ShortcutTagGroup
              labels={shortcutKeys.map((key) => key.label)}
              location="tooltips"
              size="small"
            />
          </div>
        )}

        {hint && <span className={styles['tooltip__hint']}>{hint}</span>}
      </div>

      <div className={styles['tooltip__arrow']} aria-hidden />
    </div>
  );
}
