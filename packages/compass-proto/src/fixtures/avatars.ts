import { fixtureUsers, type FixtureUserId } from './users';
import { cyberDefenseUsers } from './cyber-defense/users';

/**
 * Avatar registry: user id -> image URL.
 *
 * compass-proto does not bundle the avatar images (about 8 MB of PNGs). The
 * host supplies them and this maps them onto fixture user ids. In a Vite host:
 *
 * ```ts
 * const files = import.meta.glob('@/assets/avatars/*.png', {
 *   eager: true,
 *   import: 'default',
 * }) as Record<string, string>;
 * export const avatars = createAvatarRegistry(files);
 * ```
 */
export type AvatarRegistry = Partial<
  Record<FixtureUserId | (string & {}), string>
>;

/** File base name (lowercase) -> user id. Matches display names, plus ids and usernames. */
const nameToUserId = new Map<string, string>();
for (const u of [...fixtureUsers, ...cyberDefenseUsers]) {
  for (const key of [u.displayName, u.username, u.id]) {
    const k = key.toLowerCase();
    if (!nameToUserId.has(k)) nameToUserId.set(k, u.id);
  }
}

function baseName(path: string): string {
  const file = path.split('/').pop() ?? path;
  return file.replace(/\.[^.]+$/, '').toLowerCase();
}

/**
 * Builds a registry from a map of file path (or name) to URL. Files are
 * matched by base name against fixture display names ("Aiko Tan.png"), user ids
 * or usernames ("areid.png"), so any directory prefix works. Files that match no fixture user are ignored.
 */
export function createAvatarRegistry(
  files: Record<string, string>,
): AvatarRegistry {
  const registry: AvatarRegistry = {};
  for (const [path, url] of Object.entries(files)) {
    const id = nameToUserId.get(baseName(path));
    if (id) registry[id] = url;
  }
  return registry;
}
