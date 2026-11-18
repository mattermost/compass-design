import { ChannelsSidebar } from '@mattermost/compass-proto';
import {
  sidebarDemoModel,
  sidebarDemoTeam,
} from '@/fixtures/workspaceSidebarDemo';
import styles from '@/styles/library-demo/patterns.module.scss';

const defaultModel = sidebarDemoModel(false);
const unreadsModel = sidebarDemoModel(true);

export default function ChannelsSidebarLibrary() {
  return (
    <div className={styles['patterns__sidebar-demo']}>
      <div>
        <p className={styles['patterns__variant-label']}>
          Unreads category Off
        </p>
        <ChannelsSidebar
          showFilter
          teamName={sidebarDemoTeam.name}
          model={defaultModel}
        />
      </div>
      <div>
        <p className={styles['patterns__variant-label']}>Unreads category On</p>
        <ChannelsSidebar teamName={sidebarDemoTeam.name} model={unreadsModel} />
      </div>
    </div>
  );
}
