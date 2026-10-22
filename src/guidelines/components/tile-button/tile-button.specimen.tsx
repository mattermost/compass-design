/* eslint-disable jsx-a11y/anchor-has-content -- asChild replaces empty anchor children with action anatomy */
import BellOffOutlineIcon from '@mattermost/compass-icons/components/bell-off-outline';
import BellOutlineIcon from '@mattermost/compass-icons/components/bell-outline';
import EmoticonHappyOutlineIcon from '@mattermost/compass-icons/components/emoticon-happy-outline';
import LinkVariantIcon from '@mattermost/compass-icons/components/link-variant';
import StarIcon from '@mattermost/compass-icons/components/star';
import StarOutlineIcon from '@mattermost/compass-icons/components/star-outline';
import TrashCanOutlineIcon from '@mattermost/compass-icons/components/trash-can-outline';
import { TileButton } from '@mattermost/compass-ui/components/tile-button';
import { Icon } from '@mattermost/compass-ui/components/icon';
import styles from '@/styles/library-demo/components.module.scss';

export default function TileButtonLibrary() {
  return (
    <>
      <div className={styles['components__button-block']}>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Default</span>
          <TileButton
            icon={<Icon glyph={<EmoticonHappyOutlineIcon />} />}
            label="Action"
            aria-label="Action"
          />
          <TileButton
            icon={<Icon glyph={<StarOutlineIcon />} />}
            label="Favorite"
            aria-label="Favorite"
          />
          <TileButton
            icon={<Icon glyph={<BellOutlineIcon />} />}
            label="Mute"
            aria-label="Mute"
          />
          <TileButton
            icon={<Icon glyph={<LinkVariantIcon />} />}
            label="Copy Link"
            aria-label="Copy link"
          />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Toggled</span>
          <TileButton
            icon={<Icon glyph={<EmoticonHappyOutlineIcon />} />}
            label="Action"
            aria-label="Action"
            toggled
          />
          <TileButton
            icon={<Icon glyph={<StarIcon />} />}
            label="Favorited"
            aria-label="Favorited"
            toggled
          />
          <TileButton
            icon={<Icon glyph={<BellOffOutlineIcon />} />}
            label="Muted"
            aria-label="Muted"
            toggled
          />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Destructive
          </span>
          <TileButton
            icon={<Icon glyph={<TrashCanOutlineIcon />} />}
            label="Delete"
            aria-label="Delete"
            destructive
          />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Disabled</span>
          <TileButton
            icon={<Icon glyph={<EmoticonHappyOutlineIcon />} />}
            label="Action"
            aria-label="Action"
            disabled
          />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>As link</span>
          <TileButton
            asChild
            icon={<Icon glyph={<LinkVariantIcon />} />}
            label="View profile"
            aria-label="View profile"
          >
            <a href="#profile" />
          </TileButton>
          <TileButton
            asChild
            icon={<Icon glyph={<LinkVariantIcon />} />}
            label="Unavailable"
            aria-label="Unavailable"
            disabled
          >
            <a href="#disabled" />
          </TileButton>
        </div>
      </div>
    </>
  );
}
