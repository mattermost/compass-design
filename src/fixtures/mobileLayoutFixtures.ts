import {
  workspaceChannels,
  workspaceCurrentUserId,
  workspacePosts,
  workspaceTeams,
  getWorkspaceChannel,
  getWorkspaceUser,
  type FixturePost,
} from '@mattermost/compass-proto';
import { avatars } from './avatarRegistry';
import { plainPreview } from '@/guidelines/_components/fixtureThread';

// Data for the mobile Mentions, Saved and Profile layouts, picked from the
// sample workspace by what it is (never by id or count), so a refresh of the
// data doesn't break them.

const me = workspaceCurrentUserId;
const persona = getWorkspaceUser(me);
const mine = new Set(
  workspaceChannels.filter((c) => c.memberIds?.includes(me)).map((c) => c.id),
);

export interface MobileListPost {
  id: string;
  username: string;
  avatarSrc?: string;
  /** The time of day, e.g. "4:25 PM". */
  time: string;
  /** The day, e.g. "Nov 6". */
  day: string;
  /** The post text as one short line. */
  text: string;
  channelName: string;
  teamName?: string;
  isBot: boolean;
}

const toListPost = (post: FixturePost): MobileListPost => {
  const author = getWorkspaceUser(post.userId);
  const channel = getWorkspaceChannel(post.channelId);
  const [day, time] = post.timestamp.split(' at ');
  return {
    id: post.id,
    username: author?.displayName ?? post.userId,
    avatarSrc: avatars[post.userId],
    time: time ?? post.timestamp,
    day: time ? (day ?? '') : '',
    text: plainPreview(post.text, 180),
    channelName: channel?.name ?? '',
    teamName: workspaceTeams.find((t) => t.id === channel?.teamId)?.name,
    isBot: Boolean(author?.isBot),
  };
};

const newestFirst = (a: FixturePost, b: FixturePost) =>
  (b.createdAt ?? '').localeCompare(a.createdAt ?? '');

const isPlainPost = (p: FixturePost) =>
  !p.kind && !p.webhook && !p.attachments?.length && !p.permalinkPostId;

/** Posts by other people that @mention the signed-in user, newest first. */
export const mobileMentionPosts: MobileListPost[] = workspacePosts
  .filter(
    (p) =>
      mine.has(p.channelId) &&
      p.userId !== me &&
      persona &&
      new RegExp(`@${persona.username}\\b`).test(p.text),
  )
  .sort(newestFirst)
  .slice(0, 4)
  .map(toListPost);

/**
 * Stand-in for the signed-in user's saved posts (the sample data has no saved
 * flag): recent plain posts by people that others reacted to, else any recent
 * plain post.
 */
export const mobileSavedPosts: MobileListPost[] = (() => {
  const plain = workspacePosts
    .filter((p) => mine.has(p.channelId) && isPlainPost(p) && !p.rootId)
    .filter((p) => getWorkspaceUser(p.userId)?.isBot !== true)
    .sort(newestFirst);
  const reacted = plain.filter((p) => p.reactions?.length);
  return [...reacted, ...plain.filter((p) => !reacted.includes(p))]
    .slice(0, 3)
    .map(toListPost);
})();

const PRESENCE_LABEL = {
  online: 'Online',
  away: 'Away',
  'do-not-disturb': 'Do Not Disturb',
  offline: 'Offline',
} as const;

/** The signed-in user's profile for the mobile Profile layout. */
export const mobileProfile = {
  displayName: persona?.displayName ?? '',
  username: persona ? `@${persona.username}` : '',
  avatarSrc: avatars[me],
  online: persona?.presence === 'online',
  statusLabel: PRESENCE_LABEL[persona?.presence ?? 'online'],
  /** The custom status, when the user has one: its emoji and its text. */
  customStatus:
    persona?.customStatusEmoji && persona.customStatusText
      ? { emoji: persona.customStatusEmoji, text: persona.customStatusText }
      : undefined,
};
