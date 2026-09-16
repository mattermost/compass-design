import { EmojiPopover } from '@mattermost/compass-proto';
import styles from '@/styles/library-demo/patterns.module.scss';

export default function EmojiPopoverSpecimen() {
  return (
    <div className={styles['patterns']}>
      <header className={styles['patterns__header']}>
        <h1 className={styles['patterns__heading']}>Emoji Popover</h1>
        <p className={styles['patterns__subheading']}>
          Browse and search emojis via a fixed-size popover surface.
        </p>
      </header>

      <section className={styles['patterns__section']}>
        <h2 className={styles['patterns__section-title']}>Default</h2>
        <p className={styles['patterns__variant-label']}>
          Full emoji grid grouped by category; skin-tone selector in search bar
        </p>
        <div className={styles['patterns__popover-menu-demo']}>
          <EmojiPopover state="default" />
        </div>
      </section>

      <section className={styles['patterns__section']}>
        <h2 className={styles['patterns__section-title']}>Search results</h2>
        <p className={styles['patterns__variant-label']}>
          Flat results group replacing the category grid
        </p>
        <div className={styles['patterns__popover-menu-demo']}>
          <EmojiPopover state="search-results" />
        </div>
      </section>

      <section className={styles['patterns__section']}>
        <h2 className={styles['patterns__section-title']}>Empty search</h2>
        <p className={styles['patterns__variant-label']}>
          No results; centered empty state
        </p>
        <div className={styles['patterns__popover-menu-demo']}>
          <EmojiPopover state="empty" />
        </div>
      </section>
    </div>
  );
}
