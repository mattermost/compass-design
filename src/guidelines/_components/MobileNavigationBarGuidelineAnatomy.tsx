import { MobileNavigationBar } from '@mattermost/compass-proto';
import {
  mobileChannel,
  mobileMentionCount,
} from '@/fixtures/mobilePatternFixtures';
import AnatomyStage from '@/guidelines/_components/AnatomyStage';
import styles from './MobileNavigationBarGuidelineAnatomy.module.scss';

/**
 * Mobile Navigation Bar — anatomy preview on the shared AnatomyStage surface.
 */
export function MobileNavigationBarAnatomyStage() {
  return (
    <AnatomyStage
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className={styles['mobile-navigation-bar-anatomy__frame']}>
        <MobileNavigationBar
          variant="channel"
          name={mobileChannel?.name ?? 'Channel'}
          memberCount={mobileChannel?.memberIds?.length}
          mentionCount={mobileMentionCount}
        />
      </div>
    </AnatomyStage>
  );
}
