import { Fragment, useState } from 'react';
import { MessageSeparator } from '@mattermost/compass-ui/components/message-separator';
import { Scrollbar } from '@mattermost/compass-ui/components/scrollbar';
import {
  type MobileTabBarTab,
  MobileMentions,
  MobileMessage,
  MobileTabBar,
  mobileMessageStyles,
} from '@mattermost/compass-proto';
import DeviceFrame from '@/components/layout/DeviceFrame';
import { mobileMentionCount } from '@/fixtures/mobilePatternFixtures';
import {
  mobileMentionPosts,
  mobileProfile,
} from '@/fixtures/mobileLayoutFixtures';
import styles from './mobile-mentions.specimen.module.scss';

const bodyTextClass = mobileMessageStyles['mobile-message__body-text'];

export default function MobileMentionsLibrary() {
  const [activeTab, setActiveTab] = useState<MobileTabBarTab>('mentions');

  return (
    <div className={styles['mobile-mentions-layout']}>
      <DeviceFrame insetContent={false} statusBarStyle="light">
        <div className={styles['mobile-mentions-layout__shell']}>
          <MobileMentions>
            <Scrollbar>
              <div className={styles['mobile-mentions-layout__list']}>
                {mobileMentionPosts.map((post, i) => (
                  <Fragment key={post.id}>
                    {post.day &&
                      post.day !== mobileMentionPosts[i - 1]?.day && (
                        <MessageSeparator type="date" label={post.day} />
                      )}
                    <MobileMessage
                      avatarSrc={post.avatarSrc}
                      avatarAlt={post.username}
                      username={post.username}
                      timestamp={post.time}
                      isBot={post.isBot}
                      channelName={post.channelName}
                      teamName={post.teamName}
                    >
                      <p className={bodyTextClass}>{post.text}</p>
                    </MobileMessage>
                  </Fragment>
                ))}
              </div>
            </Scrollbar>
          </MobileMentions>
          <MobileTabBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            profileSrc={mobileProfile.avatarSrc}
            profileAlt={mobileProfile.displayName}
            mentionsBadge={mobileMentionCount}
          />
        </div>
      </DeviceFrame>
    </div>
  );
}
