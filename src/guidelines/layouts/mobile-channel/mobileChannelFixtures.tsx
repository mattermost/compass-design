import type { ReactNode } from 'react';
import { AttachmentCard } from '@mattermost/compass-ui/components/attachment-card';
import { MessageSeparator } from '@mattermost/compass-ui/components/message-separator';
import { PermalinkPreview } from '@mattermost/compass-ui/components/permalink-preview';
import { ReactionsRow } from '@mattermost/compass-ui/components/reactions-row';
import { ThreadFooter } from '@mattermost/compass-ui/components/thread-footer';
import {
  CallCard,
  MobileMessage,
  MessageAttachment,
  attachmentFileType,
  formatFileSize,
  getWorkspaceChannelPosts,
  getWorkspacePost,
  getWorkspaceUser,
  workspaceChannels,
  workspaceCurrentUserId,
  workspaceTeams,
  type FixtureChannel,
  type FixturePost,
} from '@mattermost/compass-proto';
import { avatars } from '@/fixtures/avatarRegistry';
import { integrationIcons } from '@/fixtures/integrationIcons';
import { postAttachmentProps } from '@/fixtures/messageAttachmentProps';
import FixtureMarkdown from '@/guidelines/_components/FixtureMarkdown';

// The Mobile Channel layout shows one real channel of the sample workspace,
// from the signed-in user's point of view. Everything is picked by what it is
// (never by id or count) so a refresh of the data doesn't break the page.

const me = workspaceCurrentUserId;

/** How many of the channel's newest posts the phone shows. */
const POST_COUNT = 8;

const rootsOf = (channel: FixtureChannel) =>
  getWorkspaceChannelPosts(channel.id).filter((p) => !p.rootId);

const isPerson = (p: FixturePost) =>
  !p.kind && !p.webhook && !getWorkspaceUser(p.userId)?.isBot;

/**
 * The channel: in the first team, one the signed-in user is in, with the most
 * posts by people (a conversation reads best on a phone).
 */
export const mobileChannelLayoutChannel: FixtureChannel | undefined = (() => {
  const teamId = workspaceTeams[0]?.id;
  const candidates = workspaceChannels.filter(
    (c) =>
      c.teamId === teamId &&
      (c.type === 'public' || c.type === 'private') &&
      c.memberIds?.includes(me),
  );
  const score = (c: FixtureChannel) => rootsOf(c).filter(isPerson).length;
  return [...candidates].sort((a, b) => score(b) - score(a))[0];
})();

const dayLabel = (timestamp: string) => timestamp.split(' at ')[0]!;
const timeOf = (timestamp: string) => timestamp.split(' at ')[1] ?? timestamp;

const plainText = (text: string) =>
  text
    .replace(/^#+\s*/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\s*\n+\s*/g, ' ')
    .trim();

function lastedLabel(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `Lasted ${[m && `${m} min`, s && `${s} sec`].filter(Boolean).join(' ') || '0 sec'}`;
}

/** A post as `MobileMessage`: text, files, cards, a call, reactions and the thread's replies. */
function MobilePostItem({ post }: { post: FixturePost }) {
  const author = getWorkspaceUser(post.userId);
  const webhook = post.webhook;
  const username = webhook?.displayName ?? author?.displayName ?? post.userId;
  const replies = getWorkspaceChannelPosts(post.channelId).filter(
    (p) => p.rootId === post.id,
  );
  const { cards, hoisted } = postAttachmentProps(post);
  // A call post's text is its card's title, so the body must not repeat it.
  const callText = post.kind === 'call' ? post.text.trim() : '';
  const callTextIsTitle = callText !== '' && !callText.includes('\n');
  const showText = !hoisted && !callTextIsTitle;

  const permalinked = post.permalinkPostId
    ? getWorkspacePost(post.permalinkPostId)
    : undefined;

  const footer: ReactNode[] = [];
  post.files?.forEach((f) =>
    footer.push(
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
  cards.forEach((card, i) =>
    footer.push(<MessageAttachment key={`att${i}`} {...card} />),
  );
  if (permalinked)
    footer.push(
      <PermalinkPreview
        key="permalink"
        authorName={
          permalinked.webhook?.displayName ??
          getWorkspaceUser(permalinked.userId)?.displayName
        }
        avatarSrc={
          (permalinked.webhook &&
            integrationIcons[permalinked.webhook.iconId]) ||
          avatars[permalinked.userId] ||
          ''
        }
        timestamp={permalinked.timestamp}
        messageText={plainText(permalinked.text)}
      />,
    );
  if (post.kind === 'call' && post.call)
    footer.push(
      <CallCard
        key="call"
        state="ended"
        title={callTextIsTitle ? callText : 'Call ended'}
        meta={lastedLabel(post.call.durationSeconds)}
      />,
    );
  const reactions = post.reactions?.map((r) => ({
    emoji: r.emoji,
    count: r.userIds.length,
    byCurrentUser: r.userIds.includes(me),
  }));
  const acks = post.acknowledgements ?? [];
  if (reactions?.length || post.requestAck)
    footer.push(
      <ReactionsRow
        key="reactions"
        reactions={reactions ?? []}
        acknowledged={post.requestAck}
        acknowledgeCount={acks.length}
        currentUserAcknowledged={acks.some((a) => a.userId === me)}
        showAddReaction
      />,
    );
  if (replies.length)
    footer.push(
      <ThreadFooter
        key="thread"
        replyCount={replies.length}
        avatars={[...new Map(replies.map((r) => [r.userId, r])).values()]
          .slice(0, 3)
          .map((r) => ({
            key: r.userId,
            name: getWorkspaceUser(r.userId)?.displayName ?? r.userId,
            src: avatars[r.userId],
          }))}
        badge={post.unreadMentions ? 'mention' : 'none'}
        mentionCount={post.unreadMentions}
        following={post.followerIds?.includes(me)}
        lastReplyTime={replies[replies.length - 1]!.timestamp}
      />,
    );

  return (
    <MobileMessage
      avatarSrc={
        (webhook && integrationIcons[webhook.iconId]) || avatars[post.userId]
      }
      avatarAlt={username}
      username={username}
      timestamp={timeOf(post.timestamp)}
      isBot={Boolean(webhook) || author?.isBot}
      showPinnedSavedIndicators={post.pinned}
      footer={footer.length ? <>{footer}</> : undefined}
    >
      {showText ? <FixtureMarkdown text={post.text} /> : null}
    </MobileMessage>
  );
}

/** Longest post text (in characters) that reads well in a phone-width column. */
const MAX_PHONE_TEXT = 600;

/** A post that fits a phone: no table or code block, and not a wall of text. */
const fitsPhone = (p: FixturePost) =>
  p.text.length <= MAX_PHONE_TEXT &&
  !/^\s*\|.*\|\s*$/m.test(p.text) &&
  !p.text.includes('```');

/** The channel's newest posts, with date separators and the "New messages" line. */
export function MobileChannelPosts({ channel }: { channel: FixtureChannel }) {
  const roots = rootsOf(channel).filter(fitsPhone).slice(-POST_COUNT);
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
    items.push(<MobilePostItem key={post.id} post={post} />);
  }
  return <>{items}</>;
}
