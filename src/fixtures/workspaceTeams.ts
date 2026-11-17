import { cyberDefenseTeams } from '@mattermost/compass-proto';
import { teamIcons } from './teamIcons';

/**
 * The sample workspace's teams as the Team Sidebar takes them: each with its
 * image, and the signed-in user's unread dot or mention count for it.
 */
export const workspaceTeams = cyberDefenseTeams.map((team) => ({
  ...team,
  src: teamIcons[team.id],
}));
