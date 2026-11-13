import { useState } from 'react';
import {
  QuickSwitchModal,
  type QuickSwitchItem,
} from '@mattermost/compass-proto';
import avatarAiko from '@/assets/avatars/Aiko Tan.png';
import avatarMarco from '@/assets/avatars/Marco Rinaldi.png';
import styles from '@/styles/library-demo/patterns.module.scss';

const quickSwitchItems: QuickSwitchItem[] = [
  { id: 'town-square', name: 'Town Square', breadcrumb: ['Mattermost'] },
  {
    id: 'design',
    name: 'Design',
    leadingVisual: 'private',
    status: 'unread',
    breadcrumb: ['Mattermost', 'Product'],
  },
  {
    id: 'releases',
    name: 'Releases',
    status: 'mention',
    mentionCount: 2,
    breadcrumb: ['Mattermost', 'Engineering'],
  },
  {
    id: 'aiko',
    name: 'Aiko Tan',
    leadingVisual: 'direct-message',
    avatarSrc: avatarAiko,
    keywords: ['@aiko'],
  },
  {
    id: 'marco',
    name: 'Marco Rinaldi',
    leadingVisual: 'direct-message',
    avatarSrc: avatarMarco,
    keywords: ['@marco'],
  },
  {
    id: 'launch-group',
    name: 'aiko, marco, sofia',
    leadingVisual: 'group-message',
    memberCount: 3,
  },
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
