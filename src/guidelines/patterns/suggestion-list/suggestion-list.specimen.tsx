import SuggestionComposerDemo, {
  type SuggestionDemoKind,
} from './SuggestionComposerDemo';
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
    </div>
  );
}
