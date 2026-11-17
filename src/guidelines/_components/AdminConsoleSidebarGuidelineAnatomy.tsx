import {
  AdminConsoleSidebar,
  defaultAdminConsoleSidebarGroups,
} from '@mattermost/compass-proto';
import { adminConsoleSidebarUserProps } from '@/fixtures/workspaceAdmin';
import AnatomyStage from '@/guidelines/_components/AnatomyStage';
import patternsStyles from '@/styles/library-demo/patterns.module.scss';

/**
 * Admin Console Sidebar pattern — anatomy preview on the shared AnatomyStage surface.
 */
export function AdminConsoleSidebarAnatomyStage() {
  return (
    <AnatomyStage style={{ alignItems: 'stretch' }}>
      <div className={patternsStyles['patterns__team-sidebar-demo']}>
        <AdminConsoleSidebar
          {...adminConsoleSidebarUserProps}
          groups={defaultAdminConsoleSidebarGroups}
        />
      </div>
    </AnatomyStage>
  );
}
