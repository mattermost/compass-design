import ChannelBookmarksDemo, {
  SAMPLE_BOOKMARKS,
} from '@/guidelines/_components/ChannelBookmarksDemo';
import styles from '@/styles/library-demo/patterns.module.scss';

// Each example sits in its own block with generous space below it.
const section = { marginBottom: 'var(--spacing-xxxxl)' } as const;

export default function ChannelBookmarksBarLibrary() {
  return (
    <>
      <div style={section}>
        <p className={styles['patterns__variant-label']}>
          Interactive — resize the window to see the combined overflow button
        </p>
        <ChannelBookmarksDemo addWhenEmpty />
      </div>
      <div style={section}>
        <p className={styles['patterns__variant-label']}>Few bookmarks</p>
        <ChannelBookmarksDemo
          initial={SAMPLE_BOOKMARKS.slice(0, 2)}
          addWhenEmpty
        />
      </div>
      <div style={section}>
        <p className={styles['patterns__variant-label']}>
          Read-only (no manage permission)
        </p>
        <ChannelBookmarksDemo
          initial={SAMPLE_BOOKMARKS.slice(0, 3)}
          canManage={false}
        />
      </div>
    </>
  );
}
