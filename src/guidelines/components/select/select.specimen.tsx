import { Select } from '@mattermost/compass-ui';
import styles from '@/styles/library-demo/components.module.scss';

const DEMO_OPTIONS = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
];

export default function SelectLibrary() {
  return (
    <>
      <div className={styles['components__button-block']}>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Sizes</span>
          <Select
            size="small"
            label="small"
            options={DEMO_OPTIONS}
            defaultValue="a"
          />
          <Select
            size="medium"
            label="medium"
            options={DEMO_OPTIONS}
            defaultValue="a"
          />
          <Select
            size="large"
            label="large"
            options={DEMO_OPTIONS}
            defaultValue="a"
          />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>States</span>
          <Select
            label="Invalid"
            invalid
            defaultValue="a"
            options={DEMO_OPTIONS}
          />
          <Select
            label="Disabled"
            disabled
            defaultValue=""
            options={DEMO_OPTIONS}
            placeholder="Select…"
          />
        </div>
      </div>
    </>
  );
}
