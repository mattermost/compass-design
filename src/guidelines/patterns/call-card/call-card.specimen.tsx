import {
  CallCard,
  workspaceChannels,
  workspaceCurrentUserId,
  workspacePosts,
  getWorkspaceUser,
} from '@mattermost/compass-proto';
import { Button } from '@mattermost/compass-ui/components/button';
import { avatars } from '@/fixtures/avatarRegistry';
import styles from '@/styles/library-demo/patterns.module.scss';

// People and the call come from the sample workspace: the participants are the
// people in a channel the signed-in user is in, and the ended card uses a real
// call post's times when there is one.
const me = workspaceCurrentUserId;
const channel =
  workspaceChannels.find(
    (c) =>
      c.memberIds?.includes(me) &&
      c.type !== 'direct' &&
      (c.memberIds?.length ?? 0) >= 5,
  ) ?? workspaceChannels[0];
const people = (channel?.memberIds ?? [])
  .map((id) => getWorkspaceUser(id))
  .filter((u) => !!u && !u.isBot);
const participants = people.slice(0, 5).map((u) => ({
  key: u!.id,
  name: u!.displayName,
  src: avatars[u!.id],
}));
const starter = people.find((u) => u!.id !== me) ?? people[0];
const starterName = starter?.displayName ?? 'a teammate';
const callPost = workspacePosts.find((p) => p.kind === 'call' && p.call);
const duration = callPost?.call?.durationSeconds ?? 510;
const lasted = `Lasted ${Math.floor(duration / 60)} min ${duration % 60} sec`;

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
        meta={callPost?.call?.startedAt ?? 'Yesterday at 4:12 PM'}
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
