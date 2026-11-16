/** Presence values match Compass `UserAvatar` / `StatusBadge` `status`. */
export type FixturePresence = 'online' | 'away' | 'do-not-disturb' | 'offline';

export interface FixtureUser {
  /** Stable id; also the key used by the avatar registry. */
  id: string;
  username: string;
  displayName: string;
  presence: FixturePresence;
  /** Optional plain custom status emoji. */
  /** Emoji glyph, e.g. `🌴`. */
  customStatusEmoji?: string;
  customStatusText?: string;
  /** Job title, when the sample data has one. */
  position?: string;
  /** True for bots and integrations. */
  isBot?: boolean;
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
  /** User ids. Set for direct and group channels, and for channels with a known member list. */
  memberIds?: string[];
  /** Channel header text (Markdown). */
  header?: string;
  /** Channel banner shown above the posts. */
  banner?: { text: string; backgroundColor: string };
  /** The current user (see `cyberDefenseCurrentUserId`) has favorited the channel. */
  favorite?: boolean;
  /** Root posts from others the current user has not read. Unset when none. */
  unreadCount?: number;
  /** Unread posts that mention the current user (every unread post in a direct or group message). */
  mentionCount?: number;
  /** First unread root post: where a "New messages" line goes. */
  firstUnreadPostId?: string;
  /** Pinned posts in the channel. Unset when none. */
  pinnedCount?: number;
  bookmarks?: FixtureBookmark[];
}

export interface FixtureBookmark {
  id: string;
  label: string;
  href?: string;
  /** Emoji glyph that replaces the link icon. */
  emoji?: string;
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
  /**
   * What kind of post this is. Unset means a plain message. Hosts pick the
   * component from this: `webhook` and `slack-attachment` posts come from an
   * integration (see `webhook`), `run-update` from Playbooks, `call` from
   * Calls, `bot-reply` from an AI agent answering `respondingToId`.
   */
  kind?: FixturePostKind;
  /** The post was edited after it was sent. */
  edited?: boolean;
  /** The post is pinned to the channel. */
  pinned?: boolean;
  /** Message priority label. */
  priority?: FixturePostPriority;
  /** The author asked readers to acknowledge the post. */
  requestAck?: boolean;
  acknowledgements?: FixtureAcknowledgement[];
  reactions?: FixtureReaction[];
  /** User ids following the thread. Set on root posts. */
  followerIds?: string[];
  /** Unread replies that mention the current user (see `cyberDefenseCurrentUserId`) in this thread. Set on root posts. */
  unreadMentions?: number;
  files?: FixtureFile[];
  /** Slack-style attachments (cards with a color bar, fields and buttons). */
  attachments?: FixtureSlackAttachment[];
  /** Set when an integration posted the message under its own name and icon. */
  webhook?: FixtureWebhookIdentity;
  /** The post this one links to; hosts render a permalink preview of it. */
  permalinkPostId?: string;
  runUpdate?: FixtureRunUpdate;
  call?: FixtureCall;
  /** `bot-reply`: the post being answered. */
  respondingToId?: string;
  /** `bot-reply`: the user who asked. */
  requestedById?: string;
}

export type FixturePostKind =
  | 'webhook'
  | 'slack-attachment'
  | 'run-update'
  | 'call'
  | 'bot-reply';

export type FixturePostPriority = 'important' | 'urgent';

export interface FixtureAcknowledgement {
  userId: string;
  /** Time after the post, e.g. `+1m37s`. */
  after: string;
}

export interface FixtureReaction {
  /** Emoji glyph, e.g. `👀`. */
  emoji: string;
  userIds: string[];
}

export interface FixtureFile {
  name: string;
  /** Lowercase, no dot: `csv`, `vtt`. */
  extension: string;
  sizeBytes?: number;
}

export interface FixtureSlackAttachment {
  /** CSS color for the left bar. */
  color?: string;
  authorName?: string;
  authorIcon?: string;
  authorLink?: string;
  pretext?: string;
  title?: string;
  titleLink?: string;
  text?: string;
  fields?: { title: string; value: string; short?: boolean }[];
  actions?: { name: string; url?: string }[];
  footer?: string;
  footerIcon?: string;
  imageUrl?: string;
  thumbUrl?: string;
}

/** An integration that posts under its own name and icon. */
export interface FixtureWebhookIdentity {
  displayName: string;
  /** Key of a bundled integration icon; the host supplies the image. */
  iconId: FixtureIntegrationIconId;
}

export type FixtureIntegrationIconId =
  | 'pagerduty'
  | 'sentinel'
  | 'ms-defender'
  | 'intune'
  | 'splunk';

export interface FixtureRunUpdate {
  runName: string;
  /** User id of the person who wrote the update. */
  authorId: string;
  numTasks: number;
  numTasksChecked: number;
  participantIds: string[];
}

export interface FixtureCall {
  /** Display timestamps, like `FixturePost.timestamp`. */
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
}

export interface FixtureThread {
  root: FixturePost;
  replies: FixturePost[];
}
