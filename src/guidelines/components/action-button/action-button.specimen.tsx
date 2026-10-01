import BellOffOutlineIcon from '@mattermost/compass-icons/components/bell-off-outline';
import BellOutlineIcon from '@mattermost/compass-icons/components/bell-outline';
import EmoticonHappyOutlineIcon from '@mattermost/compass-icons/components/emoticon-happy-outline';
import LinkVariantIcon from '@mattermost/compass-icons/components/link-variant';
import StarIcon from '@mattermost/compass-icons/components/star';
import StarOutlineIcon from '@mattermost/compass-icons/components/star-outline';
import TrashCanOutlineIcon from '@mattermost/compass-icons/components/trash-can-outline';
import { ActionButton } from '@mattermost/compass-ui/components/action-button';
import { Icon } from '@mattermost/compass-ui/components/icon';
import styles from '@/styles/library-demo/components.module.scss';

export default function ActionButtonLibrary() {
  return (
    <>
      <div className={styles['components__button-block']}>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Default</span>
          <ActionButton
            icon={<Icon glyph={<EmoticonHappyOutlineIcon />} />}
            label="Action"
            aria-label="Action"
          />
          <ActionButton
            icon={<Icon glyph={<StarOutlineIcon />} />}
            label="Favorite"
            aria-label="Favorite"
          />
          <ActionButton
            icon={<Icon glyph={<BellOutlineIcon />} />}
            label="Mute"
            aria-label="Mute"
          />
          <ActionButton
            icon={<Icon glyph={<LinkVariantIcon />} />}
            label="Copy Link"
            aria-label="Copy link"
          />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Active</span>
          <ActionButton
            icon={<Icon glyph={<EmoticonHappyOutlineIcon />} />}
            label="Action"
            aria-label="Action"
            active
          />
          <ActionButton
            icon={<Icon glyph={<StarIcon />} />}
            label="Favorited"
            aria-label="Favorited"
            active
          />
          <ActionButton
            icon={<Icon glyph={<BellOffOutlineIcon />} />}
            label="Muted"
            aria-label="Muted"
            active
          />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Destructive
          </span>
          <ActionButton
            icon={<Icon glyph={<TrashCanOutlineIcon />} />}
            label="Delete"
            aria-label="Delete"
            destructive
          />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Disabled</span>
          <ActionButton
            icon={<Icon glyph={<EmoticonHappyOutlineIcon />} />}
            label="Action"
            aria-label="Action"
            disabled
          />
        </div>
      </div>
    </>
  );
}
