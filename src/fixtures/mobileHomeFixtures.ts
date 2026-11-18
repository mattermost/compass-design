import {
  buildChannelsSidebarModelFromFixtures,
  workspaceChannels,
  workspaceCurrentUserId,
  workspacePosts,
  workspaceTeams,
  workspaceUsers,
  type ChannelsSidebarModel,
} from '@mattermost/compass-proto';
import { avatars } from './avatarRegistry';
import { teamSidebarTeams } from './teamSidebarTeams';
import { sidebarDemoModel, sidebarDemoTeam } from './workspaceSidebarDemo';

/** The teams for the mobile team strip (with their images and badges). */
export const mobileHomeTeams = teamSidebarTeams;

/** The team the home screen opens on: the first, like the other demos. */
export const mobileHomeFirstTeamId = sidebarDemoTeam.id;

export const mobileHomeTeamName = (teamId: string | undefined) =>
  workspaceTeams.find((t) => t.id === teamId)?.name ?? sidebarDemoTeam.name;

const threadsMentionCount = (teamId: string) => {
  const inScope = new Set(
    workspaceChannels
      .filter((c) => !c.teamId || c.teamId === teamId)
      .map((c) => c.id),
  );
  return workspacePosts
    .filter((p) => inScope.has(p.channelId))
    .reduce((n, p) => n + (p.unreadMentions ?? 0), 0);
};

/**
 * The channel list for a team, with the Unreads group on. The opening team
 * uses the same model as the Channel Sidebar demos (which marks a few of its
 * channels unread, as the data has none); the others show the data as it is.
 */
export function mobileHomeModel(teamId: string): ChannelsSidebarModel {
  if (teamId === sidebarDemoTeam.id) return sidebarDemoModel(true);
  return buildChannelsSidebarModelFromFixtures({
    channels: workspaceChannels,
    users: workspaceUsers,
    currentUserId: workspaceCurrentUserId,
    teamId,
    showUnreadsCategory: true,
    avatars,
    threadsMentionCount: threadsMentionCount(teamId),
  });
}
