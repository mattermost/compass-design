import { ProfilePopover } from '@mattermost/compass-ui/components/profile-popover';
import styles from '@/styles/library-demo/patterns.module.scss';
import {
  customStatus,
  githubHandle,
  identity,
  localTime,
  other,
  otherWithStatus,
  you,
} from './profilePopoverFixtures';

export default function ProfilePopoverLibrary() {
  return (
    <div className={styles['patterns__profile-popover-demo']}>
      <div>
        <p className={styles['patterns__variant-label']}>Others — full</p>
        <ProfilePopover
          user="others"
          {...identity(other)}
          staff
          localTime={localTime}
          onClose={() => {}}
        />
      </div>
      <div>
        <p className={styles['patterns__variant-label']}>
          Others — with custom status + extras
        </p>
        <ProfilePopover
          user="others"
          {...identity(otherWithStatus)}
          sharedOrg="Acme Corp."
          staff
          coreCommitter
          githubHandle={githubHandle(otherWithStatus)}
          localTime={localTime}
          customStatus={customStatus(otherWithStatus)}
          onClose={() => {}}
        />
      </div>
      <div>
        <p className={styles['patterns__variant-label']}>You</p>
        <ProfilePopover
          user="you"
          {...identity(you)}
          staff
          localTime={localTime}
          onClose={() => {}}
        />
      </div>
      <div>
        <p className={styles['patterns__variant-label']}>
          You — with custom status + extras
        </p>
        <ProfilePopover
          user="you"
          {...identity(you)}
          sharedOrg="Acme Corp."
          staff
          coreCommitter
          githubHandle={githubHandle(you)}
          localTime={localTime}
          customStatus={customStatus(you)}
          onClose={() => {}}
        />
      </div>
    </div>
  );
}
