import {
  cyberDefenseChannels,
  cyberDefenseCurrentUserId,
  cyberDefensePosts,
  cyberDefenseUsers,
  getCyberDefenseChannel,
  getCyberDefenseUser,
  type FixtureChannel,
  type FixturePost,
  type RightSidebarChannelMemberGroup,
  type SearchResultMessageData,
} from '@mattermost/compass-proto';
import { avatars } from '@/fixtures/avatarRegistry';
import { workspaceTeams } from '@/fixtures/workspaceTeams';
import { fixtureChannelInfoProps } from '@/guidelines/_components/fixtureChannelInfoProps';
import {
  plainPreview,
  threadMessages,
  threadsIn,
} from '@/guidelines/_components/fixtureThread';

const me = cyberDefenseCurrentUserId;

const myChannels = cyberDefenseChannels.filter((c) =>
  c.memberIds?.includes(me),
);
const myTeamChannels = myChannels.filter(
  (c) => c.type === 'public' || c.type === 'private',
);

/** A channel with a purpose, a header and a few members: it fills the Channel Info panel. */
export const sampleChannel: FixtureChannel =
  myTeamChannels.find(
    (c) => c.purpose && c.header && (c.memberIds?.length ?? 0) >= 4,
  ) ??
  myTeamChannels[0] ??
  cyberDefenseChannels[0]!;

export const sampleChannelName = sampleChannel.name;
export const sampleChannelInfoProps = fixtureChannelInfoProps(sampleChannel);

const isPerson = (p: FixturePost) =>
  !p.kind && !p.webhook && !!getCyberDefenseUser(p.userId);

/** A thread started by a person, with a few replies (any thread when none). */
const threads = threadsIn(new Set(myChannels.map((c) => c.id)));
const sampleThread =
  threads.find((t) => isPerson(t.root) && t.replies.length >= 2) ?? threads[0];

export const sampleThreadMessages = sampleThread
  ? threadMessages(sampleThread)
  : [];
export const sampleThreadChannelName =
  getCyberDefenseChannel(sampleThread?.root.channelId ?? '')?.name ??
  sampleChannelName;

/** The channel's members, online ones first. */
export const sampleMemberGroups: RightSidebarChannelMemberGroup[] = (() => {
  const people = (sampleChannel.memberIds ?? [])
    .map((id) => getCyberDefenseUser(id))
    .filter((u) => !!u && !u.isBot)
    .map((u) => ({
      id: u!.id,
      name: u!.displayName,
      secondaryLabel: `@${u!.username}`,
      avatarSrc: avatars[u!.id],
      status: u!.presence === 'online',
    }));
  const online = people.filter((m) => m.status);
  const rest = people.filter((m) => !m.status);
  return [
    { id: 'online', title: 'Online', members: online },
    { id: 'offline', title: 'Away and offline', members: rest },
  ].filter((g) => g.members.length);
})();

/** The toolbar total counts the people listed (bots are not). */
export const sampleMemberCount = sampleMemberGroups.reduce(
  (n, g) => n + g.members.length,
  0,
);

const teamNameOf = (channel?: FixtureChannel) =>
  workspaceTeams.find((t) => t.id === channel?.teamId)?.name;

const toResult = (post: FixturePost): SearchResultMessageData => {
  const author = getCyberDefenseUser(post.userId);
  const channel = getCyberDefenseChannel(post.channelId);
  return {
    id: post.id,
    avatarSrc: avatars[post.userId],
    avatarAlt: author?.displayName ?? '',
    username: author?.displayName ?? post.userId,
    timestamp: post.timestamp,
    channelLabel: channel?.name ?? '',
    teamLabel: teamNameOf(channel),
    body: plainPreview(post.text, 160),
    pinned: post.pinned,
  };
};

const resultPosts = cyberDefensePosts
  .filter((p) => isPerson(p) && p.text.length > 40 && p.text.length < 220)
  .filter((p) => myChannels.some((c) => c.id === p.channelId));

/** A few human posts to list as results, and a word from the first to highlight. */
export const sampleResults = resultPosts.slice(0, 3).map(toResult);
export const sampleTerm =
  resultPosts[0]?.text.match(/[A-Za-z]{6,}/)?.[0]?.toLowerCase() ?? '';

/** Users with a name and an avatar, for the header variants. */
export const sampleUser =
  getCyberDefenseUser(me) ?? cyberDefenseUsers.find((u) => !u.isBot)!;
