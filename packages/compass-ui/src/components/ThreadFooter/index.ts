export { default as ThreadFooter } from './ThreadFooter';
export type { ThreadFooterProps } from './ThreadFooter';
export type { UserAvatarGroupItem } from '../UserAvatarGroup/UserAvatarGroup';

/** @deprecated Use `UserAvatarGroupItem` (`key`, `name`, optional `src`). */
export interface AvatarData {
  src: string;
  alt: string;
}
