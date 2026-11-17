import type { FixtureIntegrationIconId } from '@mattermost/compass-proto';

// Every image in `src/assets/integrations/`, keyed by file name without the
// extension (`sentinel.png` -> `sentinel`). The fixture generator saves new
// icons there under their `FixtureIntegrationIconId`, so a refresh needs no
// edit here.
const files = import.meta.glob('@/assets/integrations/*.{png,jpg,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

/** Integration icon id (see `FixtureWebhookIdentity.iconId`) -> image URL. */
export const integrationIcons = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [
    path
      .split('/')
      .pop()!
      .replace(/\.[^.]+$/, ''),
    url,
  ]),
) as Record<FixtureIntegrationIconId, string>;
