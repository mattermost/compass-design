import { Button } from '@mattermost/compass-ui/components/button';
import { Popover } from '@mattermost/compass-ui/components/popover';
import styles from '@/styles/library-demo/components.module.scss';

export default function PopoverLibrary() {
  return (
    <div className={styles['components__button-block']}>
      <div className={styles['components__button-row']}>
        <span className={styles['components__instance-label']}>Sizes</span>
        <Popover size="small" manageFocus={false} aria-label="Small">
          Small, 240px.
        </Popover>
        <Popover size="medium" manageFocus={false} aria-label="Medium">
          Medium, 320px.
        </Popover>
        <Popover size="large" manageFocus={false} aria-label="Large">
          Large, 400px.
        </Popover>
      </div>
      <div className={styles['components__button-row']}>
        <span className={styles['components__instance-label']}>
          Title, close and footer
        </span>
        <Popover
          title="Filter results"
          manageFocus={false}
          onClose={() => {}}
          footer={
            <>
              <Button emphasis="tertiary" size="small">
                Reset
              </Button>
              <Button emphasis="primary" size="small">
                Apply
              </Button>
            </>
          }
        >
          Choose which results to show.
        </Popover>
      </div>
    </div>
  );
}
