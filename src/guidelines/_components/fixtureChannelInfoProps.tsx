import {
  getCyberDefenseChannelPosts,
  type FixtureChannel,
  type RightSidebarChannelInfoProps,
} from '@mattermost/compass-proto';
import FixtureMarkdown from './FixtureMarkdown';

/** Props for `RightSidebarChannelInfo`, from a fixture channel. */
export function fixtureChannelInfoProps(
  channel: FixtureChannel,
): RightSidebarChannelInfoProps {
  const direct = channel.type === 'direct' || channel.type === 'group';
  const fileCount = getCyberDefenseChannelPosts(channel.id).reduce(
    (n, p) => n + (p.files?.length ?? 0),
    0,
  );
  return {
    name: channel.name,
    purpose: channel.purpose ?? null,
    header: channel.header ? <FixtureMarkdown text={channel.header} /> : null,
    channelId: channel.id,
    favorited: channel.favorite,
    showAddPeople: channel.type !== 'direct',
    memberCount: channel.memberIds?.length,
    pinnedCount: direct ? undefined : (channel.pinnedCount ?? 0),
    fileCount,
  };
}
