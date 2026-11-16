import SuggestionComposerDemo, {
  type SuggestionDemoKind,
} from './SuggestionComposerDemo';
import { SuggestionList } from '@mattermost/compass-proto';
import styles from '@/styles/library-demo/components.module.scss';

const EXAMPLES: Array<{ kind: SuggestionDemoKind; label: string }> = [
  { kind: 'mention', label: 'Mentions (@): members, groups, not in channel' },
  { kind: 'channel', label: 'Channels (~): public and private' },
  { kind: 'command', label: 'Slash commands (/)' },
  { kind: 'emoji', label: 'Emoji (:)' },
];

export default function SuggestionListLibrary() {
  return (
    <div className={styles['components__button-block']}>
      {EXAMPLES.map(({ kind, label }) => (
        <div key={kind} className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>{label}</span>
          <div style={{ maxWidth: 640, width: '100%' }}>
            <SuggestionComposerDemo kind={kind} />
          </div>
        </div>
      ))}
      {/* Static previews of the surface's own states: there is no trigger. */}
      {[
        { label: 'Empty: no matches', props: {} },
        { label: 'Loading', props: { loading: true } },
      ].map(({ label, props }) => (
        <div key={label} className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>{label}</span>
          <div style={{ maxWidth: 480, width: '100%' }}>
            <SuggestionList options={[]} {...props} />
          </div>
        </div>
      ))}
    </div>
  );
}
