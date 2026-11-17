import type { RightSidebarThreadMessage } from '@mattermost/compass-proto';
import {
  cyberDefenseCurrentUserId,
  cyberDefensePosts,
  getCyberDefenseUser,
  type FixturePost,
} from '@mattermost/compass-proto';
import { avatars } from '@/fixtures/avatarRegistry';
import { integrationIcons } from '@/fixtures/integrationIcons';
import FixtureMarkdown from './FixtureMarkdown';

/** A thread: its root post and replies, in order. */
export interface FixtureThreadView {
  root: FixturePost;
  replies: FixturePost[];
  /** When the newest post in it was made (ISO 8601), for ordering. */
  lastAt: string;
  following: boolean;
}

/** Every thread (a root with replies) in the given channels, newest activity first. */
export function threadsIn(
  channelIds: ReadonlySet<string>,
): FixtureThreadView[] {
  const byRoot = new Map<string, FixturePost[]>();
  for (const p of cyberDefensePosts)
    if (p.rootId && channelIds.has(p.channelId))
      byRoot.set(p.rootId, [...(byRoot.get(p.rootId) ?? []), p]);
  return cyberDefensePosts
    .filter((p) => !p.rootId && byRoot.has(p.id))
    .map((root) => {
      const replies = byRoot.get(root.id)!;
      return {
        root,
        replies,
        lastAt: replies[replies.length - 1]!.createdAt ?? root.createdAt ?? '',
        following: Boolean(
          root.followerIds?.includes(cyberDefenseCurrentUserId),
        ),
      };
    })
    .sort((a, b) => b.lastAt.localeCompare(a.lastAt));
}

/** One line of plain text for a list preview: no Markdown, no line breaks. */
export function plainPreview(text: string, max = 140): string {
  const flat = text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^#+\s*/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\s*\n+\s*/g, ' ')
    .trim();
  return flat.length > max ? `${flat.slice(0, max - 1).trimEnd()}…` : flat;
}

/** The posts of a thread as the right sidebar's thread panel takes them. */
export function threadMessages(thread: {
  root: FixturePost;
  replies: FixturePost[];
}): RightSidebarThreadMessage[] {
  return [thread.root, ...thread.replies].map((post) => {
    const name =
      post.webhook?.displayName ??
      getCyberDefenseUser(post.userId)?.displayName ??
      post.userId;
    return {
      avatarSrc:
        (post.webhook && integrationIcons[post.webhook.iconId]) ||
        avatars[post.userId],
      avatarAlt: name,
      username: name,
      timestamp: post.timestamp,
      body: <FixtureMarkdown text={post.text} />,
    };
  });
}
