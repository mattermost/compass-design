import { GlobalHeader } from '@mattermost/compass-proto';
import {
  personaCustomStatus,
  personaHeaderProps,
} from '@/fixtures/workspacePersona';
import styles from '@/styles/library-demo/patterns.module.scss';

export default function GlobalHeaderLibrary() {
  return (
    <div className={styles['patterns__global-header-demo']}>
      <p className={styles['patterns__variant-label']}>Channels</p>
      <GlobalHeader product="channels" {...personaHeaderProps} />
      <p className={styles['patterns__variant-label']}>
        Channels — with custom status
      </p>
      <GlobalHeader
        product="channels"
        {...personaHeaderProps}
        customStatus={personaCustomStatus}
      />
      <p className={styles['patterns__variant-label']}>
        Channels — with Upgrade
      </p>
      <GlobalHeader
        product="channels"
        showUpgradeButton
        {...personaHeaderProps}
      />
      <p className={styles['patterns__variant-label']}>Playbooks</p>
      <GlobalHeader product="playbooks" {...personaHeaderProps} />
      <p className={styles['patterns__variant-label']}>Boards</p>
      <GlobalHeader product="boards" {...personaHeaderProps} />
    </div>
  );
}
