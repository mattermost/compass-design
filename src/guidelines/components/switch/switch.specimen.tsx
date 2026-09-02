import { Divider } from '@mattermost/compass-ui/components/divider';
import { Switch } from '@mattermost/compass-ui/components/switch';
import styles from '@/styles/library-demo/components.module.scss';

export default function SwitchLibrary() {
  return (
    <>
      <p
        className={styles['components__subheading']}
        style={{ marginBottom: 'var(--spacing-m)' }}
      >
        Native HTML checkbox with <code>role="switch"</code> for toggle
        semantics. Figma Switch v2.0.0 — track + sliding knob; checked = on
        (right), unchecked = off (left).
      </p>
      <div className={styles['components__settings-demo']}>
        <section className={styles['components__settings-group']}>
          <h3 className={styles['components__settings-group-label']}>
            States
          </h3>
          <div className={styles['components__settings-stack']}>
            <Switch size="medium">Unchecked</Switch>
            <Switch size="medium" defaultChecked>
              Checked
            </Switch>
          </div>
        </section>

        <Divider />

        <section className={styles['components__settings-group']}>
          <h3 className={styles['components__settings-group-label']}>Sizes</h3>
          <div className={styles['components__settings-stack']}>
            <Switch size="small">Small</Switch>
            <Switch size="medium" defaultChecked>
              Medium
            </Switch>
            <Switch size="large" defaultChecked>
              Large
            </Switch>
          </div>
        </section>

        <Divider />

        <section className={styles['components__settings-group']}>
          <h3 className={styles['components__settings-group-label']}>
            Labels
          </h3>
          <div className={styles['components__settings-stack']}>
            <Switch size="medium">Default label</Switch>
            <Switch size="medium" semiBold>
              Semi-bold label
            </Switch>
            <Switch size="medium" secondaryLabel="Optional description text">
              With secondary label
            </Switch>
            <Switch
              size="medium"
              semiBold
              defaultChecked
              secondaryLabel="Optional description text"
            >
              Semi-bold with secondary
            </Switch>
          </div>
        </section>

        <Divider />

        <section className={styles['components__settings-group']}>
          <h3 className={styles['components__settings-group-label']}>
            Disabled
          </h3>
          <div className={styles['components__settings-stack']}>
            <Switch size="medium" disabled>
              Disabled — off
            </Switch>
            <Switch size="medium" defaultChecked disabled>
              Disabled — on
            </Switch>
          </div>
        </section>
      </div>
    </>
  );
}
