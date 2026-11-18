import {
  getWorkspaceUser,
  workspaceCurrentUserId,
  workspaceUsers,
} from '@mattermost/compass-proto';
import { avatars } from './avatarRegistry';

/**
 * Who is signed in to the Admin Console: the workspace's system administrator
 * (a person whose job title says so), or the signed-in user when it has none.
 */
export const workspaceAdmin =
  workspaceUsers.find(
    (u) => !u.isBot && /system administrator/i.test(u.position ?? ''),
  ) ?? getWorkspaceUser(workspaceCurrentUserId);

/** `AdminConsoleSidebar` props for that user. */
export const adminConsoleSidebarUserProps = {
  userHandle: workspaceAdmin ? `@${workspaceAdmin.username}` : undefined,
  userDisplayName: workspaceAdmin?.displayName,
  avatarSrc: workspaceAdmin ? avatars[workspaceAdmin.id] : undefined,
  avatarAlt: workspaceAdmin?.displayName,
};
