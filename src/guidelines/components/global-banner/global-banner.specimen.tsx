import { GlobalBanner } from '@mattermost/compass-ui';
import styles from '@/styles/library-demo/components.module.scss';

export default function GlobalBannerLibrary() {
  return (
    <>
      <div className={styles['components__button-block']}>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Types</span>
        </div>
        <GlobalBanner
          message="Your license expires in 14 days."
          type="general"
          actionLabel="Renew"
          onAction={() => {}}
          onDismiss={() => {}}
        />
        <GlobalBanner
          message="Scheduled maintenance window tonight from 2–4 AM UTC."
          type="warning"
          onDismiss={() => {}}
        />
        <GlobalBanner
          message="Critical security update required. Please update immediately."
          type="danger"
          actionLabel="Update now"
          onAction={() => {}}
        />
        <GlobalBanner
          message="New version of Mattermost is available."
          type="info"
          actionLabel="Learn more"
          onAction={() => {}}
          onDismiss={() => {}}
        />
        <GlobalBanner
          message="Your data export is ready to download."
          type="success"
          actionLabel="Download"
          onAction={() => {}}
          onDismiss={() => {}}
        />
      </div>
    </>
  );
}
