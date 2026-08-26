import type { HTMLAttributes, MouseEvent, ReactNode } from 'react';
import CloseCircleIcon from '@mattermost/compass-icons/components/close-circle';
import Icon from '@/components/Icon/Icon';
import type { IconSize } from '@/components/Icon/Icon';
import UserAvatar from '@/components/UserAvatar/UserAvatar';
import type { UserAvatarSize } from '@/components/UserAvatar/UserAvatar';
import { toKebab } from '@/utils/string';
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
  /** When provided, shows the remove (×) button and calls this on click. */
  onRemove?: (e: MouseEvent<HTMLButtonElement>) => void;
  /** Accessible label for the remove button. Default: "Remove". */
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

export default function Chip({
  children,
  size = 'medium',
  leadingIcon,
  leadingAvatar,
  onRemove,
  removeLabel = 'Remove',
  error = false,
  colored = false,
  className = '',
  ...rest
}: ChipProps) {
  const iconSize = ICON_SIZE_MAP[size];
  const avatarSize = AVATAR_SIZE_MAP[size];

  const rootClass = [
    styles.chip,
    styles[`chip--size-${toKebab(size)}`],
    error && styles['chip--error'],
    colored && styles['chip--colored'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClass} {...rest}>
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
          onClick={onRemove}
          aria-label={removeLabel}
        >
          <CloseCircleIcon size={Number(iconSize)} aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
