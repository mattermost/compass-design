import type { ChannelHeaderProps } from '@mattermost/compass-proto';
import AnatomyStage from '@/guidelines/_components/AnatomyStage';
import { FixtureChannelHeader } from '@/guidelines/_components/FixtureChannel';
import {
  headerBotDm,
  headerChannel,
  headerGroupDm,
  headerPersonDm,
} from '@/guidelines/patterns/channel-header/channelHeaderFixtures';
import styles from './ChannelHeaderGuidelineAnatomy.module.scss';

// The anatomy shows every element, so it forces a pinned count; the type
// previews do the same. Everything else comes from the real channel.
const SHOW_PINS: Partial<ChannelHeaderProps> = { pinnedCount: 1 };

/**
 * Channel Header pattern — anatomy preview on the shared AnatomyStage surface.
 */
export function ChannelHeaderAnatomyStage() {
  return (
    <AnatomyStage
      style={{
        alignItems: 'stretch',
        justifyContent: 'center',
      }}
    >
      <div className={styles['channel-header-anatomy__strip']}>
        {headerChannel && (
          <FixtureChannelHeader
            channel={headerChannel}
            overrides={{ favorited: false, ...SHOW_PINS }}
          />
        )}
      </div>
    </AnatomyStage>
  );
}

const TYPES = {
  channel: headerChannel,
  dm: headerPersonDm,
  gm: headerGroupDm,
  bot: headerBotDm,
} as const;

/** One header type (channel, direct message, group message or bot) from the sample workspace. */
export function ChannelHeaderTypePreview({
  kind,
}: {
  kind: keyof typeof TYPES;
}) {
  const channel = TYPES[kind];
  if (!channel) return null;
  return (
    <div style={{ width: '100%' }}>
      <FixtureChannelHeader
        channel={channel}
        overrides={
          kind === 'channel' ? { favorited: false, ...SHOW_PINS } : SHOW_PINS
        }
      />
    </div>
  );
}
