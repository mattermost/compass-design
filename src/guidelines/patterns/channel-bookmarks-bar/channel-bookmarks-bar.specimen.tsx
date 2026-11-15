import ChannelBookmarksDemo, {
  SAMPLE_BOOKMARKS,
} from '@/guidelines/_components/ChannelBookmarksDemo';
import styles from '@/styles/library-demo/patterns.module.scss';

export default function ChannelBookmarksBarLibrary() {
  return (
    <div className={styles['patterns__channel-header-demo']}>
      <p className={styles['patterns__variant-label']}>
        Interactive — resize the window to see the +N overflow
      </p>
      <ChannelBookmarksDemo />
      <p className={styles['patterns__variant-label']}>Few bookmarks</p>
      <ChannelBookmarksDemo initial={SAMPLE_BOOKMARKS.slice(0, 2)} />
      <p className={styles['patterns__variant-label']}>
        Empty — Add bookmark chip
      </p>
      <ChannelBookmarksDemo initial={[]} />
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
