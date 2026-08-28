import { SectionNotice } from '@mattermost/compass-ui/components/section-notice';
import { ShortcutTagGroup } from '@mattermost/compass-ui/components/shortcut-tag';
import styles from '@/styles/library-demo/components.module.scss';

export default function SectionNoticeLibrary() {
  return (
    <>
      <div className={styles['components__button-block']}>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Default</span>
          <SectionNotice
            title="Keyboard shortcut"
            description={
              <>
                Press <ShortcutTagGroup labels={['Ctrl', 'K']} /> to open the
                quick switcher and jump to any channel.
              </>
            }
            primaryButtonLabel="Got it"
            onPrimaryAction={() => {}}
            secondaryButtonLabel="Dismiss"
            onSecondaryAction={() => {}}
            onDismiss={() => {}}
          />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Info</span>
          <SectionNotice
            title="Keyboard shortcut updated"
            type="info"
            description={
              <>
                The quick switcher is now opened with{' '}
                <ShortcutTagGroup labels={['Ctrl', 'K']} />.
              </>
            }
            onDismiss={() => {}}
          />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Success</span>
          <SectionNotice
            title="Changes saved"
            type="success"
            description="Your notification preferences have been updated."
            primaryButtonLabel="Got it"
            onPrimaryAction={() => {}}
            onDismiss={() => {}}
          />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Warning</span>
          <SectionNotice
            title="Session expiring soon"
            type="warning"
            description="You will be signed out in 5 minutes due to inactivity."
            primaryButtonLabel="Stay signed in"
            onPrimaryAction={() => {}}
            secondaryButtonLabel="Dismiss"
            onSecondaryAction={() => {}}
            onDismiss={() => {}}
          />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Danger</span>
          <SectionNotice
            title="Permission required"
            type="danger"
            description="You don't have access to post in this channel."
            primaryButtonLabel="Review permissions"
            onPrimaryAction={() => {}}
            onDismiss={() => {}}
          />
        </div>
      </div>
    </>
  );
}
