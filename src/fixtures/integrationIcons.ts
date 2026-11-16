import type { FixtureIntegrationIconId } from '@mattermost/compass-proto';
import defender from '@/assets/integrations/ms-defender.png';
import intune from '@/assets/integrations/intune.png';
import pagerduty from '@/assets/integrations/pagerduty.png';
import sentinel from '@/assets/integrations/sentinel.png';
import splunk from '@/assets/integrations/splunk.png';

/** Integration icon id (see `FixtureWebhookIdentity.iconId`) -> image URL. */
export const integrationIcons: Record<FixtureIntegrationIconId, string> = {
  pagerduty,
  sentinel,
  'ms-defender': defender,
  intune,
  splunk,
};
