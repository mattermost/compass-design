import { useState } from 'react';
import { CallPopout } from '@mattermost/compass-proto';
import {
  DIAL_IN_NUMBER,
  DIAL_IN_PIN,
  EXTERNAL_LINK,
  INTERNAL_LINK,
} from '@/fixtures/calls/callConstants';
import { fixtureCallParticipants } from '@/guidelines/_components/fixtureCallParticipants';
import { useFixtureWorkspace } from '@/guidelines/_components/useFixtureWorkspace';
import styles from './call-popout.specimen.module.scss';

const callLinkProps = {
  internalLink: INTERNAL_LINK,
  externalLink: EXTERNAL_LINK,
  dialInNumber: DIAL_IN_NUMBER,
  dialInPin: DIAL_IN_PIN,
};

/** The call popout for a call in the workspace's first channel. */
export default function CallPopoutLayout() {
  const { channel } = useFixtureWorkspace();
  const participants = fixtureCallParticipants(channel);
  const [externalEnabled, setExternalEnabled] = useState(false);
  const [callInfoOpen, setCallInfoOpen] = useState(false);
  const [muted, setMuted] = useState(true);

  return (
    <div className={styles['call-popout-preview']}>
      <CallPopout
        participants={participants}
        currentUserId={participants[0]?.id}
        muted={muted}
        onToggleMute={() => setMuted((m) => !m)}
        onCollapse={() => undefined}
        onLeave={() => undefined}
        infoOpen={callInfoOpen}
        onInfoToggle={() => setCallInfoOpen((v) => !v)}
        externalEnabled={externalEnabled}
        onExternalEnabledChange={setExternalEnabled}
        {...callLinkProps}
      />
    </div>
  );
}
