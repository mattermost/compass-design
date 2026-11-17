import {
  workspaceChannels,
  workspaceCurrentUserId,
  workspacePosts,
  getWorkspaceUser,
  type MobileSearchRecentItem,
} from '@mattermost/compass-proto';
import { mobileChannel } from './mobilePatternFixtures';
import {
  searchMessages,
  type MessageHit,
} from '@/guidelines/patterns/search-modal/searchModalFixtures';

const me = workspaceCurrentUserId;
const myChannelIds = new Set(
  workspaceChannels.filter((c) => c.memberIds?.includes(me)).map((c) => c.id),
);

/** A plain post by a person in one of the signed-in user's channels (a short one reads best as a search). */
const sourcePost = workspacePosts.find(
  (p) =>
    !p.kind &&
    !p.rootId &&
    myChannelIds.has(p.channelId) &&
    getWorkspaceUser(p.userId) &&
    !getWorkspaceUser(p.userId)?.isBot &&
    /[A-Za-z]{6,}/.test(p.text),
);
const word = sourcePost?.text.match(/[A-Za-z]{6,}/)?.[0]?.toLowerCase();
const author = sourcePost ? getWorkspaceUser(sourcePost.userId) : undefined;
const channelSlug = mobileChannel?.id.split('/').pop();

/** Recent searches built from real channels, people and words in real posts. */
export const mobileRecentSearches: MobileSearchRecentItem[] = [
  channelSlug && word
    ? { id: 'r1', query: `${word} in:${channelSlug}` }
    : undefined,
  author && word
    ? { id: 'r2', query: `${word} from:${author.username}` }
    : undefined,
  word ? { id: 'r3', query: word } : undefined,
].filter((r): r is MobileSearchRecentItem => !!r);

/** Message hits for what was typed, with the author's avatar. */
export function mobileSearchResults(query: string): MessageHit[] {
  const terms = query
    .split(/\s+/)
    .filter((t) => t && !/^(from|in|on|before|after):/i.test(t));
  return terms.length ? searchMessages(terms, 6) : [];
}
