import type { FixtureTeam } from './types';

/** Sample teams. Fields match `TeamSidebar` items (`id`, `name`, `initials`, `unread`, `mentions`). */
export const fixtureTeams = [
  { id: 'contributors', name: 'Contributors', initials: 'C' },
  { id: 'engineering', name: 'Engineering', initials: 'E', unread: true },
  { id: 'design', name: 'Design', initials: 'D', mentions: 2 },
] as const satisfies readonly FixtureTeam[];

export type FixtureTeamId = (typeof fixtureTeams)[number]['id'];

export const fixtureDefaultTeamId: FixtureTeamId = 'contributors';
