import { useState } from 'react';
import { ColorPicker } from '@mattermost/compass-ui/components/color-picker';
import { Divider } from '@mattermost/compass-ui/components/divider';
import styles from '@/styles/library-demo/components.module.scss';

export default function ColorPickerLibrary() {
  const [custom, setCustom] = useState('#7F57D6');
  return (
    <>
      <p
        className={styles['components__subheading']}
        style={{ marginBottom: 'var(--spacing-m)' }}
      >
        Swatch palette as a native radio group, with an optional hex field. Pass
        your own <code>colors</code> to translate names or change the palette.
      </p>
      <div className={styles['components__settings-demo']}>
        <section className={styles['components__settings-group']}>
          <h3 className={styles['components__settings-group-label']}>
            Default palette
          </h3>
          <ColorPicker aria-label="Default palette" defaultValue="#1C58D9" />
        </section>

        <Divider />

        <section className={styles['components__settings-group']}>
          <h3 className={styles['components__settings-group-label']}>Sizes</h3>
          <div className={styles['components__settings-stack']}>
            <ColorPicker
              aria-label="Small"
              size="small"
              defaultValue="#2F9E5B"
            />
            <ColorPicker
              aria-label="Medium"
              size="medium"
              defaultValue="#2F9E5B"
            />
            <ColorPicker
              aria-label="Large"
              size="large"
              defaultValue="#2F9E5B"
            />
          </div>
        </section>

        <Divider />

        <section className={styles['components__settings-group']}>
          <h3 className={styles['components__settings-group-label']}>
            With hex field (controlled: {custom})
          </h3>
          <ColorPicker
            aria-label="Theme color"
            showHexInput
            value={custom}
            onChange={setCustom}
          />
        </section>

        <Divider />

        <section className={styles['components__settings-group']}>
          <h3 className={styles['components__settings-group-label']}>
            Disabled
          </h3>
          <div className={styles['components__settings-stack']}>
            <ColorPicker
              aria-label="Disabled"
              disabled
              defaultValue="#D24B4E"
            />
            <ColorPicker
              aria-label="One swatch disabled"
              defaultValue="#1C58D9"
              colors={[
                { value: '#1C58D9', label: 'Blue' },
                { value: '#D24B4E', label: 'Red', disabled: true },
                { value: '#2F9E5B', label: 'Green' },
              ]}
            />
          </div>
        </section>
      </div>
    </>
  );
}
