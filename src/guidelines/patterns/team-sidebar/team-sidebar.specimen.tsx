import { useState } from 'react';
import { TeamSidebar } from '@mattermost/compass-proto';
import { workspaceTeams } from '@/fixtures/workspaceTeams';
import styles from '@/styles/library-demo/patterns.module.scss';

/** The workspace's teams; click one to make it the current team. */
export default function TeamSidebarLibrary() {
  const [activeTeamId, setActiveTeamId] = useState(workspaceTeams[0]?.id);
  return (
    <div className={styles['patterns__team-sidebar-demo']}>
      <TeamSidebar
        activeTeamId={activeTeamId}
        teams={workspaceTeams}
        onSelectTeam={setActiveTeamId}
      />
    </div>
  );
}
