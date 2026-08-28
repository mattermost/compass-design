import { Checkbox } from '@mattermost/compass-ui/components/checkbox';
import styles from '@/styles/library-demo/components.module.scss';

export default function CheckboxLibrary() {
  return (
    <>
      <p
        className={styles['components__subheading']}
        style={{ marginBottom: 'var(--spacing-m)' }}
      >
        Native HTML checkbox with Figma Checkbox (Checkbox Selector) v2.0.2
        styles. Supports checked, unchecked, and indeterminate.
      </p>
      <div className={styles['components__button-block']}>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>States</span>
          <Checkbox size="medium">Unchecked</Checkbox>
          <Checkbox size="medium" defaultChecked>
            Checked
          </Checkbox>
          <Checkbox size="medium" indeterminate>
            Indeterminate
          </Checkbox>
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Sizes</span>
          <Checkbox size="small">Small</Checkbox>
          <Checkbox size="medium" defaultChecked>
            Medium
          </Checkbox>
          <Checkbox size="large" defaultChecked>
            Large
          </Checkbox>
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Invalid</span>
          <Checkbox size="medium" valid={false}>
            Unchecked invalid
          </Checkbox>
          <Checkbox size="medium" defaultChecked valid={false}>
            Checked invalid
          </Checkbox>
          <Checkbox size="medium" indeterminate valid={false}>
            Indeterminate invalid
          </Checkbox>
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Disabled</span>
          <Checkbox size="medium" disabled>
            Disabled unchecked
          </Checkbox>
          <Checkbox size="medium" defaultChecked disabled>
            Disabled checked
          </Checkbox>
          <Checkbox size="medium" indeterminate disabled>
            Disabled indeterminate
          </Checkbox>
        </div>
      </div>
    </>
  );
}
