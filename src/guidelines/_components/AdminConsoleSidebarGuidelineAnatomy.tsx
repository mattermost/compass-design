import {
  AdminConsoleSidebar,
  defaultAdminConsoleSidebarGroups,
  workspaceCurrentUserId,
  getWorkspaceUser,
} from '@mattermost/compass-proto';
import { avatars } from '@/fixtures/avatarRegistry';
import AnatomyStage from '@/guidelines/_components/AnatomyStage';
import patternsStyles from '@/styles/library-demo/patterns.module.scss';

const me = getWorkspaceUser(workspaceCurrentUserId);

/**
 * Admin Console Sidebar pattern — anatomy preview on the shared AnatomyStage surface.
 */
export function AdminConsoleSidebarAnatomyStage() {
  return (
    <AnatomyStage style={{ alignItems: 'stretch' }}>
      <div className={patternsStyles['patterns__team-sidebar-demo']}>
        <AdminConsoleSidebar
          userHandle={me ? `@${me.username}` : undefined}
          userDisplayName={me?.displayName}
          avatarSrc={avatars[workspaceCurrentUserId]}
          avatarAlt={me?.displayName}
          groups={defaultAdminConsoleSidebarGroups}
        />
      </div>
    </AnatomyStage>
  );
}
