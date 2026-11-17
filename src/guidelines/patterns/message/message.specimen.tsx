import { workspaceChannels } from '@mattermost/compass-proto';
import { Divider } from '@mattermost/compass-ui/components/divider';
import { FixturePostMessage } from '@/guidelines/_components/FixtureChannel';
import styles from '@/styles/library-demo/patterns.module.scss';
import { plainBotPost, plainPersonPost } from './messageFixtures';

// A plain message from a person and a plain message from a bot, both real posts
// from the sample workspace (see messageFixtures): no card, file or reaction, so
// the pattern shows just the avatar, header and text.
const person = plainPersonPost;
const bot = plainBotPost;

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
