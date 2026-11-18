// Advisory token rules: motion should use --duration-* and --ease-*, shadows
// --elevation-*, spacing --spacing-* and radius --radius-*, but some can't
// (e.g. a constant-rate spinner, a one-off width). Violations print as warnings
// and never fail CI. When a value can't use a token, say why inline:
//   // stylelint-disable-next-line declaration-property-value-disallowed-list -- <reason>
import { sharedOverrides } from './stylelint.config.js';

// Anything that isn't a token reference, a Sass variable or a CSS-wide keyword.
const notToken =
  '(?!var\\(|calc\\(.*var\\(|\\$|inherit$|initial$|unset$|revert)';

export default {
  customSyntax: 'postcss-scss',
  defaultSeverity: 'warning',
  reportDescriptionlessDisables: true,
  ignoreFiles: ['**/dist/**', '**/storybook-static/**', '**/node_modules/**'],
  rules: {
    'declaration-property-value-disallowed-list': {
      // Duration and easing are checked on transitions only; keyframe animations
      // (spins, pulses) often run on their own period and curve, so `animation`
      // duration and easing are exempt.
      '/^transition(-duration|-delay)?$/': [
        /(?<![\w.])(?<!\w-)(?!0m?s\b)\d*\.?\d+m?s\b/,
      ],
      // `linear` is fine: constant-rate motion has no easing token.
      '/^transition(-timing-function)?$/': [
        /(?<![\w-])(ease|ease-in|ease-out|ease-in-out)(?![\w-])/,
        /cubic-bezier\(/,
      ],
      // Spacing and radius: use --spacing-* and --radius-*. Any raw unit warns
      // (px, rem, em, …) except percentages, viewport units (vw, vh), zero and
      // 1px hairlines. One-off widths and in-between values warn; disable
      // inline with a reason when there's no suitable token.
      '/^(padding|margin|gap|row-gap|column-gap)(-(top|right|bottom|left|block|inline)(-(start|end))?)?$/':
        [
          /(?<![\w.#])(?<!\w-)(?!0+(?:\.0+)?[a-z]*(?![\w.])|1px\b|\d*\.?\d+[dsl]?v[hw]\b)\d*\.?\d+[a-z]+\b/,
        ],
      '/^border(-(top|bottom|start|end)-?(left|right|start|end)?)?-radius$/': [
        /(?<![\w.#])(?<!\w-)(?!0+(?:\.0+)?[a-z]*(?![\w.])|1px\b|\d*\.?\d+[dsl]?v[hw]\b)\d*\.?\d+[a-z]+\b/,
      ],
      // Line height: use --line-height-*. Unitless numbers are proportional to the
      // font size, not a raw size, so they're allowed. Off-scale px values warn
      // until design settles them.
      'line-height': [new RegExp(`^(?!\\d*\\.?\\d+$)${notToken}`)],
      // Shadows: use --elevation-1…6.
      'box-shadow': [
        // Exempt: none/keywords, elevation tokens, focus / field rings, black
        // shadows (--color-neutral-1200-rgb stays dark in every theme) and inset
        // edge lines (borders, not elevations).
        /^(?!none$|inherit$|initial$|unset$)(?!.*var\(--(elevation-|focus-ring-color|color-neutral-1200-rgb))(?!(inset\s+)?0(px)?\s+0(px)?\s+0(px)?\s)(?!inset\s+\S+\s+\S+\s+0(px)?\s)/,
      ],
    },
  },
  overrides: sharedOverrides,
};
