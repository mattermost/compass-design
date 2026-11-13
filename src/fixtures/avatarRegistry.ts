import { createAvatarRegistry } from '@mattermost/compass-proto';

const files = import.meta.glob('@/assets/avatars/*.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

/** Fixture user id -> avatar image URL, built from `src/assets/avatars/`. */
export const avatars = createAvatarRegistry(files);
