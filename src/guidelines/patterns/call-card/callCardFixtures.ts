import { workspaceCurrentUserId } from '@mattermost/compass-proto';
import { avatars } from '@/fixtures/avatarRegistry';
import { callPeople, sampleCallPost } from '@/fixtures/workspaceCall';

// Participants are the people in a channel the signed-in user is in, and the
// ended card uses a real call post's times when the data has one.

export const participants = callPeople.slice(0, 5).map((u) => ({
  key: u.id,
  name: u.displayName,
  src: avatars[u.id],
}));

/** Who started the call: the first person who is not the signed-in user. */
export const starterName =
  (callPeople.find((u) => u.id !== workspaceCurrentUserId) ?? callPeople[0])
    ?.displayName ?? 'a teammate';

const duration = sampleCallPost?.call?.durationSeconds ?? 510;
export const lasted = `Lasted ${Math.floor(duration / 60)} min ${duration % 60} sec`;

/** When the missed call happened. */
export const missedMeta =
  sampleCallPost?.call?.startedAt ?? 'Yesterday at 4:12 PM';
