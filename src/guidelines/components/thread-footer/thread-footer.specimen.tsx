import avatarDanielle from '@/assets/avatars/Danielle Okoro.png';
import avatarEmma from '@/assets/avatars/Emma Novak.png';
import avatarLeonard from '@/assets/avatars/Leonard Riley.png';
import avatarMarco from '@/assets/avatars/Marco Rinaldi.png';
import avatarSofia from '@/assets/avatars/Sofia Bauer.png';
import { Message } from '@mattermost/compass-proto';
import { ThreadFooter } from '@mattermost/compass-ui/components/thread-footer';
import styles from './thread-footer.specimen.module.scss';

const AVATARS_FIVE = [
  { key: 'leonard', src: avatarLeonard, name: 'Leonard Riley' },
  { key: 'danielle', src: avatarDanielle, name: 'Danielle Okoro' },
  { key: 'marco', src: avatarMarco, name: 'Marco Rinaldi' },
  { key: 'emma', src: avatarEmma, name: 'Emma Novak' },
  { key: 'sofia', src: avatarSofia, name: 'Sofia Bauer' },
];

export default function ThreadFooterLibrary() {
  return (
    <div className={styles['specimen']}>
      <div className={styles['variant']}>
        <span className={styles['variant__label']}>Default</span>
        <Message
          avatarSrc={avatarEmma}
          avatarAlt="Emma Novak"
          username="Emma Novak"
          timestamp="9:41 AM"
          showMessageActions={false}
          threadFooter={
            <ThreadFooter replyCount={5} avatars={AVATARS_FIVE} />
          }
        >
          <p className={styles['message-text']}>
            This sprint we should prioritise the sidebar redesign — thoughts on timeline?
          </p>
        </Message>
      </div>

      <div className={styles['variant']}>
        <span className={styles['variant__label']}>Following</span>
        <Message
          avatarSrc={avatarLeonard}
          avatarAlt="Leonard Riley"
          username="Leonard Riley"
          timestamp="10:02 AM"
          showMessageActions={false}
          threadFooter={
            <ThreadFooter
              replyCount={2}
              avatars={[
                { key: 'emma', src: avatarEmma, name: 'Emma Novak' },
                { key: 'sofia', src: avatarSofia, name: 'Sofia Bauer' },
              ]}
              following
              lastReplyTime="2 mins ago"
            />
          }
        >
          <p className={styles['message-text']}>
            Agreed. I can have the wireframes ready by end of week.
          </p>
        </Message>
      </div>

      <div className={styles['variant']}>
        <span className={styles['variant__label']}>Unread</span>
        <Message
          avatarSrc={avatarDanielle}
          avatarAlt="Danielle Okoro"
          username="Danielle Okoro"
          timestamp="10:15 AM"
          showMessageActions={false}
          threadFooter={
            <ThreadFooter
              replyCount={3}
              badge="unread"
              avatars={[{ key: 'leonard', src: avatarLeonard, name: 'Leonard Riley' }]}
            />
          }
        >
          <p className={styles['message-text']}>
            Can someone send over the latest design tokens?
          </p>
        </Message>
      </div>

      <div className={styles['variant']}>
        <span className={styles['variant__label']}>Mention</span>
        <Message
          avatarSrc={avatarMarco}
          avatarAlt="Marco Rinaldi"
          username="Marco Rinaldi"
          timestamp="10:28 AM"
          showMessageActions={false}
          threadFooter={
            <ThreadFooter
              replyCount={1}
              badge="mention"
              mentionCount={2}
              avatars={[{ key: 'danielle', src: avatarDanielle, name: 'Danielle Okoro' }]}
            />
          }
        >
          <p className={styles['message-text']}>
            You have an action item in the accessibility audit.
          </p>
        </Message>
      </div>
    </div>
  );
}
