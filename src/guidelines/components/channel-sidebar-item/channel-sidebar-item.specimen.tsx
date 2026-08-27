import avatarDanielle from '@/assets/avatars/Danielle Okoro.png';
import avatarLeonard from '@/assets/avatars/Leonard Riley.png';
import avatarMarco from '@/assets/avatars/Marco Rinaldi.png';
import { ChannelSidebarItem } from '@mattermost/compass-ui';
import styles from '@/styles/library-demo/components.module.scss';

export default function ChannelSidebarItemLibrary() {
  return (
    <>
      <div className={styles['components__button-block']}>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Leading visuals
          </span>
          <div className={styles['components__sidebar-demo']}>
            <ChannelSidebarItem leadingVisual="public" name="Design" />
            <ChannelSidebarItem leadingVisual="private" name="Engineering" />
            <ChannelSidebarItem
              leadingVisual="group-message"
              name="Design Team"
              memberCount={4}
            />
            <ChannelSidebarItem
              leadingVisual="direct-message"
              name="Leonard Riley"
              avatarSrc={avatarLeonard}
              avatarAlt="Leonard Riley"
              showAvatarStatus
            />
            <ChannelSidebarItem leadingVisual="threads" name="threads" />
            <ChannelSidebarItem leadingVisual="drafts" name="Drafts" />
            <ChannelSidebarItem leadingVisual="insights" name="Insights" />
          </div>
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Status</span>
          <div className={styles['components__sidebar-demo']}>
            <ChannelSidebarItem
              leadingVisual="public"
              name="Read channel"
              status="read"
            />
            <ChannelSidebarItem
              leadingVisual="public"
              name="Unread channel"
              status="unread"
            />
            <ChannelSidebarItem
              leadingVisual="public"
              name="Mention channel"
              status="mention"
              mentionCount={3}
            />
          </div>
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Active & muted
          </span>
          <div className={styles['components__sidebar-demo']}>
            <ChannelSidebarItem
              leadingVisual="public"
              name="Active channel"
              active
            />
            <ChannelSidebarItem
              leadingVisual="public"
              name="Muted channel"
              muted
            />
            <ChannelSidebarItem
              leadingVisual="direct-message"
              name="Danielle Okoro"
              avatarSrc={avatarDanielle}
              avatarAlt="Danielle Okoro"
              muted
            />
          </div>
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Shared / call / emoji
          </span>
          <div className={styles['components__sidebar-demo']}>
            <ChannelSidebarItem
              leadingVisual="public"
              name="Shared channel"
              sharedChannel
            />
            <ChannelSidebarItem
              leadingVisual="private"
              name="Call active"
              callActive
            />
            <ChannelSidebarItem
              leadingVisual="direct-message"
              name="Marco Rinaldi"
              avatarSrc={avatarMarco}
              avatarAlt="Marco Rinaldi"
              customStatusEmoji="🏄"
            />
          </div>
        </div>
      </div>
    </>
  );
}
