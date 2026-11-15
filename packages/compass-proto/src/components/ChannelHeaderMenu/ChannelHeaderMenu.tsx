import type { HTMLAttributes } from 'react';
import AccountOutlineIcon from '@mattermost/compass-icons/components/account-outline';
import AppsIcon from '@mattermost/compass-icons/components/apps';
import ArchiveOutlineIcon from '@mattermost/compass-icons/components/archive-outline';
import BellOffOutlineIcon from '@mattermost/compass-icons/components/bell-off-outline';
import BellOutlineIcon from '@mattermost/compass-icons/components/bell-outline';
import BookmarkOutlineIcon from '@mattermost/compass-icons/components/bookmark-outline';
import ChevronRightIcon from '@mattermost/compass-icons/components/chevron-right';
import CogOutlineIcon from '@mattermost/compass-icons/components/cog-outline';
import ExitToAppIcon from '@mattermost/compass-icons/components/exit-to-app';
import FolderMoveOutlineIcon from '@mattermost/compass-icons/components/folder-move-outline';
import InformationOutlineIcon from '@mattermost/compass-icons/components/information-outline';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { MenuItem } from '@mattermost/compass-ui/components/menu-item';
import {
  PopoverMenu,
  PopoverMenuDivider,
  PopoverMenuGroup,
} from '@mattermost/compass-ui/components/popover-menu';
import BookmarksBarSubmenu from './BookmarksBarSubmenu';
import type { BookmarksBarSubmenuChoice } from './BookmarksBarSubmenu';

export interface ChannelHeaderMenuProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Makes the "Bookmarks bar" row open a submenu (Add a link / Attach a file),
   * as in the webapp; called with the choice. Without it the row is the static
   * submenu-style row. The submenu is portaled and positioned against the row.
   */
  onAddBookmark?: (type: BookmarksBarSubmenuChoice) => void;
  /**
   * Shows the static "Bookmarks bar" row in its active (submenu open) state.
   * Only for static previews; ignored when `onAddBookmark` is set.
   */
  bookmarksBarActive?: boolean;
}

/**
 * Channel header overflow menu — settings, members, more actions, and archive.
 */
export default function ChannelHeaderMenu({
  onAddBookmark,
  bookmarksBarActive = false,
  className = '',
  ...rest
}: ChannelHeaderMenuProps) {
  return (
    <PopoverMenu className={className} {...rest}>
      <PopoverMenuGroup>
        <MenuItem
          label="View info"
          leadingVisual={<Icon glyph={<InformationOutlineIcon />} size="16" />}
        />
        <MenuItem
          label="Mute channel"
          leadingVisual={<Icon glyph={<BellOffOutlineIcon />} size="16" />}
        />
        <MenuItem
          label="Notification preferences"
          leadingVisual={<Icon glyph={<BellOutlineIcon />} size="16" />}
        />
        <MenuItem
          label="Channel settings"
          leadingVisual={<Icon glyph={<CogOutlineIcon />} size="16" />}
          trailingElement
          trailingVisual={<Icon glyph={<ChevronRightIcon />} size="16" />}
        />
        {onAddBookmark ? (
          <BookmarksBarSubmenu onAddBookmark={onAddBookmark} />
        ) : (
          <MenuItem
            label="Bookmarks bar"
            active={bookmarksBarActive}
            leadingVisual={<Icon glyph={<BookmarkOutlineIcon />} size="16" />}
            trailingElement
            trailingVisual={<Icon glyph={<ChevronRightIcon />} size="16" />}
          />
        )}
      </PopoverMenuGroup>
      <PopoverMenuDivider />
      <PopoverMenuGroup>
        <MenuItem
          label="Members"
          leadingVisual={<Icon glyph={<AccountOutlineIcon />} size="16" />}
        />
      </PopoverMenuGroup>
      <PopoverMenuDivider />
      <PopoverMenuGroup>
        <MenuItem
          label="Move to"
          leadingVisual={<Icon glyph={<FolderMoveOutlineIcon />} size="16" />}
          trailingElement
          trailingVisual={<Icon glyph={<ChevronRightIcon />} size="16" />}
        />
        <MenuItem
          label="More actions"
          leadingVisual={<Icon glyph={<AppsIcon />} size="16" />}
          trailingElement
          trailingVisual={<Icon glyph={<ChevronRightIcon />} size="16" />}
        />
      </PopoverMenuGroup>
      <PopoverMenuDivider />
      <PopoverMenuGroup>
        <MenuItem
          label="Leave channel"
          destructive
          leadingVisual={<Icon glyph={<ExitToAppIcon />} size="16" />}
        />
        <MenuItem
          label="Archive channel"
          destructive
          leadingVisual={<Icon glyph={<ArchiveOutlineIcon />} size="16" />}
        />
      </PopoverMenuGroup>
    </PopoverMenu>
  );
}
