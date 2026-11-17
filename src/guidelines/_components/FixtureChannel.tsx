import type { ReactNode } from 'react';
import PencilOutlineIcon from '@mattermost/compass-icons/components/pencil-outline';
import { AttachmentCard } from '@mattermost/compass-ui/components/attachment-card';
import { MessageSeparator } from '@mattermost/compass-ui/components/message-separator';
import { PermalinkPreview } from '@mattermost/compass-ui/components/permalink-preview';
import { ReactionsRow } from '@mattermost/compass-ui/components/reactions-row';
import { ThreadFooter } from '@mattermost/compass-ui/components/thread-footer';
import {
  CallCard,
  ChannelBanner,
  ChannelHeader,
  Message,
  MessageAttachment,
  attachmentFileType,
  cyberDefenseCurrentUserId,
  formatFileSize,
  getCyberDefenseChannelPosts,
  getCyberDefensePost,
  getCyberDefenseUser,
  type FixtureChannel,
  type ChannelHeaderProps,
  type FixturePost,
} from '@mattermost/compass-proto';
import { avatars } from '@/fixtures/avatarRegistry';
import { integrationIcons } from '@/fixtures/integrationIcons';
import { postAttachmentProps } from '@/fixtures/messageAttachmentProps';
import FixtureMarkdown from './FixtureMarkdown';
import styles from './FixtureChannel.module.scss';

/** The other person in a direct message, from the current user's point of view. */
function otherUserId(channel: FixtureChannel): string | undefined {
  return channel.memberIds?.find((id) => id !== cyberDefenseCurrentUserId);
}

/** Posts in a channel that are not replies. */
function rootPosts(channelId: string): FixturePost[] {
  return getCyberDefenseChannelPosts(channelId).filter((p) => !p.rootId);
}

/** One line of plain text: the permalink card wraps its text in a paragraph already. */
const plainText = (text: string) =>
  text
    .replace(/^#+\s*/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\s*\n+\s*/g, ' ')
    .trim();

const dayLabel = (timestamp: string) => timestamp.split(' at ')[0]!;

function lastedLabel(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `Lasted ${[m && `${m} min`, s && `${s} sec`].filter(Boolean).join(' ') || '0 sec'}`;
}

/** Channel header for a fixture channel: channel, direct, group or bot. */
export function FixtureChannelHeader({
  channel,
  onNameClick,
  onInfoClick,
  infoToggled,
  overrides,
}: {
  channel: FixtureChannel;
  onNameClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onInfoClick?: () => void;
  infoToggled?: boolean;
  /** Props that replace what the channel gives, to show a state on purpose (favorited, muted, a pinned count). */
  overrides?: Partial<ChannelHeaderProps>;
}) {
  const common = { name: channel.name, onNameClick, onInfoClick, infoToggled };
  if (channel.type === 'direct') {
    const id = otherUserId(channel);
    const user = id ? getCyberDefenseUser(id) : undefined;
    return (
      <ChannelHeader
        {...common}
        type={user?.isBot ? 'bot' : 'dm'}
        avatarSrc={id ? avatars[id] : undefined}
        avatarStatus={!user?.isBot}
        customStatus={
          user?.customStatusEmoji && user.customStatusText
            ? { emoji: user.customStatusEmoji, text: user.customStatusText }
            : undefined
        }
        {...overrides}
      />
    );
  }
  if (channel.type === 'group')
    return (
      <ChannelHeader
        {...common}
        type="gm"
        memberCount={channel.memberIds?.length}
        {...overrides}
      />
    );
  return (
    <ChannelHeader
      {...common}
      type="channel"
      description={channel.purpose}
      memberCount={channel.memberIds?.length}
      pinnedCount={channel.pinnedCount}
      favorited={channel.favorite}
      {...overrides}
    />
  );
}

export function FixturePostMessage({
  post,
  channels,
  onOpenThread,
}: {
  post: FixturePost;
  channels: readonly FixtureChannel[];
  onOpenThread?: (rootId: string) => void;
}) {
  const author = getCyberDefenseUser(post.userId);
  const webhook = post.webhook;
  const username = webhook?.displayName ?? author?.displayName ?? post.userId;
  const replies = getCyberDefenseChannelPosts(post.channelId).filter(
    (p) => p.rootId === post.id,
  );

  const reactions = post.reactions?.map((r) => ({
    emoji: r.emoji,
    count: r.userIds.length,
    byCurrentUser: r.userIds.includes(cyberDefenseCurrentUserId),
  }));
  const acks = post.acknowledgements ?? [];
  // An alert's headline goes inside its card, not above it.
  const { cards: attachmentCards, hoisted } = postAttachmentProps(post);
  // A call post's text is its card's title ("Call ended"), so the card says it
  // and the body must not repeat it.
  const callText = post.kind === 'call' ? post.text.trim() : '';
  const callTextIsTitle = callText !== '' && !callText.includes('\n');
  const callTitle = callTextIsTitle ? callText : 'Call ended';
  const showText = !hoisted && !callTextIsTitle;
  // "Edited" sits inline at the end of the text, as in the webapp.
  const editedMark = post.edited ? (
    <span className={styles['fixture-channel__edited']}>
      {/* The raw glyph is an <svg>; the compass Icon is a <div>, which can't sit in a paragraph. */}
      <PencilOutlineIcon size={12} />
      Edited
    </span>
  ) : undefined;

  const permalinked = post.permalinkPostId
    ? getCyberDefensePost(post.permalinkPostId)
    : undefined;
  const permalinkChannel = permalinked
    ? channels.find((c) => c.id === permalinked.channelId)?.name
    : undefined;

  const footerItems: ReactNode[] = [];
  post.files?.forEach((f) =>
    footerItems.push(
      <AttachmentCard
        key={f.name}
        fileName={f.name}
        fileType={attachmentFileType(f.name)}
        fileMeta={[
          f.extension.toUpperCase(),
          f.sizeBytes !== undefined && formatFileSize(f.sizeBytes),
        ]
          .filter(Boolean)
          .join(' ')}
      />,
    ),
  );
  attachmentCards.forEach((card, i) =>
    footerItems.push(<MessageAttachment key={`att${i}`} {...card} />),
  );
  if (permalinked)
    footerItems.push(
      <PermalinkPreview
        key="permalink"
        authorName={
          permalinked.webhook?.displayName ??
          getCyberDefenseUser(permalinked.userId)?.displayName
        }
        avatarSrc={
          (permalinked.webhook &&
            integrationIcons[permalinked.webhook.iconId]) ||
          avatars[permalinked.userId] ||
          ''
        }
        timestamp={permalinked.timestamp}
        messageText={plainText(permalinked.text)}
        originalChannel={permalinkChannel}
      />,
    );
  if (post.kind === 'call' && post.call)
    footerItems.push(
      <CallCard
        key="call"
        state="ended"
        title={callTitle}
        meta={lastedLabel(post.call.durationSeconds)}
      />,
    );
  if (post.kind === 'run-update' && post.runUpdate) {
    const r = post.runUpdate;
    footerItems.push(
      <div key="run" className={styles['fixture-channel__run']}>
        <p className={styles['fixture-channel__run-title']}>{r.runName}</p>
        <p className={styles['fixture-channel__run-meta']}>
          {r.numTasksChecked} of {r.numTasks} tasks done
        </p>
      </div>,
    );
  }
  if (reactions?.length || post.requestAck)
    footerItems.push(
      <ReactionsRow
        key="reactions"
        reactions={reactions ?? []}
        acknowledged={post.requestAck}
        acknowledgeCount={acks.length}
        currentUserAcknowledged={acks.some(
          (a) => a.userId === cyberDefenseCurrentUserId,
        )}
        showAddReaction
      />,
    );

  return (
    <Message
      avatarSrc={
        (webhook && integrationIcons[webhook.iconId]) || avatars[post.userId]
      }
      avatarAlt={username}
      username={username}
      timestamp={post.timestamp}
      isBot={Boolean(webhook) || author?.isBot}
      priority={post.priority}
      customStatus={
        author?.customStatusEmoji && author.customStatusText && !webhook
          ? { emoji: author.customStatusEmoji, text: author.customStatusText }
          : undefined
      }
      footer={
        footerItems.length ? (
          <div className={styles['fixture-channel__footer']}>{footerItems}</div>
        ) : undefined
      }
      threadFooter={
        replies.length ? (
          <div className={styles['fixture-channel__thread-footer']}>
            <ThreadFooter
              replyCount={replies.length}
              avatars={[...new Map(replies.map((r) => [r.userId, r])).values()]
                .slice(0, 5)
                .map((r) => ({
                  key: r.userId,
                  name: getCyberDefenseUser(r.userId)?.displayName ?? r.userId,
                  src: avatars[r.userId],
                }))}
              badge={post.unreadMentions ? 'mention' : 'none'}
              mentionCount={post.unreadMentions}
              following={post.followerIds?.includes(cyberDefenseCurrentUserId)}
              lastReplyTime={replies[replies.length - 1]!.timestamp}
              onReply={onOpenThread ? () => onOpenThread(post.id) : undefined}
            />
          </div>
        ) : undefined
      }
    >
      {/* Posts a card speaks for (calls, alert cards) have no text to mark as edited. */}
      {showText && <FixtureMarkdown text={post.text} suffix={editedMark} />}
    </Message>
  );
}

/** A channel's posts as messages, with date separators and the "New messages" line. */
export function FixtureMessageList({
  channel,
  channels,
  onOpenThread,
}: {
  channel: FixtureChannel;
  channels: readonly FixtureChannel[];
  /** Called with the root post id when a thread's reply link is clicked. */
  onOpenThread?: (rootId: string) => void;
}) {
  const roots = rootPosts(channel.id);
  const items: ReactNode[] = [];
  let day: string | undefined;
  for (const post of roots) {
    const label = dayLabel(post.timestamp);
    if (label !== day) {
      items.push(
        <MessageSeparator key={`day-${post.id}`} type="date" label={label} />,
      );
      day = label;
    }
    if (post.id === channel.firstUnreadPostId)
      items.push(
        <MessageSeparator key={`new-${post.id}`} type="new-messages" />,
      );
    items.push(
      <FixturePostMessage
        key={post.id}
        post={post}
        channels={channels}
        onOpenThread={onOpenThread}
      />,
    );
  }
  return <>{items}</>;
}

/** The channel's banner, when it has one. */
export function FixtureChannelBanner({ channel }: { channel: FixtureChannel }) {
  if (!channel.banner) return null;
  return (
    <ChannelBanner
      backgroundColor={channel.banner.backgroundColor}
      tooltip={channel.banner.text}
    >
      <FixtureMarkdown text={channel.banner.text} inline />
    </ChannelBanner>
  );
}
