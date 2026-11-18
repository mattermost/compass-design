import { AttachmentCard } from '@mattermost/compass-ui/components/attachment-card';
import { ImagePreview } from '@mattermost/compass-ui/components/image-preview';
import { LinkPreview } from '@mattermost/compass-ui/components/link-preview';
import { Message, getWorkspaceUser } from '@mattermost/compass-proto';
import { ReactionsRow } from '@mattermost/compass-ui/components/reactions-row';
import { workspaceCurrentUserId } from '@mattermost/compass-proto';
import { attachmentFileType, formatFileSize } from '@mattermost/compass-proto';
import { attachmentImages } from '@/fixtures/attachmentImages';
import { avatars } from '@/fixtures/avatarRegistry';
import AnatomyStage from '@/guidelines/_components/AnatomyStage';
import FixtureMarkdown from '@/guidelines/_components/FixtureMarkdown';
import {
  anatomyPost,
  anatomyReactions,
} from '@/guidelines/patterns/message/messageFixtures';
import styles from './MessageGuidelineAnatomy.module.scss';

// The attachment-image fixtures stand in for an image shared in the message.
const [imageId, imageSrc] = Object.entries(attachmentImages)[0] ?? [];

/**
 * Message pattern — composite anatomy preview on the shared AnatomyStage surface.
 * Author, time, text, file and reactions come from the sample workspace; the
 * link preview is written here (the sample data has no unfurled links).
 */
export function MessageGuidelineAnatomyStage() {
  const post = anatomyPost;
  if (!post) return null;
  const author = getWorkspaceUser(post.userId);
  const name = author?.displayName ?? post.userId;
  return (
    <AnatomyStage
      style={{
        alignItems: 'stretch',
        justifyContent: 'center',
        margin: '0 auto var(--spacing-m)',
      }}
    >
      <div className={styles['message-anatomy']}>
        <Message
          showPinnedSavedIndicators
          avatarSrc={avatars[post.userId]}
          avatarAlt={name}
          username={name}
          timestamp={post.timestamp}
          linkPreview={
            <LinkPreview
              siteName="mattermost.com"
              title="Mattermost: Open source collaboration"
              description="Secure team messaging and workflow orchestration for technical teams."
            />
          }
          imagePreviews={
            imageSrc ? (
              <ImagePreview
                src={imageSrc}
                alt={imageId ?? ''}
                onCopyLink={() => {}}
                onDownload={() => {}}
                onToggleCollapse={() => {}}
              />
            ) : undefined
          }
          footer={
            <>
              {post.files?.map((f) => (
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
                />
              ))}
              {anatomyReactions.length > 0 && (
                <ReactionsRow
                  reactions={anatomyReactions.map((r) => ({
                    emoji: r.emoji,
                    count: r.userIds.length,
                    byCurrentUser: r.userIds.includes(workspaceCurrentUserId),
                  }))}
                  showAddReaction
                />
              )}
            </>
          }
        >
          <FixtureMarkdown text={post.text} />
        </Message>
      </div>
    </AnatomyStage>
  );
}
