import { TeamSidebar } from '@mattermost/compass-proto';
import AnatomyStage from '@/guidelines/_components/AnatomyStage';
import { workspaceTeams } from '@/fixtures/workspaceTeams';
import patternsStyles from '@/styles/library-demo/patterns.module.scss';

/**
 * Team Sidebar pattern — anatomy preview on the shared AnatomyStage surface.
 */
export function TeamSidebarAnatomyStage() {
  return (
    <AnatomyStage>
      <div className={patternsStyles['patterns__team-sidebar-demo']}>
        <TeamSidebar
          activeTeamId={workspaceTeams[0]?.id}
          teams={workspaceTeams}
        />
      </div>
    </AnatomyStage>
  );
}
