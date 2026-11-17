import { useMemo, useState, type ReactNode } from 'react';
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
  ChannelBookmarksBar,
  type ChannelBookmarkAddType,
  type ChannelBookmarkModalProps,
  ChannelHeaderMenu,
} from '@mattermost/compass-proto';
import {
  channelWithoutBookmarks,
  workspaceBookmarks,
} from '@/fixtures/workspaceBookmarks';
import { FixtureChannelHeader } from './FixtureChannel';
import ChannelBookmarksDemo, {
  SAMPLE_BOOKMARKS,
  SAMPLE_FILE_BOOKMARK,
} from './ChannelBookmarksDemo';
import styles from './ChannelBookmarksExamples.module.scss';

/** The bar as the anatomy shows it: two of the workspace's bookmarks and a file. */
export function BookmarksAnatomyExample() {
  return (
    <div className={styles['examples__full']}>
      <ChannelBookmarksBar
        bookmarks={[...workspaceBookmarks.slice(0, 2), SAMPLE_FILE_BOOKMARK]}
      />
    </div>
  );
}

/** A channel header with no bookmarks bar under it (a channel with none). */
export function BookmarksEmptyChannelExample() {
  return (
    <div className={styles['examples__full']}>
      {channelWithoutBookmarks && (
        <FixtureChannelHeader channel={channelWithoutBookmarks} />
      )}
    </div>
  );
}

/** Editing a link bookmark: the modal opens with the first bookmark's values and an emoji. */
export function BookmarkEditExample({ height = 400 }: { height?: number }) {
  const first = SAMPLE_BOOKMARKS[0];
  return (
    <BookmarkModalExample
      type="link"
      height={height}
      initialValues={{
        title: typeof first?.label === 'string' ? first.label : undefined,
        url: first?.href,
        emoji: first?.emoji ?? '📚',
      }}
    />
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
      <ChannelBookmarksDemo addWhenEmpty />
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
  /** Name of the picked file (file type, new bookmark): shown as an attachment card. */
  fileName?: string;
  /** Upload progress for the picked file, 0–100. */
  uploadProgress?: number;
}

/** The add / attach / edit modal, staged in a frame instead of full-screen. */
export function BookmarkModalExample({
  type = 'link',
  initialValues,
  height = 400,
  fileName,
  uploadProgress,
}: BookmarkModalExampleProps) {
  const file = useMemo(
    () =>
      fileName ? new File([new Uint8Array(3_400_000)], fileName) : undefined,
    [fileName],
  );
  return (
    <ModalStage height={height}>
      {(container) => (
        <ChannelBookmarkModal
          open
          type={type}
          initialValues={initialValues}
          file={file}
          uploadProgress={uploadProgress}
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
