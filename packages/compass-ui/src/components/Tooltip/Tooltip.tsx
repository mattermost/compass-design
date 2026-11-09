import type { ReactNode } from 'react';
import Emoji from '@/components/Emoji/Emoji';
import { IconSlotContext } from '@/components/Icon/Icon';
import { ShortcutTagGroup } from '@/components/ShortcutTag/ShortcutTag';
import styles from './Tooltip.module.scss';

export type TooltipArrow = 'top' | 'right' | 'bottom' | 'left';

/** `inline` sits beside the label; `large` stacks above it (e.g. a custom status). */
export type TooltipEmojiSize = 'inline' | 'large';

export interface TooltipShortcutKey {
  label: string;
}

export interface TooltipProps {
  /** Tooltip label. Accepts translated nodes (e.g. `<FormattedMessage/>`). */
  label: ReactNode;
  /** Arrow direction. Default: Right. */
  arrow?: TooltipArrow;
  /** Optional hint text shown below label. */
  hint?: ReactNode;
  /** Optional keyboard shortcut keys shown below label. */
  shortcutKeys?: TooltipShortcutKey[];
  /** Optional leading icon — pass `<Icon glyph={<SomeIcon />} />`; Tooltip provides the correct size via context. */
  icon?: ReactNode;
  /**
   * Optional emoji character. Decorative (`aria-hidden`), so the label must carry the
   * meaning. Replaces `icon` when both are passed.
   */
  emoji?: string;
  /** Emoji placement: `inline` beside the label (12px) or `large` above it (40px). Default: inline. */
  emojiSize?: TooltipEmojiSize;
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
  emoji,
  emojiSize = 'inline',
  className = '',
}: TooltipProps) {
  const arrowClass = styles[`tooltip--arrow-${arrow.toLowerCase()}`] ?? '';

  const rootClass = [styles.tooltip, arrowClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClass}>
      <div className={styles['tooltip__container']}>
        <div
          className={[
            styles['tooltip__content'],
            emoji && emojiSize === 'large'
              ? styles['tooltip__content--emoji-large']
              : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {emoji ? (
            <Emoji emoji={emoji} size={emojiSize === 'large' ? '40' : '12'} />
          ) : (
            icon != null && (
              <span className={styles['tooltip__icon']} aria-hidden>
                <IconSlotContext.Provider value={{ size: '16' }}>
                  {icon}
                </IconSlotContext.Provider>
              </span>
            )
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

        {hint != null && hint !== '' ? (
          <span className={styles['tooltip__hint']}>{hint}</span>
        ) : null}
      </div>

      <div className={styles['tooltip__arrow']} aria-hidden />
    </div>
  );
}
