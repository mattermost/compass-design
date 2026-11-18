import { MobileChannelsSidebar } from '@mattermost/compass-proto';
import {
  sidebarDemoModel,
  sidebarDemoTeam,
} from '@/fixtures/workspaceSidebarDemo';
import styles from './mobile-channel-sidebar.specimen.module.scss';

const model = sidebarDemoModel(true);

/** The workspace's channels on a phone, with the Unreads group on. */
export default function MobileChannelsSidebarLibrary() {
  return (
    <div className={styles['mcs-specimen']}>
      <div className={styles['mcs-specimen__frame']}>
        <MobileChannelsSidebar teamName={sidebarDemoTeam.name} model={model} />
      </div>
    </div>
  );
}
