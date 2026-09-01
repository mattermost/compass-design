import avatarDanielle from '@/assets/avatars/Danielle Okoro.png';
import avatarEmma from '@/assets/avatars/Emma Novak.png';
import avatarLeonard from '@/assets/avatars/Leonard Riley.png';
import avatarMarco from '@/assets/avatars/Marco Rinaldi.png';
import avatarSofia from '@/assets/avatars/Sofia Bauer.png';
import { ThreadFooter } from '@mattermost/compass-ui/components/thread-footer';
import styles from '@/styles/library-demo/components.module.scss';

export default function ThreadFooterLibrary() {
  return (
    <>
      <div className={styles['components__button-block']}>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Default</span>
          <ThreadFooter
            replyCount={5}
            avatars={[
              { key: 'leonard', src: avatarLeonard, name: 'Leonard Riley' },
              { key: 'danielle', src: avatarDanielle, name: 'Danielle Okoro' },
              { key: 'marco', src: avatarMarco, name: 'Marco Rinaldi' },
              { key: 'emma', src: avatarEmma, name: 'Emma Novak' },
              { key: 'sofia', src: avatarSofia, name: 'Sofia Bauer' },
            ]}
          />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Following
          </span>
          <ThreadFooter
            replyCount={2}
            avatars={[
              { key: 'emma', src: avatarEmma, name: 'Emma Novak' },
              { key: 'sofia', src: avatarSofia, name: 'Sofia Bauer' },
            ]}
            following
            lastReplyTime="2 mins ago"
          />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Badges</span>
          <ThreadFooter
            replyCount={3}
            badge="unread"
            avatars={[{ key: 'leonard', src: avatarLeonard, name: 'Leonard Riley' }]}
          />
          <ThreadFooter
            replyCount={1}
            badge="mention"
            mentionCount={2}
            avatars={[{ key: 'danielle', src: avatarDanielle, name: 'Danielle Okoro' }]}
          />
        </div>
      </div>
    </>
  );
}
