import {
  getWorkspaceUser,
  workspaceCurrentUserId,
  workspaceUsers,
  type FixtureUser,
} from '@mattermost/compass-proto';
import { avatars } from '@/fixtures/avatarRegistry';
import { workspaceAdmin } from '@/fixtures/workspaceAdmin';

// People come from the sample workspace; the popover's own extras (local time,
// last online, staff and committer badges) are written here, as the sample data
// has no such fields.

/** The signed-in user. */
export const you =
  getWorkspaceUser(workspaceCurrentUserId) ?? workspaceUsers[0]!;

const people = workspaceUsers.filter(
  (u) => u.id !== you.id && !u.isBot && u.position,
);
/** Someone else, with a job title and no custom status. */
export const other =
  people.find((u) => !u.customStatusText) ?? people[0] ?? you;
/** Someone else with a custom status when the data has one. */
export const otherWithStatus = people.find((u) => u.customStatusText) ?? other;
/** The workspace's system administrator: the person the anatomy shows with every element. */
export const anatomyUser = workspaceAdmin ?? other;

export const identity = (user: FixtureUser) => ({
  avatarSrc: avatars[user.id] ?? '',
  avatarAlt: user.displayName,
  name: user.displayName,
  username: `@${user.username}`,
  title: user.position,
  email: `${user.username}@example.com`,
  lastOnline: 'Last online 6 hrs ago',
});

export const localTime = {
  time: '10:42 PM',
  timezone: 'EST',
  hourDifference: '3 hrs behind',
};

/** The user's custom status, or an example when the data gives none. */
export const customStatus = (user: FixtureUser) =>
  user.customStatusText
    ? {
        emoji: user.customStatusEmoji ?? '📅',
        text: user.customStatusText,
        expiresLabel: 'Until Tomorrow',
      }
    : { emoji: '📅', text: 'In a meeting', expiresLabel: 'Until Tomorrow' };

/** A GitHub-style handle for the example (the data has none). */
export const githubHandle = (user: FixtureUser) =>
  user.username.replace(/[^a-z0-9]/gi, '');
