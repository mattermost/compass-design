import { forwardRef, useState } from 'react';
import type { ImgHTMLAttributes } from 'react';
import StatusBadge from '@/components/StatusBadge/StatusBadge';
import type {
  StatusBadgeSize,
  StatusBadgeStatus,
} from '@/components/StatusBadge/StatusBadge';
import { toKebab } from '@/utils/string';
import styles from './UserAvatar.module.scss';

/** Figma User Avatar sizes. */
export type UserAvatarSize =
  | '12'
  | '16'
  | '20'
  | '24'
  | '28'
  | '32'
  | '36'
  | '40'
  | '48'
  | '50'
  | '56'
  | '64'
  | '72'
  | '80'
  | '96'
  | '120'
  | '128';

/** Figma User Avatar Fallback colour variants. */
export type UserAvatarFallbackColor =
  | 'red'
  | 'purple'
  | 'neutral'
  | 'charcoal'
  | 'indigo'
  | 'teal'
  | 'blue'
  | 'cyan'
  | 'yellow'
  | 'green'
  | 'orange';

export interface UserAvatarProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'alt' | 'width' | 'height'
> {
  /** Alt text for the avatar image. */
  alt: string;
  /** Optional CSS class name. */
  className?: string;
  /**
   * Image URL for the avatar. When omitted, or when the image fails to load,
   * the avatar renders as Fallback (initials on a deterministic colour
   * background). A failed image sets `data-image-failed="true"` on the root.
   */
  src?: string;
  /**
   * Display name used to derive initials and the fallback colour. Defaults
   * to `alt` when not provided.
   */
  name?: string;
  /** Force a specific fallback colour. Hashed from `name`/`alt` if omitted. */
  fallbackColor?: UserAvatarFallbackColor;
  /** Size variant. Figma: Size. Default: 48. */
  size?: UserAvatarSize;
  /**
   * Status badge shown on the avatar: `online`, `away`, `do-not-disturb` or `offline`.
   * Omit (or `false`) to hide it. `true` is kept for backwards compatibility and
   * means `online`. The badge size follows the avatar `size`.
   */
  status?: boolean | StatusBadgeStatus;
  /** Accessible name for the status badge. Defaults to the status value; pass a translated string. */
  statusLabel?: string;
}

/**
 * Colours picked by the name hash. `charcoal`, `indigo` and `teal` are deliberately not here: adding a
 * colour would change the hashed colour of existing avatars, so it is opt-in via
 * `fallbackColor`.
 */
const FALLBACK_COLORS: readonly UserAvatarFallbackColor[] = [
  'red',
  'purple',
  'neutral',
  'blue',
  'cyan',
  'yellow',
  'green',
  'orange',
];

/** Map UserAvatar size to StatusBadge size (Figma scale). */
const USER_AVATAR_TO_BADGE_SIZE: Record<UserAvatarSize, StatusBadgeSize> = {
  '12': 'xx-small',
  '16': 'xx-small',
  '20': 'x-small',
  '24': 'x-small',
  '28': 'x-small',
  '32': 'small',
  '36': 'small',
  '40': 'small',
  '48': 'small',
  '50': 'small',
  '56': 'medium',
  '64': 'medium',
  '72': 'medium',
  '80': 'medium',
  '96': 'large',
  '120': 'large',
  '128': 'large',
};

function hashFallbackColor(s: string): UserAvatarFallbackColor {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return FALLBACK_COLORS[Math.abs(h) % FALLBACK_COLORS.length];
}

function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '';
  const firstName = trimmed.split(/\s+/)[0]!;
  return firstName[0]!.toUpperCase() + (firstName[1]?.toLowerCase() ?? '');
}

/**
 * User Avatars represent a person — usually their uploaded photo, with initials on a colour
 * background as a fallback. Their circular shape distinguishes them from rounded-square Team
 * Avatars at a glance. `ref` points at the root element, which is present for both the image and
 * the fallback, so it works as a tooltip or popover anchor.
 */
const UserAvatar = forwardRef<HTMLDivElement, UserAvatarProps>(
  function UserAvatar(
    {
      alt,
      className = '',
      src,
      name,
      fallbackColor,
      size = '48',
      status,
      statusLabel,
      onError,
      ...imgProps
    },
    ref,
  ) {
    // The src that failed to load; a new src is tried again.
    const [failedSrc, setFailedSrc] = useState<string>();
    const sizeClass = styles[`user-avatar--size-${toKebab(size)}`];
    const rootClass = [styles['user-avatar'], sizeClass, className]
      .filter(Boolean)
      .join(' ');

    const imageFailed = !!src && src === failedSrc;
    const isFallback = !src || imageFailed;
    const displayName = name ?? alt;
    const initials = isFallback ? getInitials(displayName) : '';
    const color = fallbackColor ?? hashFallbackColor(displayName);
    const fallbackColorClass = isFallback
      ? styles[`user-avatar__fallback--${toKebab(color)}`]
      : '';

    const badgeStatus: StatusBadgeStatus | undefined =
      status === true ? 'online' : status || undefined;
    const badgeSize = USER_AVATAR_TO_BADGE_SIZE[size];

    return (
      <div
        ref={ref}
        className={rootClass}
        data-size={size}
        data-image-failed={imageFailed ? 'true' : undefined}
      >
        {isFallback ? (
          <span
            className={[styles['user-avatar__fallback'], fallbackColorClass]
              .filter(Boolean)
              .join(' ')}
            role="img"
            aria-label={alt}
          >
            {initials}
          </span>
        ) : (
          <img
            loading="lazy"
            {...imgProps}
            onError={(e) => {
              onError?.(e);
              setFailedSrc(src);
            }}
            alt={alt}
            className={styles['user-avatar__image']}
            src={src}
            width={Number(size)}
            height={Number(size)}
          />
        )}
        {badgeStatus && (
          <span className={styles['user-avatar__status']}>
            <StatusBadge
              status={badgeStatus}
              size={badgeSize}
              label={statusLabel}
              className={styles['user-avatar__badge']}
            />
          </span>
        )}
      </div>
    );
  },
);

export default UserAvatar;
