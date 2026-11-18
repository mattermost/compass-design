import {
  getWorkspaceUser,
  workspaceChannels,
  workspaceCurrentUserId,
  workspacePosts,
  type FixtureChannel,
  type FixtureUser,
} from '@mattermost/compass-proto';

const me = workspaceCurrentUserId;

/**
 * The channel the call patterns are shown in: a channel (not a direct message)
 * the signed-in user is in, with at least five people in it, so a call there
 * has a few participants.
 */
export const callChannel: FixtureChannel | undefined =
  workspaceChannels.find(
    (c) =>
      c.memberIds?.includes(me) &&
      (c.type === 'public' || c.type === 'private') &&
      (c.memberIds?.length ?? 0) >= 5,
  ) ?? workspaceChannels.find((c) => c.memberIds?.includes(me));

/** The people in `callChannel` (no bots), the signed-in user first. */
export const callPeople: FixtureUser[] = (callChannel?.memberIds ?? [])
  .map((id) => getWorkspaceUser(id))
  .filter((u): u is FixtureUser => !!u && !u.isBot)
  .sort((a, b) => Number(b.id === me) - Number(a.id === me));

/** A call post in the sample data, for its times and duration. */
export const sampleCallPost = workspacePosts.find(
  (p) => p.kind === 'call' && p.call,
);
