import { useState } from 'react';
import {
  MobileChannelsSidebar,
  type MobileTabBarTab,
  MobileHome,
  MobileTabBar,
  MobileTeamSidebar,
} from '@mattermost/compass-proto';
import DeviceFrame from '@/components/layout/DeviceFrame';
import {
  mobileHomeFirstTeamId,
  mobileHomeModel,
  mobileHomeTeamName,
  mobileHomeTeams,
} from '@/fixtures/mobileHomeFixtures';
import { mobileMentionCount } from '@/fixtures/mobilePatternFixtures';
import { personaHeaderProps } from '@/fixtures/workspacePersona';
import styles from './mobile-home.specimen.module.scss';

/** The workspace's teams and channels on a phone; picking a team shows its channels. */
export default function MobileHomeLibrary() {
  const [activeTeamId, setActiveTeamId] = useState(mobileHomeFirstTeamId);
  const [activeTab, setActiveTab] = useState<MobileTabBarTab>('home');

  return (
    <div className={styles['mobile-home-layout']}>
      <DeviceFrame insetContent={false} statusBarStyle="light">
        <MobileHome
          teamSidebar={
            <MobileTeamSidebar
              activeTeamId={activeTeamId}
              onSelectTeam={setActiveTeamId}
              teams={mobileHomeTeams}
            />
          }
          channelsSidebar={
            <MobileChannelsSidebar
              key={activeTeamId}
              teamName={mobileHomeTeamName(activeTeamId)}
              subtitle="Community"
              model={mobileHomeModel(activeTeamId)}
            />
          }
          tabBar={
            <MobileTabBar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              profileSrc={personaHeaderProps.userAvatarSrc}
              profileAlt={personaHeaderProps.userAvatarAlt}
              mentionsBadge={mobileMentionCount}
            />
          }
        />
      </DeviceFrame>
    </div>
  );
}
