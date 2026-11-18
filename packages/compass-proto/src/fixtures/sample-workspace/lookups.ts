import type {
  FixtureChannel,
  FixturePost,
  FixtureThread,
  FixtureUser,
} from '../types';
import { workspaceChannels, workspacePosts, workspaceUsers } from './generated';

const usersById = new Map(workspaceUsers.map((u) => [u.id, u]));
const channelsById = new Map(workspaceChannels.map((c) => [c.id, c]));
const postsById = new Map(workspacePosts.map((p) => [p.id, p]));

export function getWorkspaceUser(id: string): FixtureUser | undefined {
  return usersById.get(id);
}

export function getWorkspaceChannel(id: string): FixtureChannel | undefined {
  return channelsById.get(id);
}

export function getWorkspacePost(id: string): FixturePost | undefined {
  return postsById.get(id);
}

/** Posts in a channel, in order. */
export function getWorkspaceChannelPosts(channelId: string): FixturePost[] {
  return workspacePosts.filter((p) => p.channelId === channelId);
}

/** Threads that have at least one reply. */
export const workspaceThreads: readonly FixtureThread[] = workspacePosts
  .filter((p) => !p.rootId && workspacePosts.some((r) => r.rootId === p.id))
  .map((root) => ({
    root,
    replies: workspacePosts.filter((r) => r.rootId === root.id),
  }));
