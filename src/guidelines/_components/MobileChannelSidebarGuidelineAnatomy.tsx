import { MobileChannelsSidebar } from '@mattermost/compass-proto';
import AnatomyStage from '@/guidelines/_components/AnatomyStage';
import {
  sidebarDemoModel,
  sidebarDemoTeam,
} from '@/fixtures/workspaceSidebarDemo';
import styles from './MobileChannelSidebarGuidelineAnatomy.module.scss';

/**
 * Mobile Channel Sidebar pattern — anatomy preview on the shared AnatomyStage
 * surface, in a phone-width frame.
 */
export function MobileChannelSidebarAnatomyStage() {
  return (
    <AnatomyStage style={{ justifyContent: 'center' }}>
      <div className={styles['anatomy']}>
        <MobileChannelsSidebar
          teamName={sidebarDemoTeam.name}
          model={sidebarDemoModel(false)}
        />
      </div>
    </AnatomyStage>
  );
}
