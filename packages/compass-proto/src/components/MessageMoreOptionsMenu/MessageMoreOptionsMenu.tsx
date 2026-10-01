import type { HTMLAttributes } from 'react';
import ArrowRightBoldOutlineIcon from '@mattermost/compass-icons/components/arrow-right-bold-outline';
import BookmarkOutlineIcon from '@mattermost/compass-icons/components/bookmark-outline';
import ChevronRightIcon from '@mattermost/compass-icons/components/chevron-right';
import ClockOutlineIcon from '@mattermost/compass-icons/components/clock-outline';
import ContentCopyIcon from '@mattermost/compass-icons/components/content-copy';
import FlagOutlineIcon from '@mattermost/compass-icons/components/flag-outline';
import LinkVariantIcon from '@mattermost/compass-icons/components/link-variant';
import MarkAsUnreadIcon from '@mattermost/compass-icons/components/mark-as-unread';
import MessageCheckOutlineIcon from '@mattermost/compass-icons/components/message-check-outline';
import PencilOutlineIcon from '@mattermost/compass-icons/components/pencil-outline';
import PinOutlineIcon from '@mattermost/compass-icons/components/pin-outline';
import ReplyOutlineIcon from '@mattermost/compass-icons/components/reply-outline';
import TranslateIcon from '@mattermost/compass-icons/components/translate';
import TrashCanOutlineIcon from '@mattermost/compass-icons/components/trash-can-outline';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { MenuItem } from '@mattermost/compass-ui/components/menu-item';
import {
  PopoverMenu,
  PopoverMenuDivider,
  PopoverMenuGroup,
} from '@mattermost/compass-ui/components/popover-menu';
import { ShortcutTag } from '@mattermost/compass-ui/components/shortcut-tag';

export interface MessageMoreOptionsMenuProps extends HTMLAttributes<HTMLDivElement> {
  /** Shows Edit and Delete rows. Default: true. */
  permissionToEdit?: boolean;
  /** Shows Flag message row. Default: true. */
  showFlagOption?: boolean;
}

function shortcutLabel(text: string) {
  return <ShortcutTag label={text} size="small" />;
}

/**
 * Message “more options” menu — actions with keyboard hints, optional edit/flag.
 */
export default function MessageMoreOptionsMenu({
  permissionToEdit = true,
  showFlagOption = true,
  className = '',
  style,
  ...rest
}: MessageMoreOptionsMenuProps) {
  return (
    <PopoverMenu className={className} style={style} {...rest}>
      <PopoverMenuGroup>
        <MenuItem
          label="Reply"
          leadingVisual={<Icon glyph={<ReplyOutlineIcon />} size="16" />}
          trailingElement
          trailingVisual={shortcutLabel('R')}
        />
        <MenuItem
          label="Forward"
          leadingVisual={
            <Icon glyph={<ArrowRightBoldOutlineIcon />} size="16" />
          }
          trailingElement
          trailingVisual={shortcutLabel('Shift + F')}
        />
        <MenuItem
          label="Follow thread"
          leadingVisual={<Icon glyph={<MessageCheckOutlineIcon />} size="16" />}
          trailingElement
          trailingVisual={shortcutLabel('F')}
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
        <MenuItem
          label="Remind"
          leadingVisual={<Icon glyph={<ClockOutlineIcon />} size="16" />}
          trailingElement
          trailingVisual={<Icon glyph={<ChevronRightIcon />} size="16" />}
        />
        <MenuItem
          label="Pin to channel"
          leadingVisual={<Icon glyph={<PinOutlineIcon />} size="16" />}
          trailingElement
          trailingVisual={shortcutLabel('P')}
        />
      </PopoverMenuGroup>
      <PopoverMenuDivider />
      <PopoverMenuGroup>
        <MenuItem
          label="Copy text"
          leadingVisual={<Icon glyph={<ContentCopyIcon />} size="16" />}
          trailingElement
          trailingVisual={shortcutLabel('C')}
        />
        <MenuItem
          label="Show translation"
          leadingVisual={<Icon glyph={<TranslateIcon />} size="16" />}
        />
        <MenuItem
          label="Copy link"
          leadingVisual={<Icon glyph={<LinkVariantIcon />} size="16" />}
          trailingElement
          trailingVisual={shortcutLabel('K')}
        />
      </PopoverMenuGroup>
      {permissionToEdit && (
        <>
          <PopoverMenuDivider />
          <PopoverMenuGroup>
            <MenuItem
              label="Edit"
              leadingVisual={<Icon glyph={<PencilOutlineIcon />} size="16" />}
              trailingElement
              trailingVisual={shortcutLabel('E')}
            />
            <MenuItem
              label="Delete"
              destructive
              leadingVisual={<Icon glyph={<TrashCanOutlineIcon />} size="16" />}
              trailingElement
              trailingVisual={shortcutLabel('delete')}
            />
          </PopoverMenuGroup>
        </>
      )}
      {showFlagOption && (
        <>
          {!permissionToEdit && <PopoverMenuDivider />}
          <PopoverMenuGroup>
            <MenuItem
              label="Flag message"
              destructive
              leadingVisual={<Icon glyph={<FlagOutlineIcon />} size="16" />}
            />
          </PopoverMenuGroup>
        </>
      )}
    </PopoverMenu>
  );
}
