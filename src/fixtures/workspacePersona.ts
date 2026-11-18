import {
  getWorkspaceUser,
  workspaceCurrentUserId,
} from '@mattermost/compass-proto';
import { avatars } from './avatarRegistry';

/** The signed-in user of the sample workspace. */
export const workspacePersona = getWorkspaceUser(workspaceCurrentUserId);

/** `GlobalHeader` props for the signed-in user's avatar. */
export const personaHeaderProps = {
  userAvatarSrc: avatars[workspaceCurrentUserId],
  userAvatarAlt: workspacePersona?.displayName,
};

/**
 * The signed-in user's custom status when the data has one; otherwise an
 * example, since the "with custom status" variant needs something to show.
 */
export const personaCustomStatus = {
  emoji: workspacePersona?.customStatusEmoji ?? '📅',
  text: workspacePersona?.customStatusText ?? 'In a meeting',
};
