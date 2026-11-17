import { Message, getWorkspaceUser } from '@mattermost/compass-proto';
import { messageStyles } from '@mattermost/compass-proto';
import { avatars } from '@/fixtures/avatarRegistry';
import FixtureMarkdown from '@/guidelines/_components/FixtureMarkdown';
import Preview from '@/guidelines/_components/Preview';
import { plainPersonPost } from '@/guidelines/patterns/message/messageFixtures';
import styles from './MessageGuidelineStates.module.scss';

/**
 * Default vs hover snapshots for the Message pattern guidelines (States section),
 * on a real message from the sample workspace.
 */
export function MessageGuidelineStates() {
  const post = plainPersonPost;
  if (!post) return null;
  const name = getWorkspaceUser(post.userId)?.displayName ?? post.userId;
  const message = (className?: string) => (
    <Message
      className={className}
      avatarSrc={avatars[post.userId]}
      avatarAlt={name}
      username={name}
      timestamp={post.timestamp}
    >
      <FixtureMarkdown text={post.text} />
    </Message>
  );
  return (
    <div className={styles['message-states']}>
      <Preview caption="Default">{message()}</Preview>
      <Preview caption="Hover">
        {message(messageStyles['message--state-hover'])}
      </Preview>
    </div>
  );
}
