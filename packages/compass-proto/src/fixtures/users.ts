import type { FixturePresence, FixtureUser } from './types';

/**
 * Sample people. Ids are the avatar registry keys; display names match the
 * files in the docs app's `src/assets/avatars/`.
 */
export const fixtureUsers = [
  {
    id: 'aiko-tan',
    username: 'aiko.tan',
    displayName: 'Aiko Tan',
    presence: 'online',
  },
  {
    id: 'arjun-patel',
    username: 'arjun.patel',
    displayName: 'Arjun Patel',
    presence: 'away',
  },
  {
    id: 'danielle-okoro',
    username: 'danielle.okoro',
    displayName: 'Danielle Okoro',
    presence: 'do-not-disturb',
  },
  {
    id: 'darius-cole',
    username: 'darius.cole',
    displayName: 'Darius Cole',
    presence: 'online',
  },
  {
    id: 'david-liang',
    username: 'david.liang',
    displayName: 'David Liang',
    presence: 'offline',
  },
  {
    id: 'emma-novak',
    username: 'emma.novak',
    displayName: 'Emma Novak',
    presence: 'online',
    customStatusEmoji: '🌴',
    customStatusText: 'Out of office',
  },
  {
    id: 'ethan-brooks',
    username: 'ethan.brooks',
    displayName: 'Ethan Brooks',
    presence: 'away',
  },
  {
    id: 'isabella-cruz',
    username: 'isabella.cruz',
    displayName: 'Isabella Cruz',
    presence: 'online',
  },
  {
    id: 'leila-haddad',
    username: 'leila.haddad',
    displayName: 'Leila Haddad',
    presence: 'offline',
  },
  {
    id: 'leonard-riley',
    username: 'leonard.riley',
    displayName: 'Leonard Riley',
    presence: 'online',
  },
  {
    id: 'lukas-meyer',
    username: 'lukas.meyer',
    displayName: 'Lukas Meyer',
    presence: 'online',
  },
  {
    id: 'marco-rinaldi',
    username: 'marco.rinaldi',
    displayName: 'Marco Rinaldi',
    presence: 'away',
  },
  { id: 'matty', username: 'matty', displayName: 'Matty', presence: 'online' },
  {
    id: 'sofia-bauer',
    username: 'sofia.bauer',
    displayName: 'Sofia Bauer',
    presence: 'offline',
  },
] as const satisfies readonly FixtureUser[];

export type FixtureUserId = (typeof fixtureUsers)[number]['id'];

/** The signed-in user in prototypes. */
export const fixtureCurrentUserId: FixtureUserId = 'leonard-riley';

/** Presence by user id, derived from `fixtureUsers`. */
export const fixturePresence: Readonly<Record<FixtureUserId, FixturePresence>> =
  Object.fromEntries(fixtureUsers.map((u) => [u.id, u.presence])) as Record<
    FixtureUserId,
    FixturePresence
  >;

export function getFixtureUser(id: string): FixtureUser | undefined {
  return fixtureUsers.find((u) => u.id === id);
}
