import {
  cyberDefenseCurrentUserId,
  getCyberDefenseUser,
  type FixtureChannel,
} from '@mattermost/compass-proto';
import { avatars } from '@/fixtures/avatarRegistry';
import type { Participant } from '@/types/callParticipant';

/**
 * Who is in a call in a channel: the signed-in user (the host, talking) and up
 * to five other people from the channel, most of them muted. Bots and system
 * accounts don't join calls.
 */
export function fixtureCallParticipants(
  channel: FixtureChannel | undefined,
  max = 6,
): Participant[] {
  const others = (channel?.memberIds ?? [])
    .filter((id) => id !== cyberDefenseCurrentUserId)
    .map((id) => getCyberDefenseUser(id))
    .filter((u) => u !== undefined && !u.isBot);
  const me = getCyberDefenseUser(cyberDefenseCurrentUserId);
  const people = [me, ...others].filter((u) => u !== undefined).slice(0, max);
  return people.map((u, i) => ({
    id: u.id,
    name: u.displayName,
    avatarSrc: avatars[u.id],
    ...(i === 0
      ? { host: true, talking: true, muted: false }
      : { muted: i % 3 !== 0 }),
  }));
}
