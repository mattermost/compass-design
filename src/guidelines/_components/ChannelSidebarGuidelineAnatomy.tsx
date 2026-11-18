import { ChannelsSidebar } from '@mattermost/compass-proto';
import AnatomyStage from '@/guidelines/_components/AnatomyStage';
import {
  sidebarDemoModel,
  sidebarDemoTeam,
} from '@/fixtures/workspaceSidebarDemo';
import patternsStyles from '@/styles/library-demo/patterns.module.scss';

/**
 * Channel Sidebar pattern — anatomy preview on the shared AnatomyStage surface.
 */
export function ChannelSidebarAnatomyStage() {
  return (
    <AnatomyStage style={{ alignItems: 'stretch' }}>
      <div className={patternsStyles['patterns__team-sidebar-demo']}>
        <ChannelsSidebar
          showFilter
          teamName={sidebarDemoTeam.name}
          model={sidebarDemoModel(false)}
        />
      </div>
    </AnatomyStage>
  );
}
