import { useEffect, useRef, useState } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import styles from './ReactionButton.module.scss';

export interface ReactionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The emoji character to display. */
  emoji: string;
  /** Number of users who reacted with this emoji. */
  count: number;
  /** Whether the current user has reacted with this emoji. */
  byCurrentUser?: boolean;
}

/**
 * A single emoji reaction button — shows the emoji, count, and highlights when the current user
 * has reacted. Fires onClick when clicked; the host owns toggle logic.
 *
 * The count animates up or down when the `count` prop changes.
 */
export default function ReactionButton({
  emoji,
  count,
  byCurrentUser = false,
  className = '',
  onClick,
  ...rest
}: ReactionButtonProps) {
  const prevCountRef = useRef(count);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const [countAnim, setCountAnim] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (count !== prevCountRef.current) {
      clearTimeout(timerRef.current);
      setCountAnim(count > prevCountRef.current ? 'up' : 'down');
      prevCountRef.current = count;
      timerRef.current = setTimeout(() => setCountAnim(null), 300);
    }
    return () => clearTimeout(timerRef.current);
  }, [count]);

  const rootClass = [
    styles['reaction-button'],
    byCurrentUser ? styles['reaction-button--mine'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const countClass = [
    styles['reaction-button__count'],
    countAnim === 'up' ? styles['reaction-button__count--anim-up'] : '',
    countAnim === 'down' ? styles['reaction-button__count--anim-down'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={rootClass}
      onClick={onClick}
      aria-label={`${emoji} ${count} reaction${count !== 1 ? 's' : ''}`}
      aria-pressed={byCurrentUser}
      {...rest}
    >
      <span className={styles['reaction-button__emoji']} aria-hidden>
        {emoji}
      </span>
      <span className={countClass}>{count}</span>
    </button>
  );
}
