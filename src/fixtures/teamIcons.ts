// Every team icon in `src/assets/team-icons/`, keyed by team id (the file name
// without `.png`). The fixture generator copies them from the preview dataset.
const files = import.meta.glob('@/assets/team-icons/*.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

/** Team id -> icon URL. A team with no image shows its initials. */
export const teamIcons: Record<string, string | undefined> = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [
    path
      .split('/')
      .pop()!
      .replace(/\.png$/, ''),
    url,
  ]),
);
