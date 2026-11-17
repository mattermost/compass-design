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

const unreadChannels = (teamId: string) =>
  workspaceChannels.filter(
    (c) =>
      c.teamId === teamId &&
      c.memberIds?.includes(workspaceCurrentUserId) &&
      (c.unreadCount || c.mentionCount),
  ).length;

/**
 * The team the sidebar demos show: the one with the most unread channels, so
 * the Unreads group has something in it. (Ties go to the first team.)
 */
export const sidebarDemoTeam = workspaceTeams.reduce((best, team) =>
  unreadChannels(team.id) > unreadChannels(best.id) ? team : best,
);

/** The channel shown as active: the team's first favorite, else its first channel. */
const activeChannel = (() => {
  const own = workspaceChannels.filter(
    (c) =>
      c.teamId === sidebarDemoTeam.id &&
      c.memberIds?.includes(workspaceCurrentUserId),
  );
  return own.find((c) => c.favorite) ?? own[0];
})();

const threadsMentionCount = (() => {
  const inScope = new Set(
    workspaceChannels
      .filter((c) => !c.teamId || c.teamId === sidebarDemoTeam.id)
      .map((c) => c.id),
  );
  return workspacePosts
    .filter((p) => inScope.has(p.channelId))
    .reduce((n, p) => n + (p.unreadMentions ?? 0), 0);
})();

/** The channels sidebar for the sidebar demos, from the sample workspace. */
export function sidebarDemoModel(
  showUnreadsCategory: boolean,
): ChannelsSidebarModel {
  return buildChannelsSidebarModelFromFixtures({
    channels: workspaceChannels,
    users: workspaceUsers,
    currentUserId: workspaceCurrentUserId,
    teamId: sidebarDemoTeam.id,
    showUnreadsCategory,
    activeChannelId: activeChannel?.id,
    avatars,
    threadsMentionCount,
  });
}
