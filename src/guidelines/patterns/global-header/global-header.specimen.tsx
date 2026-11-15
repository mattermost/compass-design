import { useState } from 'react';
import {
  GlobalHeader,
  SearchModal,
  type SearchModalRecent,
} from '@mattermost/compass-proto';
import { UserAvatar } from '@mattermost/compass-ui/components/user-avatar';
import avatarLeonard from '@/assets/avatars/Leonard Riley.png';
import avatarAmy from '@/assets/avatars/Emma Novak.png';
import avatarArjun from '@/assets/avatars/Arjun Patel.png';
import styles from '@/styles/library-demo/patterns.module.scss';

const SEARCH_HINTS = [
  { id: 'from', modifier: 'From:', description: 'a specific user' },
  { id: 'in', modifier: 'In:', description: 'a specific channel' },
  { id: 'on', modifier: 'On:', description: 'a specific date' },
];

const SEARCH_PEOPLE = [
  { id: 'emma', handle: 'emma.novak', name: 'Emma Novak', src: avatarAmy },
  { id: 'arjun', handle: 'arjun.patel', name: 'Arjun Patel', src: avatarArjun },
];

const INITIAL_RECENT: SearchModalRecent[] = [
  { id: '1', query: 'Welcome in:town-square' },
  { id: '2', query: 'Figma' },
  { id: '3', query: 'RC Test from:emma.novak' },
];

/**
 * Header whose Search field opens the search modal. Recent searches and modifier
 * hints show while the field is empty; typing `from:` switches to user
 * suggestions. The host owns open state and the query.
 */
export function GlobalHeaderSearchDemo() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState(INITIAL_RECENT);
  const [searched, setSearched] = useState<string | null>(null);

  const fromMatch = /(?:^|\s)from:(\S*)$/.exec(query);
  const suggestions = fromMatch
    ? SEARCH_PEOPLE.filter((p) =>
        p.handle.startsWith(fromMatch[1].toLowerCase()),
      ).map((p) => ({
        id: p.id,
        label: p.handle,
        secondaryLabel: p.name,
        leadingVisual: <UserAvatar src={p.src} alt="" size="24" />,
      }))
    : undefined;
  const needle = query.trim().toLowerCase();
  const showLists = !fromMatch;

  const close = () => setOpen(false);
  const run = (text: string) => {
    if (text.trim() === '') return;
    setSearched(text);
    setRecent((prev) => [
      { id: String(Date.now()), query: text },
      ...prev.filter((r) => r.query !== text),
    ]);
    close();
  };

  return (
    <>
      <GlobalHeader
        product="channels"
        userAvatarSrc={avatarLeonard}
        userAvatarAlt="Leonard Riley"
        onSearchClick={() => setOpen(true)}
      />
      <p className={styles['patterns__variant-label']}>
        {searched ? `Searched for “${searched}”` : 'Click the Search field'}
      </p>
      <SearchModal
        open={open}
        onClose={close}
        query={query}
        onQueryChange={setQuery}
        onSubmit={run}
        hints={showLists ? SEARCH_HINTS : undefined}
        recent={
          showLists
            ? recent.filter((r) => r.query.toLowerCase().includes(needle))
            : undefined
        }
        suggestions={suggestions}
        onRemoveRecent={(item) =>
          setRecent((prev) => prev.filter((r) => r.id !== item.id))
        }
        onSelect={(selection) => {
          if (selection.kind === 'hint') {
            setQuery(String(selection.item.modifier).toLowerCase());
          } else if (selection.kind === 'suggestion') {
            setQuery((q) =>
              q.replace(/from:\S*$/, `from:${selection.item.label} `),
            );
          } else {
            run(selection.item.query);
          }
        }}
      />
    </>
  );
}

export default function GlobalHeaderLibrary() {
  return (
    <div className={styles['patterns__global-header-demo']}>
      <p className={styles['patterns__variant-label']}>
        Channels — Search modal (click the field)
      </p>
      <GlobalHeaderSearchDemo />
      <p className={styles['patterns__variant-label']}>Channels</p>
      <GlobalHeader
        product="channels"
        userAvatarSrc={avatarLeonard}
        userAvatarAlt="Leonard Riley"
      />
      <p className={styles['patterns__variant-label']}>
        Channels — with custom status
      </p>
      <GlobalHeader
        product="channels"
        userAvatarSrc={avatarLeonard}
        userAvatarAlt="Leonard Riley"
        customStatus={{
          emoji: '📅',
          text: 'In a meeting',
        }}
      />
      <p className={styles['patterns__variant-label']}>
        Channels — with Upgrade
      </p>
      <GlobalHeader
        product="channels"
        showUpgradeButton
        userAvatarSrc={avatarLeonard}
        userAvatarAlt="Leonard Riley"
      />
      <p className={styles['patterns__variant-label']}>Playbooks</p>
      <GlobalHeader
        product="playbooks"
        userAvatarSrc={avatarLeonard}
        userAvatarAlt="Leonard Riley"
      />
      <p className={styles['patterns__variant-label']}>Boards</p>
      <GlobalHeader
        product="boards"
        userAvatarSrc={avatarLeonard}
        userAvatarAlt="Leonard Riley"
      />
    </div>
  );
}
