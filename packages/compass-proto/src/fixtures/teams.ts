import type { FixtureTeam } from './types';

/** Sample teams. Fields match `TeamSidebar` items (`id`, `name`, `initials`, `unread`, `mentions`). */
const TEAMS = [
  { id: 'contributors', name: 'Contributors', initials: 'C' },
  { id: 'engineering', name: 'Engineering', initials: 'E', unread: true },
  { id: 'design', name: 'Design', initials: 'D', mentions: 2 },
] as const satisfies readonly FixtureTeam[];

export type FixtureTeamId = (typeof TEAMS)[number]['id'];

/** Typed as `FixtureTeam` so optional fields (e.g. `mentions`) are readable on every element; `id` stays the literal union. */
export const fixtureTeams: readonly (FixtureTeam & { id: FixtureTeamId })[] =
  TEAMS;

export const fixtureDefaultTeamId: FixtureTeamId = 'contributors';
