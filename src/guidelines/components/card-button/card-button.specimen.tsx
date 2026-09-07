import { useState } from 'react';
import GlobeIcon from '@mattermost/compass-icons/components/globe';
import LockIcon from '@mattermost/compass-icons/components/lock';
import {
  CardButton,
  CardButtonGroup,
} from '@mattermost/compass-ui/components/card-button';
import { Icon } from '@mattermost/compass-ui/components/icon';
import styles from '@/styles/library-demo/components.module.scss';

function VisibilityDemo() {
  const [value, setValue] = useState<'private' | 'public'>('private');

  return (
    <CardButtonGroup aria-label="Agent visibility">
      <CardButton
        role="radio"
        title="Private agent"
        description="Only invited members"
        icon={<Icon glyph={<LockIcon />} size="24" />}
        selected={value === 'private'}
        onClick={() => setValue('private')}
      />
      <CardButton
        role="radio"
        title="Public agent"
        description="Any member can use"
        icon={<Icon glyph={<GlobeIcon />} size="24" />}
        selected={value === 'public'}
        onClick={() => setValue('public')}
      />
    </CardButtonGroup>
  );
}

export default function CardButtonLibrary() {
  return (
    <div className={styles['components__button-block']}>
      <div className={styles['components__button-row']}>
        <span className={styles['components__instance-label']}>Idle</span>
        <div style={{ maxWidth: 284, width: '100%' }}>
          <CardButton
            title="Public agent"
            description="Any member can use"
            icon={<Icon glyph={<GlobeIcon />} size="24" />}
          />
        </div>
      </div>
      <div className={styles['components__button-row']}>
        <span className={styles['components__instance-label']}>Selected</span>
        <div style={{ maxWidth: 284, width: '100%' }}>
          <CardButton
            title="Private agent"
            description="Only invited members"
            icon={<Icon glyph={<LockIcon />} size="24" />}
            selected
          />
        </div>
      </div>
      <div className={styles['components__button-row']}>
        <span className={styles['components__instance-label']}>Group</span>
        <div style={{ maxWidth: 576, width: '100%' }}>
          <VisibilityDemo />
        </div>
      </div>
    </div>
  );
}
