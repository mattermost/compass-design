import type { ReactNode } from 'react';
import avatarAiko from '@/assets/avatars/Aiko Tan.png';
import avatarArjun from '@/assets/avatars/Arjun Patel.png';
import avatarDanielle from '@/assets/avatars/Danielle Okoro.png';
import avatarLeonard from '@/assets/avatars/Leonard Riley.png';
import avatarMarco from '@/assets/avatars/Marco Rinaldi.png';
import avatarSofia from '@/assets/avatars/Sofia Bauer.png';
import { Button } from '@mattermost/compass-ui/components/button';
import { MenuItem } from '@mattermost/compass-ui/components/menu-item';
import { Modal } from '@mattermost/compass-ui/components/modal';
import { TextInput } from '@mattermost/compass-ui/components/text-input';
import { UserAvatar } from '@mattermost/compass-ui/components/user-avatar';
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

const people = [
  { name: 'Aiko Tan', handle: '@aiko', src: avatarAiko },
  { name: 'Arjun Patel', handle: '@arjun', src: avatarArjun },
  { name: 'Danielle Okoro', handle: '@danielle', src: avatarDanielle },
  { name: 'Leonard Riley', handle: '@leonard', src: avatarLeonard },
  { name: 'Marco Rinaldi', handle: '@marco', src: avatarMarco },
  { name: 'Sofia Bauer', handle: '@sofia', src: avatarSofia },
] as const;

const listFooter = (
  <>
    <Button emphasis="tertiary">Cancel</Button>
    <Button emphasis="primary">Add</Button>
  </>
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
      <div>
        <p className={styles['patterns__variant-label']}>Menu item list</p>
        <ModalCanvas>
          <Modal
            title="Add people"
            subtitle="Choose members to add to #design"
            size="small"
            headerDivider={false}
            footerDivider={false}
            footer={listFooter}
          >
            <div className={styles['patterns__modal-menu-list']}>
              {people.map((person) => (
                <MenuItem
                  key={person.handle}
                  label={person.name}
                  secondaryLabel={person.handle}
                  leadingVisual={
                    <UserAvatar
                      src={person.src}
                      alt={person.name}
                      size="24"
                    />
                  }
                />
              ))}
            </div>
          </Modal>
        </ModalCanvas>
      </div>
    </div>
  );
}
