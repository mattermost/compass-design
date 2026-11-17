import {
  AdminConsoleSidebar,
  defaultAdminConsoleSidebarGroups,
  workspaceCurrentUserId,
  getWorkspaceUser,
} from '@mattermost/compass-proto';
import { avatars } from '@/fixtures/avatarRegistry';
import styles from '@/styles/library-demo/patterns.module.scss';

const me = getWorkspaceUser(workspaceCurrentUserId);

export default function AdminConsoleSidebarLibrary() {
  return (
    <div className={styles['patterns__sidebar-demo']}>
      <div>
        <p className={styles['patterns__variant-label']}>Default</p>
        <AdminConsoleSidebar
          userHandle={me ? `@${me.username}` : undefined}
          userDisplayName={me?.displayName}
          avatarSrc={avatars[workspaceCurrentUserId]}
          avatarAlt={me?.displayName}
          groups={defaultAdminConsoleSidebarGroups}
        />
      </div>
    </div>
  );
}
