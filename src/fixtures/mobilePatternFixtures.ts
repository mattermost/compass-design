import {
  attachmentFileType,
  formatFileSize,
  workspaceChannels,
  workspaceCurrentUserId,
  workspacePosts,
  workspaceUsers,
  getWorkspaceUser,
  type FixtureChannel,
  type FixtureFile,
  type FixturePost,
  type FixtureUser,
} from '@mattermost/compass-proto';
import { attachmentImages } from './attachmentImages';
import { avatars } from './avatarRegistry';
import { integrationIcons } from './integrationIcons';
import { plainPreview } from '@/guidelines/_components/fixtureThread';

// Data for the mobile pattern pages (navigation bars, message, message input),
// picked from the sample workspace by what it is, never by id or count, so a
// refresh of the data doesn't break them.

const me = workspaceCurrentUserId;
const mine = workspaceChannels.filter((c) => c.memberIds?.includes(me));

const otherOf = (c: FixtureChannel) =>
  getWorkspaceUser(c.memberIds?.find((id) => id !== me) ?? '');

/** A team channel with a good number of members (the busiest one). */
export const mobileChannel: FixtureChannel | undefined = [...mine]
  .filter((c) => c.type === 'public' || c.type === 'private')
  .sort((a, b) => (b.memberIds?.length ?? 0) - (a.memberIds?.length ?? 0))[0];

/** A direct message with a person. */
export const mobileDm: FixtureChannel | undefined = mine.find(
  (c) => c.type === 'direct' && !otherOf(c)?.isBot,
);

/** A group message. */
export const mobileGm: FixtureChannel | undefined = mine.find(
  (c) => c.type === 'group',
);

/** A direct message with a bot. */
export const mobileBotDm: FixtureChannel | undefined = mine.find(
  (c) => c.type === 'direct' && otherOf(c)?.isBot,
);

/** Mentions waiting for the signed-in user across their channels (at least 1 to show a badge). */
export const mobileMentionCount = Math.max(
  1,
  mine.reduce((n, c) => n + (c.mentionCount ?? 0), 0),
);

/** A person with a custom status, for the "DM — custom status" examples. */
export const mobileStatusUser: FixtureUser | undefined = workspaceUsers.find(
  (u) => !u.isBot && u.customStatusEmoji && u.customStatusText,
);

/** An app or integration: a bot's avatar, else the first integration icon. */
const bot = workspaceUsers.find((u) => u.isBot && avatars[u.id]);
export const mobileApp = {
  src: bot ? avatars[bot.id] : Object.values(integrationIcons)[0],
  name: bot?.displayName ?? 'App',
};

/** A short, single-line text for a message body. */
const oneLine = (text: string) => plainPreview(text, 110);

const isPlain = (p: FixturePost) =>
  !p.kind && !p.webhook && !p.attachments?.length && !p.files?.length;

const timeOf = (timestamp: string) => timestamp.split(' at ')[1] ?? timestamp;

export interface MobilePost {
  username: string;
  avatarSrc?: string;
  timestamp: string;
  text: string;
  isBot: boolean;
  post: FixturePost;
}

const toMobilePost = (post: FixturePost): MobilePost => {
  const author = getWorkspaceUser(post.userId);
  return {
    username: author?.displayName ?? post.userId,
    avatarSrc: avatars[post.userId],
    timestamp: timeOf(post.timestamp),
    text: oneLine(post.text),
    isBot: Boolean(author?.isBot),
    post,
  };
};

const shortPlain = (p: FixturePost) =>
  isPlain(p) &&
  !p.permalinkPostId &&
  p.text.length > 30 &&
  p.text.length < 160 &&
  !/\n/.test(p.text) &&
  !/^\/|^https?:/.test(p.text);

const humanPlain = workspacePosts.filter(
  (p) => shortPlain(p) && !getWorkspaceUser(p.userId)?.isBot,
);

/** A message by a person: the default and active examples. */
export const mobileHumanPost: MobilePost | undefined = humanPlain[0]
  ? toMobilePost(humanPlain[0])
  : undefined;

/** A message by a bot (plain text, else the start of its reply). */
const botPostSource =
  workspacePosts.find(
    (p) => getWorkspaceUser(p.userId)?.isBot && !p.webhook && isPlain(p),
  ) ??
  workspacePosts.find((p) => getWorkspaceUser(p.userId)?.isBot && !p.webhook);
export const mobileBotPost: MobilePost | undefined = botPostSource
  ? toMobilePost(botPostSource)
  : undefined;

/** A person's message that has reactions. */
const reactedSource = humanPlain.find((p) => p.reactions?.length);
export const mobileReactedPost: MobilePost | undefined = reactedSource
  ? toMobilePost(reactedSource)
  : undefined;

/** A post's reactions in the shape `ReactionsRow` takes. */
export const mobileReactions = (post?: FixturePost) =>
  (post?.reactions ?? []).slice(0, 3).map((r) => ({
    emoji: r.emoji,
    count: r.userIds.length,
    byCurrentUser: r.userIds.includes(me),
  }));

/** A file a post carries, as `AttachmentCard` takes it. */
const fileSource: FixtureFile | undefined = workspacePosts.find(
  (p) => p.files?.length,
)?.files?.[0];
export const mobileFile = fileSource
  ? {
      fileName: fileSource.name,
      fileMeta: [
        fileSource.extension.toUpperCase(),
        fileSource.sizeBytes ? formatFileSize(fileSource.sizeBytes) : undefined,
      ]
        .filter(Boolean)
        .join(' '),
      fileType: attachmentFileType(fileSource.name),
    }
  : undefined;

/** A link from a post's Markdown, for the link preview. */
const linkMatch = workspacePosts
  .map((p) => /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/.exec(p.text))
  .find(Boolean);
export const mobileLink = linkMatch
  ? { title: linkMatch[1]!, siteName: new URL(linkMatch[2]!).hostname }
  : undefined;

/** An image attachments in the sample data point at. */
export const mobileImage = Object.values(attachmentImages)[0];
