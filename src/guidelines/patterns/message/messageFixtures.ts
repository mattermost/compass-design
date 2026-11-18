import {
  workspaceChannels,
  workspaceCurrentUserId,
  workspacePosts,
  getWorkspaceUser,
  type FixturePost,
} from '@mattermost/compass-proto';

// Real posts from the sample workspace for the Message pattern, picked by what
// they are (never by id), so a data refresh keeps them working. The specimen
// and the guidelines page share them.
const memberChannelIds = new Set(
  workspaceChannels
    .filter((c) => c.memberIds?.includes(workspaceCurrentUserId))
    .map((c) => c.id),
);
const isBot = (p: FixturePost) => Boolean(getWorkspaceUser(p.userId)?.isBot);
const byPerson = (p: FixturePost) =>
  !p.kind && !p.webhook && !isBot(p) && memberChannelIds.has(p.channelId);

/** A plain message: no card, file, reaction or reply, and one line of text. */
const plain = (p: FixturePost) =>
  !p.rootId &&
  !p.kind &&
  !p.attachments &&
  !p.files &&
  !p.reactions &&
  !p.priority &&
  !p.permalinkPostId &&
  !p.edited &&
  memberChannelIds.has(p.channelId) &&
  !p.text.includes('\n');
const nearNinety = (a: FixturePost, b: FixturePost) =>
  Math.abs(a.text.length - 90) - Math.abs(b.text.length - 90);

export const plainPersonPost = workspacePosts
  .filter((p) => plain(p) && !isBot(p))
  .sort(nearNinety)[0];
export const plainBotPost = workspacePosts
  .filter((p) => plain(p) && isBot(p))
  .sort(nearNinety)[0];

/** A short message from a person that shares a file: the anatomy's message. */
export const anatomyPost =
  workspacePosts
    .filter((p) => byPerson(p) && p.files?.length && !p.text.includes('\n'))
    .sort(nearNinety)[0] ??
  workspacePosts.filter((p) => byPerson(p) && p.files?.length)[0] ??
  plainPersonPost;

/** Reactions to show under the anatomy's message: its own, else a real post's. */
export const anatomyReactions =
  anatomyPost?.reactions ??
  workspacePosts.find((p) => byPerson(p) && p.reactions?.length)?.reactions ??
  [];
