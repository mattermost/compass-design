import { useCallback, useState } from 'react';
import {
  GlobalHeader,
  SearchModal,
  type SearchModalRecent,
} from '@mattermost/compass-proto';
import { Button } from '@mattermost/compass-ui/components/button';
import { SegmentedControl } from '@mattermost/compass-ui/components/segmented-control';
import { UserAvatar } from '@mattermost/compass-ui/components/user-avatar';
import avatarLeonard from '@/assets/avatars/Leonard Riley.png';
import avatarEmma from '@/assets/avatars/Emma Novak.png';
import avatarArjun from '@/assets/avatars/Arjun Patel.png';
import styles from '@/styles/library-demo/patterns.module.scss';

const MODES = [
  { key: 'all', label: 'All' },
  { key: 'channels', label: 'Channels' },
  { key: 'messages', label: 'Messages' },
  { key: 'files', label: 'Files' },
  { key: 'people', label: 'People' },
  { key: 'agents', label: 'Agents' },
];

const HINTS = [
  { id: 'from', modifier: 'From:', description: 'a specific user' },
  { id: 'in', modifier: 'In:', description: 'a specific channel' },
  { id: 'on', modifier: 'On:', description: 'a specific date' },
];

const PEOPLE = [
  { id: 'emma', handle: 'emma.novak', name: 'Emma Novak', src: avatarEmma },
  { id: 'arjun', handle: 'arjun.patel', name: 'Arjun Patel', src: avatarArjun },
];

const INITIAL_RECENT: SearchModalRecent[] = [
  { id: '1', query: 'Welcome in:town-square' },
  { id: '2', query: 'Figma' },
  { id: '3', query: 'RC Test from:emma.novak' },
];

/**
 * Stages the real dialog inside the canvas frame instead of the page, hanging
 * from a Global Header's Search field. Only Messages has content; the other
 * modes are placeholders for the planned universal search. Recent
 * searches and modifier hints show while the field is empty; typing `from:`
 * switches to people suggestions; Enter records the search.
 */
export function SearchModalCanvas() {
  const [stage, setStage] = useState<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState(INITIAL_RECENT);
  const [searched, setSearched] = useState<string | null>(null);
  const [mode, setMode] = useState('messages');
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  // The dialog hangs from the header's search field box.
  const headerRef = useCallback((el: HTMLDivElement | null) => {
    setAnchor(el?.querySelector('input[type="search"]')?.parentElement ?? null);
  }, []);

  const fromMatch = /(?:^|\s)from:(\S*)$/.exec(query);
  const suggestions = fromMatch
    ? PEOPLE.filter((p) => p.handle.startsWith(fromMatch[1].toLowerCase())).map(
        (p) => ({
          id: p.id,
          label: p.handle,
          secondaryLabel: p.name,
          leadingVisual: <UserAvatar src={p.src} alt="" size="24" />,
        }),
      )
    : undefined;
  const needle = query.trim().toLowerCase();

  const run = (text: string) => {
    if (text.trim() === '') return;
    setSearched(text);
    setRecent((prev) => [
      { id: String(Date.now()), query: text },
      ...prev.filter((r) => r.query !== text),
    ]);
    setQuery('');
    setOpen(false);
  };

  return (
    <div style={{ width: '100%' }}>
      <div
        ref={setStage}
        className={[
          styles['patterns__modal-canvas'],
          styles['patterns__modal-canvas--tall'],
        ].join(' ')}
      >
        <div ref={headerRef}>
          <GlobalHeader
            product="channels"
            userAvatarSrc={avatarLeonard}
            userAvatarAlt="Leonard Riley"
            onSearchClick={(event) => {
              setAnchor(event.currentTarget.parentElement);
              setOpen(true);
            }}
          />
        </div>
        {stage && (
          <SearchModal
            open={open}
            anchor={anchor}
            headerLeading={
              <SegmentedControl
                aria-label="Search modes"
                options={MODES}
                value={mode}
                onChange={setMode}
              />
            }
            overlayProps={{
              container: stage,
              lockScroll: false,
              style: { position: 'absolute' },
            }}
            onClose={() => setOpen(false)}
            query={query}
            onQueryChange={setQuery}
            onSubmit={run}
            hints={fromMatch ? undefined : HINTS}
            recent={
              fromMatch
                ? undefined
                : recent.filter((r) => r.query.toLowerCase().includes(needle))
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
        )}
      </div>
      {!open && (
        <Button emphasis="tertiary" onClick={() => setOpen(true)}>
          Reopen search
        </Button>
      )}
      <p className={styles['patterns__variant-label']}>
        {searched
          ? `Searched for “${searched}”`
          : 'Try the arrow keys, Enter, Esc, or type from:'}
      </p>
    </div>
  );
}

export default SearchModalCanvas;
