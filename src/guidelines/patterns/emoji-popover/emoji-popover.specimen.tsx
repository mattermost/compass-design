import { EmojiPopover } from '@mattermost/compass-proto';
import styles from '@/styles/library-demo/patterns.module.scss';

export default function EmojiPopoverSpecimen() {
  return (
    <div className={styles['patterns']}>
      <header className={styles['patterns__header']}>
        <h1 className={styles['patterns__heading']}>Emoji Popover</h1>
        <p className={styles['patterns__subheading']}>
          Browse and search emojis or GIFs via a tabbed, fixed-size popover surface.
        </p>
      </header>

      <section className={styles['patterns__section']}>
        <h2 className={styles['patterns__section-title']}>Emojis — default</h2>
        <p className={styles['patterns__variant-label']}>
          Full emoji grid grouped by category; skin-tone selector in search bar
        </p>
        <div className={styles['patterns__popover-menu-demo']}>
          <EmojiPopover defaultTab="emojis" state="default" />
        </div>
      </section>

      <section className={styles['patterns__section']}>
        <h2 className={styles['patterns__section-title']}>Emojis — search results</h2>
        <p className={styles['patterns__variant-label']}>
          Flat results group; clear button replaces skin-tone selector
        </p>
        <div className={styles['patterns__popover-menu-demo']}>
          <EmojiPopover defaultTab="emojis" state="search-results" />
        </div>
      </section>

      <section className={styles['patterns__section']}>
        <h2 className={styles['patterns__section-title']}>Emojis — empty search</h2>
        <p className={styles['patterns__variant-label']}>
          No results; centered empty state with clear button
        </p>
        <div className={styles['patterns__popover-menu-demo']}>
          <EmojiPopover defaultTab="emojis" state="empty" />
        </div>
      </section>

      <section className={styles['patterns__section']}>
        <h2 className={styles['patterns__section-title']}>GIFs — default</h2>
        <p className={styles['patterns__variant-label']}>
          Two-column GIF grid powered by GIPHY; no category navigation
        </p>
        <div className={styles['patterns__popover-menu-demo']}>
          <EmojiPopover defaultTab="gifs" state="default" />
        </div>
      </section>

      <section className={styles['patterns__section']}>
        <h2 className={styles['patterns__section-title']}>GIFs — search results</h2>
        <p className={styles['patterns__variant-label']}>
          GIF grid with results from a search query; clear button in search bar
        </p>
        <div className={styles['patterns__popover-menu-demo']}>
          <EmojiPopover defaultTab="gifs" state="search-results" />
        </div>
      </section>

      <section className={styles['patterns__section']}>
        <h2 className={styles['patterns__section-title']}>GIFs — empty search</h2>
        <p className={styles['patterns__variant-label']}>
          No GIF results; centered empty state
        </p>
        <div className={styles['patterns__popover-menu-demo']}>
          <EmojiPopover defaultTab="gifs" state="empty" />
        </div>
      </section>
    </div>
  );
}
