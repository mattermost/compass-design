import { Toast } from '@mattermost/compass-ui';
import styles from '@/styles/library-demo/components.module.scss';

export default function ToastLibrary() {
  return (
    <>
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
    </>
  );
}
