import type {
  ChannelsSidebarGroupModel,
  ChannelsSidebarItemModel,
  ChannelsSidebarModel,
} from '../components/ChannelsSidebar';
import type { AvatarRegistry } from './avatars';
import type { FixtureChannel, FixtureUser } from './types';

const LEADING_EMOJI =
  /^(\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic}|\p{Emoji_Modifier})*)\s*/u;

/**
 * Splits an emoji off the start of a channel name: `"🚨 Incident Status"`
 * gives `{ emoji: "🚨", name: "Incident Status" }`. A name that doesn't start
 * with an emoji (or is only an emoji) comes back unchanged with no `emoji`.
 */
export function splitLeadingEmoji(name: string): {
  emoji?: string;
  name: string;
} {
  const match = LEADING_EMOJI.exec(name);
  const rest = match ? name.slice(match[0].length) : name;
  if (!match || !rest.trim()) return { name };
  return { emoji: match[1], name: rest };
}

export interface BuildChannelsSidebarModelFromFixturesInput {
  channels: readonly FixtureChannel[];
  users: readonly FixtureUser[];
  /** The signed-in user. Only channels they belong to are listed. */
  currentUserId: string;
  /**
   * The team to show. Only that team's channels are listed, plus channels with
   * no team (direct and group messages). Omit to list every channel.
   */
  teamId?: string;
  /** Channel shown as active. */
  activeChannelId?: string;
  /** Avatar registry for direct messages (see `createAvatarRegistry`). */
  avatars?: AvatarRegistry;
  /**
   * Adds an Unreads group at the top with the channels that have unread or
   * mention badges; they are left out of the other groups. Default: false.
   */
  showUnreadsCategory?: boolean;
  /** Unread thread mentions for the current user; shown on the Threads row. */
  threadsMentionCount?: number;
  /** Called with the channel id when a row is clicked. */
  onSelectChannel?: (channelId: string) => void;
}

/**
 * Builds the channels sidebar from fixture channels, from the current user's
 * point of view: Favorites, Channels, then Direct Messages (direct and group),
 * with an optional Unreads group first.
 * A public or private channel whose name starts with an emoji shows it as the
 * row's leading visual (`leadingEmoji`) and drops it from the name.
 * Channels the user isn't a member of are left out, empty groups are omitted,
 * and unread / mention badges come from `unreadCount` and `mentionCount`.
 */
export function buildChannelsSidebarModelFromFixtures(
  input: BuildChannelsSidebarModelFromFixturesInput,
): ChannelsSidebarModel {
  const {
    channels,
    users,
    currentUserId,
    teamId,
    showUnreadsCategory = false,
    activeChannelId,
    avatars,
    threadsMentionCount = 0,
    onSelectChannel,
  } = input;
  const userById = new Map(users.map((u) => [u.id, u]));

  const row = (channel: FixtureChannel): ChannelsSidebarItemModel => {
    const item: ChannelsSidebarItemModel = {
      name: channel.name,
      active: channel.id === activeChannelId || undefined,
      onClick: onSelectChannel ? () => onSelectChannel(channel.id) : undefined,
    };
    if (channel.mentionCount) {
      item.status = 'mention';
      item.mentionCount = channel.mentionCount;
    } else if (channel.unreadCount) {
      item.status = 'unread';
    }

    if (channel.type === 'public' || channel.type === 'private') {
      item.leadingVisual = channel.type;
      // An emoji at the start of the name becomes the row's leading visual.
      const { emoji, name } = splitLeadingEmoji(channel.name);
      if (emoji) {
        item.leadingEmoji = emoji;
        item.name = name;
      }
      return item;
    }
    const others = (channel.memberIds ?? []).filter(
      (id) => id !== currentUserId,
    );
    if (channel.type === 'group') {
      item.leadingVisual = 'group-message';
      item.memberCount = others.length;
      return item;
    }
    // Direct message: the other person's avatar and custom status.
    const other = userById.get(others[0] ?? currentUserId);
    item.leadingVisual = 'direct-message';
    item.avatarSrc = other ? avatars?.[other.id] : undefined;
    item.avatarAlt = channel.name;
    item.showAvatarStatus = !other?.isBot;
    if (other?.customStatusEmoji)
      item.customStatusEmoji = other.customStatusEmoji;
    if (other?.customStatusText) item.customStatusText = other.customStatusText;
    return item;
  };

  const visible = channels.filter(
    (c) =>
      (!c.memberIds || c.memberIds.includes(currentUserId)) &&
      (teamId === undefined || !c.teamId || c.teamId === teamId),
  );
  const isDirect = (c: FixtureChannel) =>
    c.type === 'direct' || c.type === 'group';

  const groups: ChannelsSidebarGroupModel[] = [];
  const add = (
    key: string,
    category: ChannelsSidebarGroupModel['category'],
    list: FixtureChannel[],
  ) => {
    if (list.length) groups.push({ key, category, items: list.map(row) });
  };
  // Unread channels move up into their own group when it is on.
  const unread = (c: FixtureChannel) =>
    Boolean(c.unreadCount || c.mentionCount);
  const unreads = showUnreadsCategory ? visible.filter(unread) : [];
  const rest = showUnreadsCategory
    ? visible.filter((c) => !unread(c))
    : visible;
  add('unreads', { label: 'Unreads', showChevron: false }, unreads);
  add(
    'favorites',
    { label: 'Favorites' },
    rest.filter((c) => c.favorite),
  );
  add(
    'channels',
    { label: 'Channels' },
    rest.filter((c) => !c.favorite && !isDirect(c)),
  );
  add(
    'direct-messages',
    { label: 'Direct Messages', showPlusButton: true },
    rest.filter((c) => !c.favorite && isDirect(c)),
  );

  const threads: ChannelsSidebarItemModel = {
    name: 'Threads',
    leadingVisual: 'threads',
  };
  if (threadsMentionCount > 0) {
    threads.status = 'mention';
    threads.mentionCount = threadsMentionCount;
  }
  return { topGroupItems: [threads], groups };
}
