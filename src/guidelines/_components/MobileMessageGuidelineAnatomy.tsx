import sampleImage from '@/assets/images/sample-image.jpg';
import { AttachmentCard } from '@mattermost/compass-ui/components/attachment-card';
import { ImagePreview } from '@mattermost/compass-ui/components/image-preview';
import { LinkPreview } from '@mattermost/compass-ui/components/link-preview';
import { ReactionsRow } from '@mattermost/compass-ui/components/reactions-row';
import { MobileMessage, mobileMessageStyles } from '@mattermost/compass-proto';
import {
  mobileFile,
  mobileHumanPost,
  mobileImage,
  mobileLink,
  mobileReactedPost,
  mobileReactions,
} from '@/fixtures/mobilePatternFixtures';
import AnatomyStage from '@/guidelines/_components/AnatomyStage';
import styles from './MobileMessageGuidelineAnatomy.module.scss';

/**
 * Mobile Message pattern — anatomy preview on the shared AnatomyStage surface.
 */
export function MobileMessageAnatomyStage() {
  const post = mobileReactedPost ?? mobileHumanPost;
  const reactions = mobileReactions(post?.post);
  return (
    <AnatomyStage
      style={{
        alignItems: 'stretch',
        justifyContent: 'center',
        margin: '0 auto var(--spacing-m)',
      }}
    >
      <div className={styles['mobile-message-anatomy__frame']}>
        <MobileMessage
          showPinnedSavedIndicators
          avatarSrc={post?.avatarSrc}
          avatarAlt={post?.username ?? ''}
          username={post?.username ?? ''}
          timestamp={post?.timestamp ?? ''}
          linkPreview={
            <LinkPreview
              siteName={mobileLink?.siteName ?? 'example.com'}
              title={mobileLink?.title ?? 'Linked page'}
            />
          }
          imagePreviews={
            <ImagePreview
              src={mobileImage ?? sampleImage}
              alt=""
              onCopyLink={() => {}}
              onDownload={() => {}}
              onToggleCollapse={() => {}}
            />
          }
          footer={
            <>
              {mobileFile && <AttachmentCard {...mobileFile} />}
              <ReactionsRow reactions={reactions} showAddReaction />
            </>
          }
        >
          <p className={mobileMessageStyles['mobile-message__body-text']}>
            {post?.text}
          </p>
        </MobileMessage>
      </div>
    </AnatomyStage>
  );
}
