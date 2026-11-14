import { useState } from 'react';
import {
  QuickSwitchModal,
  type QuickSwitchItem,
} from '@mattermost/compass-proto';
import { UserAvatar } from '@mattermost/compass-ui/components/user-avatar';
import avatarAiko from '@/assets/avatars/Aiko Tan.png';
import avatarMarco from '@/assets/avatars/Marco Rinaldi.png';
import styles from '@/styles/library-demo/patterns.module.scss';

const channel = (
  name: string,
  handle: string,
  group: string,
): QuickSwitchItem => ({
  id: handle,
  name,
  secondaryLabel: `~${handle}`,
  group,
});

const directMessage = (
  name: string,
  handle: string,
  src: string,
  group: string,
): QuickSwitchItem => ({
  id: `dm-${handle}`,
  name,
  secondaryLabel: `@${handle}`,
  group,
  leadingVisual: <UserAvatar src={src} alt="" size="20" />,
});

const quickSwitchItems: QuickSwitchItem[] = [
  channel('Ask Anything', 'announcements', 'Unread'),
  channel('Ask R&D', 'ask-r-and-d', 'Unread'),
  channel('Bugs', 'bugs', 'Unread'),
  channel('Contributors', 'contributors', 'Unread'),
  channel('Design Challenge', 'design-challenge', 'Unread'),
  channel('Developers: Webapp', 'developers-web-app', 'Recent'),
  directMessage('Aiko Tan', 'aiko', avatarAiko, 'Recent'),
  channel('Integrations and Apps', 'integrations-and-apps', 'Recent'),
  directMessage('Marco Rinaldi', 'marco', avatarMarco, 'Recent'),
  channel('Off-Topic', 'off-topic', 'Recent'),
  channel('QA: Builds', 'qa-builds', 'Recent'),
];

/** Stages the real overlay inside the canvas frame instead of the page. */
export function QuickSwitchModalCanvas() {
  const [stage, setStage] = useState<HTMLDivElement | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div style={{ width: '100%' }}>
      <div
        ref={setStage}
        className={[
          styles['patterns__modal-canvas'],
          styles['patterns__modal-canvas--tall'],
        ].join(' ')}
      >
        {stage && (
          <QuickSwitchModal
            open
            overlayProps={{
              container: stage,
              lockScroll: false,
              style: { position: 'absolute' },
            }}
            items={quickSwitchItems}
            onClose={() => undefined}
            onSelect={(item) => setSelected(item.name)}
          />
        )}
      </div>
      <p className={styles['patterns__variant-label']}>
        {selected ? `Selected: ${selected}` : 'Press Enter or click a row'}
      </p>
    </div>
  );
}

export default QuickSwitchModalCanvas;
