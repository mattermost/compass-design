import { useState } from 'react';
import { Scrollbar } from '@mattermost/compass-ui/components/scrollbar';
import {
  MobileMessage,
  type MobileTabBarTab,
  MobileSavedMessages,
  MobileTabBar,
  mobileMessageStyles,
} from '@mattermost/compass-proto';
import DeviceFrame from '@/components/layout/DeviceFrame';
import {
  mobileProfile,
  mobileSavedPosts,
} from '@/fixtures/mobileLayoutFixtures';
import styles from './mobile-saved.specimen.module.scss';

const bodyTextClass = mobileMessageStyles['mobile-message__body-text'];

export default function MobileSavedLibrary() {
  const [activeTab, setActiveTab] = useState<MobileTabBarTab>('saved');

  return (
    <div className={styles['mobile-saved-layout']}>
      <DeviceFrame insetContent={false} statusBarStyle="light">
        <div className={styles['mobile-saved-layout__shell']}>
          <MobileSavedMessages>
            <Scrollbar>
              <div className={styles['mobile-saved-layout__list']}>
                {mobileSavedPosts.map((post) => (
                  <MobileMessage
                    key={post.id}
                    avatarSrc={post.avatarSrc}
                    avatarAlt={post.username}
                    username={post.username}
                    timestamp={
                      post.day ? `${post.day} at ${post.time}` : post.time
                    }
                    isBot={post.isBot}
                    channelName={post.channelName}
                    teamName={post.teamName}
                  >
                    <p className={bodyTextClass}>{post.text}</p>
                  </MobileMessage>
                ))}
              </div>
            </Scrollbar>
          </MobileSavedMessages>
          <MobileTabBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            profileSrc={mobileProfile.avatarSrc}
            profileAlt={mobileProfile.displayName}
          />
        </div>
      </DeviceFrame>
    </div>
  );
}
