import { Dropdown } from '@mattermost/compass-ui/components/dropdown';
import styles from '@/styles/library-demo/components.module.scss';

const SIZES = [
  { size: 'x-small', label: 'X-Small' },
  { size: 'small', label: 'Small' },
  { size: 'medium', label: 'Medium' },
  { size: 'large', label: 'Large' },
  { size: 'x-large', label: 'X-Large' },
] as const;

const PADDINGS = [
  { padding: 'tight', label: 'Tight' },
  { padding: 'compact', label: 'Compact' },
  { padding: 'default', label: 'Default' },
] as const;

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
        {PADDINGS.map(({ padding, label }) => (
          <div key={padding} className={styles['components__button-row']}>
            <span className={styles['components__instance-label']}>
              Padding: {label}
            </span>
            {SIZES.map(({ size, label: sizeLabel }) => (
              <Dropdown key={size} size={size} padding={padding}>
                {sizeLabel}
              </Dropdown>
            ))}
          </div>
        ))}
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
