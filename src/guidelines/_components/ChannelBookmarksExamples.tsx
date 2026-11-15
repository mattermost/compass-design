import { useState, type ReactNode } from 'react';
import LinkVariantIcon from '@mattermost/compass-icons/components/link-variant';
import PaperclipIcon from '@mattermost/compass-icons/components/paperclip';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { MenuItem } from '@mattermost/compass-ui/components/menu-item';
import {
  PopoverMenu,
  PopoverMenuGroup,
} from '@mattermost/compass-ui/components/popover-menu';
import {
  ChannelBookmarkModal,
  type ChannelBookmarkAddType,
  type ChannelBookmarkModalProps,
  ChannelHeader,
  ChannelHeaderMenu,
} from '@mattermost/compass-proto';
import ChannelBookmarksDemo from './ChannelBookmarksDemo';
import styles from './ChannelBookmarksExamples.module.scss';

/** A channel header with no bookmarks bar under it (an empty channel). */
export function BookmarksEmptyChannelExample() {
  return (
    <div className={styles['examples__full']}>
      <ChannelHeader
        type="channel"
        name="Town Square"
        description="Company-wide announcements and general discussion."
        memberCount={124}
        pinnedCount={2}
      />
    </div>
  );
}

/** The channel header menu beside its "Bookmarks bar" submenu (static surfaces). */
export function BookmarksHeaderMenuExample() {
  return (
    <div className={styles['examples__menus']}>
      <ChannelHeaderMenu bookmarksBarActive />
      <PopoverMenu variant="child" className={styles['examples__submenu']}>
        <PopoverMenuGroup>
          <MenuItem
            label="Add a link"
            leadingVisual={<Icon glyph={<LinkVariantIcon />} size="16" />}
          />
          <MenuItem
            label="Attach a file"
            leadingVisual={<Icon glyph={<PaperclipIcon />} size="16" />}
          />
        </PopoverMenuGroup>
      </PopoverMenu>
    </div>
  );
}

/** A bar narrow enough that some bookmarks collapse into the overflow button. */
export function BookmarksOverflowExample() {
  return (
    <div className={styles['examples__narrow']}>
      <ChannelBookmarksDemo />
    </div>
  );
}

interface ModalStageProps {
  height: number;
  children: (container: HTMLElement) => ReactNode;
}

function ModalStage({ height, children }: ModalStageProps) {
  const [stage, setStage] = useState<HTMLDivElement | null>(null);
  return (
    <div
      ref={setStage}
      className={styles['examples__stage']}
      style={{ height }}
    >
      {stage && children(stage)}
    </div>
  );
}

export interface BookmarkModalExampleProps {
  type?: ChannelBookmarkAddType;
  initialValues?: ChannelBookmarkModalProps['initialValues'];
  /** Stage height in px. */
  height?: number;
}

/** The add / attach / edit modal, staged in a frame instead of full-screen. */
export function BookmarkModalExample({
  type = 'link',
  initialValues,
  height = 400,
}: BookmarkModalExampleProps) {
  return (
    <ModalStage height={height}>
      {(container) => (
        <ChannelBookmarkModal
          open
          type={type}
          initialValues={initialValues}
          container={container}
          lockScroll={false}
          manageFocus={false}
          overlayStyle={{ position: 'absolute' }}
          onClose={() => {}}
          onSubmit={() => {}}
        />
      )}
    </ModalStage>
  );
}
