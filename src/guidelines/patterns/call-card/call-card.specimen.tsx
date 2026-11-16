import { CallCard } from '@mattermost/compass-proto';
import { Button } from '@mattermost/compass-ui/components/button';
import { avatars } from '@/fixtures/avatarRegistry';
import styles from '@/styles/library-demo/patterns.module.scss';

const participants = [
  {
    key: 'leonard-riley',
    name: 'Leonard Riley',
    src: avatars['leonard-riley'],
  },
  { key: 'aiko-tan', name: 'Aiko Tan', src: avatars['aiko-tan'] },
  { key: 'arjun-patel', name: 'Arjun Patel', src: avatars['arjun-patel'] },
  { key: 'darius-cole', name: 'Darius Cole', src: avatars['darius-cole'] },
  { key: 'emma-novak', name: 'Emma Novak', src: avatars['emma-novak'] },
];

export default function CallCardLibrary() {
  return (
    <div className={styles['patterns__call-card-demo']}>
      <p className={styles['patterns__variant-label']}>Calling</p>
      <CallCard state="calling" title="Calling Aiko Tan…" onCancel={() => {}} />

      <p className={styles['patterns__variant-label']}>Active</p>
      <CallCard
        state="active"
        title="Call started"
        meta="3 minutes ago by Aiko Tan"
        participants={participants}
        onJoin={() => {}}
      />

      <p className={styles['patterns__variant-label']}>Joined</p>
      <CallCard
        state="joined"
        title="You're in this call"
        meta="Started 3 minutes ago"
        participants={participants.slice(0, 3)}
        onLeave={() => {}}
      />

      <p className={styles['patterns__variant-label']}>Ended</p>
      <CallCard
        state="ended"
        title="Call ended"
        meta="Lasted 8 min 30 sec"
        recordingLabel="1 recording"
      />

      <p className={styles['patterns__variant-label']}>Ended, missed</p>
      <CallCard
        state="ended"
        title="Missed call"
        meta="Yesterday at 4:12 PM"
        trailing={
          <Button emphasis="secondary" size="medium">
            Call back
          </Button>
        }
      />

      <p className={styles['patterns__variant-label']}>Narrow (stacked)</p>
      <div className={styles['patterns__call-card-narrow']}>
        <CallCard
          state="active"
          title="Call started"
          meta="3 minutes ago by Aiko Tan"
          participants={participants}
          onJoin={() => {}}
        />
      </div>
    </div>
  );
}
