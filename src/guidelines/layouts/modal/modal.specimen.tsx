import { Button } from '@mattermost/compass-ui/components/button';
import { Modal } from '@mattermost/compass-ui/components/modal';
import FixtureChannelView from '@/guidelines/_components/FixtureChannelView';
import styles from './modal.specimen.module.scss';

const modalFooter = (
  <>
    <Button emphasis="tertiary">Cancel</Button>
    <Button emphasis="primary" destructive>
      Delete
    </Button>
  </>
);

/** A confirmation modal over the Channel layout. */
export default function ModalLayout() {
  return (
    <FixtureChannelView
      overlay={() => (
        <div className={styles['modal-layout']}>
          <div className={styles['modal-layout__backdrop']} aria-hidden />
          <div className={styles['modal-layout__dialog']}>
            <Modal
              title="Delete Category"
              size="small"
              headerDivider={false}
              footerDivider={false}
              onClose={() => undefined}
              footer={modalFooter}
            >
              <p className={styles['modal-layout__body-text']}>
                Channels in{' '}
                <span className={styles['modal-layout__body-emphasis']}>
                  Favorites
                </span>{' '}
                will move back to the Channels and Direct messages categories.
                You won’t be removed from channels.
              </p>
            </Modal>
          </div>
        </div>
      )}
    />
  );
}
