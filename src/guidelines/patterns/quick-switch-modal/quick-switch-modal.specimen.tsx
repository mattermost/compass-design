import { useState } from 'react';
import {
  QuickSwitchModal,
  type QuickSwitchItem,
} from '@mattermost/compass-proto';
import styles from '@/styles/library-demo/patterns.module.scss';

const quickSwitchItems: QuickSwitchItem[] = [
  ['Ask Anything', 'announcements', 'Unread'],
  ['Ask R&D', 'ask-r-and-d', 'Unread'],
  ['Bugs', 'bugs', 'Unread'],
  ['Contributors', 'contributors', 'Unread'],
  ['Design Challenge', 'design-challenge', 'Unread'],
  ['Developers: Webapp', 'developers-web-app', 'Recent'],
  ['Integrations and Apps', 'integrations-and-apps', 'Recent'],
  ['Off-Topic', 'off-topic', 'Recent'],
  ['QA: Builds', 'qa-builds', 'Recent'],
].map(([name, handle, group]) => ({
  id: handle,
  name,
  secondaryLabel: `~${handle}`,
  group,
}));

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
