import { AdminConsoleFooter } from '@mattermost/compass-ui/components/admin-console-footer';
import styles from '@/styles/library-demo/components.module.scss';

export default function AdminConsoleFooterLibrary() {
  return (
    <div className={styles['components__button-block']}>
      <div>
        <p className={styles['components__instance-label']}>Default</p>
        <AdminConsoleFooter
          saveDisabled
          onSave={() => undefined}
          onCancel={() => undefined}
        />
      </div>
      <div>
        <p className={styles['components__instance-label']}>With warning</p>
        <AdminConsoleFooter
          saveDisabled={false}
          status="warning"
          statusMessage="There are X issues in the form above."
          onSave={() => undefined}
          onCancel={() => undefined}
        />
      </div>
      <div>
        <p className={styles['components__instance-label']}>With error</p>
        <AdminConsoleFooter
          saveDisabled
          status="error"
          statusMessage="There are X errors in the form above."
          onSave={() => undefined}
          onCancel={() => undefined}
        />
      </div>
    </div>
  );
}
