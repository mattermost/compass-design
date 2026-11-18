import type { ReactNode } from 'react';
import { MobileNavigationBar } from '@mattermost/compass-proto';
import {
  mobileBotDm,
  mobileChannel,
  mobileDm,
  mobileGm,
  mobileMentionCount,
  mobileStatusUser,
} from '@/fixtures/mobilePatternFixtures';
import styles from './mobile-navigation-bar.specimen.module.scss';

function Stage({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles['mnb-specimen__stage']}>
      <p className={styles['mnb-specimen__label']}>{label}</p>
      <div className={styles['mnb-specimen__frame']}>{children}</div>
    </div>
  );
}

export default function MobileNavigationBarLibrary() {
  return (
    <div className={styles['mnb-specimen']}>
      <Stage label="Channel">
        <MobileNavigationBar
          variant="channel"
          name={mobileChannel?.name ?? 'Channel'}
          memberCount={mobileChannel?.memberIds?.length}
        />
      </Stage>

      <Stage label="Channel — mention badge">
        <MobileNavigationBar
          variant="channel"
          name={mobileChannel?.name ?? 'Channel'}
          memberCount={mobileChannel?.memberIds?.length}
          mentionCount={mobileMentionCount}
        />
      </Stage>

      <Stage label="DM">
        <MobileNavigationBar variant="dm" name={mobileDm?.name ?? 'Person'} />
      </Stage>

      <Stage label="DM — custom status">
        <MobileNavigationBar
          variant="dm"
          name={mobileStatusUser?.displayName ?? mobileDm?.name ?? 'Person'}
          customStatusEmoji={mobileStatusUser?.customStatusEmoji}
          customStatusText={mobileStatusUser?.customStatusText}
        />
      </Stage>

      <Stage label="GM">
        <MobileNavigationBar
          variant="gm"
          name={mobileGm?.name ?? 'Group'}
          memberCount={mobileGm?.memberIds?.length}
        />
      </Stage>

      <Stage label="Bot">
        <MobileNavigationBar variant="bot" name={mobileBotDm?.name ?? 'Bot'} />
      </Stage>
    </div>
  );
}
