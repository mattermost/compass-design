import { useCallback, useRef, useState } from 'react';
import {
  GlobalHeader,
  SearchPopover,
  useSearchPopover,
  type SearchPopoverRecent,
} from '@mattermost/compass-proto';
import { UserAvatar } from '@mattermost/compass-ui/components/user-avatar';
import { useOutsideClose } from '@mattermost/compass-ui/hooks/use-outside-close';
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

const INITIAL_RECENT: SearchPopoverRecent[] = [
  { id: '1', query: 'Welcome in:town-square' },
  { id: '2', query: 'Figma' },
  { id: '3', query: 'RC Test from:emma.novak' },
];

/**
 * Header with a working Search popover: hints and recent searches while the field
 * is empty, user suggestions after a `from:` modifier. The host owns open state,
 * outside click and focus; `GlobalHeader` only anchors the panel.
 */
export function GlobalHeaderSearchDemo() {
  const anchorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState(INITIAL_RECENT);

  const close = useCallback(() => setOpen(false), []);
  useOutsideClose(anchorRef, open, close);

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

  const search = useSearchPopover({
    query,
    open,
    hints: query === '' ? SEARCH_HINTS : undefined,
    recent: query === '' ? recent : undefined,
    suggestions,
    onRemoveRecent: (item) =>
      setRecent((prev) => prev.filter((r) => r.id !== item.id)),
    onSelect: (selection) => {
      if (selection.kind === 'hint') {
        setQuery(`${String(selection.item.modifier).toLowerCase()}`);
      } else if (selection.kind === 'suggestion') {
        setQuery((q) =>
          q.replace(/from:\S*$/, `from:${selection.item.label} `),
        );
      } else {
        setQuery(selection.item.query);
        setOpen(false);
      }
      inputRef.current?.focus();
    },
    onSubmit: () => setOpen(false),
    onClose: () => {
      setOpen(false);
      inputRef.current?.focus();
    },
  });

  return (
    <GlobalHeader
      product="channels"
      userAvatarSrc={avatarLeonard}
      userAvatarAlt="Leonard Riley"
      searchValue={query}
      onSearchChange={(value) => {
        setQuery(value);
        setOpen(true);
      }}
      searchAnchorRef={anchorRef}
      searchInputRef={inputRef}
      searchInputProps={{
        ...search.inputProps,
        autoComplete: 'off',
        onFocus: () => setOpen(true),
        onKeyDown: search.onKeyDown,
      }}
      searchPopoverOpen={open}
      searchPopover={<SearchPopover {...search.popoverProps} />}
    />
  );
}

export default function GlobalHeaderLibrary() {
  return (
    <div className={styles['patterns__global-header-demo']}>
      <p className={styles['patterns__variant-label']}>
        Channels — Search popover (click the field)
      </p>
      <div style={{ minHeight: 320 }}>
        <GlobalHeaderSearchDemo />
      </div>
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
