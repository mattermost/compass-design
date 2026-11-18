import {
  workspaceChannels,
  workspaceCurrentUserId,
  getWorkspaceUser,
  type FixtureChannel,
} from '@mattermost/compass-proto';

// One real channel of each kind from the sample workspace, picked by what it is
// (never by id), so a data refresh keeps these working. The specimen and the
// guidelines page share them.
const mine = workspaceChannels.filter((c) =>
  c.memberIds?.includes(workspaceCurrentUserId),
);
const otherIsBot = (c: FixtureChannel) =>
  Boolean(
    getWorkspaceUser(
      c.memberIds?.find((id) => id !== workspaceCurrentUserId) ?? '',
    )?.isBot,
  );

export const headerChannel = mine.find((c) => c.type === 'public' && c.purpose);
export const headerBotDm = mine.find(
  (c) => c.type === 'direct' && otherIsBot(c),
);
export const headerPersonDm = mine.find(
  (c) => c.type === 'direct' && !otherIsBot(c),
);
export const headerGroupDm = mine.find((c) => c.type === 'group');
