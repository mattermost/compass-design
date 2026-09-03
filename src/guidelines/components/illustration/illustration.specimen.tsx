import AICopilotIllustration from '@mattermost/compass-ui/illustrations/ai-copilot-intro';
import { Illustration } from '@mattermost/compass-ui/components/illustration';
import SearchIllustration from '@mattermost/compass-ui/illustrations/search';
import styles from '@/styles/library-demo/components.module.scss';

export default function IllustrationLibrary() {
  return (
    <>
      <div className={styles['components__row']}>
        <div className={styles['components__instance']}>
          <span className={styles['components__instance-label']}>
            AI Copilot (default size)
          </span>
          <Illustration aria-label="AI Copilot intro">
            <AICopilotIllustration />
          </Illustration>
        </div>
        <div className={styles['components__instance']}>
          <span className={styles['components__instance-label']}>
            Search, 200px width
          </span>
          <Illustration aria-label="Search" width="200px" height="120px">
            <SearchIllustration />
          </Illustration>
        </div>
      </div>
    </>
  );
}
