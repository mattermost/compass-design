import { CallCard } from '@mattermost/compass-proto';
import { Button } from '@mattermost/compass-ui/components/button';
import styles from '@/styles/library-demo/patterns.module.scss';
import {
  lasted,
  missedMeta,
  participants,
  starterName,
} from './callCardFixtures';

export default function CallCardLibrary() {
  return (
    <div className={styles['patterns__call-card-demo']}>
      <p className={styles['patterns__variant-label']}>Calling</p>
      <CallCard
        state="calling"
        title={`Calling ${starterName}…`}
        onCancel={() => {}}
      />

      <p className={styles['patterns__variant-label']}>Active</p>
      <CallCard
        state="active"
        title="Call started"
        meta={`3 minutes ago by ${starterName}`}
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
        meta={lasted}
        recordingLabel="1 recording"
      />

      <p className={styles['patterns__variant-label']}>Ended, missed</p>
      <CallCard
        state="ended"
        title="Missed call"
        meta={missedMeta}
        trailing={
          <Button emphasis="tertiary" size="medium">
            Call back
          </Button>
        }
      />

      <p className={styles['patterns__variant-label']}>Narrow (stacked)</p>
      <div className={styles['patterns__call-card-narrow']}>
        <CallCard
          state="active"
          title="Call started"
          meta={`3 minutes ago by ${starterName}`}
          participants={participants}
          onJoin={() => {}}
        />
      </div>
    </div>
  );
}
