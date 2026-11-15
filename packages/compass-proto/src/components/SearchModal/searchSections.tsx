import type { ReactNode } from 'react';
import GlobeIcon from '@mattermost/compass-icons/components/globe';
import LockIcon from '@mattermost/compass-icons/components/lock';
import MagnifyIcon from '@mattermost/compass-icons/components/magnify';
import CloseIcon from '@mattermost/compass-icons/components/close';
import FileGenericOutlineIcon from '@mattermost/compass-icons/components/file-generic-outline';
import FilePdfOutlineIcon from '@mattermost/compass-icons/components/file-pdf-outline';
import FileWordOutlineIcon from '@mattermost/compass-icons/components/file-word-outline';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { UserAvatar } from '@mattermost/compass-ui/components/user-avatar';
import type {
  SuggestionOption,
  SuggestionSection,
} from '@mattermost/compass-ui/components/suggestion-list';
import type {
  SearchChannel,
  SearchFile,
  SearchMode,
  SearchModalData,
  SearchModalLabels,
  SearchModalSelection,
  SearchPerson,
  SearchRecent,
} from './searchTypes';
import styles from './SearchModal.module.scss';

/** What a row does when chosen: a selection for the host, or a field edit. */
export type RowAction =
  | { type: 'select'; selection: SearchModalSelection }
  | { type: 'from'; person: SearchPerson };

export interface ModeContent {
  sections: SuggestionSection[];
  /** Action per option value. */
  actions: Map<string, RowAction>;
  /** Shift+Delete handlers (recent searches). */
  removers: Map<string, () => void>;
  /** True when there is a query but nothing matched. */
  noResults: boolean;
}

export const matches = (query: string, values: (string | undefined)[]) => {
  const needle = query.trim().toLowerCase();
  if (!needle) return false;
  return values.some((v) => v?.toLowerCase().includes(needle));
};

function unique<T extends { id: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((i) => !seen.has(i.id) && !!seen.add(i.id));
}

const FILE_ICONS = {
  pdf: FilePdfOutlineIcon,
  word: FileWordOutlineIcon,
  generic: FileGenericOutlineIcon,
};

export interface BuildArgs {
  mode: SearchMode;
  query: string;
  data: SearchModalData;
  labels: SearchModalLabels;
  onRemoveRecent?: (
    mode: 'messages' | 'files' | 'all',
    item: SearchRecent,
  ) => void;
}

export function buildModeContent({
  mode,
  query,
  data,
  labels,
  onRemoveRecent,
}: BuildArgs): ModeContent {
  const actions = new Map<string, RowAction>();
  const removers = new Map<string, () => void>();
  const sections: SuggestionSection[] = [];
  const h = labels.headings ?? {};
  const typing = query.trim() !== '';

  const channelOption = (group: string, c: SearchChannel): SuggestionOption => {
    const value = `${group}:channel:${c.id}`;
    actions.set(value, {
      type: 'select',
      selection: { kind: 'channel', item: c },
    });
    return {
      value,
      label: c.name,
      leadingVisual: (
        <Icon glyph={c.kind === 'private' ? <LockIcon /> : <GlobeIcon />} />
      ),
      menuItemProps: { mentionCount: c.mentionCount },
    };
  };

  const personOption = (group: string, p: SearchPerson): SuggestionOption => {
    const value = `${group}:person:${p.id}`;
    actions.set(value, {
      type: 'select',
      selection: { kind: 'person', item: p },
    });
    return {
      value,
      label: p.name,
      secondaryLabel: p.username,
      leadingVisual: (
        <UserAvatar
          src={p.avatarSrc}
          alt=""
          size="24"
          status={p.status === 'dnd' ? 'do-not-disturb' : p.status}
        />
      ),
    };
  };

  const fileOption = (group: string, f: SearchFile): SuggestionOption => {
    const value = `${group}:file:${f.id}`;
    actions.set(value, {
      type: 'select',
      selection: { kind: 'file', item: f },
    });
    const Glyph = FILE_ICONS[f.kind ?? 'generic'];
    return {
      value,
      label: f.name,
      secondaryLabel: f.description,
      leadingVisual: <Icon glyph={<Glyph />} />,
    };
  };

  const recentOptions = (
    group: string,
    recentMode: 'all' | 'messages' | 'files',
    items: SearchRecent[],
  ): SuggestionOption[] =>
    items.map((r) => {
      const value = `${group}:recent:${r.id}`;
      actions.set(value, {
        type: 'select',
        selection: { kind: 'recent', mode: recentMode, item: r },
      });
      const remove = () => onRemoveRecent?.(recentMode, r);
      removers.set(value, remove);
      return {
        value,
        label: r.query,
        leadingVisual: <Icon glyph={<MagnifyIcon />} />,
        // A pointer shortcut only: keyboard users remove the highlighted row
        // with Shift+Delete, so this stays out of the a11y tree.
        trailingLabel: (
          <span
            aria-hidden
            data-search-remove
            title={labels.removeRecentLabel ?? 'Remove recent search'}
            className={styles['search-modal__remove']}
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.stopPropagation();
              remove();
            }}
          >
            <Icon size="16" glyph={<CloseIcon />} />
          </span>
        ),
      };
    });

  const add = (
    key: string,
    heading: ReactNode,
    options: SuggestionOption[],
  ) => {
    if (options.length > 0) sections.push({ key, heading, options });
  };

  const unread = data.unreadChannels ?? [];
  const recentCh = data.recentChannels ?? [];
  const frequent = data.frequentPeople ?? [];
  const recentPeople = data.recentPeople ?? [];
  const directory = data.directory ?? [];
  const files = data.recentFiles ?? [];
  const msgSearches = data.recentMessageSearches ?? [];
  const fileSearches = data.recentFileSearches ?? [];

  const allChannels = unique([...unread, ...recentCh]);
  const allPeople = unique([...frequent, ...recentPeople, ...directory]);

  switch (mode) {
    case 'all': {
      if (!typing) {
        add(
          'channels',
          h.channels ?? 'Channels',
          unread.map((c) => channelOption('c', c)),
        );
        add(
          'people',
          h.people ?? 'People',
          frequent.slice(0, 3).map((p) => personOption('p', p)),
        );
        add(
          'files',
          h.files ?? 'Files',
          files.slice(0, 3).map((f) => fileOption('f', f)),
        );
        add(
          'recent',
          h.recentSearches ?? 'Recent searches',
          recentOptions('r', 'all', msgSearches.slice(0, 3)),
        );
      } else {
        add(
          'channels',
          h.channels ?? 'Channels',
          allChannels
            .filter((c) => matches(query, [c.name]))
            .map((c) => channelOption('c', c)),
        );
        add(
          'files',
          h.files ?? 'Files',
          files
            .filter((f) => matches(query, [f.name, f.description]))
            .map((f) => fileOption('f', f)),
        );
        add(
          'people',
          h.people ?? 'People',
          allPeople
            .filter((p) => matches(query, [p.name, p.username]))
            .map((p) => personOption('p', p)),
        );
      }
      break;
    }
    case 'channels': {
      if (!typing) {
        add(
          'unreads',
          h.unreads ?? 'Unreads',
          unread.map((c) => channelOption('u', c)),
        );
        add(
          'recent',
          h.recent ?? 'Recent',
          recentCh.map((c) => channelOption('c', c)),
        );
      } else {
        add(
          'channels',
          h.channels ?? 'Channels',
          allChannels
            .filter((c) => matches(query, [c.name]))
            .map((c) => channelOption('c', c)),
        );
      }
      break;
    }
    case 'messages': {
      const from = /^\s*from:\s*(.*)$/i.exec(query);
      if (from) {
        const term = from[1];
        const options = allPeople
          .filter((p) => !term || matches(term, [p.name, p.username]))
          .map((p): SuggestionOption => {
            const option = personOption('from', p);
            // Choosing a person adds a From chip instead of selecting them.
            actions.set(option.value, { type: 'from', person: p });
            return option;
          });
        add('from', h.from ?? 'From', options);
        return {
          sections,
          actions,
          removers,
          // Enter still searches with this text, so no "No results" here.
          noResults: false,
        };
      }
      const shown = typing
        ? msgSearches.filter((r) => matches(query, [r.query]))
        : msgSearches;
      add(
        'recent',
        h.recentSearches ?? 'Recent searches',
        recentOptions('r', 'messages', shown),
      );
      // Message hits wait for Enter, so a query with no matching recents is not "no results".
      return { sections, actions, removers, noResults: false };
    }
    case 'files': {
      const shownSearches = typing
        ? fileSearches.filter((r) => matches(query, [r.query]))
        : fileSearches;
      const shownFiles = typing
        ? files.filter((f) => matches(query, [f.name, f.description]))
        : files;
      add(
        'recent',
        h.recentSearches ?? 'Recent searches',
        recentOptions('r', 'files', shownSearches),
      );
      add(
        'files',
        typing
          ? (h.files ?? 'Files')
          : (h.recentFiles ?? 'Recently added files'),
        shownFiles.map((f) => fileOption('f', f)),
      );
      break;
    }
    case 'people': {
      if (!typing) {
        if (frequent.length === 0 && recentPeople.length === 0) {
          const sorted = [...directory].sort((a, b) =>
            a.name.localeCompare(b.name),
          );
          add(
            'people',
            h.people ?? 'People',
            sorted.map((p) => personOption('d', p)),
          );
        } else {
          if (frequent.length >= 3) {
            add(
              'frequent',
              h.peopleFrequent ?? 'People you chat with most',
              frequent.map((p) => personOption('f', p)),
            );
          }
          add(
            'recent',
            h.recent ?? 'Recent',
            recentPeople.map((p) => personOption('r', p)),
          );
        }
      } else {
        add(
          'people',
          h.people ?? 'People',
          allPeople
            .filter((p) => matches(query, [p.name, p.username]))
            .map((p) => personOption('p', p)),
        );
      }
      break;
    }
    case 'agents':
      break;
  }
  return {
    sections,
    actions,
    removers,
    noResults: typing && sections.length === 0,
  };
}
