import { useState } from 'react';
import { RightSidebarHeader } from '@mattermost/compass-ui/components/right-sidebar-header';
import {
  RightSidebar,
  RightSidebarSearchResults,
  type RightSidebarSearchResultsKind,
  type SearchResultMessageData,
} from '@mattermost/compass-proto';
import { SegmentedControl } from '@mattermost/compass-ui/components/segmented-control';
import avatarAiko from '@/assets/avatars/Aiko Tan.png';
import avatarMarco from '@/assets/avatars/Marco Rinaldi.png';
import avatarLeonard from '@/assets/avatars/Leonard Riley.png';
import styles from '@/styles/library-demo/patterns.module.scss';

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

export function RightSidebarSearchResultsLibrary() {
  const [kind, setKind] = useState<RightSidebarSearchResultsKind>('search');
  const [empty, setEmpty] = useState(false);
  const [jumped, setJumped] = useState<string | null>(null);
  const title = KINDS.find((k) => k.kind === kind)?.title;
  return (
    <div style={{ width: '100%' }}>
      <p className={styles['patterns__variant-label']}>Kind</p>
      <SegmentedControl
        role="radiogroup"
        aria-label="Kind"
        value={kind}
        onChange={(value) => setKind(value as RightSidebarSearchResultsKind)}
        options={KINDS.map((k) => ({ key: k.kind, label: k.kind }))}
      />
      <p className={styles['patterns__variant-label']}>State</p>
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
    </div>
  );
}

export default RightSidebarSearchResultsLibrary;
