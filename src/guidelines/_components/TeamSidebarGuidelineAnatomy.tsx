import { TeamSidebar } from '@mattermost/compass-proto';
import AnatomyStage from '@/guidelines/_components/AnatomyStage';
import { teamSidebarTeams } from '@/fixtures/teamSidebarTeams';
import patternsStyles from '@/styles/library-demo/patterns.module.scss';

/**
 * Team Sidebar pattern — anatomy preview on the shared AnatomyStage surface.
 */
export function TeamSidebarAnatomyStage() {
  return (
    <AnatomyStage>
      <div className={patternsStyles['patterns__team-sidebar-demo']}>
        <TeamSidebar
          activeTeamId={teamSidebarTeams[0]?.id}
          teams={teamSidebarTeams}
        />
      </div>
    </AnatomyStage>
  );
}
