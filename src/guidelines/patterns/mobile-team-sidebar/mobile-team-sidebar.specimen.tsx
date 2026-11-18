import { useState } from 'react';
import { MobileTeamSidebar } from '@mattermost/compass-proto';
import { teamSidebarTeams } from '@/fixtures/teamSidebarTeams';
import styles from './mobile-team-sidebar.specimen.module.scss';

/** The workspace's teams on a phone; tap one to make it the current team. */
export default function MobileTeamSidebarLibrary() {
  const [activeTeamId, setActiveTeamId] = useState(teamSidebarTeams[0]?.id);
  return (
    <div className={styles['mts-specimen']}>
      <div className={styles['mts-specimen__frame']}>
        <MobileTeamSidebar
          activeTeamId={activeTeamId}
          teams={teamSidebarTeams}
          onSelectTeam={setActiveTeamId}
        />
      </div>
    </div>
  );
}
