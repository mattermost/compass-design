import { useState } from 'react';
import { CallWidget } from '@mattermost/compass-proto';
import FixtureChannelView from '@/guidelines/_components/FixtureChannelView';
import { fixtureCallParticipants } from '@/guidelines/_components/fixtureCallParticipants';
import {
  DIAL_IN_NUMBER,
  DIAL_IN_PIN,
  EXTERNAL_LINK,
  INTERNAL_LINK,
} from '@/fixtures/calls/callConstants';

const callLinkProps = {
  internalLink: INTERNAL_LINK,
  externalLink: EXTERNAL_LINK,
  dialInNumber: DIAL_IN_NUMBER,
  dialInPin: DIAL_IN_PIN,
};

/** "Aiko T." for the widget's speaker line. */
const shortName = (name: string) => {
  const [first = name, ...rest] = name.split(' ');
  const last = rest[rest.length - 1];
  return last ? `${first} ${last[0]}.` : first;
};

/** The Channel layout with the call widget floating in the channel you are calling from. */
export default function CallWidgetLayout() {
  const [externalEnabled, setExternalEnabled] = useState(false);
  const [widgetOverlay, setWidgetOverlay] = useState<
    'menu' | 'info' | 'participants' | null
  >(null);
  const [muted, setMuted] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [sharing, setSharing] = useState(false);

  return (
    <FixtureChannelView
      floating={({ channel }) => {
        const participants = fixtureCallParticipants(channel);
        const me = participants[0];
        if (!me) return null;
        return (
          <CallWidget
            participants={participants}
            currentUserId={me.id}
            talkerName={shortName(me.name)}
            talkerAvatarSrc={me.avatarSrc}
            channelName={channel.name}
            muted={muted}
            onToggleMute={() => setMuted((m) => !m)}
            handRaised={handRaised}
            onToggleHand={() => setHandRaised((h) => !h)}
            sharing={sharing}
            onToggleShare={() => setSharing((s) => !s)}
            onExpand={() => undefined}
            onLeave={() => undefined}
            overlay={widgetOverlay}
            onToggleMenu={() =>
              setWidgetOverlay((v) => (v === 'menu' ? null : 'menu'))
            }
            onToggleParticipants={() =>
              setWidgetOverlay((v) =>
                v === 'participants' ? null : 'participants',
              )
            }
            onOpenCallInfo={() => setWidgetOverlay('info')}
            onCloseCallInfo={() => setWidgetOverlay(null)}
            externalEnabled={externalEnabled}
            onExternalEnabledChange={setExternalEnabled}
            {...callLinkProps}
          />
        );
      }}
    />
  );
}
