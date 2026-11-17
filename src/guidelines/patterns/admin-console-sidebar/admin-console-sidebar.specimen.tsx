import {
  AdminConsoleSidebar,
  defaultAdminConsoleSidebarGroups,
} from '@mattermost/compass-proto';
import { adminConsoleSidebarUserProps } from '@/fixtures/workspaceAdmin';
import styles from '@/styles/library-demo/patterns.module.scss';

export default function AdminConsoleSidebarLibrary() {
  return (
    <div className={styles['patterns__sidebar-demo']}>
      <div>
        <p className={styles['patterns__variant-label']}>Default</p>
        <AdminConsoleSidebar
          {...adminConsoleSidebarUserProps}
          groups={defaultAdminConsoleSidebarGroups}
        />
      </div>
    </div>
  );
}
