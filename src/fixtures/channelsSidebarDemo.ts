import { buildDefaultChannelsSidebarModel } from '@mattermost/compass-proto';
import { avatars } from './avatarRegistry';

/** Default docs/layout sidebar tree (unreads category off). */
export const defaultChannelsSidebarDemoModel = buildDefaultChannelsSidebarModel(
  { showUnreadsCategory: false, avatars },
);

/** Docs variant with Unreads category on. */
export const unreadsChannelsSidebarDemoModel = buildDefaultChannelsSidebarModel(
  { showUnreadsCategory: true, avatars },
);
