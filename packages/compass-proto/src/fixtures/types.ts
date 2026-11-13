/** Presence values match Compass `UserAvatar` / `StatusBadge` `status`. */
export type FixturePresence = 'online' | 'away' | 'do-not-disturb' | 'offline';

export interface FixtureUser {
  /** Stable id; also the key used by the avatar registry. */
  id: string;
  username: string;
  displayName: string;
  presence: FixturePresence;
  /** Optional plain custom status emoji. */
  customStatusEmoji?: string;
  customStatusText?: string;
}

export interface FixtureTeam {
  id: string;
  name: string;
  initials: string;
  unread?: boolean;
  mentions?: number;
}

export type FixtureChannelType = 'public' | 'private' | 'direct' | 'group';

export interface FixtureChannel {
  id: string;
  teamId: string;
  type: FixtureChannelType;
  /** Display name. For direct channels this is the other user's display name. */
  name: string;
  purpose?: string;
  /** User ids. Set for direct and group channels. */
  memberIds?: string[];
}

export interface FixturePost {
  id: string;
  channelId: string;
  userId: string;
  /** Plain text. Hosts render it with their own Message components. */
  text: string;
  /** Display timestamp, e.g. "Today at 9:41 AM". Fixed strings keep stories deterministic. */
  timestamp: string;
  /** Set on replies: id of the thread's root post. */
  rootId?: string;
}

export interface FixtureThread {
  root: FixturePost;
  replies: FixturePost[];
}
