import { CallNotice } from '@mattermost/compass-proto';
import styles from '@/styles/library-demo/components.module.scss';

export default function CallNoticeLibrary() {
  return (
    <>
      <div className={styles['components__button-block']}>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Types</span>
          <CallNotice type="reaction" emoji="🎉" label="Leonard R." />
          <CallNotice type="hand-raise" label="Danielle O." />
          <CallNotice type="other" message="You have been muted by the host" />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Sizes</span>
          <CallNotice
            type="reaction"
            emoji="👍"
            label="Marco R."
            size="small"
          />
          <CallNotice
            type="reaction"
            emoji="👍"
            label="Marco R."
            size="medium"
          />
          <CallNotice
            type="reaction"
            emoji="👍"
            label="Marco R."
            size="large"
          />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Appearance
          </span>
          <CallNotice type="reaction" emoji="🎉" label="Leonard R." />
          <CallNotice type="hand-raise" label="Danielle O." />
          <CallNotice type="other" message="You have been muted by the host" />
        </div>
        <div
          className={styles['components__button-row']}
          style={{
            background: 'var(--center-channel-bg)',
            padding: 'var(--spacing-m)',
            borderRadius: 'var(--radius-m)',
          }}
        >
          <span className={styles['components__instance-label']}>
            Center channel
          </span>
          <CallNotice
            appearance="center-channel"
            type="reaction"
            emoji="🎉"
            label="Leonard R."
          />
          <CallNotice
            appearance="center-channel"
            type="hand-raise"
            label="Danielle O."
          />
          <CallNotice
            appearance="center-channel"
            type="other"
            message="You have been muted by the host"
          />
        </div>
        <div
          className={styles['components__button-row']}
          style={{
            background: 'var(--center-channel-bg)',
            padding: 'var(--spacing-m)',
            borderRadius: 'var(--radius-m)',
          }}
        >
          <span className={styles['components__instance-label']}>
            Center channel sizes
          </span>
          <CallNotice
            appearance="center-channel"
            emoji="👍"
            label="Marco R."
            size="small"
          />
          <CallNotice
            appearance="center-channel"
            emoji="👍"
            label="Marco R."
            size="medium"
          />
          <CallNotice
            appearance="center-channel"
            emoji="👍"
            label="Marco R."
            size="large"
          />
        </div>
      </div>
    </>
  );
}
