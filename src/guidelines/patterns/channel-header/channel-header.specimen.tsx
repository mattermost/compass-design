import { ChannelHeader } from '@mattermost/compass-proto';
import { FixtureChannelHeader } from '@/guidelines/_components/FixtureChannel';
import styles from '@/styles/library-demo/patterns.module.scss';
import {
  headerBotDm,
  headerChannel,
  headerGroupDm,
  headerPersonDm,
} from './channelHeaderFixtures';

// One real channel of each kind from the sample workspace (see
// channelHeaderFixtures). The state each variant shows (favorited, muted, a
// pinned count) is set on purpose, so it does not depend on what the data
// happens to hold.
const channel = headerChannel;
const botDm = headerBotDm;
const personDm = headerPersonDm;
const groupDm = headerGroupDm;

export default function ChannelHeaderLibrary() {
  return (
    <div className={styles['patterns__channel-header-demo']}>
      {channel && (
        <>
          <p className={styles['patterns__variant-label']}>Channel</p>
          <FixtureChannelHeader
            channel={channel}
            overrides={{ favorited: false, pinnedCount: 1 }}
          />
          <p className={styles['patterns__variant-label']}>
            Channel — favorited, muted
          </p>
          <FixtureChannelHeader
            channel={channel}
            overrides={{ favorited: true, muted: true, pinnedCount: 1 }}
          />
        </>
      )}
      {botDm && (
        <>
          <p className={styles['patterns__variant-label']}>Bot</p>
          <FixtureChannelHeader
            channel={botDm}
            overrides={{ pinnedCount: 1 }}
          />
        </>
      )}
      {personDm && (
        <>
          <p className={styles['patterns__variant-label']}>DM</p>
          <FixtureChannelHeader
            channel={personDm}
            overrides={{ pinnedCount: 1 }}
          />
        </>
      )}
      {groupDm && (
        <>
          <p className={styles['patterns__variant-label']}>GM</p>
          <FixtureChannelHeader
            channel={groupDm}
            overrides={{ pinnedCount: 1 }}
          />
        </>
      )}
      <p className={styles['patterns__variant-label']}>Threads</p>
      <ChannelHeader
        type="threads"
        name="Followed Threads"
        description="Threads you're participating in will automatically show here"
      />
      <p className={styles['patterns__variant-label']}>Drafts</p>
      <ChannelHeader
        type="drafts"
        name="Drafts"
        description="Any messages you've started will show here"
      />
    </div>
  );
}
