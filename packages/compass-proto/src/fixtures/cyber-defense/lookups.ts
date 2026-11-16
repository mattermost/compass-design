import type {
  FixtureChannel,
  FixturePost,
  FixtureThread,
  FixtureUser,
} from '../types';
import {
  cyberDefenseChannels,
  cyberDefensePosts,
  cyberDefenseUsers,
} from './generated';

const usersById = new Map(cyberDefenseUsers.map((u) => [u.id, u]));
const channelsById = new Map(cyberDefenseChannels.map((c) => [c.id, c]));
const postsById = new Map(cyberDefensePosts.map((p) => [p.id, p]));

export function getCyberDefenseUser(id: string): FixtureUser | undefined {
  return usersById.get(id);
}

export function getCyberDefenseChannel(id: string): FixtureChannel | undefined {
  return channelsById.get(id);
}

export function getCyberDefensePost(id: string): FixturePost | undefined {
  return postsById.get(id);
}

/** Posts in a channel, in order. */
export function getCyberDefenseChannelPosts(channelId: string): FixturePost[] {
  return cyberDefensePosts.filter((p) => p.channelId === channelId);
}

/** Threads that have at least one reply. */
export const cyberDefenseThreads: readonly FixtureThread[] = cyberDefensePosts
  .filter((p) => !p.rootId && cyberDefensePosts.some((r) => r.rootId === p.id))
  .map((root) => ({
    root,
    replies: cyberDefensePosts.filter((r) => r.rootId === root.id),
  }));
