import { SearchInput } from '@mattermost/compass-ui/components/search-input';
import styles from '@/styles/library-demo/components.module.scss';

export default function SearchInputLibrary() {
  return (
    <>
      <div className={styles['components__button-block']}>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Sizes</span>
          <SearchInput size="small" placeholder="Small search..." />
          <SearchInput size="medium" placeholder="Medium search..." />
          <SearchInput size="large" placeholder="Large search..." />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            With label
          </span>
          <SearchInput
            label="Search channels"
            placeholder="Find a channel..."
          />
          <SearchInput label="With value" defaultValue="release notes" />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>States</span>
          <SearchInput
            label="Disabled"
            disabled
            placeholder="Disabled search..."
          />
          <SearchInput label="Invalid" defaultValue="bad query" invalid />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Field message
          </span>
          <SearchInput label="Search" message="No matches found." />
          <SearchInput
            label="Search"
            defaultValue="design"
            message="Try another keyword."
            messageTone="info"
          />
        </div>
      </div>
    </>
  );
}
