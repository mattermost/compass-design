import { useState } from 'react';
import { SegmentedControl } from '@mattermost/compass-ui/components/segmented-control';
import {
  RightSidebarSearchResults,
  type RightSidebarSearchResultsKind,
  type SearchResultMessageData,
} from '@mattermost/compass-proto';
import avatarAiko from '@/assets/avatars/Aiko Tan.png';
import avatarMarco from '@/assets/avatars/Marco Rinaldi.png';
import { RightSidebarHeader } from '@mattermost/compass-ui/components/right-sidebar-header';
import { UserAvatar } from '@mattermost/compass-ui/components/user-avatar';
import { RIGHT_SIDEBAR_THREAD_DEMO_MESSAGES } from '@/fixtures/rightSidebarThreadDemo';
import avatarLeonard from '@/assets/avatars/Leonard Riley.png';
import styles from '@/styles/library-demo/patterns.module.scss';
import { RightSidebarThread } from '@mattermost/compass-proto';
import { RightSidebarChannelInfo } from '@mattermost/compass-proto';
import { RightSidebarChannelMembers } from '@mattermost/compass-proto';
import { RightSidebar } from '@mattermost/compass-proto';

const RESULTS: SearchResultMessageData[] = [
  {
    id: 'r1',
    avatarSrc: avatarAiko,
    avatarAlt: 'Aiko Tan',
    username: 'Aiko Tan',
    timestamp: 'Today at 9:48 AM',
    channelLabel: 'UX Design',
    teamLabel: 'Compass',
    body: 'Heads up: the sidebar header now shows the parent channel as a secondary title.',
  },
  {
    id: 'r2',
    avatarSrc: avatarMarco,
    avatarAlt: 'Marco Rinaldi',
    username: 'Marco Rinaldi',
    timestamp: 'Yesterday at 4:12 PM',
    channelLabel: 'Developers: Webapp',
    teamLabel: 'Compass',
    body: 'Can we reuse the sidebar search results for pinned messages too?',
    pinned: true,
  },
  {
    id: 'r3',
    avatarSrc: avatarLeonard,
    avatarAlt: 'Leonard Riley',
    username: 'Leonard Riley',
    timestamp: 'Mon at 11:03 AM',
    channelLabel: 'Leonard Riley',
    body: 'Sidebar spec is in Figma, ping me if anything is unclear.',
  },
];

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
          header={
            <RightSidebarHeader
              title={title}
              secondaryTitle={kind === 'search' ? undefined : 'Compass'}
              onExpand={() => {}}
              onClose={() => {}}
            />
          }
        >
          <RightSidebarSearchResults
            kind={kind}
            results={empty ? [] : RESULTS}
            terms={kind === 'search' ? ['sidebar'] : []}
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
          secondaryTitle="UX Design"
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
          title="Leonard Riley"
          leadingIcon={
            <UserAvatar src={avatarLeonard} alt="Leonard Riley" size="24" />
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
          secondaryTitle="UX Design"
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
              secondaryTitle="UX Design"
              onExpand={() => {}}
              onClose={() => {}}
            />
          }
        >
          <RightSidebarThread messages={RIGHT_SIDEBAR_THREAD_DEMO_MESSAGES} />
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
              secondaryTitle="UX Design"
              onExpand={() => {}}
              onClose={() => {}}
            />
          }
        >
          <RightSidebarChannelInfo />
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
              secondaryTitle="UX Design"
              onBack={() => {}}
              onExpand={() => {}}
              onClose={() => {}}
            />
          }
        >
          <RightSidebarChannelMembers />
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
