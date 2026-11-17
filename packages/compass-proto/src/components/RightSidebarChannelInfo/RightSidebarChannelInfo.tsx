/* eslint-disable jsx-a11y/anchor-is-valid -- placeholder channel-header links in demo content */
import type { ReactNode } from 'react';
import StarOutlineIcon from '@mattermost/compass-icons/components/star-outline';
import BellOutlineIcon from '@mattermost/compass-icons/components/bell-outline';
import AccountPlusOutlineIcon from '@mattermost/compass-icons/components/account-plus-outline';
import LinkVariantIcon from '@mattermost/compass-icons/components/link-variant';
import CogOutlineIcon from '@mattermost/compass-icons/components/cog-outline';
import AccountMultipleOutlineIcon from '@mattermost/compass-icons/components/account-multiple-outline';
import PinOutlineIcon from '@mattermost/compass-icons/components/pin-outline';
import FileTextOutlineIcon from '@mattermost/compass-icons/components/file-text-outline';
import { TileButton } from '@mattermost/compass-ui/components/tile-button';
import { Divider } from '@mattermost/compass-ui/components/divider';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { MenuItem } from '@mattermost/compass-ui/components/menu-item';
import styles from './RightSidebarChannelInfo.module.scss';

const LEGACY_HEADER = (
  <>
    <a href="#" className={styles['right-sidebar-channel-info__link']}>
      Spec Template
    </a>
    {' | '}
    <a href="#" className={styles['right-sidebar-channel-info__link']}>
      UX Guidelines
    </a>
    {' | '}
    <a href="#" className={styles['right-sidebar-channel-info__link']}>
      UX Scratch
    </a>
    {' | '}
    <a href="#" className={styles['right-sidebar-channel-info__link']}>
      (Internal) UX Folder
    </a>
    {' | '}
    <a href="#" className={styles['right-sidebar-channel-info__link']}>
      Design Checklist
    </a>
    {' | '}
    <a href="#" className={styles['right-sidebar-channel-info__link']}>
      Design Checklist
    </a>
    {' | '}
    <a href="#" className={styles['right-sidebar-channel-info__link']}>
      Design Meeting Notes
    </a>
    {' | '}
    <a href="#" className={styles['right-sidebar-channel-info__link']}>
      OKRs…
    </a>{' '}
    <a
      href="#"
      className={[
        styles['right-sidebar-channel-info__link'],
        styles['right-sidebar-channel-info__link-more'],
      ].join(' ')}
    >
      More
    </a>
  </>
);

/** Count on the right of a menu row; nothing when the count is unknown. */
function count(n: number | undefined) {
  return n === undefined ? undefined : (
    <span className={styles['right-sidebar-channel-info__count']}>{n}</span>
  );
}

export interface RightSidebarChannelInfoProps {
  /** Channel name. Default: the demo channel name. */
  name?: ReactNode;
  /** Channel purpose. `null` hides the section. Default: demo text. */
  purpose?: ReactNode | null;
  /** Channel header text or links. `null` hides the section. Default: demo links. */
  header?: ReactNode | null;
  /** Shown as "ID: …". `null` hides the line. Default: a demo id. */
  channelId?: string | null;
  /** Toggles the Favorite tile. */
  favorited?: boolean;
  /** Toggles the Mute tile (its label becomes "Unmute"). */
  muted?: boolean;
  /** Shows the Add people tile. Default: true. */
  showAddPeople?: boolean;
  /** Count shown on the Members row. */
  memberCount?: number;
  /** Count shown on the Pinned Messages row. */
  pinnedCount?: number;
  /** Count shown on the Files row. */
  fileCount?: number;
}

/**
 * Right sidebar body for channel info. With no props it renders the demo
 * content; pass the props to show a real channel.
 */
export default function RightSidebarChannelInfo({
  name = 'UX Design',
  purpose = 'Discussion of UX by core contributors and staff.',
  header = LEGACY_HEADER,
  channelId = 'ggq4jzr8o386bpqytigtswjfr',
  favorited,
  muted,
  showAddPeople = true,
  memberCount,
  pinnedCount,
  fileCount,
}: RightSidebarChannelInfoProps) {
  return (
    <>
      <div className={styles['right-sidebar-channel-info__actions']}>
        <TileButton
          className={styles['right-sidebar-channel-info__action']}
          icon={<Icon glyph={<StarOutlineIcon />} />}
          label="Favorite"
          toggled={favorited}
        />
        <TileButton
          className={styles['right-sidebar-channel-info__action']}
          icon={<Icon glyph={<BellOutlineIcon />} />}
          label={muted ? 'Unmute' : 'Mute'}
          toggled={muted}
        />
        {showAddPeople && (
          <TileButton
            className={styles['right-sidebar-channel-info__action']}
            icon={<Icon glyph={<AccountPlusOutlineIcon />} />}
            label="Add people"
          />
        )}
        <TileButton
          className={styles['right-sidebar-channel-info__action']}
          icon={<Icon glyph={<LinkVariantIcon />} />}
          label="Copy Link"
        />
      </div>

      <div className={styles['right-sidebar-channel-info__about']}>
        <h3 className={styles['right-sidebar-channel-info__name']}>{name}</h3>

        {purpose != null && (
          <div className={styles['right-sidebar-channel-info__group']}>
            <span className={styles['right-sidebar-channel-info__group-title']}>
              Channel Purpose
            </span>
            <p className={styles['right-sidebar-channel-info__body-text']}>
              {purpose}
            </p>
          </div>
        )}

        {header != null && (
          <div className={styles['right-sidebar-channel-info__group']}>
            <span className={styles['right-sidebar-channel-info__group-title']}>
              Channel Header
            </span>
            <div className={styles['right-sidebar-channel-info__header-text']}>
              {header}
            </div>
          </div>
        )}

        {channelId != null && (
          <p className={styles['right-sidebar-channel-info__id']}>
            ID: {channelId}
          </p>
        )}
      </div>

      <Divider />

      <nav className={styles['right-sidebar-channel-info__menu']}>
        <MenuItem
          label="Channel Settings"
          leadingVisual={<Icon size="16" glyph={<CogOutlineIcon />} />}
        />
        <MenuItem
          label="Notification Preferences"
          leadingVisual={<Icon size="16" glyph={<BellOutlineIcon />} />}
        />
        <MenuItem
          label="Members"
          trailingVisual={count(memberCount)}
          trailingElement={memberCount !== undefined}
          leadingVisual={
            <Icon size="16" glyph={<AccountMultipleOutlineIcon />} />
          }
        />
        <MenuItem
          label="Pinned Messages"
          trailingVisual={count(pinnedCount)}
          trailingElement={pinnedCount !== undefined}
          leadingVisual={<Icon size="16" glyph={<PinOutlineIcon />} />}
        />
        <MenuItem
          label="Files"
          trailingVisual={count(fileCount)}
          trailingElement={fileCount !== undefined}
          leadingVisual={<Icon size="16" glyph={<FileTextOutlineIcon />} />}
        />
      </nav>
    </>
  );
}
