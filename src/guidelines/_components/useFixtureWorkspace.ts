import { useMemo, useState } from 'react';
import {
  buildChannelsSidebarModelFromFixtures,
  cyberDefenseChannels,
  cyberDefenseCurrentUserId,
  cyberDefensePosts,
  cyberDefenseTeams,
  cyberDefenseUsers,
  getCyberDefenseUser,
  type ChannelShellProps,
  type FixtureChannel,
} from '@mattermost/compass-proto';
import { avatars } from '@/fixtures/avatarRegistry';
import { teamIcons } from '@/fixtures/teamIcons';
import { useStickToBottom } from '@/hooks/useStickToBottom';

const me = cyberDefenseCurrentUserId;

/** Channels the signed-in user belongs to. */
const memberChannels = cyberDefenseChannels.filter((c) =>
  c.memberIds?.includes(me),
);

/** The team's channels that the signed-in user belongs to (no direct messages). */
const teamChannels = (teamId: string) =>
  memberChannels.filter((c) => c.teamId === teamId);

/**
 * The channel a team opens on: one with alert cards when there is one (it
 * shows the most), else a favorite, else the first.
 */
function defaultChannelFor(teamId: string): FixtureChannel | undefined {
  const own = teamChannels(teamId);
  return (
    own.find((c) =>
      cyberDefensePosts.some(
        (p) => p.channelId === c.id && p.kind === 'slack-attachment',
      ),
    ) ??
    own.find((c) => c.favorite) ??
    own[0]
  );
}

/** Teams as the Team Sidebar takes them, with their icons. */
const sidebarTeams: NonNullable<ChannelShellProps['teams']> =
  cyberDefenseTeams.map((t) => ({ ...t, src: teamIcons[t.id] }));

export interface FixtureWorkspaceOptions {
  /** Team to open on. Default: the first team. */
  initialTeamId?: string;
}

/**
 * State for a layout that shows the sample workspace from the signed-in
 * user's point of view: the active team and channel, the sidebar model for
 * that team, and the props `ChannelShell` needs to show the teams and switch
 * between them. Spread `shellProps` onto `ChannelShell`, attach `messagesRef`
 * to the message list's `Scrollbar` so it opens on the newest message, and
 * render `channel` with the `Fixture*` components.
 */
export function useFixtureWorkspace({
  initialTeamId = cyberDefenseTeams[0]?.id,
}: FixtureWorkspaceOptions = {}) {
  const [teamId, setTeamId] = useState(initialTeamId ?? '');
  const [channelId, setChannelId] = useState(
    () => defaultChannelFor(initialTeamId ?? '')?.id,
  );

  const team =
    cyberDefenseTeams.find((t) => t.id === teamId) ?? cyberDefenseTeams[0];
  // The active channel, if it is in this team (or a direct / group message).
  const channel =
    memberChannels.find(
      (c) => c.id === channelId && (!c.teamId || c.teamId === team?.id),
    ) ?? defaultChannelFor(team?.id ?? '');

  // Open each channel on its newest message and keep it there.
  const messagesRef = useStickToBottom(channel?.id);

  // Unread mentions in threads: the team's channels and direct messages.
  const threadsMentionCount = useMemo(() => {
    const inScope = new Set(
      cyberDefenseChannels
        .filter((c) => !c.teamId || c.teamId === team?.id)
        .map((c) => c.id),
    );
    return cyberDefensePosts
      .filter((p) => inScope.has(p.channelId))
      .reduce((n, p) => n + (p.unreadMentions ?? 0), 0);
  }, [team?.id]);

  const sidebarModel = useMemo(
    () =>
      buildChannelsSidebarModelFromFixtures({
        channels: cyberDefenseChannels,
        users: cyberDefenseUsers,
        currentUserId: me,
        teamId: team?.id,
        activeChannelId: channel?.id,
        avatars,
        threadsMentionCount,
        onSelectChannel: setChannelId,
      }),
    [team?.id, channel?.id, threadsMentionCount],
  );

  const selectTeam = (id: string) => {
    // Re-clicking the active team keeps the open channel or conversation.
    if (id === team?.id) return;
    setTeamId(id);
    setChannelId(defaultChannelFor(id)?.id);
  };

  const shellProps = {
    teams: sidebarTeams,
    activeTeamId: team?.id,
    teamName: team?.name,
    onSelectTeam: selectTeam,
    userAvatarSrc: avatars[me],
    userAvatarAlt: getCyberDefenseUser(me)?.displayName,
    channelsSidebarModel: sidebarModel,
  } satisfies Partial<ChannelShellProps>;

  return {
    team,
    channel,
    /** Every channel, for lookups such as a permalink's channel name. */
    channels: cyberDefenseChannels,
    messagesRef,
    shellProps,
    setChannelId,
  };
}
