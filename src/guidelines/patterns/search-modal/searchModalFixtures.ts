import {
  workspaceChannels,
  workspaceCurrentUserId,
  workspacePosts,
  workspaceUsers,
  getWorkspaceChannel,
  getWorkspaceUser,
  splitLeadingEmoji,
  type FixtureChannel,
  type FixtureUser,
  type SearchChannel,
  type SearchModalData,
  type SearchPerson,
} from '@mattermost/compass-proto';
import avatarMatty from '@/assets/avatars/Matty.png';
import { avatars } from '@/fixtures/avatarRegistry';
import { teamSidebarTeams } from '@/fixtures/teamSidebarTeams';
import { plainPreview } from '@/guidelines/_components/fixtureThread';

// Everything the dialog lists comes from the sample workspace, from the point
// of view of its signed-in user. Only the dialog's own vocabulary (modifier
// buttons, suggested agent questions, the agents themselves) is written here.

const me = workspaceCurrentUserId;

const STATUS: Record<FixtureUser['presence'], SearchPerson['status']> = {
  online: 'online',
  away: 'away',
  'do-not-disturb': 'dnd',
  offline: 'offline',
};

const toPerson = (user: FixtureUser): SearchPerson => ({
  id: user.id,
  name: user.displayName,
  avatarSrc: avatars[user.id],
  username: `@${user.username}`,
  status: STATUS[user.presence],
});

const channelSlug = (channel: FixtureChannel) => channel.id.split('/').pop();

const toSearchChannel = (channel: FixtureChannel): SearchChannel => {
  // A name that starts with an emoji shows it in place of the globe / lock.
  const { emoji, name } = splitLeadingEmoji(channel.name);
  return {
    id: channel.id,
    name,
    leadingEmoji: emoji,
    kind: channel.type === 'private' ? 'private' : 'public',
    mentionCount: channel.mentionCount || undefined,
  };
};

const myChannels = workspaceChannels.filter(
  (c) =>
    c.memberIds?.includes(me) && (c.type === 'public' || c.type === 'private'),
);

/** The people the signed-in user has a direct message with. */
const dmPeople = workspaceChannels
  .filter((c) => c.type === 'direct' && c.memberIds?.includes(me))
  .map((c) => c.memberIds?.find((id) => id !== me))
  .map((id) => (id ? getWorkspaceUser(id) : undefined))
  .filter((u): u is FixtureUser => !!u && !u.isBot)
  .map(toPerson);

const others = workspaceUsers
  .filter((u) => u.id !== me && !u.isBot)
  .map(toPerson);

const fileKind = (extension: string) =>
  extension === 'pdf'
    ? 'pdf'
    : extension === 'doc' || extension === 'docx'
      ? 'word'
      : 'generic';

const recentFiles = workspacePosts
  .filter((p) => p.files?.length)
  .flatMap((p) =>
    (p.files ?? []).map((file) => ({
      id: `${p.id}/${file.name}`,
      name: file.name,
      description: `${channelSlug(getWorkspaceChannel(p.channelId) ?? ({} as FixtureChannel)) ?? ''} · ${p.timestamp}`,
      kind: fileKind(file.extension) as 'pdf' | 'word' | 'generic',
    })),
  )
  .slice(0, 4);

// People you message first, then other people, so both groups have enough to show
// (People mode hides "frequent" below three) however few direct messages the
// sample data has.
const peopleByContact = [
  ...dmPeople,
  ...others.filter((o) => !dmPeople.some((d) => d.id === o.id)),
];
const frequent = peopleByContact.slice(0, 6);
const recent = peopleByContact.slice(6, 12);

export const SEARCH_MODAL_DATA: SearchModalData = {
  unreadChannels: myChannels
    .filter((c) => c.unreadCount)
    .slice(0, 3)
    .map(toSearchChannel),
  recentChannels: myChannels
    .filter((c) => !c.unreadCount)
    .slice(0, 6)
    .map(toSearchChannel),
  frequentPeople: frequent,
  recentPeople: recent,
  directory: others,
  recentFiles,
  recentMessageSearches: [
    { id: 'm1', query: 'incident' },
    { id: 'm2', query: 'from:alerts triage' },
  ],
  recentFileSearches: [
    { id: 'fs1', query: 'report' },
    { id: 'fs2', query: 'ext:pdf' },
  ],
  messageModifiers: ['From:', 'In:', 'On:', 'Before:', 'After:', '-', '""'],
  fileModifiers: ['From:', 'In:', 'Ext:', 'After:', 'Before:'],
  recentAgentSearches: [
    { id: 'ra1', query: 'Summarize what I missed in my unread channels' },
    { id: 'ra2', query: 'Which alerts are still open?' },
  ],
  agentSuggestions: [
    { id: 'as1', query: 'What are my open action items?' },
    { id: 'as2', query: 'What messages are pending my feedback?' },
    { id: 'as3', query: 'Which channels have been most active this week?' },
    { id: 'as4', query: 'Who worked on the latest incident?' },
    { id: 'as5', query: 'What decisions were made in the last review?' },
    { id: 'as6', query: 'What did the team ship last week?' },
  ],
  // Agents, not people: only Matty has artwork, the rest use the avatar fallback.
  agents: [
    { id: 'matty', name: 'Matty', avatarSrc: avatarMatty },
    { id: 'code', name: 'Code' },
    { id: 'writer', name: 'Writer' },
    { id: 'analyst', name: 'Analyst' },
  ],
};

export const SEARCH_MODAL_TEAMS = teamSidebarTeams.map((t) => ({
  id: t.id,
  name: t.name,
}));

export interface MessageHit {
  id: string;
  avatarSrc?: string;
  avatarAlt: string;
  username: string;
  timestamp: string;
  channelLabel: string;
  body: string;
}

/** Posts in the workspace that mention any of the terms (all of them when there are none). */
export function searchMessages(terms: string[], limit = 5): MessageHit[] {
  const wanted = terms.map((t) => t.toLowerCase());
  return workspacePosts
    .filter((p) => !p.kind || p.kind === 'bot-reply')
    .filter((p) => {
      const text = p.text.toLowerCase();
      return wanted.length === 0 || wanted.some((t) => text.includes(t));
    })
    .slice(0, limit)
    .map((p) => {
      const author = getWorkspaceUser(p.userId);
      const channel = getWorkspaceChannel(p.channelId);
      return {
        id: p.id,
        avatarSrc: avatars[p.userId],
        avatarAlt: author?.displayName ?? '',
        username: author?.displayName ?? p.userId,
        timestamp: p.timestamp,
        channelLabel: channel
          ? (channelSlug(channel) ?? channel.name)
          : p.channelId,
        body: plainPreview(p.text),
      };
    });
}
