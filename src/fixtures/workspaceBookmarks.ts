import {
  workspaceChannels,
  workspaceCurrentUserId,
  type ChannelBookmark,
  type FixtureBookmark,
  type FixtureChannel,
} from '@mattermost/compass-proto';

/** Bookmark links in the data are paths in the product; show them on a fictional host. */
const toHref = (href?: string) =>
  href && href.startsWith('/') ? `https://example.com${href}` : href;

/** A fixture bookmark as the bookmarks bar takes it. */
export const toChannelBookmark = (b: FixtureBookmark): ChannelBookmark => ({
  id: b.id,
  label: b.label,
  labelText: b.label,
  href: toHref(b.href),
  emoji: b.emoji,
});

/**
 * Every bookmark on the channels the signed-in user is in (one per channel in
 * the sample data), without repeats.
 */
export const workspaceBookmarks: ChannelBookmark[] = (() => {
  const seen = new Set<string>();
  return workspaceChannels
    .filter((c) => c.memberIds?.includes(workspaceCurrentUserId))
    .flatMap((c) => c.bookmarks ?? [])
    .filter((b) => !seen.has(b.label) && !!seen.add(b.label))
    .map(toChannelBookmark);
})();

/**
 * A channel with no bookmarks (a team channel the signed-in user is in), whose
 * header shows with no bookmarks bar under it.
 */
export const channelWithoutBookmarks: FixtureChannel | undefined =
  workspaceChannels.find(
    (c) =>
      c.memberIds?.includes(workspaceCurrentUserId) &&
      (c.type === 'public' || c.type === 'private') &&
      !c.bookmarks?.length,
  );
