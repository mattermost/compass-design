import type { ReactNode } from 'react';

/** The search modes, in tab order. `agents` is the Agents (AI) search. */
export type SearchMode =
  | 'all'
  | 'channels'
  | 'messages'
  | 'files'
  | 'people'
  | 'agents';

export const SEARCH_MODES: readonly SearchMode[] = [
  'all',
  'channels',
  'messages',
  'files',
  'people',
  'agents',
];

export interface SearchChannel {
  id: string;
  name: string;
  /** Default: `public`. */
  kind?: 'public' | 'private';
  mentionCount?: number;
}

export interface SearchPerson {
  id: string;
  name: string;
  avatarSrc?: string;
  /** Shown after the name, e.g. `@sofia`. */
  username?: string;
  status?: 'online' | 'away' | 'dnd' | 'offline';
}

export interface SearchFile {
  id: string;
  name: string;
  /** Muted text after the name, e.g. `ux-design · Yesterday`. */
  description?: string;
  /** Picks the icon. Default: `generic`. */
  kind?: 'pdf' | 'word' | 'generic';
}

/** A past search. `query` is what the field shows when it is chosen. */
export interface SearchRecent {
  id: string;
  query: string;
}

export interface SearchAgent {
  id: string;
  name: string;
  avatarSrc?: string;
}

export interface SearchTeam {
  id: string;
  name: string;
}

/** What the modal lists. Everything is optional; empty groups are left out. */
export interface SearchModalData {
  /** Channels with unread activity: shown first in Channels, and in All before typing. */
  unreadChannels?: SearchChannel[];
  /** Recently visited channels. Both channel lists are searched while typing. */
  recentChannels?: SearchChannel[];
  /** People the user chats with most. Hidden in People when there are fewer than 3. */
  frequentPeople?: SearchPerson[];
  /** Recent direct-message people. */
  recentPeople?: SearchPerson[];
  /** Everyone, shown alphabetically in People when there is no DM activity, and searched while typing. */
  directory?: SearchPerson[];
  recentFiles?: SearchFile[];
  recentMessageSearches?: SearchRecent[];
  recentFileSearches?: SearchRecent[];
  /** Modifier buttons in the Messages footer, e.g. `From:`, `In:`. */
  messageModifiers?: string[];
  /** Modifier buttons in the Files footer, e.g. `From:`, `Ext:`. */
  fileModifiers?: string[];
  /** Search with these agents in Agents mode. */
  agents?: SearchAgent[];
}

export type SearchModalSelection =
  | { kind: 'channel'; item: SearchChannel }
  | { kind: 'person'; item: SearchPerson }
  | { kind: 'file'; item: SearchFile }
  | { kind: 'recent'; mode: 'all' | 'messages' | 'files'; item: SearchRecent };

export interface SearchModalSubmission {
  mode: SearchMode;
  query: string;
  /** Modifier chips added in Messages, e.g. `From: Sofia Bauer`. */
  chips: string[];
  /** The chosen agent in Agents mode. */
  agentId?: string;
}

/** Translatable copy. Every string has an English default. */
export interface SearchModalLabels {
  /** Accessible name of the dialog; it is not shown. Default: "Search". */
  title?: ReactNode;
  /** Accessible name of the mode control. Default: "Search modes". */
  modesLabel?: string;
  /** Mode names. Defaults: All, Channels, Messages, Files, People, Agents. */
  modeLabels?: Partial<Record<SearchMode, ReactNode>>;
  /** Field placeholders per mode. */
  placeholders?: Partial<Record<SearchMode, string>>;
  /** Accessible name of the results listbox. Default: "Search results". */
  listboxLabel?: string;
  clearLabel?: string;
  /** Names a remove chip control: "Remove {label}". */
  removeChipLabel?: (label: string) => string;
  /** Accessible name of a recent search's remove control. Default: "Remove recent search". */
  removeRecentLabel?: string;
  /** Default: "All teams". */
  allTeamsLabel?: string;
  /** Accessible name of the team control. Default: "Search team". */
  teamLabel?: string;
  /** Group headings. */
  headings?: {
    channels?: ReactNode;
    unreads?: ReactNode;
    recent?: ReactNode;
    people?: ReactNode;
    peopleFrequent?: ReactNode;
    files?: ReactNode;
    recentFiles?: ReactNode;
    recentSearches?: ReactNode;
    from?: ReactNode;
  };
  emptyTitle?: ReactNode;
  emptyDescription?: ReactNode;
  /** Footer copy. */
  tips?: {
    allNote?: ReactNode;
    browseChannels?: ReactNode;
    browseChannelsAction?: ReactNode;
    modifiers?: ReactNode;
    enterToSearch?: ReactNode;
    peopleShortcutPrefix?: ReactNode;
    browseTeammates?: ReactNode;
    peopleOr?: ReactNode;
    startGroupMessage?: ReactNode;
    agentsNote?: ReactNode;
    searchWith?: ReactNode;
    chooseAgent?: string;
  };
}

export const DEFAULT_PLACEHOLDERS: Record<SearchMode, string> = {
  all: 'Search channels, messages, files, and people',
  channels: 'Search channels or direct messages',
  messages: 'Search messages',
  files: 'Search files',
  people: 'Search people',
  agents: 'Search',
};

export const DEFAULT_MODE_LABELS: Record<SearchMode, string> = {
  all: 'All',
  channels: 'Channels',
  messages: 'Messages',
  files: 'Files',
  people: 'People',
  agents: 'Agents',
};
