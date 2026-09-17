import GlobeIcon from '@mattermost/compass-icons/components/globe';
import { Button } from '@mattermost/compass-ui/components/button';
import type { ButtonAppearance, ButtonEmphasis, ButtonSize } from '@mattermost/compass-ui/components/button';
import { Icon } from '@mattermost/compass-ui/components/icon';
import styles from '@/styles/library-demo/components.module.scss';

const EMPHASES: ButtonEmphasis[] = [
  'primary',
  'secondary',
  'tertiary',
  'quaternary',
  'link',
];

const SIZES: ButtonSize[] = ['x-small', 'small', 'medium', 'large'];

const ICON_EMPHASES = EMPHASES.filter((e) => e !== 'link');

function ButtonPermutationGrid({
  appearance,
  destructive,
  disabled,
}: {
  appearance: ButtonAppearance;
  destructive: boolean;
  disabled: boolean;
}) {
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
            className={
              styles['components__button-variant-matrix__size-heading']
            }
          >
            {size}
          </span>
        ))}
      </div>
      {EMPHASES.map((emphasis) => (
        <div
          key={emphasis}
          className={styles['components__button-variant-matrix__row']}
        >
          <span
            className={
              styles['components__button-variant-matrix__emphasis-label']
            }
          >
            {emphasis}
          </span>
          {SIZES.map((size) => (
            <div
              key={size}
              className={styles['components__button-variant-matrix__cell']}
            >
              <Button
                appearance={appearance}
                emphasis={emphasis}
                destructive={destructive}
                disabled={disabled}
                size={size}
              >
                Label
              </Button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function ButtonLibrary() {
  const icon = <Icon glyph={<GlobeIcon />} />;

  return (
    <div className={styles['components__button-block']}>
      <p className={styles['components__paragraph']}>
        Full prop matrix for visual testing: each row is an emphasis, columns
        are sizes (16 buttons per section). Icon slots are covered separately
        below.
      </p>

      <div className={styles['components__section']}>
        <h3 className={styles['components__section-title']}>
          Default
        </h3>
        <ButtonPermutationGrid
          appearance="default"
          destructive={false}
          disabled={false}
        />
      </div>

      <div className={styles['components__section']}>
        <h3 className={styles['components__section-title']}>
          Destructive
        </h3>
        <ButtonPermutationGrid
          appearance="default"
          destructive
          disabled={false}
        />
      </div>

      <div className={styles['components__section']}>
        <h3 className={styles['components__section-title']}>
          Disabled
        </h3>
        <ButtonPermutationGrid
          appearance="default"
          destructive={false}
          disabled
        />
      </div>

      <div className={styles['components__button-surface--inverted']}>
        <div className={styles['components__section']}>
          <h3 className={styles['components__section-title']}>
            Inverted
          </h3>
          <ButtonPermutationGrid
            appearance="inverted"
            destructive={false}
            disabled={false}
          />
        </div>

        <div className={styles['components__section']}>
          <h3 className={styles['components__section-title']}>
            Inverted Destructive
          </h3>
          <ButtonPermutationGrid
            appearance="inverted"
            destructive
            disabled={false}
          />
        </div>

        <div className={styles['components__section']}>
          <h3 className={styles['components__section-title']}>
            Inverted Disabled
          </h3>
          <ButtonPermutationGrid
            appearance="inverted"
            destructive={false}
            disabled
          />
        </div>
      </div>

      <div className={styles['components__section']}>
        <h3 className={styles['components__section-title']}>Loading</h3>
        <div className={styles['components__button-row']}>
          {EMPHASES.filter((e) => e !== 'link').map((emphasis) => (
            <Button key={emphasis} emphasis={emphasis} loading>
              Saving
            </Button>
          ))}
        </div>
      </div>

      <div className={styles['components__section']}>
        <h3 className={styles['components__section-title']}>
          Icon slots — leading icon, all emphases × sizes
        </h3>
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
          {ICON_EMPHASES.map((emphasis) => (
            <div
              key={emphasis}
              className={styles['components__button-variant-matrix__row']}
            >
              <span className={styles['components__button-variant-matrix__emphasis-label']}>
                {emphasis}
              </span>
              {SIZES.map((size) => (
                <div key={size} className={styles['components__button-variant-matrix__cell']}>
                  <Button
                    emphasis={emphasis}
                    size={size}
                    leadingIcon={<Icon glyph={<GlobeIcon />} />}
                  >
                    Label
                  </Button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className={styles['components__section']}>
        <h3 className={styles['components__section-title']}>
          Icon placement — all emphases · Medium
        </h3>
        <div className={styles['components__button-variant-matrix']}>
          <div className={styles['components__button-variant-matrix__head']}>
            <span
              className={styles['components__button-variant-matrix__corner']}
              aria-hidden
            />
            {(['Leading', 'Trailing', 'Both'] as const).map((label) => (
              <span
                key={label}
                className={styles['components__button-variant-matrix__size-heading']}
              >
                {label}
              </span>
            ))}
          </div>
          {ICON_EMPHASES.map((emphasis) => (
            <div
              key={emphasis}
              className={styles['components__button-variant-matrix__row']}
            >
              <span className={styles['components__button-variant-matrix__emphasis-label']}>
                {emphasis}
              </span>
              <div className={styles['components__button-variant-matrix__cell']}>
                <Button emphasis={emphasis} leadingIcon={icon}>Label</Button>
              </div>
              <div className={styles['components__button-variant-matrix__cell']}>
                <Button emphasis={emphasis} trailingIcon={icon}>Label</Button>
              </div>
              <div className={styles['components__button-variant-matrix__cell']}>
                <Button emphasis={emphasis} leadingIcon={icon} trailingIcon={icon}>Label</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
