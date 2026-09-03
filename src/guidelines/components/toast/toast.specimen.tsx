import { Toast } from '@mattermost/compass-ui/components/toast';
import styles from '@/styles/library-demo/components.module.scss';

export default function ToastLibrary() {
  return (
    <>
      <div className={styles['components__section']}>
        <h3 className={styles['components__section-title']}>Types</h3>
        <div className={styles['components__button-block']}>
          <Toast
            message="Link copied to clipboard."
            type="general"
            onDismiss={() => {}}
          />
          <Toast
            message="Message saved successfully."
            type="success"
            onDismiss={() => {}}
          />
          <Toast
            message="Failed to send message. Please try again."
            type="danger"
            actionLabel="Retry"
            onAction={() => {}}
            onDismiss={() => {}}
          />
          <Toast
            message="Your session will expire in 5 minutes."
            type="warning"
            onDismiss={() => {}}
          />
          <Toast
            message="New update available. Refresh to apply."
            type="info"
            actionLabel="Refresh"
            onAction={() => {}}
            onDismiss={() => {}}
          />
        </div>
      </div>
      <div className={styles['components__section']}>
        <h3 className={styles['components__section-title']}>Without dismiss</h3>
        <div className={styles['components__button-block']}>
          <Toast message="Link copied to clipboard." type="general" />
          <Toast
            message="Message saved successfully."
            type="success"
          />
          <Toast
            message="Failed to send message. Please try again."
            type="danger"
            actionLabel="Retry"
            onAction={() => {}}
          />
          <Toast
            message="Your session will expire in 5 minutes."
            type="warning"
          />
          <Toast
            message="New update available. Refresh to apply."
            type="info"
            actionLabel="Refresh"
            onAction={() => {}}
          />
        </div>
      </div>
    </>
  );
}
