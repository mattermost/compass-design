import { CallWidget } from '@mattermost/compass-proto';
import AnatomyStage from '@/guidelines/_components/AnatomyStage';
import { callWidgetDemoProps } from '@/fixtures/callWidgetDemo';

/**
 * Call Widget pattern — static anatomy preview on the shared AnatomyStage surface.
 */
export function CallWidgetAnatomyStage() {
  return (
    <AnatomyStage
      style={{
        margin: '0 auto var(--spacing-m)',
        alignItems: 'center',
      }}
    >
      <CallWidget
        {...callWidgetDemoProps}
        muted={false}
        onToggleMute={() => {}}
        handRaised={false}
        onToggleHand={() => {}}
        sharing={false}
        onToggleShare={() => {}}
        onExpand={() => {}}
        onLeave={() => {}}
        overlay={null}
        onToggleMenu={() => {}}
        onToggleParticipants={() => {}}
        onOpenCallInfo={() => {}}
        onCloseCallInfo={() => {}}
        externalEnabled
        onExternalEnabledChange={() => {}}
      />
    </AnatomyStage>
  );
}
