import type { ReactNode } from 'react';
import FilterVariantIcon from '@mattermost/compass-icons/components/filter-variant';
import { Button } from '@mattermost/compass-ui/components/button';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { RightSidebarHeader } from '@mattermost/compass-ui/components/right-sidebar-header';
import { UserAvatar } from '@mattermost/compass-ui/components/user-avatar';
import avatarLeonard from '@/assets/avatars/Leonard Riley.png';
import styles from '@/styles/library-demo/components.module.scss';

function Demo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles['components__section']}>
      <h3 className={styles['components__section-title']}>{label}</h3>
      <div style={{ width: '100%', maxWidth: 400 }}>{children}</div>
    </div>
  );
}

export default function RightSidebarHeaderLibrary() {
  return (
    <>
      <Demo label="Default">
        <RightSidebarHeader title="Thread" onClose={() => {}} />
      </Demo>
      <Demo label="Secondary title">
        <RightSidebarHeader
          title="Thread"
          secondaryTitle="UX Design"
          onClose={() => {}}
        />
      </Demo>
      <Demo label="Back button">
        <RightSidebarHeader
          title="Edit Profile"
          secondaryTitle="Account Settings"
          onBack={() => {}}
          onClose={() => {}}
        />
      </Demo>
      <Demo label="Tag">
        <RightSidebarHeader title="Apps" tag="BETA" onClose={() => {}} />
      </Demo>
      <Demo label="Leading avatar and inline action">
        <RightSidebarHeader
          title="Leonard Riley"
          leadingIcon={
            <UserAvatar src={avatarLeonard} alt="Leonard Riley" size="24" />
          }
          actionLabel="Follow"
          onActionClick={() => {}}
          onClose={() => {}}
        />
      </Demo>
      <Demo label="Custom actions slot">
        <RightSidebarHeader
          title="Recent mentions"
          actions={
            <Button
              emphasis="tertiary"
              size="small"
              leadingIcon={<Icon glyph={<FilterVariantIcon />} />}
            >
              Filters
            </Button>
          }
          onExpand={() => {}}
          onPopout={() => {}}
          onClose={() => {}}
        />
      </Demo>
      <Demo label="Expand, pop out, close">
        <RightSidebarHeader
          title="Channel info"
          onExpand={() => {}}
          onPopout={() => {}}
          onClose={() => {}}
        />
      </Demo>
      <Demo label="Persistent column (no close)">
        <RightSidebarHeader
          title="Thread"
          secondaryTitle="UX Design"
          actionLabel="Following"
          actionActive
        />
      </Demo>
    </>
  );
}
