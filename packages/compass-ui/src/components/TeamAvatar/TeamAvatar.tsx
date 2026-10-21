import MentionBadge from '../MentionBadge/MentionBadge';
import styles from './TeamAvatar.module.scss';

export type TeamAvatarSize =
  | '24'
  | '28'
  | '32'
  | '40'
  | '48'
  | '56'
  | '64'
  | '72'
  | '96'
  | '120';
export type TeamAvatarState = 'default' | 'active';
export type TeamAvatarVariant = 'sidebar' | 'menu';

export interface TeamAvatarProps {
  alt?: string;
  badge?: number;
  className?: string;
  initials?: string;
  size?: TeamAvatarSize;
  src?: string;
  state?: TeamAvatarState;
  /**
   * `sidebar` (default) is interactive and uses sidebar colors. `menu` is decorative and uses
   * center-channel colors — for menu rows and other surfaces on `center-channel-bg`. It has no
   * hover or pointer affordance, is hidden from assistive tech, and ignores `state` and `badge`.
   */
  variant?: TeamAvatarVariant;
}

/**
 * Team Avatars identify a Team in Mattermost. Their rounded-square shape sets them apart
 * from circular User Avatars at a glance — same scanning rhythm, different kind of subject.
 */
export default function TeamAvatar({
  alt = '',
  badge,
  className = '',
  initials = 'Ac',
  size = '40',
  src,
  state = 'default',
  variant = 'sidebar',
}: TeamAvatarProps) {
  const numSize = parseInt(size, 10);
  const isMenu = variant === 'menu';
  const isActive = state === 'active' && !isMenu;
  const showBadge =
    badge != null && badge > 0 && numSize <= 64 && !isActive && !isMenu;

  const rootClasses = [
    styles['team-avatar'],
    styles[`team-avatar--size-${size}`],
    isActive && styles['team-avatar--active'],
    isMenu && styles['team-avatar--menu'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClasses} aria-hidden={isMenu || undefined}>
      <div className={styles['team-avatar__inner']}>
        {src ? (
          <img src={src} alt={alt} className={styles['team-avatar__image']} />
        ) : (
          <div
            className={styles['team-avatar__fallback']}
            aria-label={alt || initials}
          >
            {initials}
          </div>
        )}
      </div>
      {showBadge && (
        <MentionBadge
          count={badge!}
          size="medium"
          className={styles['team-avatar__badge']}
        />
      )}
    </div>
  );
}
