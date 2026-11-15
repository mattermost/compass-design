import { useRef } from 'react';
import { Button } from '@mattermost/compass-ui/components/button';
import ChannelBookmarksDemo, {
  SAMPLE_BOOKMARKS,
  type ChannelBookmarksDemoHandle,
} from '@/guidelines/_components/ChannelBookmarksDemo';
import styles from '@/styles/library-demo/patterns.module.scss';

export default function ChannelBookmarksBarLibrary() {
  const emptyRef = useRef<ChannelBookmarksDemoHandle>(null);

  return (
    <div className={styles['patterns__channel-header-demo']}>
      <p className={styles['patterns__variant-label']}>
        Interactive — resize the window to see the combined overflow button
      </p>
      <ChannelBookmarksDemo />
      <p className={styles['patterns__variant-label']}>Few bookmarks</p>
      <ChannelBookmarksDemo initial={SAMPLE_BOOKMARKS.slice(0, 2)} />
      <p className={styles['patterns__variant-label']}>
        No bookmarks — the bar is hidden until the first one is added
      </p>
      <div style={{ display: 'flex', gap: 'var(--spacing-s)' }}>
        <Button
          emphasis="secondary"
          size="small"
          onClick={() => emptyRef.current?.openAdd('link')}
        >
          Add a link
        </Button>
        <Button
          emphasis="secondary"
          size="small"
          onClick={() => emptyRef.current?.openAdd('file')}
        >
          Attach a file
        </Button>
      </div>
      <ChannelBookmarksDemo ref={emptyRef} initial={[]} />
      <p className={styles['patterns__variant-label']}>
        Read-only (no manage permission)
      </p>
      <ChannelBookmarksDemo
        initial={SAMPLE_BOOKMARKS.slice(0, 3)}
        canManage={false}
      />
    </div>
  );
}
