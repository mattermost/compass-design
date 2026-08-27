import { Dropdown } from '@mattermost/compass-ui';
import styles from '@/styles/library-demo/components.module.scss';

export default function DropdownLibrary() {
  return (
    <>
      <div className={styles['components__button-block']}>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Sizes</span>
          <Dropdown size="x-small">X-Small</Dropdown>
          <Dropdown size="small">Small</Dropdown>
          <Dropdown size="medium">Medium</Dropdown>
          <Dropdown size="large">Large</Dropdown>
          <Dropdown size="x-large">X-Large</Dropdown>
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Padding</span>
          <Dropdown size="medium">Tight</Dropdown>
          <Dropdown size="medium" padding="compact">
            Compact
          </Dropdown>
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>States</span>
          <Dropdown>Default</Dropdown>
          <Dropdown isOpen>Open</Dropdown>
          <Dropdown disabled>Disabled</Dropdown>
        </div>
        <div
          className={[
            styles['components__button-row'],
            styles['components__button-row--inverted-bg'],
          ].join(' ')}
        >
          <span className={styles['components__instance-label']}>Inverted</span>
          <Dropdown appearance="inverted">Inverted</Dropdown>
        </div>
      </div>
    </>
  );
}
