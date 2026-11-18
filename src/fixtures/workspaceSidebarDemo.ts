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

/**
 * The team the sidebar demos show: the first team, as in the layouts, so the
 * patterns and layouts agree.
 */
export const sidebarDemoTeam = workspaceTeams[0]!;

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

/**
 * The sample data leaves this team with nothing unread, so the demos mark a
 * few of its channels unread (the first few that are not the active one) to
 * show the Unreads group and the badges. Only these demos do this; the layouts
 * show the data as it is, and `generated.ts` is never edited.
 */
const DEMO_UNREAD = [
  { unreadCount: 4, mentionCount: 2 },
  { unreadCount: 1, mentionCount: 0 },
  { unreadCount: 2, mentionCount: 0 },
];
const demoChannels = (() => {
  const picked = new Map(
    workspaceChannels
      .filter(
        (c) =>
          c.teamId === sidebarDemoTeam.id &&
          c.memberIds?.includes(workspaceCurrentUserId) &&
          c.id !== activeChannel?.id &&
          !c.unreadCount &&
          !c.mentionCount,
      )
      .slice(0, DEMO_UNREAD.length)
      .map((c, i) => [c.id, DEMO_UNREAD[i]!] as const),
  );
  return workspaceChannels.map((c) =>
    picked.has(c.id) ? { ...c, ...picked.get(c.id) } : c,
  );
})();

/** The channels sidebar for the sidebar demos, from the sample workspace. */
export function sidebarDemoModel(
  showUnreadsCategory: boolean,
): ChannelsSidebarModel {
  return buildChannelsSidebarModelFromFixtures({
    channels: demoChannels,
    users: workspaceUsers,
    currentUserId: workspaceCurrentUserId,
    teamId: sidebarDemoTeam.id,
    showUnreadsCategory,
    activeChannelId: activeChannel?.id,
    avatars,
    threadsMentionCount,
  });
}
