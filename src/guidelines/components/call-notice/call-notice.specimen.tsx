import { CallNotice } from '@mattermost/compass-proto';
import VideoOffOutlineIcon from '@mattermost/compass-icons/components/video-off-outline';
import styles from '@/styles/library-demo/components.module.scss';

const lightRow = [
  styles['components__button-row'],
  styles['components__button-row--center-channel-bg'],
].join(' ');

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
          <CallNotice emoji="👍" label="Marco R." size="small" />
          <CallNotice emoji="👍" label="Marco R." size="medium" />
          <CallNotice emoji="👍" label="Marco R." size="large" />
        </div>
        <div className={lightRow}>
          <span className={styles['components__instance-label']}>
            Appearance: center-channel (types)
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
        <div className={lightRow}>
          <span className={styles['components__instance-label']}>
            Appearance: center-channel (sizes)
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
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Tone (type=&quot;other&quot;)
          </span>
          <CallNotice type="other" message="You have been muted by the host" />
          <CallNotice
            type="other"
            tone="warning"
            message="Call quality may be degraded due to unstable network conditions."
          />
          <CallNotice
            type="other"
            tone="error"
            message="Allow microphone access to Mattermost."
          />
        </div>
        <div className={lightRow}>
          <span className={styles['components__instance-label']}>
            Tone on a light surface
          </span>
          <CallNotice
            appearance="center-channel"
            type="other"
            message="You have been muted by the host"
          />
          <CallNotice
            appearance="center-channel"
            type="other"
            tone="warning"
            message="Call quality may be degraded due to unstable network conditions."
          />
          <CallNotice
            appearance="center-channel"
            type="other"
            tone="error"
            message="Allow microphone access to Mattermost."
          />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Custom icon
          </span>
          <CallNotice
            type="other"
            tone="error"
            icon={<VideoOffOutlineIcon />}
            message="Allow camera access to Mattermost."
          />
        </div>
      </div>
    </>
  );
}
