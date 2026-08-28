import type { ReactNode } from 'react';
import { Button } from '@mattermost/compass-ui/components/button';
import { TextInput } from '@mattermost/compass-ui/components/text-input';
import { Modal } from '@mattermost/compass-ui/components/modal';
import styles from '@/styles/library-demo/patterns.module.scss';

const modalFooter = (
  <>
    <Button emphasis="tertiary">Cancel</Button>
    <Button destructive>Delete Channel</Button>
  </>
);

const modalBody = (
  <div className={styles['patterns__modal-body-content']}>
    <p className={styles['patterns__body-text']}>
      This will permanently delete <strong>#design</strong> and all its
      messages. Members will lose access immediately. This action cannot be
      undone.
    </p>
    <TextInput label='Type "design" to confirm' placeholder="design" />
  </div>
);

function ModalCanvas({ children }: { children: ReactNode }) {
  return (
    <div className={styles['patterns__modal-canvas']}>
      <div className={styles['patterns__modal-overlay']}>{children}</div>
    </div>
  );
}

export default function ModalLibrary() {
  return (
    <div className={styles['patterns__modal-variants']}>
      <div>
        <p className={styles['patterns__variant-label']}>With dividers</p>
        <ModalCanvas>
          <Modal title="Delete Channel" size="small" footer={modalFooter}>
            {modalBody}
          </Modal>
        </ModalCanvas>
      </div>
      <div>
        <p className={styles['patterns__variant-label']}>Without dividers</p>
        <ModalCanvas>
          <Modal
            title="Delete Channel"
            size="small"
            headerDivider={false}
            footerDivider={false}
            footer={modalFooter}
          >
            {modalBody}
          </Modal>
        </ModalCanvas>
      </div>
    </div>
  );
}
