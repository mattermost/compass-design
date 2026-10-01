import type { HTMLAttributes } from 'react';
import BookmarkOutlineIcon from '@mattermost/compass-icons/components/bookmark-outline';
import LinkVariantIcon from '@mattermost/compass-icons/components/link-variant';
import MarkAsUnreadIcon from '@mattermost/compass-icons/components/mark-as-unread';
import MessageMinusOutlineIcon from '@mattermost/compass-icons/components/message-minus-outline';
import OpenInNewIcon from '@mattermost/compass-icons/components/open-in-new';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { MenuItem } from '@mattermost/compass-ui/components/menu-item';
import {
  PopoverMenu,
  PopoverMenuDivider,
  PopoverMenuGroup,
} from '@mattermost/compass-ui/components/popover-menu';
import { ShortcutTag } from '@mattermost/compass-ui/components/shortcut-tag';

export type ThreadActionsMenuProps = HTMLAttributes<HTMLDivElement>;

function shortcutLabel(text: string) {
  return <ShortcutTag label={text} size="small" />;
}

/**
 * Thread list / thread header actions menu.
 */
export default function ThreadActionsMenu({
  className = '',
  style,
  ...rest
}: ThreadActionsMenuProps) {
  return (
    <PopoverMenu className={className} style={style} {...rest}>
      <PopoverMenuGroup>
        <MenuItem
          label="Unfollow thread"
          leadingVisual={<Icon glyph={<MessageMinusOutlineIcon />} size="16" />}
        />
        <MenuItem
          label="Open in channel"
          leadingVisual={<Icon glyph={<OpenInNewIcon />} size="16" />}
        />
        <MenuItem
          label="Mark as unread"
          leadingVisual={<Icon glyph={<MarkAsUnreadIcon />} size="16" />}
          trailingElement
          trailingVisual={shortcutLabel('U')}
        />
        <MenuItem
          label="Save"
          leadingVisual={<Icon glyph={<BookmarkOutlineIcon />} size="16" />}
          trailingElement
          trailingVisual={shortcutLabel('S')}
        />
      </PopoverMenuGroup>
      <PopoverMenuDivider />
      <PopoverMenuGroup>
        <MenuItem
          label="Copy link"
          leadingVisual={<Icon glyph={<LinkVariantIcon />} size="16" />}
          trailingElement
          trailingVisual={shortcutLabel('K')}
        />
      </PopoverMenuGroup>
    </PopoverMenu>
  );
}
