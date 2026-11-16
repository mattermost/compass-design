import type {
  ChannelsSidebarGroupModel,
  ChannelsSidebarItemModel,
  ChannelsSidebarModel,
} from '../components/ChannelsSidebar';
import type { AvatarRegistry } from './avatars';
import type { FixtureChannel, FixtureUser } from './types';

export interface BuildChannelsSidebarModelFromFixturesInput {
  channels: readonly FixtureChannel[];
  users: readonly FixtureUser[];
  /** The signed-in user. Only channels they belong to are listed. */
  currentUserId: string;
  /** Channel shown as active. */
  activeChannelId?: string;
  /** Avatar registry for direct messages (see `createAvatarRegistry`). */
  avatars?: AvatarRegistry;
  /** Unread thread mentions for the current user; shown on the Threads row. */
  threadsMentionCount?: number;
  /** Called with the channel id when a row is clicked. */
  onSelectChannel?: (channelId: string) => void;
}

/**
 * Builds the channels sidebar from fixture channels, from the current user's
 * point of view: Favorites, Channels, then Direct Messages (direct and group).
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
    item.showAvatarStatus = true;
    if (other?.customStatusEmoji)
      item.customStatusEmoji = other.customStatusEmoji;
    if (other?.customStatusText) item.customStatusText = other.customStatusText;
    return item;
  };

  const visible = channels.filter(
    (c) => !c.memberIds || c.memberIds.includes(currentUserId),
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
  add(
    'favorites',
    { label: 'Favorites' },
    visible.filter((c) => c.favorite),
  );
  add(
    'channels',
    { label: 'Channels' },
    visible.filter((c) => !c.favorite && !isDirect(c)),
  );
  add(
    'direct-messages',
    { label: 'Direct Messages', showPlusButton: true },
    visible.filter((c) => !c.favorite && isDirect(c)),
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
