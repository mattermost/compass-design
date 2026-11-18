import { ReactionsRow } from '@mattermost/compass-ui/components/reactions-row';
import { MobileMessage, mobileMessageStyles } from '@mattermost/compass-proto';
import {
  mobileBotPost,
  mobileHumanPost,
  mobileReactedPost,
  mobileReactions,
  type MobilePost,
} from '@/fixtures/mobilePatternFixtures';
import styles from './mobile-message.specimen.module.scss';

const bodyTextClass = mobileMessageStyles['mobile-message__body-text'];

function Stage({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles['mm-specimen__stage']}>
      <p className={styles['mm-specimen__label']}>{label}</p>
      <div className={styles['mm-specimen__frame']}>{children}</div>
    </div>
  );
}

/** A message from the sample workspace in `MobileMessage`. */
function Post({
  data,
  ...rest
}: { data: MobilePost } & Partial<React.ComponentProps<typeof MobileMessage>>) {
  return (
    <MobileMessage
      avatarSrc={data.avatarSrc}
      avatarAlt={data.username}
      username={data.username}
      timestamp={data.timestamp}
      isBot={data.isBot}
      {...rest}
    >
      <p className={bodyTextClass}>{data.text}</p>
    </MobileMessage>
  );
}

export default function MobileMessageLibrary() {
  return (
    <div className={styles['mm-specimen']}>
      {mobileHumanPost && (
        <>
          <Stage label="Default">
            <Post data={mobileHumanPost} />
          </Stage>
          <Stage label="Active (tap)">
            <Post
              data={mobileHumanPost}
              className={mobileMessageStyles['mobile-message--state-active']}
            />
          </Stage>
        </>
      )}

      {mobileBotPost && (
        <Stage label="Bot">
          <Post data={mobileBotPost} isBot />
        </Stage>
      )}

      {(mobileReactedPost ?? mobileHumanPost) && (
        <Stage label="Pinned + reactions">
          <Post
            data={(mobileReactedPost ?? mobileHumanPost)!}
            showPinnedSavedIndicators
            footer={
              <ReactionsRow
                reactions={mobileReactions(mobileReactedPost?.post)}
                showAddReaction
              />
            }
          />
        </Stage>
      )}
    </div>
  );
}
