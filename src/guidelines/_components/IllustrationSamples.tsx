import type { ComponentType, SVGProps } from 'react';
import SearchIllustration from '@mattermost/compass-ui/illustrations/search';
import GroupsIllustration from '@mattermost/compass-ui/illustrations/groups';
import AICopilotIllustration from '@mattermost/compass-ui/illustrations/ai-copilot-intro';
import SuccessIllustration from '@mattermost/compass-ui/illustrations/success';
import DraftsEmptyIllustration from '@mattermost/compass-ui/illustrations/drafts-empty';
import ArchivedChannelIllustration from '@mattermost/compass-ui/illustrations/archived-channel';
import { Illustration } from '@mattermost/compass-ui/components/illustration';
import styles from './IllustrationSamples.module.scss';

type SvgComp = ComponentType<SVGProps<SVGSVGElement>>;

const CURATED: { name: string; glyph: SvgComp }[] = [
  { name: 'Search', glyph: SearchIllustration },
  { name: 'Groups', glyph: GroupsIllustration },
  { name: 'AI Copilot', glyph: AICopilotIllustration },
  { name: 'Success', glyph: SuccessIllustration },
  { name: 'Drafts empty', glyph: DraftsEmptyIllustration },
  { name: 'Archived channel', glyph: ArchivedChannelIllustration },
];

export function IllustrationShowcase() {
  return (
    <div className={styles['illustration-showcase']}>
      {CURATED.map(({ name, glyph: Glyph }) => (
        <div key={name} className={styles['illustration-showcase__tile']}>
          <div className={styles['illustration-showcase__art']}>
            <Illustration aria-label="" width="140px" height="96px">
              <Glyph />
            </Illustration>
          </div>
          <span className={styles['illustration-showcase__label']}>{name}</span>
        </div>
      ))}
    </div>
  );
}
