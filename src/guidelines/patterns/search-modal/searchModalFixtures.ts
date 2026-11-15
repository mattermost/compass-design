import type { SearchModalData, SearchPerson } from '@mattermost/compass-proto';
import avatarAiko from '@/assets/avatars/Aiko Tan.png';
import avatarArjun from '@/assets/avatars/Arjun Patel.png';
import avatarDanielle from '@/assets/avatars/Danielle Okoro.png';
import avatarDarius from '@/assets/avatars/Darius Cole.png';
import avatarDavid from '@/assets/avatars/David Liang.png';
import avatarEmma from '@/assets/avatars/Emma Novak.png';
import avatarEthan from '@/assets/avatars/Ethan Brooks.png';
import avatarIsabella from '@/assets/avatars/Isabella Cruz.png';
import avatarLeila from '@/assets/avatars/Leila Haddad.png';
import avatarLeonard from '@/assets/avatars/Leonard Riley.png';
import avatarLukas from '@/assets/avatars/Lukas Meyer.png';
import avatarMarco from '@/assets/avatars/Marco Rinaldi.png';
import avatarSofia from '@/assets/avatars/Sofia Bauer.png';

const person = (
  id: string,
  name: string,
  avatarSrc: string,
  extra: Partial<SearchPerson> = {},
): SearchPerson => ({ id, name, avatarSrc, ...extra });

const frequentPeople = [
  person('sofia', 'Sofia Bauer', avatarSofia, {
    status: 'online',
    username: '@sofia',
  }),
  person('marco', 'Marco Rinaldi', avatarMarco, {
    status: 'away',
    username: '@marco',
  }),
  person('leonard', 'Leonard Riley', avatarLeonard, {
    status: 'online',
    username: '@leonard',
  }),
  person('cody', 'Cody Fisher', avatarDarius, { status: 'online' }),
  person('arvind', 'Arvind Balaram', avatarArjun, { status: 'online' }),
  person('leslie', 'Leslie Alexander', avatarDanielle, { status: 'online' }),
];

const recentPeople = [
  person('wade', 'Wade Warren', avatarLeonard, { username: '@Wade.Warren' }),
  person('jenny', 'Jenny Wilson', avatarEmma, { username: '@Jenny.Wilson' }),
  person('floyd', 'Floyd Miles', avatarDavid, { username: '@Floyd.Miles' }),
  person('jane', 'Jane Cooper', avatarIsabella, { username: '@Jane.Cooper' }),
  person('albert', 'Albert Flores', avatarLukas, {
    username: '@Albert.Flores',
  }),
  person('jacob', 'Jacob Jones', avatarLeila, { username: '@Jacob.Jones' }),
];

export const SEARCH_MODAL_DATA: SearchModalData = {
  unreadChannels: [
    { id: 'ux-design', name: 'ux-design', mentionCount: 3 },
    { id: 'releases', name: 'releases' },
    { id: 'security', name: 'security', kind: 'private', mentionCount: 1 },
  ],
  recentChannels: [
    { id: 'town-square', name: 'town-square' },
    { id: 'off-topic', name: 'off-topic' },
    { id: 'design-crit', name: 'design-crit', kind: 'private' },
    { id: 'design-system', name: 'design-system' },
    { id: 'platform', name: 'platform' },
    { id: 'customers', name: 'customers', kind: 'private' },
  ],
  frequentPeople,
  recentPeople,
  directory: [
    person('ethan', 'Ethan Brooks', avatarEthan, {
      status: 'offline',
      username: '@ethan',
    }),
    person('isabella', 'Isabella Cruz', avatarIsabella, {
      status: 'online',
      username: '@isabella',
    }),
    person('emma', 'Emma Novak', avatarEmma, { username: '@emma' }),
  ],
  recentFiles: [
    {
      id: 'file1',
      name: 'Compass_Brand_Guidelines.pdf',
      description: 'ux-design · Yesterday',
      kind: 'pdf',
    },
    {
      id: 'file2',
      name: 'Q3_Roadmap.docx',
      description: 'releases · Mon',
      kind: 'word',
    },
    {
      id: 'file3',
      name: 'Onboarding_flows.fig',
      description: 'design-crit · Last week',
    },
    {
      id: 'file4',
      name: 'Support_macros.pdf',
      description: 'customers · Last week',
      kind: 'pdf',
    },
  ],
  recentMessageSearches: [
    { id: 'm1', query: 'launch checklist' },
    { id: 'm2', query: 'in:ux-design accessibility' },
    { id: 'm3', query: 'from:sofia Figma' },
    { id: 'm4', query: 'onboarding FAQ' },
  ],
  recentFileSearches: [
    { id: 'fs1', query: 'brand guidelines' },
    { id: 'fs2', query: 'ext:pdf roadmap' },
    { id: 'fs3', query: 'Q3 planning' },
  ],
  messageModifiers: ['From:', 'In:', 'On:', 'Before:', 'After:', '-', '""'],
  fileModifiers: ['From:', 'In:', 'Ext:', 'After:', 'Before:'],
  agents: [
    { id: 'aiko', name: 'Aiko', avatarSrc: avatarAiko },
    { id: 'arjun', name: 'Arjun', avatarSrc: avatarArjun },
    { id: 'emma', name: 'Emma', avatarSrc: avatarEmma },
  ],
};

export const SEARCH_MODAL_TEAMS = [
  { id: 'compass', name: 'Compass' },
  { id: 'platform', name: 'Platform' },
];

/** Message hits shown in the results panel after a Messages search. */
export const MESSAGE_HITS = [
  {
    id: 'hit1',
    avatarSrc: avatarSofia,
    avatarAlt: 'Sofia Bauer',
    username: 'Sofia Bauer',
    timestamp: '9:14 AM',
    channelLabel: 'ux-design',
    body: 'Updated the launch checklist with the new onboarding screens — review before Friday.',
  },
  {
    id: 'hit2',
    avatarSrc: avatarMarco,
    avatarAlt: 'Marco Rinaldi',
    username: 'Marco Rinaldi',
    timestamp: 'Yesterday',
    channelLabel: 'releases',
    body: 'Can we keep the launch checklist in Releases so support can find it?',
  },
  {
    id: 'hit3',
    avatarSrc: avatarLeonard,
    avatarAlt: 'Leonard Riley',
    username: 'Leonard Riley',
    timestamp: 'Mon',
    channelLabel: 'ux-design',
    body: 'Pinned the launch checklist to this channel for the next two sprints.',
  },
];
