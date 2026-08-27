import EmoticonHappyOutlineIcon from '@mattermost/compass-icons/components/emoticon-happy-outline';
import avatarLeonard from '@/assets/avatars/Leonard Riley.png';
import { Chip } from '@mattermost/compass-ui';
import styles from '@/styles/library-demo/components.module.scss';

export default function ChipLibrary() {
  return (
    <>
      <div className={styles['components__button-block']}>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Sizes</span>
          <Chip size="small" onRemove={() => {}}>
            Label
          </Chip>
          <Chip size="medium" onRemove={() => {}}>
            Label
          </Chip>
          <Chip size="medium-compact" onRemove={() => {}}>
            Label
          </Chip>
          <Chip size="large" onRemove={() => {}}>
            Label
          </Chip>
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Leading</span>
          <Chip size="medium" onRemove={() => {}}>
            No leading
          </Chip>
          <Chip
            size="medium"
            leadingIcon={<EmoticonHappyOutlineIcon size={12} />}
            onRemove={() => {}}
          >
            With icon
          </Chip>
          <Chip
            size="medium"
            leadingAvatar={{ src: avatarLeonard, alt: 'Leonard Riley' }}
            onRemove={() => {}}
          >
            Leonard Riley
          </Chip>
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>States</span>
          <Chip size="medium" onRemove={() => {}}>
            Default
          </Chip>
          <Chip size="medium" error onRemove={() => {}}>
            Error
          </Chip>
          <Chip size="medium" colored onRemove={() => {}}>
            Colored
          </Chip>
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            No remove
          </span>
          <Chip size="small">Small</Chip>
          <Chip size="medium">Medium</Chip>
          <Chip size="large">Large</Chip>
        </div>
      </div>
    </>
  );
}
