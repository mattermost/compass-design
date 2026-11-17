import {
  workspaceChannels,
  workspaceCurrentUserId,
  workspacePosts,
  getWorkspaceUser,
  type FixturePost,
} from '@mattermost/compass-proto';
import { Divider } from '@mattermost/compass-ui/components/divider';
import { FixturePostMessage } from '@/guidelines/_components/FixtureChannel';
import styles from '@/styles/library-demo/patterns.module.scss';

// A plain message from a person and a plain message from a bot, both real posts
// from the sample workspace: no card, file or reaction, so the pattern shows
// just the avatar, header and text.
const memberChannelIds = new Set(
  workspaceChannels
    .filter((c) => c.memberIds?.includes(workspaceCurrentUserId))
    .map((c) => c.id),
);
const plain = (p: FixturePost) =>
  !p.rootId &&
  !p.kind &&
  !p.attachments &&
  !p.files &&
  !p.reactions &&
  !p.priority &&
  !p.permalinkPostId &&
  !p.edited &&
  memberChannelIds.has(p.channelId) &&
  !p.text.includes('\n');
const byLength = (a: FixturePost, b: FixturePost) =>
  Math.abs(a.text.length - 90) - Math.abs(b.text.length - 90);
const isBot = (p: FixturePost) => Boolean(getWorkspaceUser(p.userId)?.isBot);

const person = workspacePosts
  .filter((p) => plain(p) && !isBot(p))
  .sort(byLength)[0];
const bot = workspacePosts
  .filter((p) => plain(p) && isBot(p))
  .sort(byLength)[0];

export default function MessageLibrary() {
  return (
    <div className={styles['patterns__message-demo']}>
      {person && (
        <FixturePostMessage post={person} channels={workspaceChannels} />
      )}
      {person && bot && <Divider />}
      {bot && <FixturePostMessage post={bot} channels={workspaceChannels} />}
    </div>
  );
}
