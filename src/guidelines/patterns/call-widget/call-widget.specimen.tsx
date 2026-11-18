import { useState } from 'react';
import { CallWidget } from '@mattermost/compass-proto';
import { callWidgetDemoProps } from '@/fixtures/callWidgetDemo';
import styles from '@/styles/library-demo/patterns.module.scss';

export default function CallWidgetLibrary() {
  const [overlay, setOverlay] = useState<
    'menu' | 'info' | 'participants' | null
  >(null);
  const [muted, setMuted] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [externalEnabled, setExternalEnabled] = useState(true);

  return (
    <div className={styles['patterns__call-widget-demo']}>
      <p className={styles['patterns__variant-label']}>
        Active call (interactive)
      </p>
      <CallWidget
        {...callWidgetDemoProps}
        muted={muted}
        onToggleMute={() => setMuted((m) => !m)}
        handRaised={handRaised}
        onToggleHand={() => setHandRaised((h) => !h)}
        sharing={sharing}
        onToggleShare={() => setSharing((s) => !s)}
        onExpand={() => {}}
        onLeave={() => {}}
        overlay={overlay}
        onToggleMenu={() => setOverlay((o) => (o === 'menu' ? null : 'menu'))}
        onToggleParticipants={() =>
          setOverlay((o) => (o === 'participants' ? null : 'participants'))
        }
        onOpenCallInfo={() => setOverlay('info')}
        onCloseCallInfo={() => setOverlay(null)}
        externalEnabled={externalEnabled}
        onExternalEnabledChange={setExternalEnabled}
      />
    </div>
  );
}
