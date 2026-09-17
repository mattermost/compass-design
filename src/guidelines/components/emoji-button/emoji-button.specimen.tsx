import {
  type EmojiButtonPadding,
  type EmojiButtonSize,
  EmojiButton,
} from '@mattermost/compass-ui/components/emoji-button';
import styles from '@/styles/library-demo/components.module.scss';

const SIZES: EmojiButtonSize[] = ['x-small', 'small', 'medium', 'large'];

const MATRIX_ROWS: {
  label: string;
  padding: EmojiButtonPadding;
}[] = [
  { label: 'Default', padding: 'default' },
  { label: 'Compact', padding: 'compact' },
];

const DEMO_EMOJI = '👍';

function EmojiButtonPermutationGrid({
  toggled,
  disabled,
}: {
  toggled: boolean;
  disabled: boolean;
}) {
  const cellClass = [
    styles['components__button-variant-matrix__cell'],
    styles['components__button-variant-matrix__cell--icon'],
  ].join(' ');

  return (
    <div className={styles['components__button-variant-matrix']}>
      <div className={styles['components__button-variant-matrix__head']}>
        <span
          className={styles['components__button-variant-matrix__corner']}
          aria-hidden
        />
        {SIZES.map((size) => (
          <span
            key={size}
            className={styles['components__button-variant-matrix__size-heading']}
          >
            {size}
          </span>
        ))}
      </div>
      {MATRIX_ROWS.map((row) => (
        <div
          key={row.label}
          className={styles['components__button-variant-matrix__row']}
        >
          <span className={styles['components__button-variant-matrix__emphasis-label']}>
            {row.label}
          </span>
          {SIZES.map((size) => (
            <div key={size} className={cellClass}>
              <EmojiButton
                aria-label={`${DEMO_EMOJI} ${row.label}, ${size}`}
                emoji={DEMO_EMOJI}
                size={size}
                padding={row.padding}
                toggled={toggled}
                disabled={disabled}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function EmojiButtonLibrary() {
  return (
    <div className={styles['components__button-block']}>
      <p className={styles['components__paragraph']}>
        Prop matrix for visual testing: each row is padding mode (Default,
        Compact), columns are sizes (8 emoji buttons per section). Toggled and
        disabled states are shown separately below.
      </p>

      <div className={styles['components__section']}>
        <h3 className={styles['components__section-title']}>Default</h3>
        <EmojiButtonPermutationGrid toggled={false} disabled={false} />
      </div>

      <div className={styles['components__section']}>
        <h3 className={styles['components__section-title']}>Toggled</h3>
        <EmojiButtonPermutationGrid toggled={true} disabled={false} />
      </div>

      <div className={styles['components__section']}>
        <h3 className={styles['components__section-title']}>Disabled</h3>
        <EmojiButtonPermutationGrid toggled={false} disabled={true} />
      </div>

      <div className={styles['components__section']}>
        <h3 className={styles['components__section-title']}>Emoji variety</h3>
        <div className={styles['components__button-row']}>
          {['👍', '❤️', '😂', '🎉', '🔥', '👀'].map((emoji) => (
            <EmojiButton
              key={emoji}
              aria-label={`React with ${emoji}`}
              emoji={emoji}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
