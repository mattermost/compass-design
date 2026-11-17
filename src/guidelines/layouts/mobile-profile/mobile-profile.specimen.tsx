import { useState } from 'react';
import AccountOutlineIcon from '@mattermost/compass-icons/components/account-outline';
import CheckCircleIcon from '@mattermost/compass-icons/components/check-circle';
import CogOutlineIcon from '@mattermost/compass-icons/components/cog-outline';
import EmoticonHappyOutlineIcon from '@mattermost/compass-icons/components/emoticon-happy-outline';
import ExitToAppIcon from '@mattermost/compass-icons/components/exit-to-app';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { Scrollbar } from '@mattermost/compass-ui/components/scrollbar';
import {
  type MobileTabBarTab,
  MobileMenuItem,
  MobileProfile,
  MobileTabBar,
} from '@mattermost/compass-proto';
import DeviceFrame from '@/components/layout/DeviceFrame';
import { mobileProfile } from '@/fixtures/mobileLayoutFixtures';
import styles from './mobile-profile.specimen.module.scss';

export default function MobileProfileLibrary() {
  const [activeTab, setActiveTab] = useState<MobileTabBarTab>('profile');

  return (
    <div className={styles['mobile-profile-layout']}>
      <DeviceFrame insetContent={false} statusBarStyle="light">
        <div className={styles['mobile-profile-layout__shell']}>
          <MobileProfile
            avatarSrc={mobileProfile.avatarSrc}
            avatarAlt={mobileProfile.displayName}
            displayName={mobileProfile.displayName}
            username={mobileProfile.username}
            status={mobileProfile.online}
          >
            <Scrollbar>
              <div className={styles['mobile-profile-layout__menu']}>
                <MobileMenuItem
                  label={mobileProfile.statusLabel}
                  leadingVisual={
                    <Icon
                      size="20"
                      className={styles['mobile-profile-layout__status-icon']}
                      glyph={<CheckCircleIcon />}
                    />
                  }
                />
                {/* With a custom status set, its emoji takes the place of the emoticon icon. */}
                <MobileMenuItem
                  label={
                    mobileProfile.customStatus?.text ?? 'Set a Custom Status'
                  }
                  leadingVisual={
                    mobileProfile.customStatus ? (
                      <span
                        className={
                          styles['mobile-profile-layout__status-emoji']
                        }
                        aria-hidden
                      >
                        {mobileProfile.customStatus.emoji}
                      </span>
                    ) : (
                      <Icon size="20" glyph={<EmoticonHappyOutlineIcon />} />
                    )
                  }
                />
                <div
                  className={styles['mobile-profile-layout__menu-divider']}
                  role="separator"
                />
                <MobileMenuItem
                  label="Your Profile"
                  leadingVisual={
                    <Icon size="20" glyph={<AccountOutlineIcon />} />
                  }
                />
                <MobileMenuItem
                  label="Settings"
                  leadingVisual={<Icon size="20" glyph={<CogOutlineIcon />} />}
                />
                <div
                  className={styles['mobile-profile-layout__menu-divider']}
                  role="separator"
                />
                <MobileMenuItem
                  label="Log out"
                  secondaryLabel="Log out of Community Server"
                  destructive
                  leadingVisual={<Icon size="20" glyph={<ExitToAppIcon />} />}
                />
              </div>
            </Scrollbar>
          </MobileProfile>
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
