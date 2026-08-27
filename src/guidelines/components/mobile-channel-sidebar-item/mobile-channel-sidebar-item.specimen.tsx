import avatarDanielle from '@/assets/avatars/Danielle Okoro.png';
import avatarLeonard from '@/assets/avatars/Leonard Riley.png';
import avatarMarco from '@/assets/avatars/Marco Rinaldi.png';
import { MobileChannelSidebarItem } from '@mattermost/compass-proto';
import styles from '@/styles/library-demo/components.module.scss';

export default function MobileChannelSidebarItemLibrary() {
  return (
    <>
      <div className={styles['components__button-block']}>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Leading visuals
          </span>
          <div className={styles['components__sidebar-demo']}>
            <MobileChannelSidebarItem leadingVisual='public' name='Design' />
            <MobileChannelSidebarItem
              leadingVisual='private'
              name='Engineering'
            />
            <MobileChannelSidebarItem
              leadingVisual='group-message'
              name='Design Team'
              memberCount={4}
            />
            <MobileChannelSidebarItem
              leadingVisual='direct-message'
              name='Leonard Riley'
              avatarSrc={avatarLeonard}
              avatarAlt='Leonard Riley'
              showAvatarStatus
            />
            <MobileChannelSidebarItem leadingVisual='threads' name='Threads' />
            <MobileChannelSidebarItem leadingVisual='drafts' name='Drafts' />
            <MobileChannelSidebarItem leadingVisual='insights' name='Insights' />
          </div>
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Status</span>
          <div className={styles['components__sidebar-demo']}>
            <MobileChannelSidebarItem
              leadingVisual='public'
              name='Read channel'
              status='read'
            />
            <MobileChannelSidebarItem
              leadingVisual='public'
              name='Unread channel'
              status='unread'
            />
            <MobileChannelSidebarItem
              leadingVisual='public'
              name='Mention channel'
              status='mention'
              mentionCount={3}
            />
          </div>
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Muted
          </span>
          <div className={styles['components__sidebar-demo']}>
            <MobileChannelSidebarItem
              leadingVisual='public'
              name='Muted channel'
              muted
            />
            <MobileChannelSidebarItem
              leadingVisual='direct-message'
              name='Danielle Okoro'
              avatarSrc={avatarDanielle}
              avatarAlt='Danielle Okoro'
              muted
            />
          </div>
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Shared / call / emoji
          </span>
          <div className={styles['components__sidebar-demo']}>
            <MobileChannelSidebarItem
              leadingVisual='public'
              name='Shared channel'
              sharedChannel
            />
            <MobileChannelSidebarItem
              leadingVisual='private'
              name='Call active'
              callActive
            />
            <MobileChannelSidebarItem
              leadingVisual='direct-message'
              name='Marco Rinaldi'
              avatarSrc={avatarMarco}
              avatarAlt='Marco Rinaldi'
              customStatusEmoji='🏄'
              showAvatarStatus
            />
          </div>
        </div>
      </div>
    </>
  );
}
