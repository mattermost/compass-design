import type { ReactNode} from 'react';
import SendIcon from '@mattermost/compass-icons/components/send';
import {Icon } from '@mattermost/compass-ui';
import { MobileModalNavigationBar } from '@mattermost/compass-proto';
import avatarStaffTeam from '@/assets/avatars/Staff Team.png';
import styles from './mobile-modal-navigation-bar.specimen.module.scss';

function Stage({label, children}: {label: string; children: ReactNode}) {
  return (
    <div className={styles['mmnb-specimen__stage']}>
      <p className={styles['mmnb-specimen__label']}>{label}</p>
      <div className={styles['mmnb-specimen__frame']}>{children}</div>
    </div>
  );
}

export default function MobileModalNavigationBarLibrary() {
  return (
    <div className={styles['mmnb-specimen']}>
      <Stage label='Parent'>
        <MobileModalNavigationBar variant='parent' title='Modal' />
      </Stage>

      <Stage label='Child'>
        <MobileModalNavigationBar variant='child' title='Modal' />
      </Stage>

      <Stage label='Child — subtitle'>
        <MobileModalNavigationBar
          variant='child'
          title='Modal'
          subtitle='UX Design'
        />
      </Stage>

      <Stage label='Parent — action'>
        <MobileModalNavigationBar
          variant='parent'
          title='Modal'
          actionLabel='Action'
        />
      </Stage>

      <Stage label='Parent — trailing icon'>
        <MobileModalNavigationBar
          variant='parent'
          title='Modal'
          trailingIcon={<Icon size='20' glyph={<SendIcon />} />}
        />
      </Stage>

      <Stage label='Parent — avatar'>
        <MobileModalNavigationBar
          variant='parent'
          title='Modal'
          avatarSrc={avatarStaffTeam}
          avatarAlt='App'
        />
      </Stage>

      <Stage label='Child — action and avatar'>
        <MobileModalNavigationBar
          variant='child'
          title='Modal'
          avatarSrc={avatarStaffTeam}
          avatarAlt='App'
          actionLabel='Done'
        />
      </Stage>
    </div>
  );
}
