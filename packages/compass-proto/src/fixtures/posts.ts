import type { FixturePost, FixtureThread } from './types';

/**
 * Sample thread in "UX Design". Text mirrors the docs app's right-sidebar
 * thread demo. Posts are plain text so hosts can render them with their own
 * Message components.
 */
const root: FixturePost = {
  id: 'post-sidebar-header',
  channelId: 'ux-design',
  userId: 'leonard-riley',
  timestamp: 'Today at 9:41 AM',
  text: 'Quick gut-check: should the sidebar header always show the parent channel as a secondary title, or only when the content is scoped to a channel?',
};

const replies: FixturePost[] = [
  {
    id: 'post-sidebar-header-1',
    channelId: 'ux-design',
    userId: 'aiko-tan',
    rootId: root.id,
    timestamp: 'Today at 9:48 AM',
    text: "I'd lean on showing it whenever there's a meaningful parent: threads, pinned messages, files. Skip it for global views like Saved Messages.",
  },
  {
    id: 'post-sidebar-header-2',
    channelId: 'ux-design',
    userId: 'danielle-okoro',
    rootId: root.id,
    timestamp: 'Today at 9:52 AM',
    text: 'The divider treatment also reads as "scoped to", which reinforces the relationship.',
  },
];

export const fixtureThreads: readonly FixtureThread[] = [{ root, replies }];

/** All posts, roots and replies, in chronological order. */
export const fixturePosts: readonly FixturePost[] = [root, ...replies];

export function getFixtureThread(rootId: string): FixtureThread | undefined {
  return fixtureThreads.find((t) => t.root.id === rootId);
}
