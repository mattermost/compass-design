import { useContext, type HTMLAttributes, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import CloseCircleIcon from '@mattermost/compass-icons/components/close-circle';
import Icon from '@/components/Icon/Icon';
import type { IconSize } from '@/components/Icon/Icon';
import UserAvatar from '@/components/UserAvatar/UserAvatar';
import type { UserAvatarSize } from '@/components/UserAvatar/UserAvatar';
import { toKebab } from '@/utils/string';
import { activateChip, ChipGroupContext } from './ChipGroup';
import styles from './Chip.module.scss';

export type ChipSize = 'small' | 'medium' | 'medium-compact' | 'large';

export interface ChipProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  /** Chip label. */
  children: ReactNode;
  /** Visual size. Default: Medium. */
  size?: ChipSize;
  /** Leading icon from @mattermost/compass-icons. */
  leadingIcon?: ReactNode;
  /** Leading avatar. Overrides leadingIcon when both are provided. */
  leadingAvatar?: { src: string; alt: string };
  /** When provided, shows the remove (×) control and calls this on click. */
  onRemove?: (e: MouseEvent<HTMLButtonElement>) => void;
  /**
   * Accessible name for a standalone remove control. Inside a ChipGroup (and
   * on any removable chip) the chip itself is named and the × is mouse-only.
   */
  removeLabel?: string;
  /** Shows an error border. */
  error?: boolean;
  /** Adds a colored background overlay. */
  colored?: boolean;
  className?: string;
}

const ICON_SIZE_MAP: Record<ChipSize, IconSize> = {
  small: '10',
  medium: '12',
  'medium-compact': '12',
  large: '16',
};

const AVATAR_SIZE_MAP: Record<ChipSize, UserAvatarSize> = {
  small: '12',
  medium: '16',
  'medium-compact': '16',
  large: '20',
};

function labelTextFromChildren(children: ReactNode): string {
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children).trim();
  }
  if (Array.isArray(children)) {
    return children.map(labelTextFromChildren).filter(Boolean).join(' ');
  }
  return '';
}

function focusTargetAfterRemove(chipEl: HTMLElement): HTMLElement | null {
  const scan = (
    start: Element | null,
    direction: 'next' | 'previous',
  ): HTMLElement | null => {
    let el: Element | null = start;
    while (el) {
      if (el instanceof HTMLElement && el.dataset.chip != null) {
        return el;
      }
      if (
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement
      ) {
        return el;
      }
      el =
        direction === 'next' ? el.nextElementSibling : el.previousElementSibling;
    }
    return null;
  };

  const parent = chipEl.parentElement;
  const afterGroup = parent?.nextElementSibling;
  const groupSiblingInput =
    afterGroup instanceof HTMLInputElement ||
    afterGroup instanceof HTMLTextAreaElement
      ? afterGroup
      : null;

  return (
    scan(chipEl.nextElementSibling, 'next') ??
    scan(chipEl.previousElementSibling, 'previous') ??
    groupSiblingInput ??
    parent?.querySelector('input, textarea') ??
    parent?.parentElement?.querySelector('input, textarea') ??
    null
  );
}

/**
 * Chips are compact, self-contained tokens that represent a selection — a person added to an
 * invite, a filter applied to a search, a chosen value in a tokenizing input. Each Chip
 * stands on its own and is removable or selectable, depending on context.
 */
export default function Chip({
  children,
  size = 'medium',
  leadingIcon,
  leadingAvatar,
  onRemove,
  removeLabel: _removeLabel,
  error = false,
  colored = false,
  className = '',
  ...rest
}: ChipProps) {
  const grouped = useContext(ChipGroupContext);
  const iconSize = ICON_SIZE_MAP[size];
  const avatarSize = AVATAR_SIZE_MAP[size];
  const labelText = labelTextFromChildren(children);
  const groupedAriaLabel =
    rest['aria-label'] ??
    (onRemove != null && labelText !== ''
      ? `${labelText}. Press Delete to remove.`
      : labelText !== ''
        ? labelText
        : undefined);
  const removable = onRemove != null;

  const handleRemove = (e: MouseEvent<HTMLButtonElement>) => {
    const chipEl = e.currentTarget.closest('[data-chip]');
    const nextFocus =
      chipEl instanceof HTMLElement ? focusTargetAfterRemove(chipEl) : null;
    const removeButton = e.currentTarget;
    onRemove?.(e);
    window.setTimeout(() => {
      if (removeButton.isConnected || nextFocus == null) return;
      if (!nextFocus.isConnected) return;
      if (nextFocus.dataset.chip != null) {
        activateChip(nextFocus);
      } else {
        nextFocus.focus({ focusVisible: true } as FocusOptions);
      }
    }, 0);
  };

  const rootClass = [
    styles.chip,
    styles[`chip--size-${toKebab(size)}`],
    error && styles['chip--error'],
    colored && styles['chip--colored'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    rest.onKeyDown?.(e);
    if (grouped || !removable || e.defaultPrevented) return;
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      e.currentTarget
        .querySelector<HTMLButtonElement>('[data-chip-remove]')
        ?.click();
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
    }
  };

  return (
    <div
      className={rootClass}
      {...rest}
      role={removable ? 'button' : rest.role}
      tabIndex={removable ? (grouped ? -1 : 0) : rest.tabIndex}
      aria-label={removable ? groupedAriaLabel : rest['aria-label']}
      data-chip=""
      onKeyDown={handleKeyDown}
    >
      {leadingAvatar != null ? (
        <span className={styles['chip__avatar-slot']}>
          <UserAvatar
            src={leadingAvatar.src}
            alt={leadingAvatar.alt}
            size={avatarSize}
          />
        </span>
      ) : leadingIcon != null ? (
        <span className={styles['chip__icon-slot']} aria-hidden>
          <Icon glyph={leadingIcon} size={iconSize} />
        </span>
      ) : null}
      <span className={styles['chip__label']}>{children}</span>
      {onRemove != null ? (
        <button
          type="button"
          className={styles['chip__remove']}
          data-chip-remove=""
          tabIndex={-1}
          aria-hidden
          onMouseDown={(e) => {
            e.preventDefault();
          }}
          onClick={handleRemove}
        >
          <CloseCircleIcon size={Number(iconSize)} aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
