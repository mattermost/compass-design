import { useState } from 'react';
import { SegmentedControl } from '@mattermost/compass-ui/components/segmented-control';
import {
  RightSidebarSearchResults,
  type RightSidebarSearchResultsKind,
} from '@mattermost/compass-proto';
import { RightSidebarHeader } from '@mattermost/compass-ui/components/right-sidebar-header';
import { UserAvatar } from '@mattermost/compass-ui/components/user-avatar';
import { avatars } from '@/fixtures/avatarRegistry';
import styles from '@/styles/library-demo/patterns.module.scss';
import { RightSidebarThread } from '@mattermost/compass-proto';
import { RightSidebarChannelInfo } from '@mattermost/compass-proto';
import { RightSidebarChannelMembers } from '@mattermost/compass-proto';
import { RightSidebar } from '@mattermost/compass-proto';
import {
  sampleChannelName,
  sampleChannelInfoProps,
  sampleMemberCount,
  sampleMemberGroups,
  sampleResults,
  sampleTerm,
  sampleThreadChannelName,
  sampleThreadMessages,
  sampleUser,
} from './rightSidebarFixtures';

const KINDS: { kind: RightSidebarSearchResultsKind; title: string }[] = [
  { kind: 'search', title: 'Search results' },
  { kind: 'mentions', title: 'Recent mentions' },
  { kind: 'saved', title: 'Saved messages' },
  { kind: 'pinned', title: 'Pinned messages' },
];

function SearchResultsDemo() {
  const [kind, setKind] = useState<RightSidebarSearchResultsKind>('search');
  const [empty, setEmpty] = useState(false);
  const [jumped, setJumped] = useState<string | null>(null);
  const title = KINDS.find((k) => k.kind === kind)?.title;
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 'var(--spacing-xl)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-s)',
          }}
        >
          <span
            className={styles['patterns__variant-label']}
            style={{ marginBottom: 0 }}
          >
            Kind
          </span>
          <SegmentedControl
            role="radiogroup"
            aria-label="Kind"
            value={kind}
            onChange={(value) =>
              setKind(value as RightSidebarSearchResultsKind)
            }
            options={KINDS.map((k) => ({ key: k.kind, label: k.kind }))}
          />
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-s)',
          }}
        >
          <span
            className={styles['patterns__variant-label']}
            style={{ marginBottom: 0 }}
          >
            State
          </span>
          <SegmentedControl
            role="radiogroup"
            aria-label="State"
            value={empty ? 'empty' : 'results'}
            onChange={(value) => setEmpty(value === 'empty')}
            options={[
              { key: 'results', label: 'results' },
              { key: 'empty', label: 'empty' },
            ]}
          />
        </div>
      </div>
      <div
        className={styles['patterns__rsb-shell']}
        style={{ marginTop: 'var(--spacing-xl)' }}
      >
        <RightSidebar
          alignBody="stretch"
          header={
            <RightSidebarHeader
              title={title}
              secondaryTitle={kind === 'search' ? undefined : sampleChannelName}
              onExpand={() => {}}
              onClose={() => {}}
            />
          }
        >
          <RightSidebarSearchResults
            kind={kind}
            results={empty ? [] : sampleResults}
            terms={kind === 'search' && sampleTerm ? [sampleTerm] : []}
            onJump={(result) => setJumped(result.username)}
          />
        </RightSidebar>
      </div>
      <p className={styles['patterns__variant-label']}>
        {jumped ? `Jumped to ${jumped}'s message` : 'Press Jump on a result'}
      </p>
    </>
  );
}

export default function RightSidebarLibrary() {
  return (
    <>
      <div className={styles['patterns__rsb-header-demo']}>
        <p className={styles['patterns__variant-label']}>Header — default</p>
        <RightSidebarHeader title="Thread" onClose={() => {}} />

        <p className={styles['patterns__variant-label']}>
          Header — with secondary title
        </p>
        <RightSidebarHeader
          title="Thread"
          secondaryTitle={sampleThreadChannelName}
          onClose={() => {}}
        />

        <p className={styles['patterns__variant-label']}>
          Header — with back button
        </p>
        <RightSidebarHeader
          title="Edit Profile"
          secondaryTitle="Account Settings"
          onBack={() => {}}
          onClose={() => {}}
        />

        <p className={styles['patterns__variant-label']}>
          Header — with label tag
        </p>
        <RightSidebarHeader title="Apps" tag="BETA" onClose={() => {}} />

        <p className={styles['patterns__variant-label']}>
          Header — with leading avatar + action
        </p>
        <RightSidebarHeader
          title={sampleUser.displayName}
          leadingIcon={
            <UserAvatar
              src={avatars[sampleUser.id]}
              alt={sampleUser.displayName}
              size="24"
            />
          }
          actionLabel="Follow"
          onActionClick={() => {}}
          onClose={() => {}}
        />

        <p className={styles['patterns__variant-label']}>
          Header — without expand
        </p>
        <RightSidebarHeader title="Saved Messages" onClose={() => {}} />

        <p className={styles['patterns__variant-label']}>
          Header — thread column without expand or close
        </p>
        <RightSidebarHeader
          title="Thread"
          secondaryTitle={sampleThreadChannelName}
          actionLabel="Following"
          actionActive
        />
      </div>

      <p
        className={styles['patterns__variant-label']}
        style={{ marginTop: 'var(--spacing-xl)' }}
      >
        Full sidebar — thread example
      </p>
      <div className={styles['patterns__rsb-shell']}>
        <RightSidebar
          alignBody="end"
          header={
            <RightSidebarHeader
              title="Thread"
              secondaryTitle={sampleThreadChannelName}
              onExpand={() => {}}
              onClose={() => {}}
            />
          }
        >
          <RightSidebarThread messages={sampleThreadMessages} />
        </RightSidebar>
      </div>

      <p
        className={styles['patterns__variant-label']}
        style={{ marginTop: 'var(--spacing-xl)' }}
      >
        Full sidebar — flexible body (channel info)
      </p>
      <div className={styles['patterns__rsb-shell']}>
        <RightSidebar
          header={
            <RightSidebarHeader
              title="Info"
              secondaryTitle={sampleChannelName}
              onExpand={() => {}}
              onClose={() => {}}
            />
          }
        >
          <RightSidebarChannelInfo {...sampleChannelInfoProps} />
        </RightSidebar>
      </div>

      <p
        className={styles['patterns__variant-label']}
        style={{ marginTop: 'var(--spacing-xl)' }}
      >
        Full sidebar — channel members
      </p>
      <div className={styles['patterns__rsb-shell']}>
        <RightSidebar
          header={
            <RightSidebarHeader
              title="Members"
              secondaryTitle={sampleChannelName}
              onBack={() => {}}
              onExpand={() => {}}
              onClose={() => {}}
            />
          }
        >
          <RightSidebarChannelMembers
            memberCount={sampleMemberCount}
            groups={sampleMemberGroups}
          />
        </RightSidebar>
      </div>
      <p
        className={styles['patterns__variant-label']}
        style={{ marginTop: 'var(--spacing-xl)' }}
      >
        Full sidebar — search results, mentions, saved and pinned
      </p>
      <SearchResultsDemo />
    </>
  );
}
