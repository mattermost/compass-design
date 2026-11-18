import type { CSSProperties } from 'react';
import { RightSidebarHeader } from '@mattermost/compass-ui/components/right-sidebar-header';
import { RightSidebar, RightSidebarThread } from '@mattermost/compass-proto';
import AnatomyStage from '@/guidelines/_components/AnatomyStage';
import {
  sampleThreadChannelName,
  sampleThreadMessages,
} from '@/guidelines/patterns/right-sidebar/rightSidebarFixtures';

const shellStyle: CSSProperties = {
  display: 'inline-flex',
  height: 360,
  maxWidth: '100%',
  border: '1px solid rgba(var(--center-channel-color-rgb), 0.16)',
  borderRadius: 'var(--radius-m)',
  overflow: 'hidden',
  backgroundColor: 'var(--center-channel-bg)',
};

/**
 * Right Sidebar pattern — anatomy preview on the shared AnatomyStage surface,
 * with a real thread from the sample workspace in the body.
 */
export function RightSidebarAnatomyStage() {
  return (
    <AnatomyStage
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto var(--spacing-m)',
      }}
    >
      <div style={shellStyle}>
        <RightSidebar
          alignBody="end"
          header={
            <RightSidebarHeader
              title="Thread"
              secondaryTitle={sampleThreadChannelName}
              onExpand={() => {}}
              onPopout={() => {}}
              onClose={() => {}}
            />
          }
        >
          <RightSidebarThread messages={sampleThreadMessages} />
        </RightSidebar>
      </div>
    </AnatomyStage>
  );
}
